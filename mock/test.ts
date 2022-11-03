import { mockConfig } from './types'
const list: mockConfig[] = [
  {
    url: '-/api/CountryLimit/CheckAsync',
    method: 'post',
    response: {
      Guid: '90ec247c-b527-43d3-8440-be68146ce461',
      Success: false,
      Code: '9992',
      Message: 'WebsiteMaintenance:103.27.180.3',
      Data: {
        IsAllow: 1,
        CountryCode: null,
        ProvinceID: 0,
        CityID: 0,
        CountryEName: null,
        RegionName: null,
        CityName: null,
        IP: '192.168.31.1',
        MaintenanceStartTime: '2022/08/02 09:00:00',
        MaintenanceEndTime: '2022/08/30 17:52:00',
      },
    },
  },
  {
    url: '-/api/login',
    method: 'post',
    timeout: 3000,
    status: 200,
    response: args => {
      // 响应内容
      return +args.body.password === 123456
        ? {
            Code: 0,
            Message: '登录成功',
            Data: {
              Token: '@word(50, 100)', // @word()是mockjs的语法
              Refresh_token: '@word(50, 100)', // refresh_token是用来重新生成token的
            },
          }
        : {
            Code: 400,
            Message: '密码错误，请输入123456',
            Args: args,
          }
    },
  },
]

export default list
