'use strict';

/////////////////////////////////////////////////////////////////
////////     update res object with additional data      ///////
///////////////////////////////////////////////////////////////
const helpers =               require('../handlers/helpers')
const querystring =           require('querystring')
const { translate,
        initializeTranslations,
        setFallbackLocale } = require('../i18n/i18n')
const { g, b, gr, r, y } =    require('../console');

const apiprep = (router) => {

  router.use(function(request, response, next) {

    console.log(g('-----------prep api route--------------'));
   
      response.locals.baseUrl = `${request.protocol}://${request.headers.host}`
      // Get enabled locales from Contentful
      response.locals.locales = [{ code: 'en-US', name: 'U.S. English' }]
      response.locals.currentLocale = response.locals.locales[0]
      // Inject custom helpers
      response.locals.helpers = helpers      

      // Make query string available in templates to render links properly
      const cleanQuery = helpers.cleanupQueryParameters(request.query)
      const qs = querystring.stringify(cleanQuery)

      response.locals.queryString = qs ? `?${qs}` : ''
      response.locals.queryStringSettings = response.locals.queryString
      response.locals.query = request.query
      response.locals.currentPath = request.path

      // Initialize translations and include them on templates
      initializeTranslations()
      response.locals.translate = translate

      // Set active api based on query parameter
      const apis = [
        {
          id: 'cda',
          label: translate('contentDeliveryApiLabel', response.locals.currentLocale.code)
        },
        {
          id: 'cpa',
          label: translate('contentPreviewApiLabel', response.locals.currentLocale.code)
        }
      ]

      // Set currently used api
      response.locals.currentApi = apis
        .find((api) => api.id === (request.query.api || 'cda'))

      // Fall back to delivery api if an invalid API is passed
      if (!response.locals.currentApi) {
        response.locals.currentApi = apis.find((api) => api.id === 'cda')
      }

      next()
  
  });
};

module.exports = apiprep;
