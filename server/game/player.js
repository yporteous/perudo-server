const {dieRoll} = require('./random')

class Player {
  constructor (playerID, displayName) {
    this.id = playerID
    this.displayName = displayName
    this.dice = [1,1,1,1,1]
  }

  rollDice () {
    this.dice = this.dice.map((die) => dieRoll())
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
