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
//const helpers =               require('../helpers')
//const { updateCookie } =      require('../lib/cookies')
const breadcrumb =            require('../lib/breadcrumb')
//const { catchErrors } =       require('../handlers/errorHandlers')
const transport =             require('../config/gmail');
const { g, b, gr, r, y } =    require('../console');
const { translate, 
        initializeTranslations, 
        setFallbackLocale } = require('../i18n/i18n')
const { normalizePort, 
        onError,
        onListening }       = require('../handlers/helpers')

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
app.get('/js/bundle.js', browserifier);
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


//////////////////////////////////////////////////////
////////// Register and Config Routes ///////////////
////////////////////////////////////////////////////

const apiprep =             express.Router()
const apitest =             express.Router()
const home =                express.Router()
const nopage =              express.Router()
const errpage =             express.Router()

require('../routes/home')(apiprep)
require('../routes/home')(apitest)
require('../routes/home')(home)
require('../routes/nopage')(nopage)
require('../routes/errpage')(errpage)

//////////////////////////////////////////////////////////////////////////
///////////////////////////// API CATALOGUE /////////////////////////////
////////////////////////////////////////////////////////////////////////

// serve client
//app.get('/js/bundle.js', browserifier);

// update api with additional data
app.use(apiprep);

// test connections
app.use(apitest);

// home page
app.get('/', home);

// Catch 404 and forward to error handler
app.use(nopage)

// Error handler
app.use(errpage)

const port = normalizePort(process.env.VCAP_APP_PORT || process.env.PORT);

app.listen(port);
app.on('error', onError)
app.on('listening', onListening)
