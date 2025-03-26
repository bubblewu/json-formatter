# JSON Formatter

一个功能强大的JSON格式化和验证工具，使用最新的Next.js 15.2.4和React 19技术栈构建。

## 技术栈

- **Next.js**: 15.2.4（最新版）
- **React**: 19.0.0（最新版）
- **next-intl**: 3.17.0（高性能国际化）
- **TailwindCSS**: 4.x（最新版）
- **CodeMirror**: 6.x（高性能代码编辑器）

## 功能特性

- JSON格式化与美化
- JSON压缩
- JSON验证
- 多语言支持（英文/中文）
- 历史记录保存
- 协作编辑功能
- 暗色/亮色主题切换

## 安装与运行

### 先决条件

- Node.js 18.17.0或更高版本
- npm 9.x或更高版本

### 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/bubblewu/json-formatter.git
cd json-formatter
```

2. 安装依赖
```bash
npm install
```
或使用提供的脚本
```bash
./update-deps.sh
```

3. 启动开发服务器
```bash
npm run dev
```

4. 构建生产版本
```bash
npm run build
npm run start
```

## 开发命令

- `npm run dev` - 使用Turbopack启动开发服务器
- `npm run build` - 构建生产版本
- `npm run start` - 启动生产服务器
- `npm run lint` - 运行ESLint检查代码质量
- `npm run format` - 使用Prettier格式化代码
- `npm run clean` - 清理缓存和node_modules
- `npm run reinstall` - 重新安装所有依赖
- `npm run update` - 更新依赖到最新版本

## 国际化支持

该项目使用next-intl提供国际化支持，支持英文和中文两种语言。

- 英文: `/en/...`
- 中文: `/zh/...`

默认语言是英文，URL中没有语言前缀时会自动使用默认语言。

## 贡献

欢迎提交问题和Pull Request！

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
