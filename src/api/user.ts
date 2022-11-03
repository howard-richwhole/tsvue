import request from '@/utils/request'

export function login(data: { password: string | number }) {
  return request<{ a: 123 }>({
    url: 'https://google.com/api/login',
    method: 'post',
    data,
  })
}
