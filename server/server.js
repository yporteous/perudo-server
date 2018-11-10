const express = require('express')
const http = require('http')
const path = require('path')
const socketIO = require('socket.io')

const port = 3000
const app = express()
const server = http.createServer(app)
const io = socketIO(server)

let numberOfGames = 0

io.on('connection', socket => {
  console.log('New player connected')

  socket.on('createGame', (params, callback) => {
    console.log('creating a new game')
    // create a new game id
    let gameID = `${++numberOfGames}`.padStart(4)
    // join that game as a player
    socket.join(gameID)
    // report id to user so that others can join
    socket.emit('gameCreated', gameID)
  })

  socket.on('joinGame', (params, callback) => {
    let room = socket.manager.rooms['/' + params.gameID]

    if (room) {
      socket.join(gameID)
      socket.emit('gameJoined', gameID)
    } else {
      socket.emit('gameNonExistent')
    }
  })
  
})


server.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
