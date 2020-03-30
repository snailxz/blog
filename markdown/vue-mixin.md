# vue mixin(混入)详解

### 1.什么是 mixin (混入)

mixin(混入) 是对vue组件内通用部分的封装，达到可复用目的。它包含了所有 vue 组件选项。

e.g:
```javascript
// mixins/mixin.js
export default {
    data() {
        return {
            name: "如花",
            info: {
                age: 20,
                sex: '男',
            },
        }
    },
    created() {
        this.hello()
    },
    methods: {
        hello() {
            console.log('hello world')
        },
    },
}
```
```javascript
// 使用
import mixin from "@/mixins/mixin";

// 组件
export default {
    ...
    mixins: [mixin],
    ...
}

// 全局（不推荐）
vue.mixin(mixin)

// hello world
```

### 2. mixin (混入) 特性

混入选项具有一定的合并规则。具体如下:

##### a. data对象递归合并， 同名对象组件数据优先
##### b. 同名生命周期钩子里边的内容都会被调用，混入对象优先执行
##### c. `methods`、`components`、`directives`同名时组件取组件的值

e.g:
```javascript
// 使用
import mixin from "@/mixins/mixin";
export default {
    mixins: [mixin],
    data() {
        return {
            name: '似玉',
            info: {
                sex: 21,
                job: '前端',
            },
        }
    },
    created() {
        console.log(`job: ${this.info.job}`)
    },
    methods: {
        hello() {
            console.log(`hello my name is ${this.name}, I'm ${this.info.age} years old.`)
        },
    },
}

// hello my name is 似玉, I'm 21 year old.
// job: 前端
```

### 3.日常用法

```javascript
export default {
  data() {
    return {
      section: true, // 是否分页
      url: "",  // 列表接口请求url
      method: "GET",  // 请求方式
      query: {},  // 搜索数据
      meta: {  // 分页配置
        size: 10,
        page: 1,
        totle: 0,
        sizes: [10, 20, 30, 40]
      },
      list: [], // 列表数据
    }
  },
  methods: {
    // 获取列表数据
    async getListData() {
      if (!await this.beforeInit()) {
        return
      }
      let params = {}
      Object.keys(this.query).forEach(key => {
        if (this.query[key].replace(/(^\s*)|(\s*$)/g, "")) {
          params[key] = this.query[key].replace(/(^\s*)|(\s*$)/g, "")
        }
      })
      const config = { method: this.method }

      if (this.section) {
        params.page = this.meta.page;
        params.limit = this.meta.size;
      }

      if (this.method === "GET") {
        config.params = {
          ...params
        }
      } else {
        config.data = {
          ...params
        }
      }
      return new Promise((resolve, reject) => {
        this.$axios(this.url, config).then(
          res => {
            if (this.section) {
              this.list = res.data.data.list || [];
              this.meta.page = res.data.data.page;
              this.meta.total = res.data.data.total;
            } else {
              this.list = res.data.data
            }
            resolve(res)
          },
          err => {
            reject(err)
          }
        )
      })
    },
    // 修改初始
    beforeInit() {
      return true
    },
    // 搜索
    search() {
      this.meta.page = 1;
      this.getListData()
    },
    // 重置
    reset() {
      Object.keys(this.query).forEach(item => {
        this.query[item] = "";
      })
      this.meta.page = 1;
      this.getListData();
    },
    /**
     * 分页器size切换
     * @param {Number} val 分页size
     */
    handleSizeChange(val) {
      this.meta.page = 1;
      this.meta.size = val;
      this.getListData();
    },
    /**
     * 分页器翻页
     * @param {Number} val 分页页码
     */
    handleCurrentChange(val) {
      this.meta.page = val;
      this.getListData();
    },
  }
}
```

