type PromisifyOptions = {fn: string, context?: any};

export default function promisify(fn: any, opts: string | PromisifyOptions){
  let actualOpts:PromisifyOptions = typeof opts === 'string' ? {fn: opts} : opts;
  let realFn = actualOpts.fn ? fn[actualOpts.fn] : fn;
  return function(...args:any[]){
    return new Promise(function(resolve, reject){
      let realArgs = args.concat([(err: Error, result: any)=>{
        if (err){
          return reject(err);
        }
        
        return resolve(result);
      }]);
      realFn.apply(actualOpts.context || fn, realArgs);
    });
  }
}