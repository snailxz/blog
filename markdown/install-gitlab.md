## 按照官网教程逐步安装
 
[https://about.gitlab.com/install/](https://about.gitlab.com/install/)

* 注意 执行这句时 `sudo EXTERNAL_URL="https://gitlab.example.com" yum install -y gitlab-ee
` 引号里边的 `https://gitlab.example.com` 需要改成自己的ip端口号或者域名

## 如果之后要修改访问路径
1. 打开
```bash
vim /etc/gitlab/gitlab.rb
```
2. 新增或修改下边这行，并保存退出
```bash
external_url 'http://192.168.0.109:9999'
```
3. 执行
```bash
sudo gitlab-ctl reconfigure
```

## 如果访问不了，可能是端口号被防火墙禁了
```bash
/sbin/iptables -I INPUT -p tcp --dport 9999 -j ACCEPT
```