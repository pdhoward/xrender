
///////////////////////////////////////////////////////
////////     demonstration commercial site     ///////
//////           api catalogue                ///////
//////      c strategic machines 2018        ///////
///////////////////////////////////////////////////

const apiProfile = process.env.SERVER_API_URL || 'http://localhost:3100'
let localStorage = {}
localStorage.token = null

/*
// isomorphic code requires node package
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}
*/
let token = localStorage.token

if (!token)
  token = localStorage.token = Math.random().toString(36).substr(-8)

const headers = {
  'Accept': 'application/json',
  'Authorization': token
}

console.log("testing ===============")
console.log(`value of token is ${token}`)
console.log(JSON.stringify(headers))


// set of simple apis for server calls
// server in turn integrates to headless cms

export const getAll = () => {
  console.log("ENTERED GET ALL API")
  fetch(`${apiProfile}/api/db`, { headers })
    .then(res => res.json())
    .then((data) => {
      console.log("returned data")
      console.log(data)
      return data
    })
  }

export const remove = (contact) =>
  fetch(`${apiProfile}/api/db/${contact}`, {
    method: 'DELETE', headers })
    .then(res => res.json())
    .then(data => data.contact)

export const create = (body) =>
  fetch(`${apiProfile}/api/db`, {
    method: 'PUT',
    headers: {      
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then(res => res.json())

export const update = (body) =>
    fetch(`${apiProfile}/api/db`, {
      method: 'POST',
      headers: {       
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    .then(res => res.json())
    .then(data => data)

