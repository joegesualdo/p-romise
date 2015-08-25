function PRomise(fn) {
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
  return new PRomise(function(resolveFn){
    callback(resolveFn)
  });
}

module.exports = {
  PRomise: PRromise,
  WrapPromise: WrapPromise
}
