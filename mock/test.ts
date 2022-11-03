import { mockConfig } from './types'
import _ from 'lodash'
let token = ''

const list: mockConfig[] = [
  {
    url: '/api/reset',
    response(){
      token = ''
    }
  },
  {
    url: '/api/check',
    response({ config, headers }) {
      config.timeout = _.random(1, 5) * 1000
      if (headers.token === token) {
        token = Date.now().toString()
        return {
          token,
          message: 'ok',
        }
      } else {
        config.status = 401
        return {
          message: `fail.${token} !== ${headers.token}`,
        }
      }
    },
  },
  {
    url: '/api/get',
    method: 'get',
    timeout: 3000,
    status: 200,
    response({ config, headers }) {
      config.timeout = _.random(1, 5) * 1000
      if (headers.token === token) {
        return {
          message: 'ok',
        }
      } else {
        config.status = 401
        return {
          message: `fail.${token} !== ${headers.token}`,
        }
      }
    },
  },
]

export default list
