'use strict';

/////////////////////////////////////////////////////
////////   SERVER API Catalogue for db   ///////////
///////////////////////////////////////////////////

const uuidv1 =                  require('uuid/v1');
const contentful =              require('contentful');
const { g, b, gr, r, y } =      require('../console');

// space id for the bookstore
const client = contentful.createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN,
    environment: "master"
})

////////////////////////////////////
///////   get all entries    //////
//////////////////////////////////

/*
const getAll = async (token, cb) => {
    let response = await getAllContent()   
    return cb(response)
}
*/
const getAll = async (token) => {
    let response = await getAllContent()
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

const getAllContent = () => {
    console.log(g('\nRetrieving CMS Content \n'))  
   
    return new Promise((resolve, reject) => {
        client.getContentType('bookstore')
            .then((response) => {                  

                client.getEntries({
                    content_type: response.sys.id
                    })
                    .then((entries) => {                        
                        return resolve(entries) })
                    .catch((error) => {
                        console.log(r(`\nError occurred while fetching Entries for ${y(response.name)}:`))
                        console.error(error)
                    })
            })
            .catch((error) => {
                console.log(r('\nError occurred while fetching Content Types:'))
                console.error(error)
            })
    }) 

}


/////////////////////////////////////
module.exports = {
  add,
  deleteEntry,
  getAll,
  update
}