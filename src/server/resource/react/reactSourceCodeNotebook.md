#### 关于批处理

在react18中，一个方法内多次调用setState只触发一次渲染的逻辑在这里

```js
function ensureRootIsScheduled(root: FiberRoot, currentTime: number) {
  const nextLanes = getNextLanes(
    root,
    root === workInProgressRoot ? workInProgressRootRenderLanes : NoLanes,
  );
  // We use the highest priority lane to represent the priority of the callback.
  const newCallbackPriority = getHighestPriorityLane(nextLanes);
  // Check if there's an existing task. We may be able to reuse it.
  //  事件函数中调用两次或者多次setstate时候existingCallbackPriority为上一次setstate时候的优先级，这时候直接return，不会向synqueue里面增加任务
  const existingCallbackPriority = root.callbackPriority;
  if (
    existingCallbackPriority === newCallbackPriority
  ) {
    console.warn('在一个事件函数中多次触发setstate')
    return;
  }

  // Schedule a new callback.
  let newCallbackNode;
  console.log('**********下一任务的优先级************', newCallbackPriority)
  if (newCallbackPriority === SyncLane) {
    if (root.tag === LegacyRoot) {
      scheduleLegacySyncCallback(performSyncWorkOnRoot.bind(null, root));
    } else {
      // 向syncQueue里面push回调函数
      scheduleSyncCallback(performSyncWorkOnRoot.bind(null, root));
    }
    // 判断是否支持微任务true
    if (supportsMicrotasks) {
        console.log(executionContext, 'log: ensureRootIsScheduled')   
        scheduleMicrotask(() => {

          // 等待事件回调(原生事件的回调函数)函数触发完成以后才会进入flushSyncCallbacks刷新事件回调函数增加的更新queue
          if (executionContext === NoContext) {
            flushSyncCallbacks();
          }
        });
    } else {
      // Flush the queue in an Immediate task.
      scheduleCallback(ImmediateSchedulerPriority, flushSyncCallbacks);
    }
    newCallbackNode = null;
  } 
   
}
```

当多次调用setState，会多次触发ensureRootIsScheduled，ensureRootIsScheduled内部会获取下一次更新的优先级，并保存到root上，当下一次进来发现获取的优先级和目前root上的优先级是一样的，就不会往syncQueue或调度中心里面push真正的渲染方法了，因此就实现了批处理。

#### 关于useEffect的调用时机

在初次渲染的时候，useEffect的回调函数是走的scheduler调度中心，但是加入renderLane位SyncLane ,貌似走的同步的方式？？？

```js
if (
    includesSomeLane(pendingPassiveEffectsLanes, SyncLane) &&
    root.tag !== LegacyRoot
  ) {
    flushPassiveEffects();
  }
```

对比react17，相同的代码

```react
 useEffect(() => {
    let now = performance.now();
    while(performance.now()-now<1000){
    }
    console.log("useEffect执行了");
    
    return () => {
      console.log("执行了effect清楚方法了zzzz");
    };
  }, [arr]);
```

17中会先渲染页面，回调异步执行，但是18中，回调同步执行，阻塞了页面

**因此只有以非同步的方式导致useEffect回调重新执行时，回调才不会阻塞渲染**

通过离散事件触发的渲染优先级为同步优先级，通过连续事件例如onMouseMove，优先级不为同步优先级，则此时useEffect为异步调用



#### useLayoutEffect为什么会阻塞页面重新渲染（错的）

在commitRoomImpl方法中，执行了

```js
commitLayoutEffects(finishedWork, root, lanes);
.......省略中间代码
flushSyncCallbacks();
```

调用setState后会执行**ensureRootIsScheduled**

**ensureRootIsScheduled**把新的渲染任务根据优先级选择是注册到调度中心还是放入同步队列中（**syncQueue**）

```js
function ensureRootIsScheduled(root: FiberRoot, currentTime: number){
  ///.......
   if (newCallbackPriority === SyncLane) {
      // 向syncQueue里面push回调函数
      scheduleSyncCallback(performSyncWorkOnRoot.bind(null, root));
	}
}
```

当执行完commitLayoutEffects，会执行**flushSyncCallbacks**，而flushSyncCallbacks就是执行**syncQueue**中的方法

