'use strict';

///////////////////////////////////////
////////     404               ///////
/////////////////////////////////////

const { g, b, gr, r, y } =    require('../console');
const { translate } =         require('../i18n/i18n')

const nopage = (router) => {

  router.use(function(request, response, next) {

    const err = new Error(translate('errorMessage404Route', response.locals.currentLocale.code))
    err.status = 404
    next(err)
  });
};

module.exports = nopage;
