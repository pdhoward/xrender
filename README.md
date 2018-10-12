
# Render Content for a Dialogue

## Usage

### 1. Clone the repo
```
$ git clone https://github.com/pdhoward/xrender
```

### 2. Set up Cognitive Instrumentation 

### 3. Configure credentials
edit the .env for the credentials

### 4. Run locally on port 3100 or higher

## Routes

1. seed/setup.js - cli for setting apis and importing a file to cms. 

The current import should not be used. Located under contentful export.json (will be udpated)

2. /api/fetch - from the browser

experiment to demonstrate process for retrieving cms contentTypes. The 'services/content' module called by this api will retrieve and render all contentTypes in the identified space

3. /api/post - from the browser

experiment to seed the cms bookstore using a json object and associated images. This demonstrates the ability to load a cms with data migrated from another site. Note that rate limits are encountered. Timers need to be inserted to slow down the process with significant data migrations

4. / - index route renders the bookstore web page. 



# License
[MIT](LICENSE)
