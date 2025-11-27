---
title: 'React源码 - 大名鼎鼎的Fiber'
description: '本文以源码解读 React Fiber：我们就将通过源码来深入的了解Fiber架构。能更清楚的知道 fiber 对象到底是什么、起到了什么作用以及为什么重要。'
pubDate: 'Sep 15 2025'
heroImage: '../../assets/blog-img-3.jpg'
tag: 'React'
---

# Fiber源码解析

接触过React的同学都或多或少的听说过Fiber这个名字。那么这篇我们就将通过源码来深入的了解Fiber架构。能更清楚的知道 fiber 对象到底是什么、起到了什么作用以及为什么重要。

在正是开始讲解 fiber 之前，我们需要对React Element和虚拟DOM有个基本的了解，因为它和fiber有着密切的联系。

## 虚拟DOM

#### 什么是虚拟DOM？

虚拟DOM 英文为 Virtual DOM，也可以简称为V-DOM。 它是一个**编程概念**，而不是一个具体的实体。它是真实DOM在内存中的一种轻量级表示。也可以理解为使用一个JS对象来描述DOM树的特征。

下面是一段简单的React代码：

```jsx
<div className={'container'}>
    Hello， World!
</div>
```

经过Babel编译后会变成下面代码：

```js
// 旧版本Bable
React.createElement('h1', { className: 'container' }, 'Hello， World!');

// 新版本Bable
import { jsx as _jsx } from "react/jsx-runtime";
/*#__PURE__*/_jsx("div", {
  className: 'container',
  children: "Hello\uFF0C World!"
});
```

上面这段代码最终会返回一个JavaScript对象，用来描述DOM树的结构，这就可以被理解为虚拟DOM：

```js
{
  type: 'div',
  props: {
    className: 'container',
  },
  children: ['Hello, World!'],
}
```

很多同学可能会疑问了，上面这个对象不是 React Element 么，为什么说它是虚拟DOM呢？ 没错，但他也符合虚拟DOM的特征，所以虚拟DOM并不是一个实体，而是一个概念。任何符合该特征的对象都可以理解为虚拟DOM

而在React16 Fiber架构问世以后，我更愿意将Fiber理解为虚拟DOM。

#### 为什么需要虚拟DOM？

JavaScript暴露了许多可以直接操作DOM的api，但调用这些api的时候，浏览器会频繁渲染，包括计算、布局、绘制、格栅化、合成等，这些操作都会消耗浏览器的性能。</br>
如果先操作虚拟DOM，最后在统一操作真实DOM则会一定程度上的减少浏览器的性能消耗。

## React Fiber

#### Fiber是什么？

React 团队花费了两年的时间重构了fiber架构，用来解决React的性能问题。每个Fiber节点都是一个工作单元，对应一个React Element。

旧的 Stack Reconciler 是同步的，一旦开始渲染就无法中断，而Fiber诞生实现了：

*   可中断渲染
*   优先级调度
*   并发特性

简单来说就是，Reconciler 的过程中会将每一个 fiber 作为一个工作单元来处理。在 **Fiber Reconciler** 的工作期间，React 会主动判断当前帧是否还有剩余时间，如果没有时间了，它会主动暂停工作，将控制权交还给浏览器，让浏览器去执行更高级别的任务（如处理用户输入、绘制动画等），从而避免造成卡顿。当浏览器处理完紧急任务，主线程再次空闲时（例如在下一帧的开始），React 会通过**调度器（Scheduler）**  请求再次执行工作，并且会从上次中断的那个 Fiber 节点继续往下处理。

我们知道 React Element 是一个普通的JavaScript对象，从视图层上静态**描述**UI应该是什么样子。

而 **Fiber** 则是在 **React Element** 的基础上包含丰富内部状态和指针的数据结构，代表要执行的工作。简单的说，我们代码会被编译为 React Element，然后通过协调和 Diff 算法将 React element 生成 Fiber 树。最后，根据Fiber上的不同flags标记对DOM进行操作并渲染到页面上。所以，我上面说更愿意将 Fiber 理解为 虚拟DOM。

既然我们知道了 React Element, Fiber 以及真实DOM之前的关系。 那么，下面我们来看一下 Fiber 是长什么样子的。

下面直接附上 Fiber 构造函数的源码：

