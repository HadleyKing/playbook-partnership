import { z } from "zod"
import sha256 from '@/utils/sha256'
import type KRG from "@/core/KRG"
import IEE2791schema from '@/spec/bco'
import * as dict from '@/utils/dict'
import * as array from '@/utils/array'
import type { FPL } from "@/core/FPPRG"
import { decode_complete_process_inputs, decode_complete_process_output } from "@/core/engine"
import extractCitations from "@/utils/citations"
import packageJson from '@/package.json'

type BCO = z.infer<typeof IEE2791schema>
type BaseBCO = Omit<BCO, 'etag' | 'object_id' | 'spec_version'>

function toBCOTimeString(date?: Date) {
  if (date === undefined) date = new Date()
  return date.toISOString().replace(/Z$/, '000')
}

type Metadata = {
  title?: string,
  description?: string,
}

type Author = {
  name: string,
  affiliation?: string,
  email?: string,
  orcid?: string,
}

function parseMetaNodeAuthor(author: string) {
  const m = /^(.+?)\s*(<(.+?)>)?$/.exec(author)
  if (m === null) return { name: author }
  const [_0, name, _2, email] = m
  return { name, email }
}

export default async function FPL2BCO(props: { krg: KRG, fpl: FPL, metadata?: Metadata, author?: Author | null }): Promise<BCO> {
  const fullFPL = props.fpl.resolve()
  const processLookup = dict.init(
    await Promise.all(fullFPL.map(async (step, index) => {
      const metanode = props.krg.getProcessNode(step.process.type)
      let story: string | undefined
      if (props.metadata?.description) {
        story = undefined
      } else {
        const inputs = await decode_complete_process_inputs(props.krg, step.process)
        const output = await decode_complete_process_output(props.krg, step.process)
        story = metanode.story ? metanode.story({ inputs, output }) : undefined
      }
      return {
        key: step.process.id,
        value: {
          index,
          node: step.process,
          metanode,
          story,
        },
      }
    }))
  )
  const story = props.metadata?.description || (
    extractCitations(
      dict.values(processLookup)
        .filter(({ story }) => !!story)
        .map(({ story }) => story)
        .join(' ')
    )
  )
  const baseBCO: BaseBCO = {
    usability_domain: [story],
    provenance_domain: {
      embargo: {}, // ?
      name: props.metadata?.title || 'Playbook',
      version: packageJson.version,
      license: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
      derived_from: `${process.env.PUBLIC_URL}/report/${fullFPL[fullFPL.length - 1].id}`,
      contributors: [],
      review: [],
      created: toBCOTimeString(), // TODO: datetime
      modified: toBCOTimeString(), // TODO: datetime
    },
    description_domain: {
      keywords: array.unique(
        dict.values(processLookup)
          .flatMap(({ metanode }) =>
            metanode.meta.tags ? dict.keys(metanode.meta.tags) : []
          )
      ),
      platform: ['Debian GNU/Linux 11'],
      pipeline_steps: dict.values(processLookup).map(({ index, node, metanode }) => ({
        name: metanode.meta.label,
        description: metanode.meta.description,
        version: metanode.meta.version,
        step_number: index + 1,
        prerequisite: dict.values(node.inputs).map(input => processLookup[input.id]).map(inputProcess => ({
          name: `Output of step ${inputProcess.index+1}`,
          uri: {
            uri: `#/${inputProcess.index}/process/output`,
            access_time: toBCOTimeString(),
          },
        })),
        input_list: dict.values(node.inputs).map(input => processLookup[input.id]).map(inputProcess => ({
          uri: `#/${inputProcess.index}/process/output`,
          access_time: toBCOTimeString(),
        })),
        output_list: [
          {
            uri: `#/${index}/process/output`,
            access_time: toBCOTimeString(),
          }
        ],
      })),
    },
    parametric_domain: dict.values(processLookup).filter(({ node }) => node.data !== null && node.data?.value).map(({ index, node, metanode }) => ({
      step: `${index+1}`,
      param: 'stdin',
      value: JSON.stringify(node.data?.value),
    })),
    execution_domain: {
      // TODO: load prereqs from steps in use (?)
      external_data_endpoints: [],
      software_prerequisites: [
        {
          name: 'Docker',
          version: '20.10.21',
          uri: {
            access_time: toBCOTimeString(),
            uri: 'https://docs.docker.com/get-docker/',
          },
        },
      ],
      environment_variables: {},
      script_driver: 'shell',
      script: [
        {
          uri: {
            uri: 'https://github.com/nih-cfde/playbook-partnership/tree/dev/cli/playbook-partnership-executor.sh',
            filename: 'playbook-partnership-executor.sh',
          }
        }
      ]
    },
    io_domain: {
      input_subdomain: [
        {
          uri: {
            uri: `${process.env.PUBLIC_URL}/api/db/fpl/${
              fullFPL[fullFPL.length - 1].id
            }`,
          },
          // mediatype: 'application/json',
        },
      ],
      output_subdomain: [
        {
          uri: {
            uri: `${process.env.PUBLIC_URL}/api/db/fpl/${
              fullFPL[fullFPL.length - 1].id
            }/output`,
          },
          mediatype: 'application/json'
        }
      ]
    },
    // TODO error_domain
  }
  const current_authors = new Set()
  if (props.author) {
    current_authors.add(props.author.name)
    baseBCO.provenance_domain.contributors.push({
      ...props.author,
      contribution: ['authoredBy'],
    })
  }
  dict.values(processLookup).forEach(({ metanode }) => {
    if (metanode.meta.author) {
      const author = parseMetaNodeAuthor(metanode.meta.author)
      if (current_authors.has(author.name)) return
      current_authors.add(author.name)
      baseBCO.provenance_domain.contributors.push({
        ...author,
        contribution: ['contributedBy'],
      })
    }
  })
  return {
    spec_version: 'https://w3id.org/ieee/ieee-2791-schema/2791object.json',
    etag: sha256(baseBCO),
    // Note: Object IDs will be minted upstream
    object_id: "",
    ...baseBCO,
  }
}
