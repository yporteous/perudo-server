const {Player} = require('./player')
const {Bid} = require('./bid')

class Game {
  constructor(gameID, players = []) {
    this.players = players

    this.gameID = gameID

    this.currentPlayer = 0
    this.currentBid = new Bid() // defaults to 0x2; 1x2 is lowest possible bid
    this.palifico = false
  }

  addPlayer (player) {
    // console.log(`Player ___@${player.id} joined.`)
    this.players.push(player)
  }

  getCurrentPlayerObject () {
    return this.players[this.currentPlayer]
  }

  nextPlayer () {
    this.currentPlayer = (this.currentPlayer + 1) % this.players.length
    // what is the scope of a callback?
    // send acceptance message to next player
    // send notification message to next player
    // update all players regarding new bid
  }

  previousPlayer () {
    return (this.currentPlayer + this.players.length - 1) % this.players.length
  }

  rollAllDice () {
    this.players.forEach(player => {
      player.rollDice()
    })
  }

  makeBid (player, bid) {
    if (player.id === this.players[this.currentPlayer].id) {
      if (bid.checkValid(this.currentBid)) {
        this.currentBid = new Bid(bid.freq, bid.num)
        this.nextPlayer()
        return true
      }
    }
    return false
  }

  challenge (player) {
    if (player.id === this.players[this.currentPlayer].id) {
      let bidCorrect, losingPlayer
      if (this.evaluateCurrentState()) {
        // bid was correct, challenge fails
        // remove die from current player
        player.removeDie()
        bidCorrect = true
        losingPlayer = this.players[this.currentPlayer]
      } else {
        // bid was incorrect, challenge succeeds
        // remove die from previous player
        this.players[this.previousPlayer()].removeDie()
        bidCorrect = false
        losingPlayer = this.players[this.previousPlayer()]
      }
      // reset bids
      this.currentBid = new Bid()
      return {bidCorrect, losingPlayer}
    }
  }

  // determines if bid is correct; returns true when bid under or equal state
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
