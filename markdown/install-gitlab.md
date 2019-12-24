## 按照官网教程逐步安装
 
> https://about.gitlab.com/install/


## 如果要修改访问路径
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