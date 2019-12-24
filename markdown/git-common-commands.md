# git 常用命令

### git clone http://xxx.git
> 将git仓库克隆到本地

### git checkout develop
> 切换到 `develop` 分支
### git push 
> 将当前分支推送到远程

### git branch 
> 查看所有本地分支

### git branch -a 
> 查看所有分支

### git branch -r 
> 查看所有线上分支

### git cherry-pick cyas6c8as6casc86as7c6as86c7as6c 
> 将 `cyas6c8as6casc86as7c6as86c7as6c` 这次提交合并到当前分支

### git stash 
> 暂存当前分支的修改

### git stash pop 
> 显示暂存

### git stash list
> 显示缓存队列

### git stash clear
> 晴空所有缓存队列

### git merge dev 
> 将 `dev` 分支合并到当前分支

### git branch newbranch 
> 新建本地 `newbranch` 分支

### git checkout -b newbranch 
> 新建本地 `newbranch` 分支

### git push origin newbranch:newbranch 
> 新建远程 `newbranch` 分支并合本地分支关联

### git push --set-upstream origin newbranch
> 推送当前分支并建立与远程上游分支 `newbranch` 的跟踪

### git branch -d oldbranch 
> 删除本地分支 `oldbranch`

### git branch -d -r oldbranch 
> 删除本地的远程分支 `oldbranch` （线上不会删除）

### git push origin --delete oldbranch 
> 删除远程`oldbranch`分支 

### git reset –-soft xxxx(版本号)
> 撤销本地 commit 但保留当前代码


# mac 下 git 不能push 报403 问题修复
参考 [https://www.jianshu.com/p/77b0340a02f3](https://www.jianshu.com/p/77b0340a02f3)
> 出现此问题的原因是 之前gitlab上的账户被停用/注销 然后再次开户， 登录名和之前的都一模一样， 此时电脑上还缓存着之前的 config 配置。在 clone 工程时因为新的账户名和之前的一致，所以没有报错，pull 命令也没有报错，但是在 push 更改的代码时出现了类似如下错误：

```bash
remote: You are not allowed to push code to this project.
fatal: unable to access 'http://xxxxxxxx.git/': The requested URL returned error: 403
```

> 起初以为是权限问题，但是查看之后确认当前权限是有 push 的，后来确认是 git config 缓存了之前的配置导致的问题

### 解决方法如下：
1. 查看config配置

```bash
git config --list
# 如果看到有 `credential.helper=xxxxx` 的字段，说明现在已经有缓存的凭证
```

2. 查看凭证地址

```bash
git config --show-origin --get credential.helper

# file:/Applications/Xcode.app/Contents/Developer/usr/share/git-core/gitconfig    osxkeychain
```

3. 删除凭证

```bash
cd /Applications/Xcode.app/Contents/Developer/usr/share/git-core
vi gitconfig
# 把里边 凭证名称那一行删掉
# 在删除保存文件 `:wq` 时 会报错误 因为当前文件权限是 onlyread 此时输入 `:w !sudo tee % ` 即可解决
```

4. 查看删除效果

```bash
git config credential.helper
# 如果删除成功此时应该不会出现任何东西
```
> 此时再次 clone 工程，就会要求你输入用户名密码，也可以正常 push 了, 但是每次都需要输入密码很麻烦可以执行一下命令，只在第一次时需要输入，之后就不需要在输入了

```bash
git  config --global  credential.helper  store 
```

> 这个命令会在 ～ 下建立一个 .git-credentials 文件用来储存用户名密码
    