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
const cookieParser = require('cookie-parser')
const path =                  require('path');
const cors =                  require('cors');
const favicon =               require('serve-favicon');
const logger = require('morgan')
const helmet = require('helmet')
const transport =             require('../config/gmail');
const { g, b, gr, r, y } =    require('../console');

// Express app
const app = express();

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

const isDev = (app.get('env') === 'development');
console.log('isDev: ' + isDev);

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

const home =                express.Router()

require('../routes/home')(home)

//////////////////////////////////////////////////////////////////////////
///////////////////////////// API CATALOGUE /////////////////////////////
////////////////////////////////////////////////////////////////////////

// serve client
app.get('/js/bundle.js', browserifier);

// home page
app.get('/', home);

const port = process.env.VCAP_APP_PORT || process.env.PORT;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