```js
export function flushSyncCallbacks() {
  if (!isFlushingSyncQueue && syncQueue !== null) {
    // Prevent re-entrance.
    isFlushingSyncQueue = true;
    let i = 0;
    const previousUpdatePriority = getCurrentUpdatePriority();
    try {
      const isSync = true;
      const queue = syncQueue;
      setCurrentUpdatePriority(DiscreteEventPriority);
      for (; i < queue.length; i++) {
        let callback = queue[i];
        console.log(callback, 'log: flushSyncCallbacks 同步刷新执行的任务')
        do {
          callback = callback(isSync);
        } while (callback !== null);
      }
      syncQueue = null;
      includesLegacySyncCallbacks = false;
    }
  }
  return null;
}
```



当useLayoutEffect中触发了新的渲染，如

```jsx
useLayoutEffect(()=>{
    setArr(["A", "B", "E", "C", "X", "Y"]);
    console.log("useLayoutEffect执行了");
   return () => {
      console.log("执行了useLayoutEffect清楚方法了");
    };
  },[])
```

而此时，由于**commitLayoutEffects**是同步执行，因此触发的新的渲染为**最高优先级(同步优先级) 1**

![image-20240717142144509](/Users/zhu/Library/Application Support/typora-user-images/image-20240717142144509.png)

把useLayoutEffect换成useEffect，此时nextLane就为16，因此新的渲染任务不会被放到syncQueue中，而是注册至调度中心进行异步调用



#### setState的优化手段

当 **fiber.lanes === NoLanes &&(alternate === null || alternate.lanes === NoLanes)**成立，也就是当前hook 的queue为空时，调用setState，react会提前计算新的state的值，去和旧的state进行比较，如果相同(浅比较)，就不会调用**scheduleUpdateOnFiber**

```typescript
function dispatchSetState<S, A>(
  fiber: Fiber,
  queue: UpdateQueue<S, A>,
  action: A,
) {
  const lane = requestUpdateLane(fiber);

  const update: Update<S, A> = {
    lane,
    action,
    hasEagerState: false,
    eagerState: null,
    next: (null: any),
  };
  if (isRenderPhaseUpdate(fiber)) {
    enqueueRenderPhaseUpdate(queue, update);
  } else {
    enqueueUpdate(fiber, queue, update, lane);
    const alternate = fiber.alternate;
    if (
      fiber.lanes === NoLanes &&
      (alternate === null || alternate.lanes === NoLanes)
    ) {
      // The queue is currently empty, which means we can eagerly compute the
      // next state before entering the render phase. If the new state is the
      // same as the current state, we may be able to bail out entirely.
      const lastRenderedReducer = queue.lastRenderedReducer;
      if (lastRenderedReducer !== null) {
        let prevDispatcher;
        try {
          const currentState: S = (queue.lastRenderedState: any);
          const eagerState = lastRenderedReducer(currentState, action);
          // Stash the eagerly computed state, and the reducer used to compute
          // it, on the update object. If the reducer hasn't changed by the
          // time we enter the render phase, then the eager state can be used
          // without calling the reducer again.
          update.hasEagerState = true;
          update.eagerState = eagerState;
          if (is(eagerState, currentState)) {
            // Fast path. We can bail out without scheduling React to re-render.
            // It's still possible that we'll need to rebase this update later,
            // if the component re-renders for a different reason and by that
            // time the reducer has changed.
            return;
          }
        } catch (error) {
        } finally {
        }
      }
    }
    const eventTime = requestEventTime();
    const root = scheduleUpdateOnFiber(fiber, lane, eventTime);
  }
}
```



#### 调和函数

react调和函数流程解析

react调和函数的作用就是在react fiber树构建过程中，比较**旧的fiber**和**新的reactElement**，尽量复用旧fiber的一个方法，也就是常说的diff算法

当触发react重新渲染，最终会进入workLoop工作循环，经历向下探寻（beginWork） 和向上回溯阶段 (completeWork)

执行beginWork时会根据不同的节点类型进入不同的方法

以下代码只保留关键逻辑

