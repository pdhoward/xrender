'use strict';

/////////////////////////////////////////////////////
////////   SERVER API Catalogue for db   ///////////
///////////////////////////////////////////////////

const uuidv1 =                  require('uuid/v1');
const contentful =              require('contentful-management');
const { g, b, gr, r, y } =      require('../console');

// space id for the bookstore
const client = contentful.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_API,
    space: process.env.CONTENTFUL_SPACE_ID,    
    environment: "master"
})



////////////////////////////////////
///////   get all entries    //////
//////////////////////////////////
const getAll = async (token, cb) => {

  let response = await getContent()
  return response
  
}


/////////////////////////////////
///////   update db   //////////
///////////////////////////////

const update = async (token, cb) => {

 console.log('update')
}

////////////////////////////////////
///////   add new entry  //////////
//////////////////////////////////
const add = async (token, cb) => {
   console.log(' add new entry')   
}

////////////////////////////////////
///////   delete client  //////////
//////////////////////////////////
const deleteEntry = async(token, cb) => {
    console.log(' delete new entry')   
}

// fetch function - cms

const getContent = () => {
    console.log(g('\nRetrieving CMS Content \n'))  
   
    return client.getContentTypes()
        .then((response) => {

            let contentType = response.filter(c => c.name="bookstore")

            return client.getEntries({
                content_type: contentType[0].sys.id
            })
                .then((response) => response.items)
                .catch((error) => {
                    console.log(r(`\nError occurred while fetching Entries for ${y(contentType[0].name)}:`))
                    console.error(error)
                })
        })
    .catch((error) => {
        console.log(r('\nError occurred while fetching Content Types:'))
        console.error(error)
    })    

}


/////////////////////////////////////
module.exports = {
  add,
  deleteEntry,
  getAll,
  update
}