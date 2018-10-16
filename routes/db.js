

'use strict';

/////////////////////////////////////////////
//////// process http calls for data   /////
////////////////////////////////////////////

const bodyParser =            require('body-parser')
const api =                   require('../api')
const { g, b, gr, r, y } =    require('../console');

const db = (router) => {

	router.use(bodyParser.json());

	router.delete("/:id", function(req, res, next) {
 	 console.log("----------DB ROUTE -----------")
 	 api.delete(req.token, req.params.id, function(response){
 		 res.status(200).send(response)
		 next()
 	  })
   })

	 /*
	router.get('/', function(req, res, next) {		 
		api.getAll(req.token, function(response){		
			res.status(200).send(response)
			next()
			})
		})
*/
	router.get('/', async (req, res, next) => {

		let response = await api.getAll(req.token)		
		res.status(200).send(response)
		next()
		
	})

	 router.post('/', function(req, res, next) {
		  console.log("---------DB ROUTE -----------")
			if (req.body) {
		     api.update(req.token, req.body, function(response){
		       res.status(200).send(response)
					 next()
		      })
		    }
		    else {
					let err = new Error('Error Post DBA - Please Provide All Required Data')
		      res.status(403).send(err.message)
					next(err)
		   }
		 })

	 router.put('/', function(req, res, next) {
		  console.log("---------DB ROUTE -----------")	
			if (req.body) {
		     api.add(req.token, req.body, function(response) {
		       res.status(200).send(response)
					 next()
		      })
		    }
		    else {
					let err = new Error('Error Put DBA - Please Provide All Required Data')
		      res.status(403).send(err.message)
					next(err)
		   }
		 })

}

module.exports = db