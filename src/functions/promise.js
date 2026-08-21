const STATUS = {
    PENDING:'PENDING',
    RESOLVED: 'RESOLVES',
    REJECTED: 'REJECTED'
}

function MyPromise(value) {
    const that = this;
    this.state = STATUS.PENDING;

    this.value = null;

    that.resolvedCbs = [];
    that.rejectedCbs = [];

    function resolve() {
        if (that.state == STATUS.PENDING){
            that.state = STATUS.RESOLVED;
            that.value = value;
            that.resolvedCbs.map(cb=>cb(value));
        }
    }
    function reject() {
        if (that.state == STATUS.PENDING){
            that.state = STATUS.REJECTED;
            that.value = value;
            that.rejectedCbs.map(cb=>cb(value));
        }
    }

    try {
        fn(resolve,reject);
    } catch (error) {
        reject(e)
    }

    function then(onFulfilled,onRejected) {
        const that = this;

        onFulfilled = typeof onFulfilled =='function'? onFulfilled : value=>value;
        onRejected= typeof onRejected =='function'? onRejected : e=>{throw e};

        if (that.state == STATUS.PENDING) {
            that.resolvedCbs.push(onFulfilled);
            that.rejectedCbs.push(onRejected);
        } else if (this.state == STATUS.RESOLVED) {
            onFulfilled(that.value)
        } else if (this.state == STATUS.REJECTED){
            onRejected(that.value)
        }
    }
}

