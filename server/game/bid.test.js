const expect = require('expect')

const {Bid} = require('./bid')

describe('Bid object', () => {
  it('should create a bid object with the correct default values when called without arguments', () => {
    let bid = new Bid()
    expect(bid).toBeTruthy()
    expect(bid.freq).toBe(0)
    expect(bid.num).toBe(2)
  })

  it('should create a bid object with the correct values when called with arguments', () => {
    let bid = new Bid(3, 4)
    expect(bid).toBeTruthy()
    expect(bid.freq).toBe(3)
    expect(bid.num).toBe(4)
  })

  it('should correctly identify a legal no-aces bid', () => {
    let previousBid = new Bid(3, 4)
    let newBid1 = new Bid(4, 4) // freq greater
    let newBid2 = new Bid(3, 5) // num greater
    expect(newBid1.checkValid(previousBid)).toBeTruthy()
    expect(newBid2.checkValid(previousBid)).toBeTruthy()
  })

  it('should correctly identify an illegal no-aces bid', () => {
    let previousBid = new Bid(3, 4)
    let newBid1 = new Bid(2, 4) // freq smaller
    let newBid2 = new Bid(3, 3) // num smaller
    let newBid3 = new Bid(3, 4) // same bid
    expect(newBid1.checkValid(previousBid)).toBeFalsy()
    expect(newBid2.checkValid(previousBid)).toBeFalsy()
    expect(newBid3.checkValid(previousBid)).toBeFalsy()
  })

  it('should correctly identify a legal to-aces bid', () => {
    let previousBid = new Bid(4, 4)
    let newBid1 = new Bid(2, 1) // f1 >= f/2
    expect(newBid1.checkValid(previousBid)).toBeTruthy()
  })

  it('should correctly identify an illegal to-aces bid', () => {
    let previousBid = new Bid(4, 4)
    let newBid1 = new Bid(1, 1) // f1 < f/2
    expect(newBid1.checkValid(previousBid)).toBeFalsy()
  })

  it('should correctly identify a legal from-aces bid', () => {
    let previousBid = new Bid(3, 1)
    let newBid1 = new Bid(7, 2) // f > 2*f1
    expect(newBid1.checkValid(previousBid)).toBeTruthy()
  })

  it('should correctly identify an illegal from-aces bid', () => {
    let previousBid = new Bid(3, 1)
    let newBid1 = new Bid(6, 2) // f <= 2*f1
    expect(newBid1.checkValid(previousBid)).toBeFalsy()
  })

  it('should correctly identify a legal aces-to-aces bid', () => {
    let previousBid = new Bid(4, 1)
    let newBid1 = new Bid(5, 1) // freq greater
    expect(newBid1.checkValid(previousBid)).toBeTruthy()
  })

  it('should correctly identify an illegal aces-to-aces bid', () => {
    let previousBid = new Bid(4, 1)
    let newBid1 = new Bid(3, 1) // freq smaller
    let newBid2 = new Bid(4, 1) // freq equal
    expect(newBid1.checkValid(previousBid)).toBeFalsy()
    expect(newBid2.checkValid(previousBid)).toBeFalsy()
  })
})
