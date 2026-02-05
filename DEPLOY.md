# H5海报生成器部署指南

## 快速临时访问（已启动）

本地服务器已在 http://localhost:8000 运行

## 永久部署方案 - GitHub Pages

### 步骤1：创建GitHub仓库
1. 访问 https://github.com/new
2. 仓库名称：`poster-generator`
3. 选择「Public」
4. 点击「Create repository」

### 步骤2：推送代码到GitHub
在终端中运行以下命令：

```bash
# 进入项目目录
cd /Users/jessie/Documents/trae_projects/H5

# 添加远程仓库（替换为你的GitHub用户名）
git remote add origin git@github.com:你的用户名/poster-generator.git

# 推送代码
git branch -M main
git push -u origin main
```

### 步骤3：启用GitHub Pages
1. 进入仓库的「Settings」页面
2. 点击左侧的「Pages」选项
3. 在「Source」部分，选择「main」分支
4. 点击「Save」按钮
5. 等待几分钟，GitHub会生成访问链接

### 步骤4：访问你的H5页面
部署完成后，你可以通过以下格式的链接访问：
`https://你的用户名.github.io/poster-generator/`

## 技术说明

- **项目结构**：纯静态H5页面，包含HTML、CSS和JavaScript
- **功能**：模板选择、照片上传、海报生成、拖拽调整、缩放功能
- **模板**：使用本地images目录中的5个模板图片
- **数据处理**：所有操作都在浏览器端完成，无需后端服务

## 注意事项

- GitHub Pages部署后，链接将永久可用
- 确保你的仓库设置为Public，否则只有你能访问
- 如果你修改了代码，需要重新推送到GitHub，GitHub Pages会自动更新