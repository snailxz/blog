
# 开发一个简单的cli工具

## step zero 目的

目前项目组业务种类多、新增项目频繁、开发周期紧凑，每次初始话项目需要从git库重新拉取修改，比较麻烦，如果有一个工具可以配合基础模板快速生成可以极大提高开发效率。

## step one 初始化

```bash
# 初始化 npm
npm init -y

# 安装依赖
npm install chalk commander git-clone inquirer ora shelljs --save
```
传送门：
+ [commander 命令行工具](https://github.com/tj/commander.js/blob/master/Readme_zh-CN.md)
+ [inquirer 命令行交互工具](https://github.com/SBoudrias/Inquirer.js#documentation)
+ [chalk 彩色命令行提示](https://github.com/chalk/chalk#readme)
+ [git-clone  git clone 工具](https://github.com/jaz303/git-clone)
+ [ora 命令行加载效果](https://github.com/sindresorhus/ora#readme)
+ [shelljs 在 node 里执行 shell 的工具](https://github.com/shelljs/shelljs)

```json
# 完善 package.json
{
  "name": "cyweb-cli", # 包名称 在 npm 搜索时的名字
  "version": "1.0.0", # 版本
  "description": "a cli project for cy-web", # 描述
  "bin": { # 包命令
    "cw": "./bin/cw.js" # npm 包向外暴露出去的命令
  },
  "repository": { # git地址
    "type": "git",
    "url": "ssh://xxxxxxxxxxx.git"
  },
  "readme": "https://xxxxxxxxxxx/cyweb-cli/README.md", # readme npm主页要显示的
  "bugs": { # 提bug的方式 一般是 issues
    "url": "https://xxxxxxxxxxx/cyweb-cli/issues",
    "email": "lixiangzhao@xxxxxxxxxxx.cn"
  },
  "keywords": [ # 搜素的关键词
    "cyweb-cli",
    "vchangyi"
  ],
  "author": "snail", # 包作者
  "license": "IMT", # 协议
  "preferGlobal": true,
  "dependencies": { # 依赖
    "chalk": "^3.0.0",
    "commander": "^5.0.0",
    "git-clone": "^0.1.0",
    "inquirer": "^7.1.0",
    "ora": "^4.0.3",
    "shelljs": "^0.8.3"
  }
}
```

## step two 实现命令

在开始之前需要了解下 `npm link` 命令
> 在包文件夹下执行 npm link 会在全局 node_modules 中创建该包的软连接，使该包命令在全局可用。
相当于 npm install -g 安装了一下这个包

[npm link 文档](https://docs.npmjs.com/cli/link.html)

从 package.json 可以看出 `bin` 里边有个命令需要实现： `cw`

为了后续扩展，我们希望执行 cw 命令本身不要做任何事情，只是输出一下本包的信息，比如版本号、帮助文档之类的，将任务交给具体的自命令来实现，e.g：`cw init` 初始化一个工程这样。

下面实现：

#### cw
新建 /bin/cw.js 对应 package.json bin 下边该命令的文件地址
```javascript
#!/usr/bin/env node  
// 写npm包的时候需要在脚本的第一行写上#!/usr/bin/env node,用于指明该脚本文件要使用node来执行
// /usr/bin/env 用来告诉用户到path目录下去寻找node，#!/usr/bin/env node 可以让系统动态的去查找node，已解决不同机器不同用户设置不一致问题。

// 引入 commander
const program = require('commander')

// 设置版本号 和需要提示的信息
program
  .version(require('../package').version, '-v, --version')
  .usage('<command> [options]')

// 设置执行任务的子命令 这里 init 是初始化 需要有 name 参数
// .alias('i') 是别名
program
  .command('init <name>', 'create a new project from gitLab basic template').alias('i')

// 隐藏默认 help command
program
  .command('help', { noHelp: true, isDefault: true })

// 自定义 help 内容
program
  .on('--help', () => {
    console.log()
  })

// 结束
program
  .parse()

// 没有参数需要显示help
if (!process.argv.slice(2).length) {
  program.outputHelp()
}
```

接下来需要实现子命令 init 的具体内容，command 设置子命令时有两种形式：
```javascript
// 第一种
program
    .command('init <name>'）
    .description('clone a repository into a newly created directory')
    .action(name => {
        console.log('project name:', name);
    });
// 第二种
program
    .command('init <name>', 'create a new project from gitLab basic template')

```
第一种 command 和 description 分开，可使用 action 接受参数并在回调方法里边执行命令

第二种是将 description 值数作为 command 的第二参数，这时就不能通过 action 回调来处理命令，当使用此方式时程序会自动在当前目录查找和子命令名称相符的js文件并执行文件内容，默认查找文件名格式 主命令-自命令.js,e.g: `./cw-init.js`，也可以通过传入配置项 `executableFile` 来指定对应的文件名称，e.g：
```javascript
program
    .command('init <name>', 'create a new project from gitLab basic template', {executableFile: 'init'})
```
这时程序就会查找`./init.js`



这里我们使用第二种方式并且没有自定义查找文件名称，所以我们需要再新建文件`cw-init.js`

```javascript
#!/usr/bin/env node

// 引入需要的 node 包，和自定义的方法
const program = require('commander')
const chalk   = require('chalk')
const ora     = require('ora')
const shell   = require('shelljs')
const clone   = require('git-clone')
const ask     = require('../lib/ask')  // 新建项目时需要回答一些问题
const write   = require('../lib/write')  // 修改 package.json方法 (8 9999999999 这段猫打的)
const tmpList = require('../tmp.json')  // 支持的模版配置文件
const exists  = require('fs').existsSync
const { errorLog, successLog } = require('../lib/logger')  // 封装的 成功/失败 风格提示

program
  .name('init|i')  // 自命令提示名称 不设置 会出现 cw-init 这种情况 和实际不符
  .option('-t, --template', 'check basic template gitlab url')  // option 选项，执行 cw init -t 时会显示支持的模板类型和git库地址
  .usage('<name>')  // 需要接受的参数

program
  .on('--help', () => {
    console.log()
  })

program
  .parse(process.argv);

// 当执行 cw init -t 时 program.template = true 会显示当前支持生成的模板信息
if (program.template) {
  console.log()
  console.log(chalk.black.bgCyan('个项目基础模板 gitlab 地址：'), '\n')
	Object.keys(tmpList).forEach(key => {
		console.log(chalk.white(tmpList[key].name + ': '), chalk.blue(tmpList[key].url))
  })
  console.log()
  process.exit()
}

// 如果没有第三个参数 name 需要提示
const pkgs = program.args;
if (pkgs.length === 0) {
  errorLog('\n请输入新建项目文件夹名称\n')
  program.help()
}

// 如果当前目录已存在此名称项目
if (exists(program.args[0])) {
  errorLog(` ${program.args[0]} 项目已存在当前目录 `)
  process.exit(1)
}

// 如果有那么就会执行 ask ，和
ask.getUserInput(data => {
  if (data.confirm.toLowerCase() !== 'y') {
    errorLog('你取消了此项目的新建')
    process.exit()
  }
  if (!tmpList[data.type].url) {
    errorLog('暂无此模板地址')
    process.exit()
  }
  const valStr = JSON.stringify(Object.values(data).map(val => val.replace(/(^\s*)|(\s*$)/g, '')))
  if (/,"",/g.test(valStr)) {
    errorLog('请正确填写新建项目信息')
    process.exit()
  }
  cloneTemplate(tmpList[data.type].url, data)
})

// clone 模板库的方法
const cloneTemplate = function (gitHost, config) {
  const loading = ora(`正在下载模板文件`)
  loading.start()
  clone(gitHost, config.name, null, function (err) {
      loading.stop()
      if (err) {
          errorLog(err)
      } else {
          // clone 成功删除原本的 .git
          shell.rm('-rf', `${config.name}/.git`)
          // 修改 package.jso 内容
          write.changeJSON(`${config.name}/package.json`, config)
          // 初始化一个新的 git 库
          shell.cd(config.name)
          shell.exec('git init')
          // 成功提示
          successLog(`  ${config.name} 项目创建成功 `)
          console.log(`\ncd ${config.name} \nyarn install \nyarn serve\n`)
      }
  })
}

```

在这里引入了几个自定义的文件:

```javascript
// ./lib/ask.js 新建项目时需要询问
const inquirer = require('inquirer')

/**
 * get user input
 * @param {function} cb
 */
exports.getUserInput = function (cb) {
	const tmpList  = require('../tmp.json')
	const typeList = Object.keys(tmpList).map(key => {
		return {
			value: key,
			name: tmpList[key].name
		}
	})
	inquirer.prompt([{
		type: 'input',
		name: 'name',
		message: '项目名称',
		default: process.argv[2]
	}, {
		type: 'input',
		name: 'author',
		message: '开发人员',
		default: 'vchangyi'
	}, {
		type: 'input',
		name: 'description',
		message: '项目描述',
		default: 'a web project'
	}, {
		type: 'list',
		name: 'type',
		message: '选择项目类型',
		choices: [
			...typeList
		]
	}, {
		name: 'confirm',
		message: '确定新建?（y/n）',
		default: 'y'
	}]).then(answers => {
		cb(answers)
	})
}
```

```javascript
// /lib/logger.js  封装的 成功/失败 风格提示
const chalk = require('chalk')

/**
 * errorLog
 */
exports.errorLog = function (str) {
  console.log()
  console.log(chalk.white.bgRed(str))
  console.log()
}

/**
 * log
 */
exports.successLog = function (str) {
  console.log()
  console.log(chalk.black.bgGreen(str))
  console.log()
}
```

```javascript
// /lib/write.js 写入 package.json
const fs = require('fs')
const { errorLog } = require('./logger')

/**
 * change package.json
 */
module.exports.changeJSON = function (path, config) {
    try {
        let fileContent = fs.readFileSync(path, "utf-8")
        fileContent = JSON.parse(fileContent)
        fileContent.name = config.name
        fileContent.author = config.author
        fileContent.description = config.description
        fs.writeFileSync(path, JSON.stringify(fileContent, null, 2))
    } catch (err) {
        errorLog('写入 package.json 失败')
        program.help(1)
    }
}
```

还有模版文件配置json
```json
# /tmp.json
{
  "mobilew": {
    "name": "移动端h5",
    "url": "http://xxxxxxxxxxx.git"
  },
  "wechatw": {
    "name": "微信端h5",
    "url": "http://xxxxxxxxxxx.git"
  },
  "wwechatw": {
    "name": "企业微信端h5",
    "url": "http://xxxxxxxxxxx.git"
  },
  "admin": {
    "name": "管理后台",
    "url": "http://xxxxxxxxxxx.git"
  },
  "mp": {
    "name": "微信小程序",
    "url": "http://xxxxxxxxxxx.git"
  },
  "wmp": {
    "name": "企业微信小程序",
    "url": "http://xxxxxxxxxxx.git"
  }
}
```

接下来执行 `npm link` 命令将包安装在全局，执行 `cw` 会看到相应的提示。

## step three 安装

确保各个功能没有问题我们就可以使用了，这个包我们想要项目组的开发人员都能使用，所有本地 `npm link` 就显得不够灵活了。

所以我们需要将包上传到 git 库 ，同时记得更新 package.json 里边 git 地址相关内容

在本地我们可以通过 `npm install` 来安装，e.g:

```bash
npm install git+http://xxxxxx.git
```

(全文完)

<br/><br/><br/><br/><br/>
