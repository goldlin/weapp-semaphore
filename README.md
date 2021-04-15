# weapp-semaphore

A lite semaphore / message queue lib for wechat app
一个轻量的类信号量/消息队列扩展，适用于微信小程序

## Feature

* 提供一个灵活的方式，用于小程序各页面实例间做异步被动通信
* 生产者和消费者的操作完全解耦
* 利用小程序原生的 Behavior 方式实现，不影响应用架构

BTW, Semaphore 不是个准确的命名，但一直想不出正确对应的概念，望有以教我

## Install

1. 在 globalData 中初始化数据结构

```javascript
App({
  globalData: {
    semaphoreStore: new Map(),
  },
});
```

2. 两种在页面中引入的方式：

   * 如果是 Component 方式构造的页面，引入方式和普通 Behavior 一致

   ```javascript
   import semaphore from "../../behaviors/semaphore";

   Component({
     behaviors: [semaphore],
     ...
   });
   ```

   * 如果是 Page 方式构造的页面，需要用组件的方式在 json 配置文件中引入，在 wxml 文件任意位置插入，并在使用前通过 selectComponent 来获取实例，以调用 API

   .json:

   ```json
    "usingComponents": {
      "semaphore": "../../components/semaphore/semaphore"
    }
   ```

   .wxml

   ```xml
    <semaphore id="semaphore" />
   ```

   .js

   ```javascript
   Page({
     ...
     onLoad() {
       this.semaphore = this.selectComponent("#semaphore");
     },
     ...
   });
   ```

## API

* `setSem(obj: object)` 给其它页面实例设置信号
* `setSelfSem(obj: object)` 给当前页面设置信号
* `getSem(key: string)` 获取当前页面的 key 信号，key 为空时，返回所有信号
* `consumeSem(key: string)` 消耗当前页面的 key 信号，并返回其值
* `removeSem(key: string)` 移除其它页面实例的 key 信号

## 典型用法

### Case 1

* 页面 A 展示评论列表，点击打开页面 B 撰写评论
* 页面 B 无论是提交评论或是取消评论，都会关闭并返回页面 A
* Q: 如何在评论提交成功时，提醒页面 A 在 onShow 时更新评论列表？
* A: 在页面B成功提交评论时，使用`setSem` 设置`{ newComment: true }`的信号，在页面 A 的 onShow 中，使用`consumeSem('newComment')`获取该信号的值，为`true`时，更新评论列表

### Case 2

* 页面栈多个页面都需要根据登录状态的变化，及时更新数据
* 登录页可以在页面栈深处触发，打开登录页并登录成功/取消登录后，关闭登录页返回前页
* Q: 如何在登录状态发生变化时，通知页面栈中的所有页面？
* A: 登录页产生登录状态变化时，使用`setSem({ loginChanged: true})`设置信号，其它页面在`onShow`时`consumeSem('loginChanged')`，返回值为`true`时即可更新数据

### Case 3

* 当前页面含有多种操作，会触发不同的页面跳转
* Q: 当再次回到该页面时，如何知道之前在何处离开？
* A: 离开页面前，通过`setSelfSem({ leaveAt: 'xxx' })`记录离开时的现场，并在`onShow`时`consumeSem('leaveAt')`来消耗并获取现场