```js
function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes,
): Fiber | null {
  workInProgress.lanes = NoLanes;
  switch (workInProgress.tag) {
    case FunctionComponent: {
      const Component = workInProgress.type;
      const unresolvedProps = workInProgress.pendingProps;
      const resolvedProps =
        workInProgress.elementType === Component
          ? unresolvedProps
          : resolveDefaultProps(Component, unresolvedProps);
      return updateFunctionComponent(
        current,
        workInProgress,
        Component,
        resolvedProps,
        renderLanes,
      );
    }
    case HostComponent:
      return updateHostComponent(current, workInProgress, renderLanes);
    ......      
  }
}
```

不管最终进入那一条case，最终都会执行**reconcileChildren**方法，也就是调和函数，我们以**FunctionComponent**为例

```js
function updateFunctionComponent(
  current,
  workInProgress,
  Component,
  nextProps: any,
  renderLanes,
) {
  //省略context和hooks逻辑。。。
  let nextChildren;
  nextChildren = renderWithHooks(
      current,
      workInProgress,
      Component,
      nextProps,
      context,
      renderLanes,
    );

  reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  return workInProgress.child;
}
```

我们对传入**reconcileChildren**方法的主要参数做一个解释，以如下jsx为例

```js
function App(){
  const [count,setCount] = useState(100)
  return (
    <div onClick={()=>setCount((c)=>c+1)}>{count}</div>
  )
}
```

- current : 当前渲染在页面上的fiber节点，此处就是**App对应的fiber**
- workInProgress : 当前正在协调的fiber节点，此处是**App对应的新的fiber**，current和workInProgress的关系请**参考react双缓冲**
- nextChildren ：此处为App方法执行后获得的reactElement对象![image-20240709151806574](/Users/zhu/Library/Application Support/typora-user-images/image-20240709151806574.png)、
- renderLanes ： 优先级相关，本文省略



**reconcileChildren**方法中会调用**reconcileChildFibers**

```js
export function reconcileChildren(
  current: Fiber | null,
  workInProgress: Fiber,
  nextChildren: any,
  renderLanes: Lanes,
) {
  if (current === null) {
   	//初次渲染，省略。。。
  } else {
    //diff算法的入口
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren,
      renderLanes,
    );
  }
}
```

在reconcileChildFibers逻辑中，区分为子节点为单节点和多节点

```js
function reconcileChildFibers(
    returnFiber: Fiber,
    currentFirstChild: Fiber | null,
    newChild: any,
    lanes: Lanes,
  ): Fiber | null {
    // 处理单个子节点
    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(
            reconcileSingleElement(
              returnFiber,
              currentFirstChild,
              newChild,
              lanes,
            ),
          );
      }
      //处理多子节点
      if (isArray(newChild)) {
        return reconcileChildrenArray(
          returnFiber,
          currentFirstChild,
          newChild,
          lanes,
        );
      }
    }
    return deleteRemainingChildren(returnFiber, currentFirstChild);
  }
```

##### 单节点

```js
  function reconcileSingleElement(
    returnFiber: Fiber,   
    currentFirstChild: Fiber | null, 
    element: ReactElement,
    lanes: Lanes,
  ): Fiber {
    const key = element.key;
    let child = currentFirstChild;
    while (child !== null) {
      if (child.key === key) {
        const elementType = element.type;
          if (child.elementType === elementType) {
            deleteRemainingChildren(returnFiber, child.sibling);
            const existing = useFiber(child, element.props);
            existing.return = returnFiber;
            return existing;
          }
        deleteRemainingChildren(returnFiber, child);
        break;
      } else {
        deleteChild(returnFiber, child);
      }
      child = child.sibling;
    }
     const created = createFiberFromElement(element, returnFiber.mode, lanes);
     created.return = returnFiber;
     return created;
  }
```

从上面代码中可以看到，这里有一个常见的误区，react的**diff算法**比较的是**fiber**和**reactElement**，而不是**fiber**和**fiber**进行对比。可以看到这个方法主要由一个大的while循环构成，接下来详细解释下循环中做的事

进入while循环中，根据**key**和**type**的不同，又分为如下几种情况：

1.key相同，type不同

例如如下情况

![image-20240709160118185](/Users/zhu/Library/Application Support/typora-user-images/image-20240709160118185.png)

​	这种情况说明元素的节点类型发生了变化，p---->div，直接调用**deleteRemainingChildren(returnFiber, child)**，删除旧的p fiber及它后面的所有fiber (删除旧的p fiber 和div fiber)，跳出循环，执行创建fiber的代码，此时就不会进入复用逻辑，

