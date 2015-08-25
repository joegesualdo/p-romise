function Promise(fn) {
  // Promises have state. We need to know what state they are in before 
  //   proceeding, and make sure we move through the states correctly.
  // A promise can be pending waiting for a value, or resolved with a value.
  //   Once a promise resolves to a value, it will always remain at that value and never resolve again.
  // Having state makes sure that our promise is resolved before running the .then() method
  var state = 'pending';
  var value;
  var deferred;

  function resolveFn(newValue) {
    value = newValue;
    state = 'resolved';

    // The callee calls resolve() before the caller calls then(): In this case 
    //   we hold onto the resulting value. Once then() gets called, we are ready to hand back the value.
    if(deferred) {
      handle(deferred);
    }
  }

  function handle(onResolved) {
    // The caller has called then() before the callee calls resolve(), that 
    //   means there is no value ready to hand back. In this case the state 
    //   will be pending, and so we hold onto the caller’s callback to use 
    //   later. Later when resolve() gets called, we can then invoke the 
    //   callback and send the value on its way.
    if(state === 'pending') {
      deferred = onResolved;
      return;
    }

    onResolved(value);
  }

  this.then = function(onResolved) {
    handle(onResolved);
  };

  fn(resolveFn);
}

var WrapPromise = function(callback){
  return new Promise(function(resolveFn){
    callback(resolveFn)
  });
}

//
// WrapPromise(function(resolve){
//   setTimeout(function(){
//     resolve(['joe', 'mike'])
//   }, 5000)
// }).then(function(val){
//   console.log(val);
// });
//
//
// #######################
function ChainablePromise(fn) {
  var state = 'pending';
  var value;
  var deferred = null;

  function resolve(newValue) {
    value = newValue;
    state = 'resolved';

    if(deferred) {
      handle(deferred);
    }
  }

  // The handler object that we pass in the this function 
  //   carries around both an onResolved callback as well as 
  //   a reference to resolve(). There is more than one copy of resolve() 
  //   floating around, each promise gets their own copy of this function, 
  //   and a closure for it to run within. This is the bridge from the first 
  //   promise to the second.
  function handle(handler) {
    if(state === 'pending') {
      deferred = handler;
      return;
    }

    if(!handler.onResolved) {
      handler.resolve(value);
      return;
    }

    // concluding the previous promise 
    deferred.onResolved(value, deferred.resolve);
  }

  // then() always returns a promise 
  this.then = function(onResolved) {
    return new ChainablePromise(function(resolve) {
      handle({
        onResolved: onResolved,
        resolve: resolve
      });
    });
  };

  fn(resolve);
}

var WrapChainablePromise = function(callback){
  return new ChainablePromise(function(resolveFn){
    callback(resolveFn)
  });
}

WrapChainablePromise(function(resolve){
  setTimeout(function(){
    resolve(['joe', 'mike'])
  }, 1000)
}).then(function(val, resolve){
  console.log(val);
  setTimeout(function(){
    resolve(23)
  }, 5000)
}).then(function(val,resolve){
  console.log(val);
  setTimeout(function(){
    resolve("woowee")
  }, 9000)
}).then(function(val){
  console.log(val);
  setTimeout(function(){
    console.log('woo')
  }, 1000)
});

var pRomise = {
  Wrap: WrapPromise,
  WrapChainable: WrapChainablePromise
}

module.exports = pRomise;
