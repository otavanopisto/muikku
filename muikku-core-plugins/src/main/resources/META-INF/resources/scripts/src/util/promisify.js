export default function promisify(fn, opts){
  let actualOpts = typeof opts === 'string' ? {fn: opts} : opts;
  let realFn = actualOpts.fn ? fn[actualOpts.fn] : fn;
  return function(...args){
    return new Promise(function(resolve, reject){
      let realArgs = args.concat([(err, result)=>{
        if (err){
          return reject(err);
        }
        
        return resolve(result);
      }]);
      realFn.apply(actualOpts.context || fn, realArgs);
    });
  }
}