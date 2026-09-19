/**
 * 手写 Promise.all
 * @param {Array} promises - 可迭代对象（通常为数组）
 * @returns {Promise} - 返回一个新的 Promise
 */
function myPromiseAll(promises) {
  // 1. 返回一个全新的 Promise 实例
  return new Promise((resolve, reject) => {
    // 2. 参数校验：如果不是数组，直接 reject
    if (!Array.isArray(promises)) {
      return reject(new TypeError("参数必须是数组"));
    }

    // 3. 边界情况：空数组直接 resolve 空数组
    if (promises.length === 0) {
      return resolve([]);
    }

    // 4. 初始化结果数组和计数器
    const results = [];
    let completedCount = 0;
    const total = promises.length;

    // 5. 遍历每个 promise（或普通值）
    promises.forEach((item, index) => {
      // 6. 关键点：使用 Promise.resolve() 包装，确保能处理普通值
      Promise.resolve(item)
        .then((value) => {
          // 7. 成功时：存储结果，并增加计数器
          results[index] = value;
          completedCount++;

          // 8. 所有 promise 都完成时，resolve 结果数组
          if (completedCount === total) {
            resolve(results);
          }
        })
        .catch((error) => {
          // 9. 任何一个 promise 失败，立即 reject
          reject(error);
        });
    });
  });
}

// ============ 测试1：所有 Promise 成功 ============
console.log("========== 测试1：所有 Promise 成功 ==========");

const p1 = Promise.resolve(1);
const p2 = Promise.resolve(2);
const p3 = Promise.resolve(3);

myPromiseAll([p1, p2, p3])
  .then((results) => {
    console.log("结果:", results); // [1, 2, 3]
  })
  .catch((error) => {
    console.error("错误:", error);
  });

// ============ 测试2：混合普通值和 Promise ============
console.log("\n========== 测试2：混合普通值和 Promise ==========");

const p4 = Promise.resolve("hello");
const p5 = 42;
const p6 = Promise.resolve("world");

myPromiseAll([p4, p5, p6]).then((results) => {
  console.log("结果:", results); // ['hello', 42, 'world']
});

// ============ 测试3：包含异步 Promise ============
console.log("\n========== 测试3：包含异步 Promise ==========");

const p7 = new Promise((resolve) => setTimeout(() => resolve("慢"), 1000));
const p8 = new Promise((resolve) => setTimeout(() => resolve("快"), 500));
const p9 = Promise.resolve("立刻");

myPromiseAll([p7, p8, p9]).then((results) => {
  console.log("异步结果:", results); // ['慢', '快', '立刻']
  // 注意：顺序是 [p7, p8, p9]，即使 p8 比 p7 先完成
});

// ============ 测试4：某个 Promise 失败 ============
console.log("\n========== 测试4：某个 Promise 失败 ==========");

const p10 = Promise.resolve(1);
const p11 = Promise.reject("出错了！");
const p12 = Promise.resolve(3);

myPromiseAll([p10, p11, p12])
  .then((results) => {
    console.log("结果:", results);
  })
  .catch((error) => {
    console.log("捕获错误:", error); // '出错了！'
  });

// ============ 测试5：空数组 ============
console.log("\n========== 测试5：空数组 ==========");

myPromiseAll([]).then((results) => {
  console.log("空数组结果:", results); // []
});

// ============ 测试6：非数组参数 ============
console.log("\n========== 测试6：非数组参数 ==========");

myPromiseAll("不是数组")
  .then((results) => {
    console.log("结果:", results);
  })
  .catch((error) => {
    console.log("类型错误:", error.message); // '参数必须是数组'
  });
