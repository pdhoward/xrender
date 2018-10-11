


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

