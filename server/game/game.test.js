const expect = require('expect')

const {Game} = require('./game')
const {Player} = require('./player')
const {Bid} = require('./bid')

describe('Game object', () => {
  let p1, p2, p3, newGame

  beforeEach(() => {
    p1 = new Player('p0000', 'Dizzy')
    p2 = new Player('p0001', 'Skaffy')
    p3 = new Player('p0002', 'Xenny')
    newGame = new Game([p1])
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
    it('should increment the player after a valid bid', () => {
      newGame.addPlayer(p2)
      newGame.makeBid(p1, new Bid(2, 3))
      expect(newGame.currentPlayer).toBe(1)
    })

    it('should not increment the player after an invalid bid', () => {
      newGame.currentBid = new Bid(4, 6)
      newGame.addPlayer(p2)
      newGame.makeBid(p1, new Bid(2, 3))
      expect(newGame.currentPlayer).toBe(0)
    })

    it('should not accept a bid from a player who is not currently bidding', () => {
      newGame.addPlayer(p2)
      newGame.makeBid(p2, new Bid(2, 3))
      expect(newGame.currentPlayer).toBe(0)
      expect(newGame.currentBid).toMatchObject(new Bid())
    })
  })

  describe('Challenging', () => {
    beforeEach(() => {
      newGame.addPlayer(p2)
      newGame.addPlayer(p3)
      p1.dice = [1, 3, 3, 4, 6]
      p2.dice = [3, 4, 4, 5, 6]
      p3.dice = [1, 1, 2, 3, 6]
      // Num:   1 | 2 | 3 | 4 | 5 | 6
      // –––––––––|–––|–––|–––|–––|–––
      // Freq:  3 | 1 | 4 | 3 | 1 | 3
      // F_ace: 3 | 4 | 7 | 6 | 4 | 6
      // –––––––––|–––|–––|–––|–––|–––
    })

    it('should correctly identify a successful no-ace challenge', () => {
      newGame.currentBid = new Bid(5, 5)
      newGame.challenge(p1, (res, pl) => {
        expect(res).toBeFalsy()
      })
    })

    it('should correctly identify an unsuccessful no-ace challenge', () => {
      newGame.currentBid = new Bid(3, 5)
      newGame.challenge(p1, (res, pl) => {
        expect(res).toBeTruthy()
      })
    })

    it('should correctly identify a successful aces challenge', () => {
      newGame.currentBid = new Bid(4, 1)
      newGame.challenge(p1, (res, pl) => {
        expect(res).toBeFalsy()
      })
    })

    it('should correctly identify an unsuccessful aces challenge', () => {
      newGame.currentBid = new Bid(3, 1)
      newGame.challenge(p1, (res, pl) => {
        expect(res).toBeTruthy()
      })
    })

    it('should remove a die from the loser of a successful challenge', () => {
      newGame.currentBid = new Bid(5, 5)
      newGame.challenge(p1, (res, pl) => {
        expect(p3.dice.length).toBe(4)
      })
    })

    it('should remove a die from the loser of an unsuccessful challenge', () => {
      newGame.currentBid = new Bid(3, 5)
      newGame.challenge(p1, (res, pl) => {
        expect(p1.dice.length).toBe(4)
      })
    })
  })

})
