# 抽奖营销

> 整理一些常用的抽奖类型，持续更新中。

## 1. Introduction - 简介
* 常见抽奖形态；
* 主要内容包括：摇一摇，刮刮卡，老虎机，即时开奖；
* demo地址演示：<br />
<img width="150" src="https://kafeibei.github.io/dist/images/raffle-h5/qrcode_raffle.png" />

## 2. Function - 功能说明

### 2.1 摇一摇 - Shake
通过摇手机触发抽奖功能，增加用户间的互动

#### 2.1.1 效果图
<img width="375" src="https://kafeibei.github.io/dist/images/raffle-h5/demo_shake.png" />

#### 2.1.2 用微信扫描下面二维码查看效果
<img width="150" src="https://kafeibei.github.io/dist/images/raffle-h5/qrcode_shake.png" />

### 2.2 刮刮卡 - Scratch
刮开刮奖区覆盖的涂层，展示抽奖结果

#### 2.2.1 效果图
<img width="375" src="https://kafeibei.github.io/dist/images/raffle-h5/demo_scratch.png" />

#### 2.2.2 用微信扫描下面二维码查看效果
<img width="150" src="https://kafeibei.github.io/dist/images/raffle-h5/qrcode_scratch.png" />

### 2.3 老虎机 - Slot
根据展示的图形是否相同，判断是否中奖

#### 2.3.1 效果图
<img width="375" src="https://kafeibei.github.io/dist/images/raffle-h5/demo_slot.png" />

#### 2.3.2 用微信扫描下面二维码查看效果
<img width="150" src="https://kafeibei.github.io/dist/images/raffle-h5/qrcode_slot.png" />

### 2.4 即时开奖 - Instant
省去传统抽奖的过程，直接展示是否得奖的结果

#### 2.3.1 效果图
<img width="375" src="https://kafeibei.github.io/dist/images/raffle-h5/demo_instant.png" />

#### 2.3.2 用微信扫描下面二维码查看效果
<img width="150" src="https://kafeibei.github.io/dist/images/raffle-h5/qrcode_instant.png" />

## 3. Installation - 安装

### 3.1 环境安装
...

### 3.2 安装步骤
```
# 下载仓库
git clone https://github.com/kafeibei/raffle-h5.git
# 进入项目根目录，安装依赖
npm install
# 项目实例化
gulp init
# 项目服务启动
gulp
```

### 3.3 部署步骤
```
# 测试环境部署
gulp init --test
# 生成环境部署
gulp init --build
```