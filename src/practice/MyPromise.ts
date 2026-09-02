enum State  {
  PENDING= 'pending',
  RESOLVED= 'resolved',
  REJECTED= 'rejected'
}

class CustomPromise<T> {
  state:State = State.PENDING
  value?: T
  reason?: any

  private onFulfilledCbs:Array<()=>void> = [];
  private onRejectedCbs:Array<()=>void> = [];

  constructor(executor:(resolved:(value:T)=>void, rejected:(reason:any)=>void) => void){
    const resolved = (value:T) => {
      if(this.state == State.PENDING){
        this.state = State.RESOLVED;
        this.value = value;
        this.onFulfilledCbs.forEach((fn)=>fn());
      }
    }

    const rejected = (reason:any) => {
      if(this.state == State.PENDING){
        this.state = State.REJECTED;
        this.reason = reason;
        this.onRejectedCbs.forEach((fn)=>fn());
      }
    }

    try{ 
      executor(resolved, rejected);
    } catch (e){
      rejected(e);
    }
  }

  then(onFulfilled?:(value:T)=>void, onRejected?:(reason:any)=>void) {
    if (this.state==State.RESOLVED){
      onFulfilled?.(this.value!)
    } else if (this.state==State.REJECTED) {
      onRejected?.(this.reason!)
    } else if (this.state==State.PENDING) {
      this.onFulfilledCbs.push(()=>onFulfilled?.(this.value!));
      this.onRejectedCbs.push(()=>onRejected?.(this.value!));
    }
  }
}

const mpTest = new CustomPromise((resolve)=>{
  setTimeout(()=>{
      resolve('this is the return value?');
  }, 500)
})
  
mpTest.then((val)=> console.log(`${val}Truly ended`))
