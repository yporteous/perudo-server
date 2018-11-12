const express = require('express')
const http = require('http')
const path = require('path')
const socketIO = require('socket.io')

const {Game} = require('./game/game')
const {Player} = require('./game/player')

const port = 3000
const app = express()
const server = http.createServer(app)
const io = socketIO(server)

const publicPath = path.join(__dirname, '../testclient')
app.use(express.static(publicPath))

//let numberOfGames = 0

// could this be an object?
let games = []

io.on('connection', socket => {
  // TODO: add parameter to socket that identifies the game
  // local variable, or can we add to socket object directly?
  let currentGame
  let player

  console.log('New player connected')

  // creating a new game; sign in at this time
  socket.on('createGame', (params, callback) => {

    // create a new game id
    let gameID = `${games.length}`.padStart(4, '0')
    player = new Player(socket.id, params.displayName)

    // create a game with that ID, and the current player's socket id
    currentGame = new Game(gameID, [player])
    games.push(currentGame)

    // join that game's room as a player
    socket.join(gameID)

    // report id to user to give to other potential players
    socket.emit('gameJoined', gameID)
    console.log(`created game ${gameID}`)
  })

  // joining an existing game
  socket.on('joinGame', (params, callback) => {

    // find room
    let room = io.sockets.adapter.rooms[params.gameID]

    // create player
    player = new Player(socket.id, params.displayName)

    // if room exists:
    if (room) {
      // game should exist if room exists, but add extra validation
      currentGame = games.filter(game => game.gameID === params.gameID)[0]
      // add player to game
      currentGame.addPlayer(player)
      // join room
      socket.join(params.gameID)
      // confirm with player
      socket.emit('gameJoined', params.gameID)
    } else {
      // report that game does not exist
      socket.emit('gameNonExistent')
    }
  })
})


server.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
