'use strict';

//////////////////////////////////////////////////////////
////////    test connections based on configs     ///////
////////////////////////////////////////////////////////
const helpers =               require('../helpers')
const { getSpace,
        getLocales } =        require('../services/contentful')
const { g, b, gr, r, y } =    require('../console');

const apitest = (router) => {

  router.use(function(request, response, next) {

    console.log(g('---------test api connections---------'));

      // Test space connection and attach space related data for views if possible
      catchErrors(async function (request, response, next) {
          // Catch misconfigured space credentials and display settings page
          try {
              const space = await getSpace()
              const locales = await getLocales()
              // Update credentials in cookie when space connection is successful
              updateCookie(response, SETTINGS_NAME, response.locals.settings)

              // Get available locales from space
              response.locals.locales = locales
              const defaultLocale = response.locals.locales
                  .find((locale) => locale.default)

              if (request.query.locale) {
                  response.locals.currentLocale = space.locales
                      .find((locale) => locale.code === request.query.locale)
              }

              if (!response.locals.currentLocale) {
                  response.locals.currentLocale = defaultLocale
              }

              if (response.locals.currentLocale.fallbackCode) {
                  setFallbackLocale(response.locals.currentLocale.fallbackCode)
              }

              // Creates a query string which adds the current credentials to links
              // To other implementations of this app in the about modal
              helpers.updateSettingsQuery(request, response, response.locals.settings)
          } catch (error) {
              if ([401, 404].includes(error.response.status)) {
                  // If we can't connect to the space, force the settings page to be shown.
                  response.locals.forceSettingsRoute = true
              } else {
                  throw error
              }
          }
          next()
      })
  });
};

module.exports = apitest;