```js
// facebook/react/blob/main/packages/react-reconciler/src/ReactFiber.js#L136-L209
function FiberNode(
  this: $FlowFixMe,
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
) {
  // Instance
  this.tag = tag; // fiber 类型
  this.key = key; // 用于调和子节点
  this.elementType = null; 
  this.type = null; // 元素类型
  this.stateNode = null; // 对应的真实 DOM 元素

  // Fiber 链表结构 
  this.return = null; // 指向父节点（父节点）
  this.child = null;  // 指向第一个子节点（子节点）
  this.sibling = null; // 指向下一个兄弟节点（兄弟节点）
  this.index = 0;     // 在父节点的子节点列表中的索引位置

  this.ref = null;
  this.refCleanup = null;

 // Props 和 State
  this.pendingProps = pendingProps; // 新一轮渲染中传入的新 props
  this.memoizedProps = null;        // 上一次渲染时使用的 props
  this.updateQueue = null;          // 状态更新队列，存储 setState 产生的更新对象
  this.memoizedState = null;        // 上一次渲染时使用的 state
  this.dependencies = null;         // 当前 Fiber 所依赖的上下文（Context）、事件订阅等
  
  this.mode = mode;

  // Effects
  this.flags = NoFlags;         // 当前 Fiber 需要执行的副作用（如 Placement, Update, Deletion）
  this.subtreeFlags = NoFlags;  // 子节点树中需要执行的副作用（用于性能优化）
  this.deletions = null;        // 待删除的子 Fiber 节点数组（用于记录需要被删除的节点）

  // Lane 模型（优先级调度） 
  // React 17+ 使用的优先级调度模型，用于并发渲染
  this.lanes = NoLanes;        // 当前 Fiber 上待处理的更新优先级车道
  this.childLanes = NoLanes;   // 子节点树中待处理的更新优先级车道

  // 双缓存技术
  this.alternate = null; // 指向 current 树或 workInProgress 树中的对应 Fiber 节点
                         // 用于实现双缓存机制，在更新时交替使用两棵树
}
```

通过上面源码可以清楚的看到Fiber都含有哪些属性，并且通过我的注释也可以对每个属性有一个基本的概念。这些属性可以分为几类，比如有的是**构建链表结构**的，有的是负责**处理状态和props**的，还有的是负责**标记副作用**的。

首先我们先来了解一下Fiber的链表结构，也可以叫做 **Fiber tree**。

#### Fiber树

通过 FiberNode 构造函数我们了解到，fiber 通过 `return`，`child` 以及 `sibling` 属性来构建链表结构，那么我们来看一下下面这段代码生成的Fiber Tree 是什么样子的。

```jsx
function MyComponent() {
    return (
        <div>
          hello,world
          <p>paragraph</p>
          <button>click</button>
        </div>
    )
}
```

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/548eb0c8d559490d9428a004852a0f9f~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgc2ppbg==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzY1MzAxNjg1MDgwMDY5MiJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1763393511&x-orig-sign=QaiWPhiAuE5zDIiLXm%2BzUIFIq%2Fs%3D)

return 表示指向父节点， child 表示指向第一个子节点， sibling 则指向兄弟节点。 所以我们就构建出了如上图所示的 Fiber Tree。

我们了解了Fiber Tree 的结构，那么接下来就来分析一下 Fiber Tree是如何构建的。

#### Fiber Tree 是如何构建的？

Fiber Tree 的构建可以分为初始化和更新。我们先从初始化开始介绍。

React 开发者对下面这段代码肯定再熟悉不过了， `createRoot()` 就是 **concurrent** 模式下创建 React 应用程序的入口函数。

```jsx
import { createRoot } from 'react-dom/client';  
const domNode = document.getElementById('root');  
const root = createRoot(domNode);
root.render(<App/>)
```

既然想知道 React Fiber 是如何初始化的，那么我们通过源码沿着这个函数的调用栈，来看一下在调用 `createRoot()` 的时候，React 都做了哪些事情。

> 为了方便大家理解，我将只保留每个方法中的关键代码。如果想查看完整代码，大家可以根据代码块中的首行注释去github中查看。

下面是 `createRoot()` 的关键源码：

