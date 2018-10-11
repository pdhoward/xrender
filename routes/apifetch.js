'use strict';

/////////////////////////////////////////////
////////  Test for fetchin cms data  ///////
///////////////////////////////////////////

const { g, b, gr, r, y } =    require('../console');
const { catchErrors } =       require('../handlers/errorHandlers')
const { getCourses, getCourse, 
        getLesson, 
        getCoursesByCategory } = require('./courses')
const { getSettings, 
        postSettings } =      require('./settings')
const { getLandingPage } =    require('./landingPage')
const { getImprint } =        require('./imprint')
const { getContent } =        require('../services/content')


const apifetch = (router) => {

  router.use(function(req, res, next) {

    console.log(g('-----------Fetch Route ----------------'));

    if (res.headersSent) return next();   // exit if headers had been sent
      // GET the home landing page
     /* 
          getLandingPage(req, res, next)
          getCourses(req, res, next)
          getSettings(req, res, next)
          getImprint(req, res, next)   // intended to translate a pug page

     */
          getContent(req, res, next)

      // Courses routes
      //   
     // catchErrors(getCoursesByCategory)      
     // catchErrors(getCourse)
     // catchErrors(getLesson)

      // Settings routes
     
      //catchErrors(postSettings)

      // Imprint route
      
  });
// Display settings in case of invalid credentials
  router.all('*', async (request, response, next) => {
    if (response.locals.forceSettingsRoute) {
        await getSettings(request, response, next)
        return
    }
    next()
  })
};

module.exports = apifetch;
