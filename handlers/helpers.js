

const marked =              require('marked')
const querystring =         require('querystring')
const { translate } =       require('../i18n/i18n')

function isCustomCredentials (settings) {
  const spaceId = process.env.CONTENTFUL_SPACE_ID
  const deliveryToken = process.env.CONTENTFUL_DELIVERY_TOKEN
  const previewToken = process.env.CONTENTFUL_PREVIEW_TOKEN

  return settings.spaceId !== spaceId ||
    settings.deliveryToken !== deliveryToken ||
    settings.previewToken !== previewToken
}

function cleanupQueryParameters (query) {
  const cleanQuery = Object.assign({}, query)
  delete cleanQuery.space_id
  delete cleanQuery.delivery_token
  delete cleanQuery.preview_token
  delete cleanQuery.reset
  return cleanQuery
}

function updateSettingsQuery (request, response, settings) {
  const cleanQuery = cleanupQueryParameters(request.query)

  let settingsQuery = Object.assign({}, cleanQuery, {
    editorial_features: settings.editorialFeatures ? 'enabled' : 'disabled'
  })

  if (isCustomCredentials(settings)) {
    settingsQuery = Object.assign(settingsQuery, {
      space_id: settings.spaceId,
      delivery_token: settings.deliveryToken,
      preview_token: settings.previewToken
    })
  }

  const settingsQs = querystring.stringify(settingsQuery)
  response.locals.queryStringSettings = settingsQs ? `?${settingsQs}` : ''
}

// security function - remove base 64 data from any apis
function removeInvalidDataURL (content) {
  let regex = /data:\S+;base64\S*/gm
  return content.replace(regex, '#')
}

// Parse markdown text
module.exports.markdown = (content = '') => {
  if (!content.trim()) {
    return ''
  }
  return marked(removeInvalidDataURL(content), { sanitize: true })
}

// A handy debugging function we can use to sort of "console.log" our data
module.exports.dump = (obj) => JSON.stringify(obj, null, 2)

module.exports.formatMetaTitle = (title, localeCode = 'en-US') => {
  if (!title) {
    return translate('defaultTitle', localeCode)
  }
  return `${title.charAt(0).toUpperCase()}${title.slice(1)} — ${translate('defaultTitle', localeCode)}`
}

module.exports.isCustomCredentials = isCustomCredentials
module.exports.cleanupQueryParameters = cleanupQueryParameters
module.exports.updateSettingsQuery = updateSettingsQuery


///////////////////////////////////////////
//////////Server Utilities ///////////////
//////////////////////////////////////////
module.exports.normalizePort = (val) => {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    // Named pipe
    return val
  }

  if (port >= 0) {
    // Port number
    return port
  }

  return false
}

module.exports.onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // Handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

module.exports.onListening = () => {
  const addr = app.address()
  const uri = typeof addr === 'string' ? addr : `http://localhost:${addr.port}`
  console.log(`Listening on ${uri}`)
}


