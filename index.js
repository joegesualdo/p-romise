var WrapChainablePromise = require("./chainable-promise").WrapChainablePromise
var WrapPromise = require("./promise").WrapPromise

var pRomise = {
  Wrap: WrapPromise,
  WrapChainable: WrapChainablePromise
}

module.exports = pRomise;
