# 持续集成系列-第1篇

## gitlab-runner

##### 安装 gitlab-runner

```bash
# 下载gitlab-runner 
sudo curl -L --output /usr/local/bin/gitlab-runner https://gitlab-runner-downloads.s3.amazonaws.com/latest/binaries/gitlab-runner-linux-amd64
```
##### 查看仓库ci信息

在gitlab仓库 `Settings` 下的 `CI / CD` 下的 `Runners` 下查看

![image](/images/notes/2020-03-27-001.jpeg)


##### 注册一个 runner

```bash
# 注册
gitlab-runner register

# 1. gitlab url
# 2. ci Toekn
# 3. runner 描述
# 4. runner tag
# 5. 执行器 shell
```

##### 添加并启动服务
```bash
# 添加
gitlab-runner install -n "<service-name>" -u <user-name>
# 启动
sudo gitlab-runner start -n "<service-name>"
```

##### 新增 `.gitlab-ci.yml` 文件

在仓库根目录新建 `.gitlab-ci.yml` 文件，当 git 监测到有新的push时，会执行配置中的任务

```bash
# 任务链 按顺序串行执行
stages:
  - build
  - deploy

# job 任务
dev-build: # 任务名称 自定义
  stage: build # 对应任务链中的每个名字
  only:        # 监控分支
    - develop
  variables:   # 自定义变量
    aaa: abcd
  script:
    - echo "安装依赖...."
    - yarn install
    - echo "开始打包...."
    - yarn test
    - echo "清空缓存...."
    - rm -rf /home/dev-www/*
    - rm -rf /home/nginx.conf
    - echo "拷贝文件到网站目录...."
    - cp -r dist/* /home/dev-www
    - cp -r nginx.conf /home
  tags:        # runner 的 tags
    - test
  
# job 任务
dev-deploy: # 任务名称 自定义
  stage: deploy # 对应任务链中的每个名字
  only:        # 监控分支
    - develop
  script:
    - cd /home
    - echo "启动服务...."
    - nginx -s reload
  tags:        # runner 的 tags
    - test

# job 任务
prod-build: # 任务名称 自定义
  stage: build # 对应任务链中的每个名字
  only:        # 监控分支
    - master
  variables:   # 自定义变量
    aaa: abcd
  script:
    - echo "安装依赖...."
    - yarn install
    - echo "开始打包...."
    - yarn build
    - echo "清空缓存...."
    - rm -rf /home/prod-www/*
    - rm -rf /home/nginx.conf
    - echo "拷贝文件到网站目录...."
    - cp -r dist/* /home/prod-www
    - cp -r nginx.conf /home
  tags:        # runner 的 tags
    - test
  
# job 任务
prod-deploy: # 任务名称 自定义
  stage: deploy # 对应任务链中的每个名字
  only:        # 监控分支
    - master
  script:
    - cd /home
    - echo "启动服务...."
    - nginx -s reload
  tags:        # runner 的 tags
    - test 
```