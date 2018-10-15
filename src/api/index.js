
///////////////////////////////////////////////////////
////////     demonstration commercial site     ///////
//////           api catalogue                ///////
//////      c strategic machines 2018        ///////
///////////////////////////////////////////////////

const apiProfile = process.env.REACT_APP_CONTACTS_API_URL || 'http://localhost:5002'

let token = localStorage.token

if (!token)
  token = localStorage.token = Math.random().toString(36).substr(-8)

const headers = {
  'Accept': 'application/json',
  'Authorization': token
}

// set of simple apis for server calls
// server in turn integrates to headless cms

export const getAll = () =>
  fetch(`${apiProfile}/api/db`, { headers })
    .then(res => res.json())
    .then((data) => {
      return data
    })

export const remove = (contact) =>
  fetch(`${apiProfile}/api/db/${contact}`, {
    method: 'DELETE', headers })
    .then(res => res.json())
    .then(data => data.contact)

export const create = (body) =>
  fetch(`${apiProfile}/api/db`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then(res => res.json())

export const updateProfile = (body) =>
    fetch(`${apiProfile}/api/db`, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    .then(res => res.json())
    .then(data => data)