```js
// facebook/react/blob/main/packages/react-dom/src/client/ReactDOMRoot.js
export function createRoot(container，options): RootType {
 if (!isValidContainer(container)) {
   throw new Error('Target container is not a DOM element.');
 }

 const root = createContainer(container, ConcurrentRoot);
 markContainerAsRoot(root.current, container);

 const rootContainerElement: Document | Element | DocumentFragment =
   !disableCommentsAsDOMContainers && container.nodeType === COMMENT_NODE
     ? (container.parentNode: any)
     : container;
 listenToAllSupportedEvents(rootContainerElement);

 // $FlowFixMe[invalid-constructor] Flow no longer supports calling new on functions
 return new ReactDOMRoot(root);
}
```

从上面源码中可以看出，在 `createRoot()` 函数中， 调用了 `createContainer()` 方法。下面，我们通过源码来看一下 `createContainer()` 究竟是做什么的。

```js
// /facebook/react/blob/main/packages/react-reconciler/src/ReactFiberReconciler.js
export function createContainer(
  containerInfo: Container,
  tag: RootTag,
): OpaqueRoot {
  const hydrate = false;
  const initialChildren = null;
  const root = createFiberRoot(containerInfo, tag， hydrate);
  registerDefaultIndicator(onDefaultTransitionIndicator);
  return root;
}
```

`createContainer()` 方法很简单，就是直接调用了 `createFiberRoot()` 函数：

```js
//facebook/react/blob/main/packages/react-reconciler/src/ReactFiberRoot.js
export function createFiberRoot(
  containerInfo: Container,
  tag: RootTag
  hydrate
): FiberRoot {
  // $FlowFixMe[invalid-constructor] Flow no longer supports calling new on functions
  const root: FiberRoot = (new FiberRootNode(containerInfo, tag, hydrate): any);

  // Cyclic construction. This cheats the type system right now because
  // stateNode is any.
  const uninitializedFiber = createHostRootFiber(tag, isStrictMode);
  root.current = uninitializedFiber;
  uninitializedFiber.stateNode = root;
  
  const initialState: RootState = {
    element: initialChildren,
    isDehydrated: hydrate,
    cache: initialCache,
  };
  uninitializedFiber.memoizedState = initialState;

  initializeUpdateQueue(uninitializedFiber);

  return root;
}
```

从上面代码可以看出，通过调用 fiberRootNode() 构造函数创建了一个 fiberRoot 对象； 然后通过`createHostRootFiber` 方法创建了一个 RootFiber 对象。最后通过 current 和 stateNode 指针将两者关联起来。

`createRoot` 最终会生成如下的 fiber 结构：

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/5f1031e00d564cfc9978d7ed69ebfd40~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgc2ppbg==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzY1MzAxNjg1MDgwMDY5MiJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1763393511&x-orig-sign=2sfQaujqFSEQvz6MnX0jzFJPFN8%3D)

这是一个 双向环形链接 结构，`Root` 为根对象， `RootElement` 则为 **Current Tree** 的根节点。他们之间通过 `current` 和 `stateNode` 指针关联。

至于什么是 **Current Tree**， 这里就涉及到了 React 架构中的另一个概念 - **双缓冲树**。

#### 什么是双缓冲树？

React 内部其实维护着两颗Fiber Tree， 分别是 **Current Tree** 和 **Work In Progress** Tree（WIP）。

*   **Current Tree**: 代表页面现在正在展示的 Fiber 结构。
*   **WorkInProgress Tree**： WIP 是在 Render 阶段，通过新的 react element 树和Current tree 调和比较生成的新的 fiber tree。这颗树的构建是在内存中实现的，并在 commit 阶段应用到真实的DOM上。

可以将他俩想象成两幅画，Current Tree 为正在展示的画，而 WIP 为后台正在准备的新画。当新画(WIP)准备好后，将直接交换两幅画，将新画展示给观众。

#### 为什么要两棵树？

如果你边算边改当前树，用户就会看到半更新、逻辑不一致。双缓冲让所有改动都在 WIP 上完成，**commit 时一次性落地**，可以确保 UI 始终一致。

#### WIP 在哪里初始化的？

现在我们有了 RootFiber（HostRootFiber）作为 `currentTree` 的根节点，那么 WIP tree 的根节点是在哪里初始化的呢？
当我们调用 `root.render(<App/>)`, react 会开始调度更新。在 渲染阶段（render phase），React 会尝试为 hostRootFiber（current tree 的根节点）创建一个 workInProgress 副本。

