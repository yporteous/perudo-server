const {dieRoll} = require('./random')
const {Bid} = require('./bid')

class Player {
  constructor () {
    // this._id = playerID
    this.resetDice()
    this.bid = new Bid()
  }

  rollDice () {
    this.dice = this.dice.map(() => {
      dieRoll()
    })
  }

  removeDie () {
    this.dice.pop()
  }

  resetDice () {
    this.dice = [1,1,1,1,1]
  }
}

module.exports = {
  Player
}
