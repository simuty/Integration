

RabbitMQ 学习

对应的博客连接
1. [rabbitmq系列一：基本使用]()
2. [rabbitmq系列二：]()

源自rabbitmq官网教程，用ts自行实现加深理解，也便于项目中使用。

========================

### 依赖及下载

  * node
  * [rabbitmq](https://www.rabbitmq.com)
  * [ts-node](https://github.com/TypeStrong/ts-node)

```
$ node -v
v8.9.3
# 为了执行ts代码
$ npm -i ts-node -g
$ ts-node -v
v9.0.0
$ brew install rabbitmq
$ brew services start rabbitmq
```

### 使用

```bash
$ git clone
# 确保安装ts-node
$ ts-node -v
# 终端1
$ ts-node emit_log_topic.ts
# 终端2
$ ts-node receive_logs_topic.ts
```


### 书籍推荐

- 《RabbitMQ实战指南》
- 《RabbitMQ实战 高效部署分布式消息队列》