
'use strict';
require('dotenv').config();
///////////////////////////////////////
////////   upload bookstore    ///////
/////////////////////////////////////


// note - not triggerd by a web page option - see test/content.test.js
const contentful = require('contentful');
const { g, b, gr, r, y } = require('../console');
const Table = require('cli-table2')


// space used tp test xrender ... more complex contentTypes
const client = contentful.createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN,
    environment: "master"
})


////////////////////////////
client.getSpace('<space-id>')
    .then((space) => space.createEntry('<content-type-name>', {
        fields: {
            name: {
                'en-US': d.TheName
            },
            age: {
                'en-US': d.TheAge
            }
        }
	}))
    .then((entry) => console.log(entry))
    .catch(console.error)

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

