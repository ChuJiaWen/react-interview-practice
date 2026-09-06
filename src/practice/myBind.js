Function.prototype.myBind = function(context, ...args) {
    const fn = this;
    return function(...newArgs) {
        return fn.apply(context, [...args, ...newArgs]); // 合并参数
    }
}

// 测试
function test(a, b) {
    console.log(this.name, a, b);
}

const obj = {name: 'myBind'};
const bound = test.myBind(obj, 1);
bound(2);