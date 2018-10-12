
'use strict';
require('dotenv').config();
///////////////////////////////////////
////////   upload bookstore    ///////
/////////////////////////////////////

// note - not triggerd by a web page option - see test/content.test.js
const contentful =              require('contentful-management');
const { readFileSync } =        require('fs')
const books =                   require('../src/components/data3')
const exportFile =              require('../contentful/export.json')
const { g, b, gr, r, y } =      require('../console');

// space used to test xrender ... more complex contentTypes
const client = contentful.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_API
})

const postData = (req, res, next) => {
    return new Promise((resolve, reject) => {
    console.log(r(`Entered importjs .............`))

    const postEntries = async (books) => {
        console.log(r(`Entered postentries .............`))
        const dataArray = books.map(async (b) => {
          const response = await createEntry(b)
          return response 
        })
        console.log(r(`-----------------completed map ---------------`))  
        const newArray = await Promise.all(dataArray)
        console.log(r(`-----------------completed newArray-------------`))
        console.log(newArray)
        console.log(r(`-----------------------------------------------`))
        return newArray
    }

    const createEntry = (b) => {
        console.log(r(`Entered createEntry .............`))
        console.log(b)
        return new Promise((resolve, reject) => {

            client.getSpace(process.env.CONTENTFUL_SPACE_ID)
                .then((space) => space.getEnvironment('master'))
                .then((environment) => environment.createEntry('test', {
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
                        category: {
                            'en-US': b.category
                        }
                    }
                }))
                .then((entry) => {
                    entry.publish()
                    console.log(entry)
                    resolve(entry)
                    return
                })
                .catch(console.error)
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
/*
// process an image for an entry

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