```js
const created = createFiberFromElement(element, returnFiber.mode, lanes);
created.return = returnFiber;
```

​	2. key不同

​		![image-20240709161000123](/Users/zhu/Desktop/1.png)

​	执行**deleteChild(returnFiber, child)**，此处就是删除**key为1**的div fiber , 然后执行**child = child.sibling**，此时child变成**key为3**的div fiber, 再次执行循环体

 3.key相同，type相同

​	当key和type都相同，即会进入fiber复用逻辑，可以看到里面调用了useFiber方法，该方法会根据传入的props尽量复用旧的fiber

```js
deleteRemainingChildren(returnFiber, child.sibling);
const existing = useFiber(child, element.props);
existing.return = returnFiber;
```

##### 多节点

当新的children为多节点，会进入多节点reconcile流程，我们以下图为例

![image-20240819165225925](/Users/zhu/Library/Application Support/typora-user-images/image-20240819165225925.png)

```ts
function reconcileChildrenArray(
    returnFiber: Fiber,
    currentFirstChild: Fiber | null,
    newChildren: Array,
    lanes: Lanes,
  ): Fiber | null {
    let resultingFirstChild: Fiber | null = null;
    let previousNewFiber: Fiber | null = null;
    let oldFiber = currentFirstChild;
    let lastPlacedIndex = 0;
    let newIdx = 0;
    let nextOldFiber = null;
    //第一次循环，遍历前后最大长度,复用oldFiber,直到key不一样就跳出
    for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
      if (oldFiber.index > newIdx) {
        nextOldFiber = oldFiber;
        oldFiber = null;
      } else {
        nextOldFiber = oldFiber.sibling;
      }
      //updateSlot方法内部就是去判断key是否相同，相同且type也相同的话就复用，key不同的话就返回null
      const newFiber = updateSlot(
        returnFiber,
        oldFiber,
        newChildren[newIdx],
        lanes,
      );
      if (newFiber === null) {
        break;
      }
      if (shouldTrackSideEffects) {
        if (oldFiber && newFiber.alternate === null) {
          // We matched the slot, but we didn't reuse the existing fiber, so we
          // need to delete the existing child.
          deleteChild(returnFiber, oldFiber);
        }
      }
      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
      if (previousNewFiber === null) {
        resultingFirstChild = newFiber;
      } else {
        previousNewFiber.sibling = newFiber;
      }
      previousNewFiber = newFiber;
      oldFiber = nextOldFiber;
    }

    //新数组被遍历完了，old Fiber没遍历的就可以删了
    if (newIdx === newChildren.length) {
      // We've reached the end of the new children. We can delete the rest.
      deleteRemainingChildren(returnFiber, oldFiber);
      return resultingFirstChild;
    }

    //旧的被遍历完了，但是新的还有，新的剩下的打上Placement标记
    if (oldFiber === null) {
      for (; newIdx < newChildren.length; newIdx++) {
        const newFiber = createChild(returnFiber, newChildren[newIdx], lanes);
        if (newFiber === null) {
          continue;
        }
        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
        if (previousNewFiber === null) {
          // TODO: Move out of the loop. This only happens for the first run.
          resultingFirstChild = newFiber;
        } else {
          previousNewFiber.sibling = newFiber;
        }
        previousNewFiber = newFiber;
      }
      return resultingFirstChild;
    }

    // Add all children to a key map for quick lookups.
    const existingChildren = mapRemainingChildren(returnFiber, oldFiber);

    // 第二次循环: 遍历剩余非公共序列, 优先复用oldFiber序列中的节点
    // Keep scanning and use the map to restore deleted items as moves.
    for (; newIdx < newChildren.length; newIdx++) {
      const newFiber = updateFromMap(
        existingChildren,
        returnFiber,
        newIdx,
        newChildren[newIdx],
        lanes,
      );
      if (newFiber !== null) {
        if (shouldTrackSideEffects) {
          if (newFiber.alternate !== null) {
    //如果map中的fiber被复用了，则说明我们不需要给他打上deletion 标记，需要将它从map中删除（最终map中的fiber都是需要被删除的）
            existingChildren.delete(
              newFiber.key === null ? newIdx : newFiber.key,
            );
          }
        }
        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
        if (previousNewFiber === null) {
          resultingFirstChild = newFiber;
        } else {
          previousNewFiber.sibling = newFiber;
        }
        previousNewFiber = newFiber;
      }
    }

    if (shouldTrackSideEffects) {
      // Any existing children that weren't consumed above were deleted. We need
      // to add them to the deletion list.
      existingChildren.forEach((child) => deleteChild(returnFiber, child));
    }

    return resultingFirstChild;
  }
```

