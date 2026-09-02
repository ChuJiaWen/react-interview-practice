interface Task<T=any> {
    fn: () => Promise<T>;
    resolve: (value:T)=>void;
    reject: (reason?:any)=>void;
}

class CustomerScheduler {
    private maxCount: number;
    private processingCount: number = 0;
    private queue: Task[] = [];


    constructor(maxCount:number) {
        this.maxCount = maxCount;
    }

    public addTask<T>(fn: ()=> Promise<T>): Promise<T> {
        return new Promise((resolve, reject)=>{
            this.queue.push({fn, resolve, reject})
            this.__execute();
        })
    }

    private  __execute() {
        if (this.queue.length > 0 && this.processingCount < this.maxCount) {
            const task = this.queue.shift();
            this.processingCount++;
            task?.fn()
            .then(
                (result)=>{task.resolve(result)}, 
                (reason)=>{task.reject(reason)})
            .finally(()=>{
                this.processingCount--;
                this.__execute();
            })
            
        }
    }


}

function test(id:number ,timeout: number):()=>Promise<number> {
    return ()=>new Promise((resolve)=>{
        console.log(`${id} job started`)
        setTimeout(()=>{
            console.log(`${id} job done`);
            resolve(id)
        }, timeout)
    })
}

async function main() {

const customScheduler = new CustomerScheduler(2);
const taskList = [customScheduler.addTask(test(1, 1000)),
customScheduler.addTask(test(2, 200)),
customScheduler.addTask(test(3, 10)),]
const results = await Promise.all(taskList)

console.log('所有任务完成:', results);
}

main();
