# js中call()、apply()、bind()的用法和区别

> call() apply() bind() 都属于 function 原型中的方法,都会改变当前方法的 this 指向，区别在于 call() 和 apply() 都是立即执行 call() 的参数是一个一个的 apply() 的参数是一个数组集合， bind() 只是返回一个对当前函数的引用

## call()

```javascript
    function showname (num0, num1, num2) {
      console.log('showname>')
      console.log(this.name)
      console.log(num0, num1, num2)
    }
    function showage (num0, num1, num2) {
      console.log('showage>')
      console.log(this.age)
      console.log(num0, num1, num2)
    }

    var user1 = {
      name: 'snail',
      sex: 'man',
      age: '24'
    }

    var user2 = {
      name: 'jobs',
      sex: 'man',
      age: '66'
    }

    showname.call(user1, 98, 99, 100)  // showname> snail      98 99 100
    showage.call(user2, 1, 2, 3)    // showage> 66      1 2 3
    showage.call(showname)  // showage> undefined      undefined undefined undefined 这一句 this 指向的是 showage
    showage.call.call(showname)  // showname> undefined      undefined undefined undefined 这一句 this 指向的是 showname
```

## apply()
```javascript
    var arr1 = [1, 2, 3]
    var arr2 = ['a', 'b', 'c']

    arr1.push.apply(arr1, arr2)
    console.log(arr1)  // [1, 2, 3, "a", "b", "c"]
    
    
    // e.g: Math.max(1,2,3,4,5)  // 5
    var numbers = [53, 65, 25, 37, 78];
    console.log(Math.max(...numbers)); //78
    console.log(Math.max.apply(null, numbers)); //78
```

## call()
```javascript
    var x = 9;
    var module = {
        x: 81,
        getX: function () {
            return this.x;
        }
    };
    console.log(module.getX()); // 81
    var retrieveX = module.getX;
    console.log(retrieveX()); // 9
    var boundGetX = retrieveX.bind(module);
    console.log(boundGetX()); // 81
```
