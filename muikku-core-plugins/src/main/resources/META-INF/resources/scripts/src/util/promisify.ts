type PromisifyOptions = { fn: string; context?: any };

export default function promisify(fn: any, opts: string | PromisifyOptions) {
  const actualOpts: PromisifyOptions =
    typeof opts === "string" ? { fn: opts } : opts;
  const realFn = actualOpts.fn ? fn[actualOpts.fn] : fn;
  return function (...args: any[]) {
    return new Promise(function (resolve, reject) {
      const realArgs = args.concat([
        (err: Error, result: any) => {
          if (err) {
            return reject(err);
          }

          return resolve(result);
        },
      ]);
      realFn.apply(actualOpts.context || fn, realArgs);
    });
  };
}

export function promisifyNewConstructor(
  Constructor: any,
  onload: string,
  onerror: string,
  setupAttributes?: { [attr: string]: any },
) {
  return function (...args: any[]) {
    return new Promise(function (resolve, reject) {
      const obj = new Constructor(...args);
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
