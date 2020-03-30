# CentOS 下的 docker 安装

## 1. Docker 要求 CentOS 系统的内核版本高于 3.10 ，查看本页面的前提条件来验证你的CentOS 版本是否支持 Docker 。
通过 uname -r 命令查看你当前的内核版本
```bash
uname -r
```

## 2. 使用 root 权限登录 Centos。确保 yum 包更新到最新。
```bash
sudo yum update
```

## 3. 卸载旧版本(如果安装过旧版本的话)
```bash
sudo yum remove docker  docker-common docker-selinux docker-engine
```

## 4. 安装需要的软件包， yum-util 提供yum-config-manager功能，另外两个是devicemapper驱动依赖的
```bash
sudo yum install -y yum-utils device-mapper-persistent-data lvm2
```

## 5. 设置yum源
```bash
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
```

## 6. 可以查看所有仓库中所有docker版本，并选择特定版本安装
```bash
yum list docker-ce --showduplicates | sort -r
```

## 7. 安装docker
```bash
sudo yum install docker-ce  #由于repo中默认只开启stable仓库，故这里安装的是最新稳定版17.12.0
# 或
sudo yum install <FQPN>  # 例如：sudo yum install docker-ce-17.12.0.ce
```

## 8. 启动并加入开机启动
```bash
sudo systemctl start docker
sudo systemctl enable docker
```

## 9. 验证安装是否成功(有client和service两部分表示docker安装启动都成功了)
```bash
docker version
```

## 10. 安装完成之后可能需要下载docker镜像，更改docker镜像源可以试下载更快
新建/修改文件 /etc/docker/daemon.json
```bash
vi /etc/docker/daemon.json
```
添加以下内容:

```bash
{
   "registry-mirrors": ["http://hub-mirror.c.163.com"]
}
```
重启docker服务:
```bash
systemctl restart docker.service
```
常用国内docker源：
```bash
# Docker 官方中国区

https://registry.docker-cn.com

# 网易

http://hub-mirror.c.163.com

# 中国科技大学

https://docker.mirrors.ustc.edu.cn

# 阿里云

https://pee6w651.mirror.aliyuncs.com
```

