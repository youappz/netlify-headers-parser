const test = require('ava')
const { each } = require('test-each')

const { parseAllHeaders } = require('..')

const FIXTURES_DIR = `${__dirname}/fixtures`

const parseHeaders = async function ({ fileFixtureNames, configFixtureName }) {
  const headersFiles =
    fileFixtureNames === undefined
      ? undefined
      : fileFixtureNames.map((fileFixtureName) => `${FIXTURES_DIR}/headers_file/${fileFixtureName}`)
  const netlifyConfigPath =
    configFixtureName === undefined ? undefined : `${FIXTURES_DIR}/netlify_config/${configFixtureName}.toml`
  const options =
    headersFiles === undefined && netlifyConfigPath === undefined ? undefined : { headersFiles, netlifyConfigPath }
  return await parseAllHeaders(options)
}

each(
  [
    {
      title: 'empty',
      output: [],
    },
    {
      title: 'only_config',
      configFixtureName: 'success',
      output: [{ for: '/path', values: { test: 'one' } }],
    },
    {
      title: 'only_files',
      fileFixtureNames: ['success', 'success'],
      output: [
        { for: '/path', values: { test: 'one' } },
        { for: '/path', values: { test: 'one' } },
      ],
    },
    {
      title: 'both_config_files',
      fileFixtureNames: ['success', 'success'],
      configFixtureName: 'success',
      output: [
        { for: '/path', values: { test: 'one' } },
        { for: '/path', values: { test: 'one' } },
        { for: '/path', values: { test: 'one' } },
      ],
    },
  ],
  ({ title }, { fileFixtureNames, configFixtureName, output }) => {
    test(`Parses netlify.toml and _headers | ${title}`, async (t) => {
      t.deepEqual(await parseHeaders({ fileFixtureNames, configFixtureName }), output)
    })
  },
)