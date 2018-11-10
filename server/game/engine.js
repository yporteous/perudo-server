const {Player} = require('./player')
const {Bid} = require('./bid')

class Game {
  // might change to array of player names input, creating a dictionary?
  constructor(nPlayers) {
    this.players = []
    for (var i = 0; i < nPlayers; i++) {
      this.players.push(new Player())
    }

    this.currentPlayer = 0
    this.currentBid = new Bid() // defaults to 0x2; 1x2 is lowest possible bid
  }
}
