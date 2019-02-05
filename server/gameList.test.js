const expect = require('expect')

const {Game} = require('./game/game')
const {GameList} = require('./gameList')

describe('Game List object', () => {
  let g1, g2, gList

  beforeEach(() => {
    g1 = new Game()
    g2 = new Game()
    gList = new GameList()
  })

  it('Should create a new GameList object', () => {
    expect(gList).toBeTruthy()
  })

  it('Should have an array of available IDs', () => {
    expect(gList).toHaveProperty('availableIDs')
    expect(gList.availableIDs.length).toBe(9000)
  })

  it('Should assign an ID to the game, and remove that from the available IDs', () => {
    gList.add(g1)
    expect(g1.id).not.toBe('')
    expect(gList.availableIDs.length).toBe(8999)
    expect(gList.availableIDs.filter(id => id === g1.id).length).toBe(0)
  })
})