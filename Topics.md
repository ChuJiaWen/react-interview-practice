前端面试八股文，本质上考察的是你对**JavaScript语言、浏览器原理、框架设计、工程化**这四个维度的深度理解。

我按**面试优先级**给你整理了一份**精简高效的知识图谱**，并提供**具体的自测题**，帮你快速定位知识盲区。

---

### 第一梯队：JavaScript 核心（必考，占 40%）

面试官会刨根问底，直到你答不上来为止。

#### 1. 数据类型与判断（基础中的基础）
-   **知识点**：`基本类型（7种：string, number, boolean, undefined, null, symbol, bigint）` vs `引用类型（object, array, function）`。
-   **核心机制**：栈内存与堆内存的存储区别（值拷贝 vs 引用拷贝）。
-   **判断方法**：`typeof` 的缺陷（`typeof null === 'object'`）和 `Object.prototype.toString.call()` 的精准判断。
-   **面试题**：`const obj = { a: 1 }; const obj2 = obj; obj2.a = 2; console.log(obj.a);` 输出什么？为什么？

#### 2. 作用域、闭包与 this（核心难点）
-   **作用域**：全局、函数、块级作用域（`let/const`）。
-   **闭包**：**定义**（函数 + 词法环境的组合）；**用途**（柯里化、私有变量、防抖节流）；**隐患**（内存泄漏）。
-   **this 指向**：**默认绑定**（非严格模式指向 window）、**隐式绑定**（谁调用指向谁）、**显式绑定**（call/apply/bind）、**new 绑定**。
-   **箭头函数**：没有自己的 `this`，继承外层作用域；不能作为构造函数。
-   **面试题**：手写 `bind` 函数；说出下面代码的输出：

    ```javascript
    var name = 'window';
    const obj = {
      name: 'obj',
      say: function() { 
        setTimeout(() => console.log(this.name)); 
      }
    };
    obj.say(); // 输出什么？
    ```

#### 3. 原型与继承（JS 的根基）
-   **核心概念**：`prototype`（函数属性）、`__proto__`（实例属性）、`constructor`。
-   **原型链**：实例 → 原型 → 原型的原型 → ... → `null`。
-   **继承方式**：`ES6 Class extends` 本质是 **寄生组合继承**（组合继承 + `Object.create`）。
-   **面试题**：实现 `new` 操作符；让 `Child` 继承 `Parent` 的所有方法（静态+实例）。

#### 4. 异步编程与事件循环（Event Loop）—— **必考重灾区**
-   **宏任务**：`setTimeout`、`setInterval`、I/O、UI渲染。
-   **微任务**：`Promise.then`、`MutationObserver`、`async/await`（`await` 后面的代码）。
-   **执行顺序**：执行栈清空 → 微任务队列全部执行 → 取一个宏任务执行 → 微任务...
-   **面试题**：说出以下代码打印顺序：

    ```javascript
    console.log('1');
    setTimeout(() => console.log('2'), 0);
    Promise.resolve().then(() => console.log('3'));
    console.log('4');
    // 输出：1, 4, 3, 2
    ```

---

### 第二梯队：浏览器 & 网络（占 25%）

#### 1. 页面加载过程（从输入 URL 到页面展示）
-   **DNS 解析** → **TCP 三次握手** → **HTTP 请求** → **服务器响应**。
-   **渲染流程**：解析 HTML 构建 DOM 树 → 解析 CSS 构建 CSSOM 树 → 合并成渲染树（Render Tree）→ 布局（Layout/回流）→ 绘制（Paint/重绘）。
-   **关键点**：`<script>` 标签会阻塞 DOM 解析；`async` 和 `defer` 的区别。

#### 2. 浏览器缓存（强缓存 vs 协商缓存）
-   **强缓存**：`Cache-Control`（`max-age`）和 `Expires`。命中后不发请求，直接从缓存读。
-   **协商缓存**：`Last-Modified / If-Modified-Since` 和 `ETag / If-None-Match`。发请求验证，304 状态码。

