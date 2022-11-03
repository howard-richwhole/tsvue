import request from '@/utils/request'

export function login(data: { password: string | number }) {
  return request<{ a: 123 }>({
    url: '/api/login',
    method: 'post',
    data,
  })
}
