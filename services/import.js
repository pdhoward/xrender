
'use strict';
require('dotenv').config();
///////////////////////////////////////
////////   upload bookstore    ///////
/////////////////////////////////////

// note - not triggerd by a web page option - see test/content.test.js
const contentful =              require('contentful-management');
const { readFileSync } =        require('fs')
const books =                   require('../src/components/data2')
const exportFile =              require('../contentful/export.json')
const { g, b, gr, r, y } =      require('../console');

// space used tp test xrender ... more complex contentTypes
const client = contentful.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_API
})

const postData = (req, res, next) => {

    const postEntries = async (books) => {
        const promises = books.map(b => createEntry(b))
        const entries = await Promise.all(promises)
        return entries
    }

    postEntries(books).then((e) => {
        console.log("SUCCESS")
        res.json(e)
    })
    

}

const createEntry = (b) => {
   
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
            console.log(entry)})
        .catch(console.error)
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
