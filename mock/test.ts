import { mockConfig } from './types'
import _ from 'lodash'
let token = Date.now()

const list: mockConfig[] = [
  {
    url: '/api/check',
    response({ config, headers }) {
      config.timeout = _.random(1, 5) * 1000
      if (headers.token === token) {
        return {
          token: Date.now(),
          message: 'ok',
        }
      } else {
        config.status = 401
        return {
          message: 'fail',
        }
      }
    },
  },
  {
    url: '/api/get',
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
          message: 'fail',
        }
      }
    },
  },
]

export default list
