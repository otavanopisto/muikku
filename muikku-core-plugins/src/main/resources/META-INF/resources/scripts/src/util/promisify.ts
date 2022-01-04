type PromisifyOptions = { fn: string; context?: any };

export default function promisify(fn: any, opts: string | PromisifyOptions) {
  let actualOpts: PromisifyOptions =
    typeof opts === "string" ? { fn: opts } : opts;
  let realFn = actualOpts.fn ? fn[actualOpts.fn] : fn;
  return function (...args: any[]) {
    return new Promise(function (resolve, reject) {
      let realArgs = args.concat([
        (err: Error, result: any) => {
          if (err) {
            return reject(err);
          }

          return resolve(result);
        }
      ]);
      realFn.apply(actualOpts.context || fn, realArgs);
    });
  };
}

export function promisifyNewConstructor(
  Constructor: any,
  onload: string,
  onerror: string,
  setupAttributes?: { [attr: string]: any }
) {
  return function (...args: any[]) {
    return new Promise(function (resolve, reject) {
      let obj = new Constructor(...args);
      obj[onload] = () => {
        resolve(obj);
      };
      obj[onerror] = (err: any) => {
        reject(err);
      };

      if (setupAttributes) {
        Object.keys(setupAttributes).forEach((attr) => {
          obj[attr] = setupAttributes[attr];
        });
      }
    });
  };
}
