# 说明

一个TODO示例程序，自用的 Nest JS 小程序后端脚手架，使用prisma作为后端ORM，由于小程序没有cookie机制，使用自定义的拦截器和REDIS实现session认证。
添加了常用的captcha、email、sms、jeepay（聚合支付）等服务，以及一些常用的工具函数。高度模块化，可以根据自己的业务需求酌情删除不需要的模块。

## 模块说明
* auth Auth 【基础】注解认证模块 
* config 【基础】配置模块
* error 【基础】错误处理模块
* prisma 【基础】prisma数据库模块
* redis 【基础】redis模块
* utils 【基础】工具函数模块
* captcha 【三方】行为验证码模块
* email 【三方】邮件发送模块
* file 【三方】文件上传下载模块
* jeepay 【三方】聚合支付模块
* sms 【三方】短信发送模块
* wechat 【三方】微信小程序模块
* app-user 【业务】用户账号和登录注册模块
* todo 【业务】TODO模块 演示todo类的增删改查操作


复制一份 config.example.ts 文件为 config.test.ts，并修改其中的配置，作为单元测试和e2e测试用的数据库（是的，正规单元测试应该直接mock掉数据库操作，这里采用了更符合国情的田园敏捷，在保证开发质量的同时保障一定的开发效率。
复制一份`.env.example`文件为`.env`，并修改其中的配置。该配置文件仅用于prisma的数据库连接配置，原因是schema.prisma不能直接从yaml文件中读取配置，仅能识别env中的配置。

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
