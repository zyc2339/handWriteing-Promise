//类的构建方法
class Promise {
    //构造方法
    constructor(executor){
//添加属性
this.PromiseState = `pending`;
this.PromiseResult= null;
//声明属性
this.callbacks = []
//保存实例对象 this 的值
// const self = this;
    //resolve 函数
const resolve = (data) => {
    //判断状态
    if (this.PromiseState!=="pending")return;
    //1.修改对象状态（promiseState）
   this.PromiseState = `fulfilled`; //resolved
    //2.设置对象结果值（promiseResult）
    this.PromiseResult = data;
    //调用成功的回调函数
    setTimeout(()=>{
        this.callbacks.forEach(item => {
            item.onResolved(data)
    });
   })
}
   //reject 函数
const reject = (data)=> {
    if (this.PromiseState!=="pending")return;

//1.修改对象状态（promiseState）
this.PromiseState = `rejected`; //resolved
//2.设置对象结果值（promiseResult）
this.PromiseResult = data;
setTimeout(()=>{
    this.callbacks.forEach(item => {
        item.onRejected(data)
});
})
}

        try {
        //同步调用【执行器函数】
        executor(resolve,reject);

        }catch (e) {
            reject(e)
        }
    }

    //then 方法封装
    then(onResolved, onRejected){
        const self = this;
        if (typeof onRejected !== 'function'){
            onRejected = reason => {
                throw "reason"
            }
        }
        
        if(typeof onResolved !== `function`){
            onResolved = value => value;
        }
            return new Promise((resolve,reject)=>{
        
                //封装函数
                function callback(type){
                    try{
                        let result =  type(self.PromiseResult);
                    //判断
                    if (result instanceof Promise){
                        result.then(v=>{
                            resolve(v)
                            console.log(v)
                        },r=>{
                         reject(r);
                     })
        
                    }else{
                        resolve(result);
                    }
                 }catch(e){
                     reject(e)
                 }
        
                }
                    //调用回调函数  PromiseState
                    // console.log(this) 还是指向then
                    if(this.PromiseState ==="fulfilled"){
                       setTimeout(()=>{
                           callback(onResolved)
                       });
                    }
                    if(this.PromiseState==="rejected"){
                        setTimeout(()=>{
                            callback(onRejected)
                        });
                    }
                    //判断 pending状态
                    if(this.PromiseState === `pending`){
                        //保存回调函数
                        this.callbacks.push({
                            onResolved: function (){callback(onResolved)},
        
                            onRejected:function (){callback(onRejected)}})
        }
        })
        }

    //catch 
    catch(onRejected){
        return this.then(undefined, onRejected);
    }
    //resolve
    static resolve(value){
        //返回promise对象
        return new Promise ((resolve,reject)=>{
                if (value instanceof Promise){
                    value.then(v=>{
                        resolve(v);
                    }, r=>{
                        reject(r);
                    })
                }else{
                    //状态设置为成功
                    resolve(value);
                }
            })
        
        }
        // 添加 reject方法
        static reject(reason){
            //返回promise对象
            return new Promise ((resolve,reject)=>{
                    reject(reason)
                })
            
            }
        
        // 添加 all方法
        static all(promises){
        //返回结果为promise对象
           return new Promise((resolve,reject)=>{
               //声明变量
               let count = 0
               let arr = [];
               //遍历
               for(let i=0; i<promises.length; i++){
                   ////////////////////////////////
                   promises[i].then(v=>{
                       //得知对象的状态是成功
                       //每个promise对象 都成功
                       count++
                       //将当前promise对象成功的结果 存入到数组中
                       arr[i] = v;
                       //判断
                       if(count === promises.length){
                        //修改状态
                        resolve(arr);
        
                       }
                   }, r=>{
                       reject(r);
                   })
               }
           })
        
        }
        
        // 添加 race 方法
        static race(promises){
            //返回结果为promise对象
               return new Promise((resolve,reject)=>{
                   for(let i=0; i<promises.length; i++){
                       promises[i].then(v=>{
                            resolve(v);
                           }
                       ), r=>{
                           reject(r);
                       }}
                   }
               )
            }
}



//添加  then方法
// 添加 catch方法
// Promise.prototype.catch = function(onRejected){
//     return this.then(undefined, onRejected);
// }
// 添加 resolve方法
// Promise.resolve = function(value){
// //返回promise对象
// return new Promise ((resolve,reject)=>{
//         if (value instanceof Promise){
//             value.then(v=>{
//                 resolve(v);
//             }, r=>{
//                 reject(r);
//             })
//         }else{
//             //状态设置为成功
//             resolve(value);
//         }
//     })

// }
// // 添加 reject方法
// Promise.reject = function(reason){
//     //返回promise对象
//     return new Promise ((resolve,reject)=>{
//             reject(reason)
//         })
    
//     }

// // 添加 all方法
// Promise.all = function (promises){
// //返回结果为promise对象
//    return new Promise((resolve,reject)=>{
//        //声明变量
//        let count = 0
//        let arr = [];
//        //遍历
//        for(let i=0; i<promises.length; i++){
//            ////////////////////////////////
//            promises[i].then(v=>{
//                //得知对象的状态是成功
//                //每个promise对象 都成功
//                count++
//                //将当前promise对象成功的结果 存入到数组中
//                arr[i] = v;
//                //判断
//                if(count === promises.length){
//                 //修改状态
//                 resolve(arr);

//                }
//            }, r=>{
//                reject(r);
//            })
//        }
//    })

// }

// // 添加 race 方法
// Promise.race = function (promises){
//     //返回结果为promise对象
//        return new Promise((resolve,reject)=>{
//            for(let i=0; i<promises.length; i++){
//                promises[i].then(v=>{
//                     resolve(v);
//                    }
//                ), r=>{
//                    reject(r);
//                }}
//            }
//        )
//     }
    
    