## Building this source

For the building process only nodejs (6+) is required, once it's installed run

`npm install`

Note that the result will be different depending on the NODE_ENV environment variable, when it's not set it defaults
to development, but once it's set to the string "production" it will produce the production builds which include minification
and compression.

It'll create a dist folder on the parent of itself.

## Developing

When you develop it can be painfully slow to generate bundles, specially if they are triggered every time a file is changed you should
build it from command line, use node directly for this you can do

`node build.ts`

To build all versions including the vendor file

`node build.ts communicator.ts`

To build an specific entry file from the entry files, this is faster; and you'll use it a lot when modifying.

`NODE_ENV=production node build.ts`

To build the production files (takes longer than anything)

## Practical differences between development and prodction

Development build include the following (not present in production):
- Redux developer tools integration [For chrome](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd) [For firefox](https://addons.mozilla.org/en-US/firefox/addon/remotedev/)
- Redux Event Logging, (verbose, it's included in the developer tools integration but this is nice when one feels too lazy to fiddle with the tools and just needs to check a couple of variables).
- PropType checking, will throw an error if a component property types are not valid for that component.
- Source Maps (you only see the original sources and not the compiled result in chrome/firefox javascript debugger)
- React Developer tools integration [For chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) [For firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

## Other practicalities and rules

 - Avoid `$.proxy` and even `.bind` use [arrow functions](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions) instead
 - Avoid using indirect calls to functions like `.call` or  `.apply`, use the [spread operator](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Spread_operator) instead
 - Avoid prototypes completely and use [classes](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes)
 - Avoid complex string concatenations use [template literals](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals)
 - `var` is fobidden, please use `let` or `const`
 
## Callbacks and Promises

Right now the mApi works with callbacks, and there's no much to do about it, we don't have a lot of async non-lifecycle code; hence
there are no wrappers over generators, promises and so on; you however have access to a full fledged ES6 environment and hence you can
use async await as well as generators; but for this async functions must be rewritten to return promises. Promises are polyfilled
already if not avaliable so try to use them whenever possible.

Then code that was previously written as:

```javascript
doSomething(){
  getMyData(function(err, data){
    if (err){
  	  displayError(err)
  	  return;
    }
  
    doSomethingWithData(data)
  })
}
```

Will be changed to:

```
async doSomething(){
  try {
    doSomethingWithData(await getMyData());
  } catch(err) {
    displayError(err)
  }
}
```