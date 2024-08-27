react调和函数流程解析

react调和函数的作用就是在react fiber树构建过程中，比较旧的fiber和新的reactElement，尽量复用旧fiber的一个方法，也就是常说的diff算法



当触发react重新渲染，最终会进入workLoop工作循环，经历向下探寻（beginWork） 和向上回溯阶段 (completeWork)

执行beginWork时会根据不同的节点类型进入不同的方法

以下代码只保留关键逻辑

```javascript
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

当reconcile到 App fiber时，最终会进入**placeSingleChild**方法中

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

​		![image-20240709161000123](/Users/zhu/Library/Application Support/typora-user-images/image-20240709161000123.png)

​	执行**deleteChild(returnFiber, child)**，此处就是删除**key为1**的div fiber , 然后执行**child = child.sibling**，此时child变成**key为3**的div fiber, 再次执行循环体

 3.key相同，type相同

​	当key和type都相同，即会进入fiber复用逻辑，可以看到里面调用了useFiber方法，该方法会根据传入的props尽量复用旧的fiber

```js
deleteRemainingChildren(returnFiber, child.sibling);
const existing = useFiber(child, element.props);
existing.return = returnFiber;
```

##### 总结

​	当reactElement是单节点，会根据key和type的情况，选择复用或者新增fiber节点



















































