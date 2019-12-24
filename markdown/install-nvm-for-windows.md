# windows下安装nvm管理node和npm版本

> 随着前端工程化越来越重要，node环境的搭建也越来越麻烦，大多数情况下我们的项目都使用不止一个版本的node，于是node的版本管理就显得尤为重要。nvm是一个可以管理node版本的工具，在需要的时候我们可以使用nvm命令切换本机的node版本，省去了以前一遍一遍重新安装的麻烦。

### 1.首先下载 nvm-windows 

##### window
[nvm各个版本](https://github.com/coreybutler/nvm-windows/releases)

##### mac
    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
or
    
    wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
*本文只介绍window下的安装和使用其他系统环境请移步 [https://github.com/creationix/nvm](https://github.com/creationix/nvm)*

### 2.安装
![image](/images/notes/2018-05-02-001.png)  
*注意：nvm的安装路径不能有中文或者空格，而且安装在c盘环境变量貌似会出问题（2018-12-11 发现c盘的问题主要是没有写入权限，导致在下载node 和npm 包时出现问题），所以最好还是在其他盘建一个文件夹，安装前需要先卸载之前安装过的node*

![image](/images/notes/2018-05-02-002.png)

之后会让你选择node存放的位置，这个目录是在你切换了版本以后，nvm会把你当前切换的node版本相关的东西拷贝到这个目录。为了避免跟上边路径的错误，直接跟nvm安装目录平级就行了。

### 3.install node

在安装node之前首先将npm下载源替换成淘宝的，不然npm安装容易失败

##### 找到nvm/settings.txt 添加这两行配置

    node_mirror: https://npm.taobao.org/mirrors/node/
    npm_mirror: https://npm.taobao.org/mirrors/npm/
    
##### 打开命令行 运行

    nvm install 8.8.0
    
这样我们就安装了node的8.8.0版本，
##### 切换node版本
    nvm use 8.8.0
    
这样就完成了node版本的快速切换，如果之后需要使用不同的版本 只需要安装 和 切换即可

*注意：不同版本node的npm包没有联系，比如你在8.8.0版本之下安装了vue-cli， 在6.10.0是无法使用的，需要再次安装*

## 常用的nvm命令
    nvm install <version>  // 安装node version 需要安装的版本号 
    nvm uninstall <version> // 卸载node version 需要卸载的版本号
    nvm use <version>  // 切换使用指定的版本node
    nvm ls  // 列出所有安装的版本