上面的源码中，我们对其中的关键步骤进行讲解。

1. 首先会进入一次循环

   本次循环最多会循环**旧数组**和**新数组**的最小长度次，以图中的例子来看就是5次

   每次循环都会执行**updateSlot**方法，方法内部会判断**新旧**节点的**key**是否相同，这里会出现几种情况：

   - key不同，updateSlot返回**null**，**跳出循环**
   - key相同，节点type不同，无法复用，updateSlot返回根据reactElement创建的新的fiber
   - key相同，节点type相同，复用旧的fiber，updateSlot返回复用的fiber

   可以看出，第一次大的循环会一直往后遍历，尽最大可能的复用旧的节点，直到**新旧节点的key不同**，就会跳出循环，跳出第一次循环会产生**3种**不同的可能性

   1. 新数组被遍历完，旧的还有剩下的

      这种情况只需要**删除旧数组中剩下**的即可，结束diff算法流程

   2. 旧数组被遍历完，新数组还有剩下的

      这种情况说明旧数组都得到了复用，只需要给新数组中剩下的**打上新增标记**即可，结束diff算法流程

   3. 新旧数组都还有剩下的

      这种情况是最复杂的，因此会进入diff算法后续流程

2. 第一轮循环结束，新旧数组都还有剩余

   首先会把旧数组中剩余的节点放入一个**map**中，以节点的key为键，方便后续通过key进行查找

   接下来就会对剩余的新数组进行遍历，遍历过程中拿到每一个节点的key，去map里面找是否有能匹配上的节点，如果key和type都匹配上了则复用旧的节点，**当节点得到了复用，需要从map中移除对应的旧节点**，因为运行到最后map里面保留的就是所有没有得到复用的节点，需要打上删除标记



当一个节点得到了复用，这个节点所在的位置可能发生了变化，例如

A->B->C->D->E   变成 A->B->E->C->X->Y，其中C和E的相对位置发生了变化，react内部是如何确定节点的位置变化了呢？确定节点是否发生移动的方法就是**placeChild**

这里涉及到了一个关键的变量，**lastPlacedIndex**，这个变量的含义可以理解为**目前已经复用的节点在旧数组中最大的index**，读起来很拗口，通过上面的例子来解释：当遍历到了A和B节点时，发现可以被复用，则**lastPlacedIndex**被修改为B节点在**旧数组中的index**，也就是1，再往后遍历到了E，此时E的旧index为4，大于lastPlacedIndex，则此时E节点是相对旧数组没有发生移动的，因此不会给E节点标记为移动，且会把**lastPlacedIndex**设置为4。继续遍历到C，C的旧index为2，lastPlacedIndex为4，因此可以知道在旧数组中，当前遍历的节点在上一个节点之前，因此当前节点是**需要移动**的。

由此可以看出react对节点移动的策略是：**让元素往后移动，避免元素往前移动**

```js
 function placeChild(
    newFiber: Fiber,
    lastPlacedIndex: number,
    newIndex: number,
  ): number {
    newFiber.index = newIndex;
    const current = newFiber.alternate;
    if (current !== null) {
      const oldIndex = current.index;
      if (oldIndex < lastPlacedIndex) {
        //应该是尽量让节点往后移动，避免节点往前移动
        // This is a move.
        newFiber.flags |= Placement;
        return lastPlacedIndex;
      } else {
        // This item can stay in place.
        return oldIndex;
      }
    } else {
      // This is an insertion.
      newFiber.flags |= Placement;
      return lastPlacedIndex;
    }
  }
```







































##### 总结

​	当reactElement是单节点，会根据key和type的情况，选择复用或者新增fiber节点







#### useDeferredValue

