'use strict';

//////////////////////////////////////////////////////////
////////    test connections based on configs     ///////
////////////////////////////////////////////////////////

const { g, b, gr, r, y } =    require('../console');

const apiprep = (router) => {

  router.use(function(req, res, next) {

    console.log(g('--------------home route ----------------'));

    if (res.headersSent) return next();   // exit if headers had been sent

    return new Promise((resolve, reject) => {
      res.render('index', {
      });

      resolve('success');
    })
      .catch(error => {
        console.error(error);
        reject(error);
      })
      .finally(() => {
        return next();
      });
  });
};

module.exports = apiprep;