#### 3. 跨域（CORS）
-   **同源策略**：协议、域名、端口三者一致。
-   **解决方案**：JSONP（仅支持 GET）、CORS（服务端设置 `Access-Control-Allow-Origin`）、Nginx 反向代理。

---

### 第三梯队：框架（React/Vue）核心原理（占 25%）

#### 1. 虚拟 DOM 与 Diff 算法
-   **为什么需要虚拟 DOM**？直接操作 DOM 慢，JS 操作对象快（跨平台）。
-   **Diff 策略**（React）：
    1.  Tree Diff：分层对比（跨层级移动极少发生，直接销毁重建）。
    2.  Component Diff：同类组件对比，不同类直接替换。
    3.  Element Diff：同级节点通过 **Key** 进行增删改（`map` 里用 `key` 的原因）。

#### 2. 组件通信方式
-   **父子通信**：`props` / `$emit` / `onChange`。
-   **跨层级通信**：`Context`（React） / `provide/inject`（Vue）。
-   **全局状态**：Redux（React）/ Vuex / Pinia（Vue）。

#### 3. 生命周期（React 为例）
-   **挂载**：`constructor` → `getDerivedStateFromProps` → `render` → `componentDidMount`。
-   **更新**：`shouldComponentUpdate`（性能优化点）→ `render` → `componentDidUpdate`。
-   **卸载**：`componentWillUnmount`（清除定时器、取消订阅）。

#### 4. Hooks 原理（React 特有）
-   **为什么 Hooks 不能在循环/条件语句里调用？** 因为 Hooks 依赖**调用顺序**来存储状态（链表结构）。
-   **useEffect 依赖项**：`[]`（仅挂载时执行）、`[a]`（a 变化时执行）、无依赖（每次渲染都执行）。
-   **useMemo 与 useCallback**：缓存计算结果与函数引用，用于性能优化。

---

### 第四梯队：工程化与性能优化（占 10%）

#### 1. Webpack / Vite 核心
-   **Webpack**：`Entry`（入口）→ `Loader`（转换文件，如 `babel-loader`）→ `Plugin`（做打包外的事，如 `HtmlWebpackPlugin`）→ `Output`（出口）。
-   **Vite**：利用浏览器原生 ES Module（ESM）支持，开发时**不打包**，按需编译，速度极快。

#### 2. 性能优化（高频考点）
-   **加载优化**：代码分割（`dynamic import`）、图片懒加载（`loading="lazy"`）、CDN 加速。
-   **渲染优化**：防抖（`debounce`）与节流（`throttle`）、虚拟列表（只渲染可视区域）、`requestAnimationFrame`。

---

### 第五梯队：手写代码题（面试必过独木桥）

面试官让你现场手撕的代码，90% 是以下几种：

| 题目 | 考察点 |
| :--- | :--- |
| **防抖（Debounce）** | 闭包、定时器 |
| **节流（Throttle）** | 时间戳或定时器实现 |
| **数组扁平化（Flatten）** | 递归、`reduce`、`Array.flat` |
| **深拷贝（Deep Clone）** | 递归 + 判断对象类型（注意循环引用） |
| **手写 Promise** | 状态管理、`then` 链式调用 |
| **手写 `new` 操作符** | 原型绑定 |
| **手写 `call/apply/bind`** | `this` 显式绑定 |

---

### 🎯 冲刺准备建议（按时间分配）

-   **如果还有 1 个月**：按照上面的梯队，每天攻克一个模块，**手写代码必须过一遍**。
-   **如果还有 1 周**：重点背 **Event Loop**、**this 指向**、**缓存机制** 和 **手写防抖节流**。
-   **如果明天就面试**：把 "面试题" 部分的代码在脑子里过一遍，重点看 **`this` 输出题** 和 **`Event Loop` 打印顺序题**。

如果你对某个具体的知识点（比如 `原型链` 或 `手写 Promise`）想了解得更深入，可以告诉我，我可以为你展开详细讲解。祝你面试顺利！😊