这是react18提供的一个hook，官方描述它的作用是可以**延迟更新**某一部分UI。实际上就是**返回一个更新时机落后于传入值的值**，也就是**延迟的值**，听上去很拗口，我们通过一个例子和源码来学习下这个hook。

```tsx
export default function MyComponent() {
  const [inputValue, setInputValue] = useState("");
  const deferredValue = useDeferredValue(inputValue);
  let start = performance.now();
  while (performance.now() - start < 1000) {}
  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <p>即时值: {inputValue}</p>
      <p>延迟值: {deferredValue}</p>
    </div>
  );
}
```

在上面的例子中，手动的减慢了组件的渲染，这样更容易看到即时更新的值和延迟值的区别。当键盘输入时，可以明显看到页面上即时值先进行了更新，而延迟值等了一会儿才在页面上更新。也就是我们输入了一次，但是页面触发了两次更新，第一次更新仅仅更新了**inputValue**，第一次更新完成后立马进行了第二次更新，这次更新才更新了**deferredValue**。

##### 源码

我们结合源码就更清晰了。为了方便理解我对源码进行了一部分改动

```tsx
function useDeferredValue<T>(value: T): T {
  const [prevValue, setValue] = useState(value);
  useEffect(() => {
    const prevTransition = ReactCurrentBatchConfig.transition;
    ReactCurrentBatchConfig.transition = {};
    try {
      setValue(value);
    } finally {
      ReactCurrentBatchConfig.transition = prevTransition;
    }
  }, [value]);
  return prevValue;
}
```

可以看到本质上就是通过**useState**和**useEffect**来实现的，它内部通过**useState**保存了我们往**useDeferredValue**传递的初始值，当value发生变化，通过useEffect再次触发页面渲染。在setValue之前，还有两行代码

```js
const prevTransition = ReactCurrentBatchConfig.transition;
ReactCurrentBatchConfig.transition = {};
```

这两行代码和**transition**相关，这里可以简单的理解为，通过这两行代码，让后面的更新使用transition优先级的方式进行，transition优先级的更新更容易被打断。

我们再次走之前例子的流程，当input输入时，调用**setInputValue**，进入第一次渲染阶段，由于**setInputValue**通过**change事件**触发，此时优先级较高。渲染完成后触发了**useEffect**回调，通过**transition**优先级也就是较低的优先级再次触发渲染，这时才会更新延迟值

##### 总结

通过上面的分析，我们可以总结出useDeferredValue什么时候使用：当页面上某一部分的UI的渲染可以被延迟或被更重要的任务打断时，可以通过这个hook去降低这一部分渲染的优先级









#### useEffect的原理

在useEffect内部，会创建一个对象结构，通过这个结构可以看出，useEffect内部也是通过链表进行组织的

```ts
const effect: Effect = {
    tag, //hook的类型
    create, //useEffect第一个参数
    destroy,//useEffect第一个参数执行的返回结果
    deps, //依赖数组
    // Circular
    next: (null: any), //链表指针
};
```

这个对象最终会被放到hook所在的fiber对象的updateQueue属性上

```ts
let componentUpdateQueue: null | FunctionComponentUpdateQueue = (currentlyRenderingFiber.updateQueue: any);
  if (componentUpdateQueue === null) {
    componentUpdateQueue = createFunctionComponentUpdateQueue();
    currentlyRenderingFiber.updateQueue = (componentUpdateQueue: any);
    componentUpdateQueue.lastEffect = effect.next = effect;
  } else {
    const lastEffect = componentUpdateQueue.lastEffect;
    if (lastEffect === null) {
      componentUpdateQueue.lastEffect = effect.next = effect;
    } else {
      const firstEffect = lastEffect.next;
      lastEffect.next = effect;
      effect.next = firstEffect;
      componentUpdateQueue.lastEffect = effect;
    }
  }
```

updateQueue也是一个环状链表，通过环状链表可以实现快速插入节点

这样在commit阶段，就可以通过fiber.updateQueue.lastEffect就能拿到最后一个hook，再通过最后一个hook.next拿到第一个hook，从前往后执行

注：所有的hook最终都挂载在fiber的memoizedState属性上，hook对象的next指向下一个hook，hook对象上也有一个memoizedState属性，这个属性根据不同的hook来决定，例如**useState**的话**memoizedState**就会具体的值，**useEffect** hook对象的**memoizedState**就为effect对象(上面的effect对象)

