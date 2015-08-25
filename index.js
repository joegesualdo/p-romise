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

  function reject(reason) {
    state = 'rejected';
    value = reason;

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

    // You can choose to pass a callback to .then() function. But if you leave
    //   off the callback, the promise resolves to the same value as the previous promise
    if(!handler.onResolved) {
      handler.resolve(value);
      return;
    }

    // concluding the previous promise 
    if(typeof(value) == 'object' && Object.getPrototypeOf(value) == "Error" && value){
      console.log(handler)
      handler.onReject(value);
    } else {
      console.log("Success")
      handler.onResolved(value, handler.resolve, handler.reject);
    }
  }

  // then() always returns a promise 
  this.then = function(onResolved, onReject) {
    return new ChainablePromise(function(resolve, reject) {
      handle({
        onResolved: onResolved,
        onReject: onReject,
        resolve: resolve,
        reject: reject 
      });
    });
  };

  fn(resolve, reject);
}

var WrapChainablePromise = function(callback){
  return new ChainablePromise(function(resolveFn, rejectFn){
    callback(resolveFn, rejectFn)
  });
}

WrapChainablePromise(function(resolve, reject){
  setTimeout(function(){
    // resolve(['joe', 'mike'])
    resolve(44)
  }, 1000)
}).then(function(val, resolve, reject){
  var err =new Error("Error 1")
  setTimeout(function(){
    reject(err)
  }, 5000)
}, function(err){
  console.log("errrrooorrr")
}).then(function(val, resolve, reject){
  var err = new Error("Error 2")
  setTimeout(function(){
    reject(err)
  }, 9000)
}, function(err){
  console.log("errrrooorrr")
})
// }).then(function(val, reject){
//   setTimeout(function(){
//     console.log('woo')
//   }, 1000)
// });

var pRomise = {
  Wrap: WrapPromise,
  WrapChainable: WrapChainablePromise
}

module.exports = pRomise;
