## P-Romise
> Turn function into a promise

## Install

[blog post](http://www.mattgreer.org/articles/promises-in-wicked-detail/)
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

## Inspiration
> Inspired by ["JavaScript Promises ... In Wicked Detail"](http://www.mattgreer.org/articles/promises-in-wicked-detail/) by Matt Greer
