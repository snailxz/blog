# 安装nginx

## 1. 安装依赖环境

### a. gcc 安装
安装 nginx 需要先将官网下载的源码进行编译，编译依赖 gcc 环境，如果没有 gcc 环境，则需要安装：
```bash
yum install gcc-c++
```

### b. PCRE pcre-devel 安装
PCRE(Perl Compatible Regular Expressions) 是一个Perl库，包括 perl 兼容的正则表达式库。nginx 的 http 模块使用 pcre 来解析正则表达式，所以需要在 linux 上安装 pcre 库，pcre-devel 是使用 pcre 开发的一个二次开发库。nginx也需要此库。
```bash
yum install -y pcre pcre-devel
```

### c. zlib 安装
zlib 库提供了很多种压缩和解压缩的方式， nginx 使用 zlib 对 http 包的内容进行 gzip ，所以需要在 Centos 上安装 zlib 库。
```bash
yum install -y zlib zlib-devel
```

### d. OpenSSL 安装
OpenSSL 是一个强大的安全套接字层密码库，囊括主要的密码算法、常用的密钥和证书封装管理功能及 SSL 协议，并提供丰富的应用程序供测试或其它目的使用。
nginx 不仅支持 http 协议，还支持 https（即在ssl协议上传输http），所以需要在 Centos 安装 OpenSSL 库。
```bash
yum install -y openssl openssl-devel
```

## 2. 安装nginx

### a. 使用wget命令下载
```bash
wget -c https://nginx.org/download/nginx-1.12.0.tar.gz
```
### b. 解压
```bash
tar -zxvf nginx-1.12.0.tar.gz
```
### c. 编译安装
```bash
# 进入目录
cd nginx-1.12.0 
# 使用默认配置
./configure
# 安装
make
make install
```
### d. 启动nginx
```bash
cd /usr/local/nginx/sbin/
# 启动
./nginx
# 停止
./nginx -s stop （或者） ./nginx -s quit
# 重启
./nginx -s reload
```

> 至此已经可以通过ip访问页面了，因为默认的是80端口所以不用填写,若果访问不了又可能是80端口被防火墙挡住了需要配置下防火墙，相关命令如下：

```bash
# 开启80端口
/sbin/iptables -I INPUT -p tcp --dport 80 -j ACCEPT

# 重启防火墙
service iptables restart

# 查看端口开启状态
netstat -ntlp
```



## 3. 配置nginx

### a. 进入 conf/ 目录
```bash
cd /usr/local/nginx/conf
```
### b. 打开配置文件 nginx.conf
```bash
vi nginx.conf
```
### c. 输入一下配置内容
```bash
    # 主要更改 server 里边的这些内容
    server {
        # 要监听的端口
        listen       80; 
        server_name  localhost;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
            root   html;
            index  index.html index.htm;
            # vue单页需要添加下边一行 避免出现 404
            try_files $uri $uri/ /index.html;
        }
        # 代理 /api/ 路径的接口到 http://192.168.0.109:8000
        location /api/ {
            proxy_pass http://192.168.0.109:8000;
            proxy_connect_timeout 60;
            
            # net-error 时要添加一下两行
            proxy_http_version 1.1;
            proxy_set_header Connection "";
            
            add_header Access-Control-Allow-Origin *;
            add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept";
            add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
        }
        # 代理 /auth/ 路径的接口到 http://192.168.0.109:8000
        location /auth/ {
            proxy_pass http://192.168.0.109:8000;
            add_header Access-Control-Allow-Origin *;
            add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept";
            add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
        }
    }
```

### d. 重启nginx
```bash
./nginx -s reload
```

# 安装ftp

## 安装
```bash
yum install -y vsftpd
```

## 配置

### a.



# 可能要用到的命令
开启端口
> /sbin/iptables -I INPUT -p tcp --dport 80 -j ACCEPT

查看端口开启状态
> netstat -ntlp

解压文件到指定位置
> sudo unzip  文件名  -d  地址

重启nginx
> /usr/nginx/sbin/nginx -s reload

启动别的配置文件
> ./nginx -c conf/other.conf
