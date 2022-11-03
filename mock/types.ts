import { IncomingHttpHeaders } from 'node:http'
import { UrlObject } from 'node:url'

export interface mockConfig {
  url: string
  method?: 'get' | 'post' | 'put' | 'delete' | 'patch'
  timeout?: number
  status?: number
  response:
    | ((req: {
        body: unknown
        query: UrlObject['query']
        headers: IncomingHttpHeaders
        config: Pick<mockConfig, 'timeout' | 'status'>
      }) => unknown)
    | any
}
