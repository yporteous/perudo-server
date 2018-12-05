const expect = require('expect')

const {Game} = require('./game')
const {Player} = require('./player')
const {Bid} = require('./bid')

let nCalls = 0

describe('Game Object', () => {
  let p1, p2, newGame

  beforeEach(() => {
    p1 = new Player('p0000', 'Dizzy')
    p2 = new Player('p0001', 'Skaffy')
    p3 = new Player('p0002', 'Xenny')
    newGame = new Game('0001', [p1])
  })

  it('should create a new game object when called appropriately', () => {
    expect(newGame).toBeTruthy()
    expect(newGame.players.length).toBe(1)
    expect(newGame.players[0]).toBe(p1)
  })

  describe('Player tracking', () => {
    it('should add a new player', () => {
      newGame.addPlayer(p2)
      expect(newGame.players.length).toBe(2)
      expect(newGame.players[1]).toBe(p2)
    })

    it('should get the current player object', () => {
      expect(newGame.getCurrentPlayerObject()).toBe(p1)
    })

    it('should correctly increment the current player tracker', () => {
      newGame.addPlayer(p2)
      newGame.addPlayer(p3)
      for (var i = 1; i <= newGame.players.length; i++) {
        newGame.nextPlayer()
        expect(newGame.currentPlayer).toBe(i % newGame.players.length)
      }
    })

    it('should correctly calculate the index of the previous player', () => {
      newGame.addPlayer(p2)
      newGame.addPlayer(p3)
      expect(newGame.previousPlayer()).toBe(2)
      newGame.currentPlayer = 2
      expect(newGame.previousPlayer()).toBe(1)
    })
  })

  // it('should roll all the dice', () => {
  //   // use rewire to override the random function
  // })

  describe('Bidding', () => {
    it('should accept a valid bid', () => {
      let newBid = new Bid(2, 3)
      newGame.makeBid(p1, newBid)
      expect(newGame.currentBid).toMatchObject(newBid)
    })

    // it('should correctly account for aces allowing a lower freq', () => {
    //   newGame.currentBid = new Bid(4, 3)
    //   let newBid = new Bid(3, 1)
    //   newGame.makeBid(newBid)
    //
    //   expect(newGame.currentBid).toMatchObject(newBid)
    // })

    it('should not accept an invalid bid with lower freq and same num', () => {
      let previousBid = new Bid(4, 3)
      newGame.currentBid = previousBid
      let newBid = new Bid(2, 3)
      newGame.makeBid(newBid)

      expect(newGame.currentBid).toMatchObject(previousBid)
    })

    it('should not accept an invalid bid with same/lower freq and lower num)', () => {
      let previousBid = new Bid(4, 3)
      newGame.currentBid = previousBid
      let newBid = new Bid(4, 2)
      newGame.makeBid(newBid)

      expect(newGame.currentBid).toMatchObject(previousBid)
    })
  })

  describe('Challenging', () => {
    it('should correctly identify a successful challenge', () => {

    })
  })

})
