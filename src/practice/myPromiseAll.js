function myPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError("参数必须是数组"));
    }

    if (promises.length === 0) {
      return resolve([]);
    }

    let successCount = 0;
    let res = new Array(promises.count);

    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((value) => {
          res[index] = value;
          successCount++;

          if (successCount == promise.length) {
            resolve(res);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
}
