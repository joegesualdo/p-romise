## P-Romise
> Turn function into a promise

## Install

```
$ npm install --save p-romise
```

## Example Usage 
```javascript
var pRomise = require("p-romise");
var WrapPromise = pRomise.Wrap;

WrapPromise(function(resolve){
  setTimeout(function(){
    resolve("Hello World")
  }, 5000)
}).then(function(result){
  console.log(result);
});
```

## API

## .Wrap(myFunction(resolve))
> The resulting promise is NOT chainable

```javascript
var pRomise = require("p-romise");
var WrapPromise = pRomise.Wrap;

WrapPromise(function(resolve){
  setTimeout(function(){
    resolve("Hello World")
  }, 5000)
}).then(function(result){
  console.log(result);
});
```

## .WrapChainable(myFunction(resolve, reject))
> The resulting promise is chainable

##.then(myfunction(val, resolve, reject))

```javascript
var pRomise = require("p-romise");
var WrapChainablePromise = pRomise.WrapChainable;

WrapChainablePromise(function(resolve, reject){
  setTimeout(function(){
    resolve(32)
  }, 1000)
})
.then(function(val, resolve, reject){
  var err =new Error("Error 1")
  setTimeout(function(){
    resolve("World")
  }, 5000)
}, function(err){
  console.log("errrrooorrr")
})
.then(function(val, resolve, reject){
  var err = new Error("Error 2")
  setTimeout(function(){
    reject(err)
  }, 9000)
}, function(err){
  console.log(err)
})
.then(function(val, reject){
 setTimeout(function(){
   console.log('woo')
 }, 1000)
});
```

## Inspiration
> Inspired by ["JavaScript Promises ... In Wicked Detail"](http://www.mattgreer.org/articles/promises-in-wicked-detail/) by Matt Greer
