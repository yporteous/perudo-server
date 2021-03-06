const express = require('express')
const http = require('http')
const path = require('path')
const socketIO = require('socket.io')

const {Game} = require('./game/game')
const {Player} = require('./game/player')
const {GameList} = require('./gameList')

const port = 3000
const app = express()
const server = http.createServer(app)
const io = socketIO(server)

const publicPath = path.join(__dirname, '../testclient')
app.use(express.static(publicPath))

//let numberOfGames = 0

// TODO: Choose between callbacks and return values for Game object methods

// could this be an object?
let games = new GameList()
// let games = []

io.on('connection', socket => {
  // TODO: add parameter to socket that identifies the game
  // local variable, or can we add to socket object directly?
  let currentGame
  let playerMe

  console.log(`New player (${socket.id}) connected`)

  // creating a new game; sign in at this time
  socket.on('createGame', (params) => {

    // create a new game id
    // TODO: need a new process for generating this if games will be removed
    let gameID = `${games.length}`.padStart(4, '0')
    playerMe = new Player(socket.id, params.displayName)

    // create a game with that ID, and the current player's socket id
    currentGame = new Game(gameID, [playerMe])
    games.push(currentGame)

    // join that game's room as a player
    socket.join(gameID)

    // report id to user to give to other potential players
    socket.emit('gameJoined', {
      gameID,
      playerMe,
      players: currentGame.players
    })
    console.log(`created game ${gameID}`)

    socket.on('startGame', () => {
      // send currentPlayer to all players
      io.to(currentGame.gameID).emit('newTurn', currentGame.currentPlayer)
    })
  })

  // joining an existing game
  socket.on('joinGame', (params) => {

    // find room
    let room = io.sockets.adapter.rooms[params.gameID]

    // if room exists:
    if (room) {
      // create player
      playerMe = new Player(socket.id, params.displayName)
      // game should exist if room exists, but add extra validation later
      currentGame = games.filter(game => game.gameID === params.gameID)[0]
      // add player to game
      currentGame.addPlayer(playerMe)
      // update players already in game
      io.to(currentGame.gameID).emit('updatePlayerList', currentGame.players)
      // join room
      socket.join(params.gameID)
      // confirm addition with player
      socket.emit('gameJoined', {
        gameID: params.gameID,
        playerMe,
        players: currentGame.players
      })
    } else {
      // report that game does not exist
      socket.emit('gameNonExistent')
    }
  })

  // playing the game
  socket.on('makeBid', bid => {
    // Game object itself checks that it is the right player's turn
    if (currentGame.makeBid(playerMe, bid)) {
      io.to(currentGame.gameID).emit('bidMade', bid)
    }
  })

  socket.on('challenge', () => {
    let {bidWasCorrect, losingPlayer} = currentGame.challenge(playerMe)
    if (bidWasCorrect) {
      io.to(currentGame.gameID).emit('challengeFailed', losingPlayer)
    } else {
      io.to(currentGame.gameID).emit('challengeSucceeded', losingPlayer)
    }
  })

  socket.on('disconnect', () => {
    console.log(`Player (${socket.id}) disconnected.`)
    if (playerMe) {
      // remove player from game, check if game needs to be culled
      gameIndex = currentGame.parseInt()
    }
  })
})

server.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
