


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


// minimal json for using conteful import ... includes asset
{
    "contentTypes": [
        {
            "sys": {
                "id": "post"
            },
            "name": "Post",
            "fields": [
                {
                    "id": "title",
                    "name": "Title",
                    "type": "Symbol"
                },
                {
                    "id": "body",
                    "name": "Body",
                    "type": "Text"
                }
            ]
        }
    ],
        "entries": [
            {
                "sys": {
                    "id": "<unique_id_here>",
                    "publishedVersion": 1,
                    "contentType": {
                        "sys": {
                            "id": "post"
                        }
                    }
                },
                "fields": {
                    "title": {
                        "en-US": "My Cat"
                    },
                    "body": {
                        "en-US": "This is a post about my cat."
                    }
                }
            }
        ],
            "assets": [
                {
                    "sys": {
                        "publishedVersion": 1
                    },
                    "fields": {
                        "title": {
                            "en-US": "my cat"
                        },
                        "description": {
                            "en-US": "a picture of my cat"
                        },
                        "file": {
                            "en-US": {
                                "url": "//example.com/my_cat.jpg",
                                "fileName": "my_cat.jpg",
                                "contentType": "image/jpeg"
                            }
                        }
                    }
                }
            ]
}