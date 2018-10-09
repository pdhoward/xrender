'use strict';

/////////////////////////////////////////////
////////     home page               ///////
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


const apifetch = (router) => {

  router.use(function(req, res, next) {

    console.log(g('-----------Fetch Route ----------------'));

    if (res.headersSent) return next();   // exit if headers had been sent
      // GET the home landing page
      getLandingPage()

      // Courses routes
      //catchErrors(getCourses)      
     // catchErrors(getCoursesByCategory)      
     // catchErrors(getCourse)
     // catchErrors(getLesson)

      // Settings routes
     // catchErrors(getSettings)
      //catchErrors(postSettings)

      // Imprint route
      //catchErrors(getImprint)   
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
