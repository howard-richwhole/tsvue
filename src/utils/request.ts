import { useWebStore } from '@/store/web'

function finalOpts(
  fetchOpts: ReturnType<typeof getFetchOpts>,
  originOpts: Readonly<reqOpts>,
): void {
  fetchOpts.headers.token = localStorage.getItem('token') || ''
  originOpts.data
}

interface reqOpts {
  url: string
  headers?: Record<string, string>
  data?: unknown
  method?: string
  absolute?: boolean
}
class ReqPending {
  pending = new Map()
  absReq: Promise<unknown> = Promise.resolve()
  reqList: Promise<unknown>[] = []
  started = false

  start() {
    const { value, done } = this.pending.entries().next()
    if (done) {
      this.started = false
      return
    }
    const [cb, { isAbsolute, rs }] = value
    if (isAbsolute) {
      const reqList = this.reqList
      this.reqList = []
      this.absReq = Promise.allSettled(reqList.concat(this.absReq)).finally(
        () => {
          const req = cb()
          rs(req)
          return new Promise(resolve => {
            req.finally(() => {
              // 延遲100ms 提供運算緩衝
              setTimeout(resolve, 100)
            })
          })
        },
      ) as Promise<unknown>
    } else {
      const p = this.absReq.finally(() => {
        const req = cb()
        rs(req)
        _.pull(this.reqList, p)
        return req
      })
      this.reqList.push(p)
    }
    this.pending.delete(cb)
    this.start()
  }
  add<resp>(cb: () => Promise<resp>, isAbsolute?: boolean): Promise<resp> {
    if (!this.started) {
      this.started = true
      this.start()
    }
    return new Promise(rs => {
      this.pending.set(cb, { isAbsolute, rs })
    })
  }
}

function getFetchOpts(
  opts: reqOpts,
): RequestInit & { headers: Record<string, string> } {
  return {
    method: opts.method,
    headers: _.assign(
      {
        'content-type': 'application/json',
      },
      opts.headers,
    ),
  }
}

function setData(
  opts: reqOpts,
  fetchOpts: ReturnType<typeof getFetchOpts>,
): string {
  const base = new URL(import.meta.env.VITE_API, location.origin)
  const url = new URL(opts.url, base.origin + base.pathname)

  if (!opts.method || opts.method.toLowerCase() === 'get') {
    _.each(opts.data as Record<string, string>, (val: string, key: string) => {
      url.searchParams.set(key, JSON.stringify(val))
    })
  } else {
    fetchOpts.body = JSON.stringify(opts.data)
  }
  return url.href
}

const reqPending = new ReqPending()

export const abortableMap: WeakMap<object, () => void> = new WeakMap()

export default function <resp>(opts: reqOpts): Promise<resp> {
  const timeout = 60000
  const abortCtrl = new AbortController()
  const cb = () => {
    const fetchOpts = getFetchOpts(opts)

    fetchOpts.signal = abortCtrl.signal

    const webStore = useWebStore()
    if (webStore.token) {
      fetchOpts.headers.authorization = `Bearer ${webStore.token}`
    }

    const url = setData(opts, fetchOpts)

    finalOpts(fetchOpts, opts)

    const f = fetch(url, fetchOpts).then(data => {
      return data.json().catch(() => data) as Promise<resp>
    })
    if (timeout) {
      const pid = setTimeout(() => abortCtrl.abort(), timeout)
      f.finally(() => {
        clearTimeout(pid)
      })
    }
    return f
  }
  const p = reqPending.add(cb, opts.absolute)
  abortableMap.set(p, () => abortCtrl.abort())
  return p
}
