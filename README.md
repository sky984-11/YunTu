一款跨平台的截图记账软件，改变您的记账方式。

## 功能特性

- **自动解析**：支持支付宝和微信账单截图自动解析。
- **多平台支持**：支持 Android 和 PC（Windows/Mac/Linux）端。
- **数据同步**：多端自动同步账单数据，方便随时查看和管理。
- **多账单分类**：支持收入、支出等多种账单分类，清晰记录财务状况。
- **标签管理**：支持自定义账单标签，便于快速搜索与统计。
- **数据导出**：支持将账单数据导出为 CSV 格式文件，便于进一步分析。
- **数据安全**：所有账单数据均存储在本机。

## 技术栈

- **前端**：Vue 3 + PrimeVue + TailwindCSS
- **后端**：FastAPI，用于图片上传和 OCR 解析处理
- **数据库**：采用tauri的SQLite插件本地存储
- **OCR 引擎**：基于PaddleOCR
- **跨平台打包**：Tauri  实现多端打包


## 功能截图

### 菜单
![image](https://github.com/user-attachments/assets/9036fb86-4c9a-4e9c-a395-93868de67846)

### 首页
![image](https://github.com/user-attachments/assets/b54c3fd8-3a51-4ddf-8c46-f7070573b5d2)

### 统计
![image](https://github.com/user-attachments/assets/76d31106-45ba-4afe-8d54-f64c14f61595)

### 每日回顾
![image](https://github.com/user-attachments/assets/11165a86-d70e-45a2-9f89-bbad9231ef40)

### 账单导入
![image](https://github.com/user-attachments/assets/a9d80e9e-7601-46af-946f-0fde6d925fe7)



## 安装步骤

1. 克隆项目代码：

```bash
git clone https://github.com/sky984-11/YunTu.git
cd YunTu
```
    
2. 安装依赖：

```bash
# 安装前端依赖 
yarn install 
# 安装后端依赖 
pip install -r requirements.txt
```
    
3. 打包和运行：

```bash
# Tauri 打包 PC 端应用 
yarn tauri build
# Tauri 打包  Android 端应用 
yarn tauri android build --apk --target aarch64
#
```

## 使用方法

1. 启动应用后，在主界面选择“添加账单”。
2. 上传支付宝或微信账单截图，应用将自动识别截图内容并提取相关账目信息。
3. 手动确认账单详情（如金额、日期、支付方式等），并选择分类保存。
4. 在“账单记录”页面查看和管理所有账目，可以通过分类或标签筛选账单。
5. 使用“导出”功能将账单数据导出为 CSV 格式，便于备份和分析。

## 开发指南

### 环境配置

- **Node.js**: v20.17.0
- **Python**: 3.12
- **Android Studio** (Android 依赖环境)
- **Tauri CLI**: 用于 PC 端开发与打包

### 运行开发环境

```bash
# 前端开发 
yarn tauri dev  
# 后端开发 
python3 main.py
```

## 未来改进计划

- **自定义提醒功能**：为用户提供每日/每月账单提醒。
- **第三方存储支持**：后续增加账单数据源自定义，支持数据本地化部署。
- **账单协同功能**：可以邀请多人一起记账。

## 贡献

欢迎对本项目进行贡献！可以通过提交 Issue 或 PR 参与开发，帮助我们不断完善应用。

## 许可证

本项目使用 MIT License 许可证。