具体在 prepareFreshStack 函数中，会调用 createWorkInProgress 来为 `hostRootFiber` 创建 `workInprogress` 节点：

```js
// /facebook/react/blob/main/packages/react-reconciler/src/ReactFiberWorkLoop.js
function prepareFreshStack(root: FiberRoot, lanes: Lanes): Fiber {
...
const rootWorkInProgress = createWorkInProgress(root.current, null);
...
}
```

下面这段源码会创建一个fiber作为WIP 并通过alternate指针关联 currentTree 和 WIP tree。

```js
// This is used to create an alternate fiber to do work on.
export function createWorkInProgress(current: Fiber, pendingProps: any): Fiber {
  let workInProgress = current.alternate;
  if (workInProgress === null) {
    // We use a double buffering pooling technique because we know that we'll
    // only ever need at most two versions of a tree. We pool the "other" unused
    // node that we're free to reuse. This is lazily created to avoid allocating
    // extra objects for things that are never updated. It also allow us to
    // reclaim the extra memory if needed.
    workInProgress = createFiber(
      current.tag,
      pendingProps,
      current.key,
      current.mode,
    );
    workInProgress.elementType = current.elementType;
    workInProgress.type = current.type;
    workInProgress.stateNode = current.stateNode;
    // 相互设置 alternate 指针
    workInProgress.alternate = current;
    current.alternate = workInProgress;
  } else {
    // We already have an alternate.
    // copy from current tree
    // Reset the effect tag.
    ...
  }
  // Reset all effects except static ones.
  // Static effects are not specific to a render.
   ...
  // Clone the dependencies object. This is mutated during the render phase, so
  // it cannot be shared with the current fiber.
   ...
  // These will be overridden during the parent's reconciliation
   ...
  return workInProgress;
}
```

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/36f9173b2c464785a36b12584ed42f5f~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgc2ppbg==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzY1MzAxNjg1MDgwMDY5MiJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1763393511&x-orig-sign=nhOCK7Sa0uLHq1VjlVq0kErFiI0%3D)

在 Render Phase， 会通过 `beginWork` 和 `completeWork` 循环对 **workInProgress** 树上的 fiber节点 进行**深度优先遍历**。为了方便追踪正在处理的 fiber，react 内部维护了一个 workInProgress 指针，永远指向正在更新的 WIP tree 上的 fiber。

所以，当Render Phase 处理到 App 对应的 Fiber 节点时，`workInProgress` 会指向 App。如下图所示：

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/4f22c5375afe407ca5b995c66b325d4e~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgc2ppbg==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzY1MzAxNjg1MDgwMDY5MiJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1763393511&x-orig-sign=rVPDfPjxYZwbBrUHxvNIVHkRUI8%3D)

当 Render phase 执行完毕后， 新的 WIP tree 的构建工作就完成了。 接下来会进入 Commit Phase，并根据 Render Phase 中给 fiber 标记的不同 flags 来对真实 DOM 进行对应的操作。 当这两个阶段都完成后，FiberRootNode 会将 current 从指向 旧的 Current Tree 变更为指向新的 WIP tree。
通俗的讲，可以理解为 current tree 和 WIP tree 进行了互换。
如下图所示：

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/f5ff234a89ea4a4cbaf2cac8f8888e4a~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgc2ppbg==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMzY1MzAxNjg1MDgwMDY5MiJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1763393511&x-orig-sign=Oj6GVKWqpK0p0xFKuuMTUs8G10g%3D)

至此，fiber tree 的**双缓存工作**就完成了。

### 小结

以上关于 React Fiber 的基本介绍就结束了。 同学们可能还有其它问题，比如，Fiber树是如何更新的以及如何根据fiber树去操作真实DOM的。这些问题，涉及到了React 的调和机制、Render Phase 和 Commit Phase， 感兴趣的同学可以关注一下我发布的[React 源码 - Render Phase 的工作细节](https://juejin.cn/post/7504461472237846582)和[React 源码 - Commit Phase 的工作细节](https://juejin.cn/post/7548842389004910607)这两篇文章。

最后，如果大家对React源码感兴趣，且想系统的学习React设计架构的，在这里推荐大家一本书 - 《深入浅出React开发指南 - 赵林林》

引用：
《深入浅出React开发指南 - 赵林林》
