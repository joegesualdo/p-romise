function Promise(fn) {
  var state = 'pending';
  var value;
  var deferred;

  function resolve(newValue) {
    value = newValue;
    state = 'resolved';

    if(deferred) {
      handle(deferred);
    }
  }

  function handle(onResolved) {
    if(state === 'pending') {
      deferred = onResolved;
      return;
    }

    onResolved(value);
  }

  this.then = function(onResolved) {
    handle(onResolved);
  };

  fn(resolve);
}

function getNumber(){
  return new Promise(function(resolve){
    var value = 42;
    setTimeout(function(){
      resolve(value);
    }, 5000)
  })
}

var WrapPromise = function(callback){
  return new Promise(function(resolve){
    callback(resolve)
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

var pRomise = {
  Wrap: WrapPromise
}

module.exports = pRomise;