重新渲染时，就算依赖数组没有发生变化，也会被放到fiber.updateQueue中

```ts
function updateEffectImpl(fiberFlags, hookFlags, create, deps): void {
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  let destroy = undefined;
  if (currentHook !== null) {
    const prevEffect = currentHook.memoizedState;
    destroy = prevEffect.destroy;
    if (nextDeps !== null) {
      const prevDeps = prevEffect.deps;
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        //deps没发生变化时，effect对象没有HookHasEffect标识
        hook.memoizedState = pushEffect(hookFlags, create, destroy, nextDeps);
        return;
      }
    }
  }
  //fiberFlags = PassiveFlag = 2048
  currentlyRenderingFiber.flags |= fiberFlags;
  //deps数组发生变化时，pushEffect生成的effect对象带有HookHasEffect标识
  hook.memoizedState = pushEffect(
    HookHasEffect | hookFlags,
    create,
    destroy,
    nextDeps,
  );
}
```

当依赖数组没有发生变化时，fiber上不会有**PassiveFlag**的标识，最终在commit阶段执行useEffect时，会根据PassiveEffect这个标识判断本次是否需要执行对应fiber上的effect



#### useTransition

##### 作用：

降低state的更新优先级，使得本次更新更容易被优先级更高的打断

返回的第一个参数用来标记是否还有待处理的transition

##### 执行流程：

useTransition内部维护了一个**const [isPending, setPending] = useState(false)**

```ts
function startTransition(){
	setPending(true)
	//下面三行代码应该是标记后续的更新为transition lanes
	const prevTransition = ReactCurrentBatchConfig.transition;
  ReactCurrentBatchConfig.transition = {};
  const currentTransition = ReactCurrentBatchConfig.transition;
	setPending(false)
	callback()
}
```

当执行startTransition时，首先调用setPending(true)，此时会触发一次render，且此时render的lane由调用startTansition的地方决定，例如在点击事件中执行，此时第一次render的**lane**就为1。由于第一次render大部分UI没有发生变化，因此这次render效率很高。

setPending(false)和callback()引起的更新，只能获取**transition**的lanes，这就是降低优先级的根本原因

当isPending更新为false时，说明此时transition已经处理完了





#### 中断渲染核心



当有渲染任务被打断时，任务队列中的task并不会被删除，因此队列里面一直有任务需要执行

```ts
const performWorkUntilDeadline = () => { // 调度时候执行的函数
  if (scheduledHostCallback !== null) { // scheduledHostCallback为flushWork
    const currentTime = getCurrentTime();
    startTime = currentTime;
    let hasMoreWork = true;
    try {
      hasMoreWork = scheduledHostCallback(hasTimeRemaining, currentTime);
    } finally {
      if (hasMoreWork) {
        schedulePerformWorkUntilDeadline();
      }
    }
  }
};
```

当渲染任务被打断后，performConcurrentWorkOnRoot会返回它自身，因此**scheduledHostCallback**最终会返回true，还有其他任务则会在任务执行完成后继续发起调度，**scheduledHostCallback**最终执行的就是下面的**workLoop**中的代码，每次执行taskQueue中的task时，在这里也会判断是否需要**yield**，如果**yield**了且**taskQueue**没清空，则上面的**hasMoreWork**就为true

```ts
function workLoop(hasTimeRemaining, initialTime) {
  currentTask = peek(taskQueue);
  while (
    currentTask !== null &&
    !(enableSchedulerDebugging && isSchedulerPaused)
  ) {
    if (
      currentTask.expirationTime > currentTime &&
      (!hasTimeRemaining || shouldYieldToHost())
    ) {
      break;
    }
    const callback = currentTask.callback;
    if (typeof callback === 'function') {
      const didUserCallbackTimeout = currentTask.expirationTime <= currentTime;
      const continuationCallback = callback(didUserCallbackTimeout);// 这里就是react中performConcurrentWorkOnRoot函数的返回值
      currentTime = getCurrentTime();
      if (typeof continuationCallback === 'function') {
        // 这里表示任务没完成被中断了，则将返回的函数作为新的回调在下一次循环执行
        currentTask.callback = continuationCallback;
      } else {
        if (currentTask === peek(taskQueue)) {
          pop(taskQueue);
        }
      }
    } else {
      pop(taskQueue);//执行完的task会被删除，没执行完的不会被删除
    }
    currentTask = peek(taskQueue);
  }
  // Return whether there's additional work
  if (currentTask !== null) {
    // 表示taskqueue没执行完，在performWorkUntilDeadline会继续发起调度
    return true;
  } else {
    return false;
  }
}
```

