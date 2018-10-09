'use strict';

require('dotenv').config({
  silent: true
});

////////////////////////////////////////////////////////////////
////////     demonstration commercial site            ////////
//////            mainline processing                 ///////
////// c strategic machines 2018 all rights reserved ///////
///////////////////////////////////////////////////////////

const express =               require('express');
const browserify =            require('browserify-middleware');
const spreadplugin =          require('babel-plugin-transform-object-rest-spread');
const bodyParser =            require('body-parser');
const cookieParser =          require('cookie-parser')
const path =                  require('path');
const cors =                  require('cors');
const favicon =               require('serve-favicon');
const logger =                require('morgan')
const helmet =                require('helmet')
const settings =              require('../lib/settings')
const helpers =               require('./helpers')
const { updateCookie } =      require('./lib/cookies')
const breadcrumb =            require('./lib/breadcrumb')
const { catchErrors } =       require('./handlers/errorHandlers')
const transport =             require('../config/gmail');
const { g, b, gr, r, y } =    require('../console');
const { translate, 
        initializeTranslations, 
        setFallbackLocale } = require('./i18n/i18n')
const { getSpace, 
        getLocales } =        require('./services/contentful')

// Express app
const app = express();

const SETTINGS_NAME = 'CognitiveBookStore'

//////////////////////////////////////////////////////////////////////////
////////////////////  Register Middleware       /////////////////////////
////////////////////////////////////////////////////////////////////////

app.use(logger('dev'))
app.use(helmet())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser())
app.set('views', path.join(__dirname, '..', 'src'));
app.set('view engine', 'js');
app.engine('js', require('express-react-views').createEngine());
app.use('/css', express.static(path.resolve(__dirname, '..', 'public/css')));
app.use('/img', express.static(path.resolve(__dirname, '..', 'public/assets/img')));
app.use(express.static(path.join(__dirname, '..', 'node_modules/semantic-ui/dist')));
app.use(favicon(path.join(__dirname, '..', '/public/assets/favicon.ico')));
app.use(cors());

app.use(settings)    // initialize app settings based on env variables

app.use(breadcrumb())

const isDev = (app.get('env') === 'development');

///////////////////////////////////////////////////////
////////////  compile reactjs pages  /////////////////
/////////////////////////////////////////////////////
browserify.settings.development.precompile=true;
browserify.settings.development.cache = true;

const browserifier = browserify(path.resolve(__dirname, '..', 'public/js/bundle.js'), {
  plugins: [{ plugin: spreadplugin }],
  watch: isDev,
  debug: isDev,
  extension: ['js'],
  transform: ['babelify'],
});

if (!isDev) {
  browserifier.browserify.transform('uglifyify', { global: true });
}

///////////////////////////////////////////////////////
///////force all production requests to ssl //////////
/////////////////////////////////////////////////////

app.use(function (req, res, next) {
  if (req.headers['x-forwarded-proto'] !== 'https' && process.env.NODE_ENV === 'production') {
    const secureUrl = 'https://' + req.hostname + req.originalUrl
    res.redirect(302, secureUrl)
  }
  next()
})

///////////////////////////////////////////////////////
//// make all data visible for views to consume  /////
/////////////////////////////////////////////////////

app.use(catchErrors(async function (request, response, next) {
  response.locals.baseUrl = `${request.protocol}://${request.headers.host}`
  // Get enabled locales from Contentful
  response.locals.locales = [{ code: 'en-US', name: 'U.S. English' }]
  response.locals.currentLocale = response.locals.locales[0]
  // Inject custom helpers
  response.locals.helpers = helpers

  // Make query string available in templates to render links properly
  const cleanQuery = helpers.cleanupQueryParameters(request.query)
  const qs = querystring.stringify(cleanQuery)

  response.locals.queryString = qs ? `?${qs}` : ''
  response.locals.queryStringSettings = response.locals.queryString
  response.locals.query = request.query
  response.locals.currentPath = request.path

  // Initialize translations and include them on templates
  initializeTranslations()
  response.locals.translate = translate

  // Set active api based on query parameter
  const apis = [
    {
      id: 'cda',
      label: translate('contentDeliveryApiLabel', response.locals.currentLocale.code)
    },
    {
      id: 'cpa',
      label: translate('contentPreviewApiLabel', response.locals.currentLocale.code)
    }
  ]

  // Set currently used api
  response.locals.currentApi = apis
    .find((api) => api.id === (request.query.api || 'cda'))

  // Fall back to delivery api if an invalid API is passed
  if (!response.locals.currentApi) {
    response.locals.currentApi = apis.find((api) => api.id === 'cda')
  }

  next()
}))

