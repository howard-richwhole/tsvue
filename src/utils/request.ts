interface reqOpts {
  url: string
  headers?: Record<string, string>
  data?: unknown
  method?: string
}

const base = new URL(import.meta.env.VITE_API, location.origin)

export default function <respT>(opts: reqOpts): Promise<respT> {
  const fetchOpts: RequestInit = {
    method: opts.method,
    headers: _.assign({ 'content-type': 'application/json' }, opts.headers),
  }

  const url = new URL(opts.url, base)
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
