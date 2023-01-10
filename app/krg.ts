import KRG from '@/core/KRG'
import * as components from '@/components'
import { ensureArray } from '@/utils/array'
declare global {
  var krg: KRG | undefined
}

const krg = global.krg || new KRG()
Object.keys(components)
  .filter(k => k !== 'component')
  .flatMap(k => ensureArray(components[k]))
  .forEach(metanode => krg.add(metanode))

global.krg = krg
export default krg