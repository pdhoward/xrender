'use strict';

/////////////////////////////////////////////
////////  update cms with seed data ///////
///////////////////////////////////////////

const { postData } =          require('../services/import')
const { g, b, gr, r, y } =    require('../console');


const apipost = (router) => {

  router.use(function(req, res, next) {

    console.log(g('-----------Post Data Route ----------------'));

    if (res.headersSent) return next();   // exit if headers had been sent     
    postData(req, res, next)
      .then((m) => {
        console.log(m)
        next()
      })   
    
  })
};

module.exports = apipost;
