'use strict';
require('dotenv').config();
///////////////////////////////////////////////////////////////////////
////////   process content retrieve and console log results    ///////
/////////////////////////////////////////////////////////////////////


// note - not triggerd by a web page option - see test/content.test.js
const contentful =            require('contentful');
const { g, b, gr, r, y } =    require('../console');
const Table =                 require('cli-table2')

// space used to test discovery and render
/*
const client = contentful.createClient({
  space: process.env.CONTENT_SPACEID,
  accessToken: process.env.CONTENT_DELIVERY_ID,
  environment: "master"
})
*/

// space used tp test xrender ... more complex contentTypes
const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN,
  environment: "master"
})


const getContent = (req, res, next) => {

    console.log(g('\nWelcome to the Contentful \n'))
    console.log('Demonstrating Contentful CDA\n')

    function retrieveContent () {
        displayContentTypes()
        .then(displayEntries)
        .then(() => {
          console.log('Want to go further? Feel free to check out this guide:')
          console.log(y('https://www.contentful.com/developers/docs/javascript/tutorials/using-js-cda-sdk/\n'))
        })
        .catch((error) => {
          console.log(r('\nError occurred:'))
          if (error.stack) {
            console.error(error.stack)
            return
          }
          console.error(error)
        })
      }

    function displayContentTypes () {
      console.log(g('Fetching and displaying Content Types ...'))

        return fetchContentTypes()
        .then((contentTypes) => {
          // Display a table with Content Type information
          const table = new Table({
            head: ['Id', 'Title', 'Fields']
          })
          contentTypes.forEach((contentType) => {
            const fieldNames = contentType.fields
              .map((field) => field.name)
              .sort()
            table.push([contentType.sys.id, contentType.name, fieldNames.join(', ')])
          })
          console.log(table.toString())

          return contentTypes
    })
  }

    function displayEntries (contentTypes) {
      console.log(g('Fetching and displaying Entries ...'))

      return Promise.all(contentTypes.map((contentType) => {
        return fetchEntriesForContentType(contentType)
        .then((entries) => {
          console.log(`\These are the first 100 Entries for Content Type ${y(contentType.name)}:\n`)

          // Display a table with Entry information
          const table = new Table({
            head: ['Id', 'Title']
          })
          entries.forEach((entry) => {
            table.push([entry.sys.id, entry.fields[contentType.displayField] || '[empty]'])
          })
          console.log(table.toString())
          if (res.headersSent) return;
          res.json(entries)
          //res.send(table.toString())
          res.end()
        })
      }))
    }

    // Load all Content Types in your space from Contentful
    function fetchContentTypes () {
      return client.getContentTypes()
      .then((response) => {
        return response.items})
      .catch((error) => {
        console.log(r('\nError occurred while fetching Content Types:'))
        console.error(error)
      })
    }

    // Load all entries for a given Content Type from Contentful
    function fetchEntriesForContentType (contentType) {
      return client.getEntries({
          content_type: contentType.sys.id
        })
      .then((response) => response.items)
      .catch((error) => {
        console.log(r(`\nError occurred while fetching Entries for ${y(contentType.name)}:`))
        console.error(error)
      })
    }

    // execute
    retrieveContent()
    //res.json({msg: "request completed"})
    //res.end()

 
}

module.exports = {
  getContent: getContent}
