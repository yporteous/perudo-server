class Bid {
  constructor (freq = 0, num = 2) {
    this.freq = freq
    this.num = num
  }

  // checks if bid is valid given previous bid
  checkValid (previousBid) {
    if (this.num === 1 && previousBid.num === 1) { // both 1: new > old
      return this.freq > previousBid.freq
    } else if (this.num === 1) { // only new is 1: new >= old / 2
      return this.freq >= previousBid.freq / 2
    } else if (previousBid.num === 1) { // only old is 1: new > 2 * old (strictly)
      return this.freq > 2 * previousBid.freq
    } else { // no 1s: new > old or freq increase
      return (this.num > previousBid.num) || (this.freq > previousBid.freq)
    }
  }

  // gives minimum frequency for a given number for the next bid
  minFreq (num) {
    // if currently on ace
    if (this.num === 1) {
      // current value + 1 if also ace, otherwise 2 * currentVal + 1
      return num === 1
        ? this.freq + 1
        : 2 * this.freq + 1
    } else { // if not currently on 1:
      if (num === 1) { // if new value is 1 halve and round up
        return Math.ceil(this.freq / 2)
      } else if (num > this.num) { // if new value is greater, can stick with same freqency
        return this.freq
      } else { // otherwise, need to increase freqency by 1
        return this.freq + 1
      }
    }
  }
  
}

module.exports = {
  Bid
}
