class GameList {
  constructor () {
    this.games = {}
    this.availableIDs = Array(9000).fill().map((e, i) => i + 1000)
  }

  add (game) {
    let index = Math.floor(Math.random() * this.availableIDs.length)
    let id = this.availableIDs.splice(index, 1)
    game.id = id
    this.games[id] = game
  }

  removeByID (id) {
    delete this.games[id]
    this.availableIDs.push(id)
  }
}

module.exports = {
  GameList
}