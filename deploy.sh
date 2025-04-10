#!/bin/bash
set -e

# 定义项目根目录 (请根据实际情况修改)
PROJECT_ROOT="."
# 定义 pm2 应用名称 (请根据实际情况修改)
PM2_APP_NAME="all"
# 定义 admin-web 构建输出目录
ADMIN_WEB_DIST="$PROJECT_ROOT/apps/admin-web/dist"
# 定义 web 项目的 .next 静态资源目录
WEB_NEXT_STATIC="$PROJECT_ROOT/apps/web/.next/static"
# 定义 web 项目的 standalone .next 目录
WEB_NEXT_STANDALONE_NEXT="$PROJECT_ROOT/apps/web/.next/standalone/.next"
# 定义 nginx 配置重载命令
NGINX_RELOAD_COMMAND="sudo nginx -s reload"
# 定义部署目标目录
DEPLOYMENT_DIR="/var/www/html"

# 切换到项目根目录
cd "$PROJECT_ROOT"

# 0. 停止 pm2 运行的服务
echo "0. 停止 pm2 运行的服务: $PM2_APP_NAME"
if command -v pm2 &> /dev/null; then
  pm2 stop "$PM2_APP_NAME" || echo "警告: 停止 pm2 服务失败 (可能服务未运行)."
else
  echo "警告: pm2 未安装，跳过停止服务步骤。"
fi

# 1. 检查 git 仓库是否干净
echo "1. 检查 git 仓库是否干净..."
GIT_STATUS=$(git status --porcelain)
if [ -n "$GIT_STATUS" ]; then
  echo "错误: Git 仓库不干净，请提交或暂存您的更改。"
  exit 1
else
  echo "Git 仓库干净。"
fi

# 2. 执行 git pull 更新仓库代码
echo "2. 执行 git pull 更新仓库代码..."
git pull origin "$(git rev-parse --abbrev-ref HEAD)" || { echo "Git pull 失败，请检查错误。"; exit 1; }
echo "代码更新完成。"

# 3. 执行 pnpm i 安装依赖
echo "3. 执行 pnpm i 安装依赖..."
if command -v pnpm &> /dev/null; then
  pnpm i --frozen-lockfile || { echo "pnpm 安装依赖失败，请检查错误。"; exit 1; }
else
  echo "错误: pnpm 未安装，请先安装 pnpm。"
  exit 1
fi
echo "依赖安装完成。"

# 4. 执行 pnpm run build 编译项目
echo "4. 执行 pnpm run build 编译项目..."
pnpm run build || { echo "项目编译失败，请检查错误。"; exit 1; }
echo "项目编译完成。"

# 5. 删除 /var/www/html 目录中的全部文件和子目录
echo "5. 删除 $DEPLOYMENT_DIR 目录中的全部文件和子目录..."
sudo rm -rf "$DEPLOYMENT_DIR"/* || { echo "删除 $DEPLOYMENT_DIR 内容失败，请检查权限。"; exit 1; }
echo "$DEPLOYMENT_DIR 内容已删除。"

# 6. 将 apps/admin-web/dist/ 目录内的全部内容复制到 /var/www/html 目录中
echo "6. 将 $ADMIN_WEB_DIST 目录内的全部内容复制到 $DEPLOYMENT_DIR 目录中..."
sudo cp -r "$ADMIN_WEB_DIST"/* "$DEPLOYMENT_DIR"/ || { echo "复制文件到 $DEPLOYMENT_DIR 失败，请检查路径和权限。"; exit 1; }
echo "文件已复制到 $DEPLOYMENT_DIR。"

# 7. 复制 apps/web/.next/static 目录到 apps/web/.next/standalone/.next 目录下
echo "7. 复制 $WEB_NEXT_STATIC 目录到 $WEB_NEXT_STANDALONE_NEXT 目录下..."
# mkdir -p "$WEB_NEXT_STANDALONE_NEXT" || { echo "创建目录 $WEB_NEXT_STANDALONE_NEXT 失败。"; exit 1; }
cp -r "$WEB_NEXT_STATIC" "$WEB_NEXT_STANDALONE_NEXT" || { echo "复制静态资源失败，请检查路径。"; exit 1; }
echo "静态资源已复制到 $WEB_NEXT_STANDALONE_NEXT。"

# 8. 执行 pm2 run pm2.json
echo "8. 执行 pm2 run pm2.json..."
if command -v pm2 &> /dev/null; then
  pm2 startOrRestart pm2.json || { echo "执行 pm2.json 失败，请检查 pm2 配置文件。"; exit 1; }
  pm2 save
else
  echo "警告: pm2 未安装，跳过执行 pm2.json 步骤。"
fi
echo "pm2 配置已应用。"

# 9. 执行 nginx -s reload
echo "9. 执行 $NGINX_RELOAD_COMMAND..."
eval "$NGINX_RELOAD_COMMAND" || { echo "重载 Nginx 配置失败，请检查 Nginx 服务状态和配置。"; exit 1; }
echo "Nginx 配置已重载。"

echo "部署脚本执行完毕。"