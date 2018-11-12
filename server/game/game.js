const {Player} = require('./player')
const {Bid} = require('./bid')

class Game {
  // might change to array of player names input, creating a dictionary?
  constructor(gameID, playerIDs) {
    this.players = playerIDs.map(id => {
      new Player(id)
    })

    this.gameID = gameID

    this.currentPlayer = 0
    this.currentBid = new Bid() // defaults to 0x2; 1x2 is lowest possible bid
    this.palifico = false
  }

  addPlayer (player) {
    console.log(`Player ___@${player.id} joined.`)
    this.players.push(player)
  }

  nextPlayer () {
    this.currentPlayer = (this.currentPlayer + 1) % this.players.length
    // send acceptance message to next player
    // send notification message to next player
    // update all players regarding new bid
  }

  previousPlayer () {
    return (this.currentPlayer + this.players.length - 1) % this.players.length
  }

  makeBid (player, bid) {
    if (player.id === this.players[this.currentPlayer].id) {
      if (bid.checkValid(this.currentBid)) {
        this.currentBid = bid
        nextPlayer()
      }
    }
  }

  challenge (player) {
    if (player.id === this.players[this.currentPlayer].id) {
      if (evaluateCurrentState()) {
        // bid was correct, challenge fails
        // remove die from current player
        player.removeDie()
      } else {
        // bid was incorrect, challenge succeeds
        // remove die from previous player
        previousPlayer().removeDie()
      }
      // reset bids
    }
  }

  // determines if bid is correct; returns true when under or equal
  evaluateCurrentState () {
    let allDice = [].concat.apply([], this.players.map(player => player.dice))
    let diceTotals = allDice.reduce((a, val) => {
      a[val - 1]++
      return a
    }, [0,0,0,0,0,0])

    if (this.currentBid.num === 1) {
      return this.currentBid.freq <= diceTotals[0]
    } else {
      return this.currentBid.freq <= diceTotals[0] + diceTotals[this.currentBid.num - 1]
    }
  }
}

module.exports = {
  Game
}
