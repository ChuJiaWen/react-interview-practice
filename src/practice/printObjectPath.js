

const output = {
  "a.b.c.dd": "abcdd",
  "a.d.xx": "adxx",
  "a.e": "ae",
};
const entry = {
  a: {
    b: {
      c: { dd: "abcdd" },
    },
    d: { xx: "adxx" },
    e: "ae",
  },
};
function transition(inputObj, prefix = "", result = {}) {
  for (const [key, value] of Object.entries(inputObj)) {
    const path = prefix ? `${prefix}.${key}` : key;

    if (value !== null && typeof value === "object") {
      transition(value, path, result);
    } else {
      result[path] = value;
    }
  }

  return result;
}

console.log(transition(entry));