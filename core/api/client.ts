import React from 'react'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import * as dict from '@/utils/dict'
import fetcher, { fetcherGET } from '@/utils/next-rest-fetcher'
import type { APIRouteInterface } from "@/spec/api"

export function useAPIQuery<Q extends {}, O>(route: APIRouteInterface<Q, O>, query: Q) {
  const key = React.useMemo(() => {
    let path = route.path
    const searchParams = new URLSearchParams()
    dict.items(query).forEach(({ key, value }) => {
      const m = (new RegExp(`\\[\\.*${key as string}\\]`)).exec(path)
      if (m !== null) path = path.replace(m[0], typeof value === 'string' ? value : JSON.stringify(value))
      else searchParams.append(key as string, typeof value === 'string' ? value : JSON.stringify(value))
    })
    const params = searchParams.toString()
    if (params) return path + '?' + params
    else return path
  }, [route.path, query])
  return useSWR(key, fetcherGET<O>)
}

export function useAPIMutation<Q extends {}, O, B>(route: APIRouteInterface<Q, O, B>, query?: Partial<Q>) {
  return useSWRMutation(route.path, (_key: RequestInfo | URL, { arg = {} }: { arg?: { query?: Partial<Q>, body?: B } }) => {
    let path = route.path
    const searchParams = new URLSearchParams()
    dict.items({ ...query, ...(arg.query??{}) }).forEach(({ key, value }) => {
      const m = (new RegExp(`\\[\\.*${key as string}\\]`, 'g')).exec(path)
      if (m !== null) path = path.replace(m[0], typeof value === 'string' ? value : JSON.stringify(value))
      else searchParams.append(key as string, typeof value === 'string' ? value : JSON.stringify(value))
    })
    const params = searchParams.toString()
    if (params) path = path + '?' + params
    return fetcher<O>(path, { method: 'POST', body: typeof arg.body === 'undefined' ? undefined : arg.body instanceof FormData ? arg.body : JSON.stringify(arg.body) })
  })
}
