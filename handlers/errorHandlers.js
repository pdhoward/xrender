
///////////////////////////////////////////////////////
///////  A handle wrapper for .catch()        ////////
//////  This tests for presence of err on fn ////////
/////////////////////////////////////////////////////

module.exports.catchErrors = (fn) => {
  return function (request, response, next) {
    return fn(request, response, next).catch((e) => {
      if (e.response) {
        e.status = e.response.status
      }
      next(e)
    })
  }
}
