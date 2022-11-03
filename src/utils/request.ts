import { useWebStore } from '@/store/web'
interface reqOpts {
  url: string
  headers?: Record<string, string>
  data?: unknown
  method?: string
}

const base = new URL(import.meta.env.VITE_API, location.origin)
const headers: Record<string, string> = {
  'content-type': 'application/json',
}

export default function <respT>(opts: reqOpts): Promise<respT> {
  useToken()

  const fetchOpts: RequestInit = {
    method: opts.method,
    headers: _.assign(headers, opts.headers),
  }

  const url = new URL(opts.url, base.origin + base.pathname)
  if (!fetchOpts.method || fetchOpts.method.toUpperCase() === 'GET') {
    _.each(opts.data as Record<string, string>, (val: string, key: string) => {
      url.searchParams.set(key, JSON.stringify(val))
    })
  } else {
    fetchOpts.body = JSON.stringify(opts.data)
  }

  return fetch(url.href, fetchOpts).then(data => {
    return data.json()
  })
}

function useToken(): void {
  const webStore = useWebStore()
  if (webStore.token) {
    headers.authorization = `Bearer ${webStore.token}`
  }
}
