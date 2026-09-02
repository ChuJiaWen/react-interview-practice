interface Task2<T> {
  fn: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (reason: T) => void;
}

class CustomScheduler {
  private maxCount: number;
  private queue: Task2<any>[] = [];
  private runningCount: number = 0;

  constructor(maxCount: number) {
    this.maxCount = maxCount;
  }

  public add<T>(fn: () => Promise<T>) {
   return new Promise((resolve, reject)=> {
    this.queue.push({fn, resolve, reject});
    this.__execute();
   })
  }

  private __execute(): void {
    if (this.runningCount < this.maxCount && this.queue.length > 0) {
      const task = this.queue.shift();
      this.runningCount++;
      task?.fn()
      .then((value)=>task.resolve(value), (reason)=>task.reject(reason))
      .finally(()=>{
        this.runningCount--;
        this.__execute();
      }
    )
      
    }
  }
}

async function testFunction(id: number, timeout: number) {
  return new Promise((resolve, reject) => {
    console.log(`${id} job started`);
    setTimeout(() => {
      console.log(`${id} job finished`);
      if (id % 2 == 0) {
        reject(`${id} failed!!`);
      } else {
        resolve(id);
      }
    }, timeout);
  });
}
async function main() {
  const testScheduler = new CustomScheduler(2);
  const taskList = [
    testScheduler.add(() => testFunction(1, 1000)),
    testScheduler.add(() => testFunction(2, 300)),
    testScheduler.add(() => testFunction(3, 30)),
  ];
  const res = await Promise.allSettled(taskList);
  console.log(JSON.stringify(res));
}
main();
