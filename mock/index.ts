import { IncomingMessage } from 'node:http'
import { pathToFileURL } from 'node:url'
import { mockConfig } from './types'
import { build } from 'esbuild'
import { PluginOption } from 'vite'
import chokidar from 'chokidar'
import path from 'node:path'
import fs from 'node:fs'
import _ from 'lodash'

type loadedMock = Map<string, mockConfig[]>
const folderName = 'mock'
const folderPath = path.resolve('.', folderName)

const loadedMockConfig: loadedMock = new Map()

function loadMockApi() {
  _.chain(fs.readdirSync(folderPath))
    .filter(
      i =>
        !['index.ts', 'types.ts'].includes(i) &&
        path.extname(i).toLowerCase() === '.ts',
    )
    .each(i => {
      const outfile = `${i}-${Date.now()}.mjs`
      return build({
        absWorkingDir: folderPath,
        entryPoints: [path.resolve(folderPath, i)],
        format: 'esm',
        sourcemap: 'inline',
        platform: 'node',
        outfile,
        write: false,
      }).then(({outputFiles}) => {
        const { text, path: filePath } = outputFiles[0]
        fs.writeFileSync(filePath, text)
        return import(pathToFileURL(filePath).toString()).then(
          ({ default: config }) => {
            fs.unlinkSync(filePath)
            return [outfile, config]
          },
        )
      }).then(i => {
        loadedMockConfig.clear()
        loadedMockConfig.set(i[0], i[1])
      }).catch(e=>{
        console.log(e.message)
      })
    })
    .value()
}

function parseJson(req: IncomingMessage): Promise<unknown> {
  let rawData = ''
  return new Promise((rs, rj) => {
    req.on('data', chunk => {
      rawData += chunk
    })
    req.on('end', () => {
      try {
        rs(JSON.parse(rawData))
      } catch (e) {
        rs(rawData)
      }
    })
  })
}

export default function (): PluginOption {
  return {
    name: 'mock',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const mockList = _.flattenDeep(
          Array.from(loadedMockConfig, ([key, value]) => value),
        )
        const url = new URL(`http://${req.headers.host}${req.url}`)
        const query = Object.fromEntries(url.searchParams.entries())
        const foundReq = _.find(mockList, i => {
          return (
            url.pathname.match(new RegExp(i.url)) &&
            req.method === (i.method ? i.method : 'get').toUpperCase()
          )
        }) as mockConfig | undefined

        if (foundReq) {
          const pickConfig = _.pick(foundReq, ['status', 'timeout']) as Pick<
            mockConfig,
            'status' | 'timeout'
          >
          const mockRes = _.isFunction(foundReq.response)
            ? foundReq.response({
                body: await parseJson(req),
                query,
                headers: req.headers,
                config: pickConfig,
              })
            : foundReq.response

          res.setHeader('Content-Type', 'application/json')
          res.statusCode = pickConfig.status || 200
          setTimeout(() => {
            res.end(JSON.stringify(mockRes))
          }, pickConfig.timeout || 0)
          return
        }
        next()
      })
    },
  }
}

chokidar.watch(folderPath).on('ready', () => {
  loadMockApi()
})

chokidar.watch(folderPath).on('change', () => {
  loadMockApi()
})
