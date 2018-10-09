'use strict';

///////////////////////////////////////
////////     404               ///////
/////////////////////////////////////

const { g, b, gr, r, y } =    require('../console');

const nopage = (router) => {

  router.use(function(req, res, next) {

    const err = new Error(translate('errorMessage404Route', response.locals.currentLocale.code))
    err.status = 404
    next(err)
  });
};

module.exports = nopage;
