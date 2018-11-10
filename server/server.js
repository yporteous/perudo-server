const express = require('express')
const http = require('http')
const path = require('path')
const socketIO = require('socket.io')

const port = 3000
const app = express()
const server = http.createServer(app)
const io = socketIO(server)

io.on('connection', socket => {
  console.log('New player connected')

  socket.on('createGame', (params, callback) => {
    console.log('creating a new game')
    // create a new game id
    // join that game as a player
    // report id to user so that others can join
  })


})


server.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
