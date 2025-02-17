import Link from 'next/link'
import dynamic from 'next/dynamic'
import { func_icon, variable_icon } from '@/icons'
import { DataMetaNode, ProcessMetaNode } from '@/spec/metanode'
import ReactMarkdown from 'react-markdown'

const Icon = dynamic(() => import('@/app/components/icon'))

export default function MetaNodeListing({ metanodes }: { metanodes: { metanode: (DataMetaNode | ProcessMetaNode), multi?: boolean, type?: string, }[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th className="prose">Icon</th>
            <th className="prose">Type</th>
            <th className="prose">Label</th>
            <th className="prose">Description</th>
          </tr>
        </thead>
        <tbody>
          {metanodes.map(({ metanode, type }) => {
            return (
              <tr key={metanode.spec}>
                <td><Icon icon={metanode.meta.icon ? metanode.meta.icon : metanode.kind === 'data' ? variable_icon : func_icon} /></td>
                <td>{type ? type : metanode.kind === 'data' ? 'Data' : 'prompt' in metanode ? 'Prompt' : 'Resolver'}</td>
                <th>
                  <Link
                    href={`/components/${encodeURIComponent(metanode.spec)}`}
                    className="link prose whitespace-pre-wrap"
                  >{metanode.meta.label}</Link>
                </th>
                <td className="prose whitespace-pre-wrap">
                  <ReactMarkdown components={{
                    p(props: React.PropsWithChildren<{}>) {
                      return <span {...props}>{props.children}</span>
                    }
                  }}>{metanode.meta.description}</ReactMarkdown>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export function MetaNodeCard({ metanode }: { metanode: DataMetaNode | ProcessMetaNode }) {
  return (
    <div className="flex flex-row items-center gap-2 m-2">
      <Icon icon={metanode.meta.icon ? metanode.meta.icon : metanode.kind === 'data' ? variable_icon : func_icon} size={3} title={null} />
      <div className="flex flex-col prose">
        <h1 className="m-0 whitespace-pre-wrap">{metanode.meta.label}</h1>
        <h2 className="m-0 text-gray-500">{metanode.kind === 'data' ? 'Data' : 'prompt' in metanode ? 'Prompt' : 'Resolver'} Node</h2>
      </div>
    </div>
  )
}
