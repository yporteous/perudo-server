const expect = require('expect')
const rewire = require('rewire')

const playerLib = rewire('./player')
const Player = playerLib.Player
// const {dieRoll} = rewire('./random')

playerLib.__set__('dieRoll', () => {
  return 4 // "chosen by fair die roll"
})

describe('Player object', () => {
  let p1
  let id = '0012adecf'
  let name = 'Dizzy'

  beforeEach(() => {
    p1 = new Player(id, name)
  })

  it('should create a new player object', () => {
    expect(p1).toBeTruthy()
    expect(p1.displayName).toBe(name)
    expect(p1.id).toBe(id)
  })

  it('should remove a die', () => {
    p1.removeDie()
    expect(p1.dice.length).toBe(4)
  })

  it('should roll the dice', () => {
    p1.rollDice()
    expect(p1.dice).toEqual([4,4,4,4,4])
  })

  it('should reset dice to 1,1,1,1,1', () => {
    p1.rollDice()
    p1.resetDice()
    expect(p1.dice).toEqual([1,1,1,1,1])
  })
})
