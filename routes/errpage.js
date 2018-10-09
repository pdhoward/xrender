'use strict';

/////////////////////////////////////////////
////////    render error page        ///////
///////////////////////////////////////////

const { g, b, gr, r, y } =    require('../console');

const errpage = (router) => {

  router.use(function(err, request, response, next) {
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
  });
};

module.exports = errpage;
