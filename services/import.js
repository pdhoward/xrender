
'use strict';
require('dotenv').config();
///////////////////////////////////////
////////   upload bookstore    ///////
/////////////////////////////////////

// note - not triggerd by a web page option - see test/content.test.js
const contentful =              require('contentful-management');
const { createReadStream } =    require('fs')
const url =                     require('url')
const path =                    require('path')
const books =                   require('../src/components/data2')
const exportFile =              require('../contentful/export.json')
const { g, b, gr, r, y } =      require('../console');

// space used to test xrender ... more complex contentTypes
const client = contentful.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_API
})

let regexp = /[^ /\\&\?]+\.\w{3,4}(?=([\?&].*$|$))/
//let testurl = 'img/python/learn-python-the-hard-way.jpeg'
//console.log(regexp.exec(testurl)[0])

const postData = (req, res, next) => {
    return new Promise((resolve, reject) => {  

    const postEntries = async (books) => {
        // create entries for bookstore
        const dataArray = books.map(async (b) => {
          console.log(r(`executing entry creation `))
          console.log(JSON.stringify(b))
          const response = await createEntry(b)
          return response 
        })        
        const newDataArray = await Promise.all(dataArray)

        // create media file for each entry that has been created
        const assetArray = newDataArray.map(async (a) => {
            console.log(g(`executing asset creation`))
            console.log(JSON.stringify(a, null, 2))
            const response = await createAsset(a)
            return response
        })

        const newUpdatedArray = await Promise.all(assetArray)

        return newDataArray
    }

    const createEntry = (b) => {     
        return new Promise((resolve, reject) => {          

            client.getSpace(process.env.CONTENTFUL_SPACE_ID)
                .then((space) => space.getEnvironment('master'))
                .then((environment) => environment.createEntry('bookstore', {
                    fields: {
                        id: {
                            'en-US': b.id
                        },
                        title: {
                            'en-US': b.title
                        },
                        price: {
                            'en-US': b.price
                        },
                        path: {
                            'en-US': b.thumbnail
                        },
                        category: {
                            'en-US': b.category
                        }
                    }
                }))
                .then((entry) => {
                    // publish entry
                    entry.publish()
                    resolve(entry)
                    return 
                    
                })
                .catch(console.error)
                
        })
    }

    const createAsset = (a) => {

        let fileNM = regexp.exec(a.fields.path["en-US"])[0]    // extract path name from entry object
        let uploadNM = path.resolve(__dirname, '..', 'public/assets/img')  // find path to image
        let pathNM = uploadNM + "\\" + fileNM    // create path name
        console.log(pathNM)

        return new Promise((resolve, reject) => {

            client.getSpace(process.env.CONTENTFUL_SPACE_ID)
                .then( function(space) {                   

                    space.getEnvironment('master')
                    .then(function (environment) {
                
                        environment.getEntry(a.sys.id)
                        .then(function (entry) {
                            environment.createAssetFromFiles({
                                fields: {
                                    file: {
                                        'en-US': {
                                            contentType: 'image/jpeg',
                                            fileName: fileNM,
                                            file: createReadStream(pathNM)
                                        }
                                    }
                                }
                            })
                            .then(asset => asset.processForAllLocales())
                            .then(asset => asset.publish())
                            .then(function (asset) {
                                // assign uploaded image as an entry field                               
                                entry.fields["thumbnail"] = {}
                                entry.fields.thumbnail["en-US"] = { "sys": { "id": asset.sys.id, "linkType": "Asset", "type": "Link" } };
                                entry.update()
                                resolve(entry)
                            })
                            .catch(console.error)
                        })
                  })
                })
            })            
        }
        

    postEntries(books).then((newArray) => {
        let returnArray = [...newArray]
        res.json(returnArray)
        resolve({"msg": "success"})
    })
  })
}

module.exports = {
    postData: postData
}

// process an image for an entry
/*
client.getSpace(CONTENTFUL_SPACE).then((space) => {
    // retrieve my Contentful space

    space.getEntry(CONTENTFUL_ENTRY).then(function (entry) {
        // get a specific entry

        // create a new asset in my Contentful media section
        space.createAssetWithId(RANDOM_ID, {
            fields: {
                file: {
                    'en-GB': {
                        contentType: 'image/jpeg',
                        fileName: 'test.jpg',
                        upload: 'http://www.example.com/test.jpg'
                    }
                }
            }
        })
            .then(asset => asset.processForAllLocales())
            .then(asset => asset.publish())
            .then(function (asset) {

                // assign uploaded image as an entry field
                entry.fields["image"]["en-GB"] = { "sys": { "id": asset.sys.id, "linkType": "Asset", "type": "Link" } };
                return entry.update()
            });
    });
});
*/
