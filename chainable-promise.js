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
      handler.onReject(value);
    } else {
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

module.exports = {
  ChainablePromise: ChainablePromise,
  WrapChainablePromise: WrapChainablePromise
}