// Test space connection and attach space related data for views if possible
app.use(catchErrors(async function (request, response, next) {
  // Catch misconfigured space credentials and display settings page
  try {
    const space = await getSpace()
    const locales = await getLocales()
    // Update credentials in cookie when space connection is successful
    updateCookie(response, SETTINGS_NAME, response.locals.settings)

    // Get available locales from space
    response.locals.locales = locales
    const defaultLocale = response.locals.locales
      .find((locale) => locale.default)

    if (request.query.locale) {
      response.locals.currentLocale = space.locales
        .find((locale) => locale.code === request.query.locale)
    }

    if (!response.locals.currentLocale) {
      response.locals.currentLocale = defaultLocale
    }

    if (response.locals.currentLocale.fallbackCode) {
      setFallbackLocale(response.locals.currentLocale.fallbackCode)
    }

    // Creates a query string which adds the current credentials to links
    // To other implementations of this app in the about modal
    helpers.updateSettingsQuery(request, response, response.locals.settings)
  } catch (error) {
    if ([401, 404].includes(error.response.status)) {
      // If we can't connect to the space, force the settings page to be shown.
      response.locals.forceSettingsRoute = true
    } else {
      throw error
    }
  }
  next()
}))




///////////////////////////////////////////////////////////////////////
/////////////////// messaging alert for platform errors ///////////////
//////////////////////////////////////////////////////////////////////

const mailObject = {
  from: process.env.TRANSPORT_LABEL,
  to: process.env.TRANSPORT_RECEIVER,
  subject: 'Platform Error',
  text: ''
};

process.on('uncaughtException', function (er) {
  console.error(er.stack)
  mailObject.text = er.stack;
  transport.sendMail(mailObject, function (er) {
    if (er) console.error(er);
    process.exit(1);
  });
});


///////////////////////////////////////////
//////////Server Utilities ///////////////
//////////////////////////////////////////
const normalizePort = (val) => {
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

const onError = (error)=> {
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

const onListening = () => {
  const addr = app.address()
  const uri = typeof addr === 'string' ? addr : `http://localhost:${addr.port}`
  console.log(`Listening on ${uri}`)
}

//////////////////////////////////////////////////////
////////// Register and Config Routes ///////////////
////////////////////////////////////////////////////

const home =                express.Router()

require('../routes/home')(home)

//////////////////////////////////////////////////////////////////////////
///////////////////////////// API CATALOGUE /////////////////////////////
////////////////////////////////////////////////////////////////////////

// serve client
app.get('/js/bundle.js', browserifier);

// home page
app.get('/', home);


// Catch 404 and forward to error handler
app.use(function (request, response, next) {
  const err = new Error(translate('errorMessage404Route', response.locals.currentLocale.code))
  err.status = 404
  next(err)
})

// Error handler
app.use(function (err, request, response, next) {
  // Set locals, only providing error in development
  response.locals.error = err
  response.locals.error.status = err.status || 500
  if (request.app.get('env') !== 'development') {
    delete err.stack
  }
  response.locals.title = 'Error'
  // Render the error page
  response.status(err.status || 500)
  response.render('error')
})

const port = normalizePort(process.env.VCAP_APP_PORT || process.env.PORT);

app.listen(port);
app.on('error', onError)
app.on('listening', onListening)

