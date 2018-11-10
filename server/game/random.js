// this file is broken out to make it easy to use different randomisers

function dieRoll () {
  return Math.floor(Math.random() * 6) + 1
}

module.exports = {
  dieRoll
}