渲染任务执行过程中，一共有**两个地方**在判断是否需要交出执行权，第一个就是上面**Scheduler**中的**workLoop**，每一个task执行之前，第二个就是**performConcurrentWorkOnRoot**方法执行前

![image-20240808220221344](/Users/zhu/Library/Application Support/typora-user-images/image-20240808220221344.png)

#### lanes

##### 前置知识：

- 获取lanes中最高的lane

  ```ts
  getHighestPriorityLane(lanes: Lanes): Lane {
    return lanes & -lanes;
  }
  ```

  

#### context

通过createContext创建的context类似一个全局变量，context.provider的value的变化都会同步到这个全局变量上去，useContext方法内部会读取这个全局变量，并将它放到fiber节点的**dependencies**属性上

```js
currentlyRenderingFiber.dependencies = {
   lanes: NoLanes,
   firstContext: contextItem,
};
```

当value发生变化时，会通过当前**fiber**（react.provider）向下寻找，找到fiber上带有**dependencies**并且和当前**context**匹配的fiber

找到后把**fiber**标记为在本次渲染中有更新（将**lane**修改为当前渲染lane，并修改parentFIber的childLanes），

```js
// The context value changed. Search for matching consumers and schedule
// them to update.
propagateContextChange(workInProgress, context, renderLanes);
```

```ts
 while (dependency !== null) {
        // Check if the context matches.
        if (dependency.context === context) {
          // Match! Schedule an update on this fiber.
          fiber.lanes = mergeLanes(fiber.lanes, renderLanes);
          const alternate = fiber.alternate;
          if (alternate !== null) {
            alternate.lanes = mergeLanes(alternate.lanes, renderLanes);
          }
          scheduleContextWorkOnParentPath(
            fiber.return,
            renderLanes,
            workInProgress,
          );
          // Mark the updated lanes on the list, too.
          list.lanes = mergeLanes(list.lanes, renderLanes);
          // Since we already found a match, we can stop traversing the
          // dependency list.
          break;
        }
        dependency = dependency.next;
 }
```



#### Ref

react的ref可以赋值在两种类型的元素上，第一种就是原生DOM元素，第二种是react组件，其中第二种赋值方式通常会搭配**useImperativeHandle**这个hook一起使用

##### 原生DOM

带有ref属性的fiber节点，会被打上**LayoutMask**的flag，在commit阶段会进入处理useLayoutEffect的方法，以同步的方式把对应的DOM赋值给**ref.current**

##### 组件

useImperativeHandle内部使用了useLayoutEffect，因此也和在原生DOM一样同时处理

react内部会把**imperativeHandleEffect**这个方法当作**useLayoutEffect**的第一个参数传入

imperativeHandleEffect的**第一个**参数就是我们在使用**useImperativeHandle**时传入的第二个参数

```js
function imperativeHandleEffect<T>(
  create: () => T,
  ref: {|current: T | null|} | ((inst: T | null) => mixed) | null | void,
) {
  if (typeof ref === 'function') {
    const refCallback = ref;
    const inst = create();
    refCallback(inst);
    return () => {
      refCallback(null);
    };
  } else if (ref !== null && ref !== undefined) {
    const refObject = ref;
    const inst = create();
    refObject.current = inst;
    return () => {
      refObject.current = null;
    };
  }
}
```

在commit阶段，执行useLayoutEffect时，会把方法的返回值**赋值**给ref.current，组件卸载时会将ref.current**清空**



#### react事件

react内部会将大部分事件都绑定在container上，也有例外，如selectchange事件是绑定在document上的。

当原生事件触发后，会调用react内部传递的一个方法，这个方法内部会模拟浏览器的冒泡或者捕获机制，再处理我们传递给react的事件回调

相当于给原生的事件包装了一层优先级的概念，不同的事件对应不同的优先级







































