type PromiseState = "pending" | "fulfilled" | "rejected";

class MyPromise<T> {
  private state: PromiseState = "pending";
  private value?: T;
  private reason?: unknown;

  private onFulfilledCallbacks: Array<() => void> = [];
  private onRejectedCallbacks: Array<() => void> = [];

  constructor(executor: (resolve: (value: T) => void, reject: (reason?: unknown) => void) => void) {
    const resolve = (value: T) => {
      if (this.state === "pending") {
        this.state = "fulfilled";
        this.value = value;
        this.onFulfilledCallbacks.forEach((cb) => cb());
      }
    };

    const reject = (reason?: unknown) => {
      if (this.state === "pending") {
        this.state = "rejected";
        this.reason = reason;
        this.onRejectedCallbacks.forEach((cb) => cb());
      }
    };

    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  then(onFulfilled?: (value: T) => void, onRejected?: (reason?: unknown) => void): void {
    if (this.state === "fulfilled") {
      onFulfilled?.(this.value!);
    } else if (this.state === "rejected") {
      onRejected?.(this.reason);
    } else {
      this.onFulfilledCallbacks.push(() => onFulfilled?.(this.value!));
      this.onRejectedCallbacks.push(() => onRejected?.(this.reason));
    }
  }
}

// 使用
const mp = new MyPromise<string>((res) => {
  setTimeout(() => res("ts promise done"), 800);
});

mp.then((v) => console.log(v));
