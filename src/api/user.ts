import request from '@/utils/request'

interface resp {
  message: string
  token?: string
}
export function check() {
  return request<resp>({
    url: '/api/check',
    absolute: true,
  }).then(data => {
    if (data.token) {
      localStorage.setItem('token', data.token)
    }
    return data
  })
}

export function get() {
  return request<resp>({
    url: '/api/get',
  })
}
export function reset() {
  localStorage.setItem('token', '')
  return request<void>({
    url: '/api/reset',
  })
}
