function turnIntoIpAddress(str) {
  // 合法IP地址：由'.'分隔的4段数字，每段数字x长度为1-3位，且0 ≤ x ≤ 255
  if (str.length < 4) return [];

  const result = [];

  function backtrack(start, path) {
    if (start == str.length) {
      if (path.length == 4) {
        result.push(path.join('.'));
      }

      return;
    }

    // 剩余字符数量不足或过多，直接剪枝
    const remainChars = str.length - start;
    const remainParts = 4 - path.length;

    if (remainChars < remainParts || remainChars > remainChars * 3) return;

    for (let i = 1; i <= 3; i++) {
      // 如果超出字符段边界 或分隔段数超过4，剪枝
      if (start + i > str.length || path.length > 3) {
        break;
      }

      const val = str.slice(start, start + i);
      // 不允许前导0，例如‘01‘
      if ((val.length > 1 && val[0] == '0') || Number(val) > 255) break;
      backtrack(start + i, [...path, val]);
    }
  }
  backtrack(0, []);

  return result;
}

const result = turnIntoIpAddress('2550112');

console.log(result);
console.log(result.length);
