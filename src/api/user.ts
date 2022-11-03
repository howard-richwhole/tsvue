import request from '@/utils/request'

let token = ''
interface resp {
  message: string
  token?: string
}
export function check() {
  return request<resp>({
    url: '/api/check',
    headers: {
      token,
    },
  }).then(data => {
    if (data.token) {
      token = data.token
    }
  })
}

export function get() {
  return request<resp>({
    url: '/api/get',
    headers: {
      token,
    },
  })
}
