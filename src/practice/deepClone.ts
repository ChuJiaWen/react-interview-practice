/**
 * 简易深拷贝 TS 版本，处理大部分常见边界
 * 支持：对象、数组、Date、RegExp、Map、Set、基础类型
 * 不支持：循环引用、函数、Symbol、BigInt（如需可额外扩展）
 */
function deepClone<T>(source: T): T {
  // 1. 基础类型 / null 直接返回
  if (source === null || typeof source !== "object") {
    return source;
  }

  // 2. Date：新建Date实例
  if (source instanceof Date) {
    return new Date(source.getTime()) as unknown as T;
  }

  // 3. RegExp：复制正则的source、flags
  if (source instanceof RegExp) {
    return new RegExp(source.source, source.flags) as unknown as T;
  }

  // 4. Set
  if (source instanceof Set) {
    const newSet = new Set();
    source.forEach((item) => {
      newSet.add(deepClone(item));
    });
    return newSet as unknown as T;
  }

  // 5. Map
  if (source instanceof Map) {
    const newMap = new Map();
    source.forEach((value, key) => {
      newMap.set(deepClone(key), deepClone(value));
    });
    return newMap as unknown as T;
  }

  // 6. 数组
  if (Array.isArray(source)) {
    return source.map((item) => deepClone(item)) as unknown as T;
  }

  // 7. 普通对象
  const target = {} as T;
  Reflect.ownKeys(source).forEach((key) => {
    // 只拷贝可枚举属性，如需拷贝不可枚举可以去掉判断
    if (Object.prototype.propertyIsEnumerable.call(source, key)) {
      (target as any)[key] = deepClone((source as any)[key]);
    }
  });

  return target;
}
