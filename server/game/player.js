const {dieRoll} = require('./random')

class Player {
  constructor (playerID) {
    this._id = playerID
    this.resetDice()
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
