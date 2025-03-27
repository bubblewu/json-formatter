const fs = require('fs');
const path = require('path');

// 获取命令行参数
const mode = process.argv[2];

if (mode !== 'local' && mode !== 'deploy') {
  console.error('Usage: node switch-config.js [local|deploy]');
  process.exit(1);
}

// 配置文件路径
const configPath = path.join(__dirname, 'next.config.mjs');
const localConfigPath = path.join(__dirname, 'next.config.local.mjs');
const deployConfigPath = path.join(__dirname, 'next.config.deploy.mjs');

// 如果是第一次切换，备份当前部署配置
if (mode === 'local' && !fs.existsSync(deployConfigPath) && fs.existsSync(configPath)) {
  fs.copyFileSync(configPath, deployConfigPath);
  console.log('Deployment configuration backed up to next.config.deploy.mjs');
}

try {
  // 切换配置
  if (mode === 'local') {
    if (fs.existsSync(localConfigPath)) {
      fs.copyFileSync(localConfigPath, configPath);
      console.log('Switched to local development configuration');
    } else {
      console.error('Local configuration file not found');
      process.exit(1);
    }
  } else { // deploy
    if (fs.existsSync(deployConfigPath)) {
      fs.copyFileSync(deployConfigPath, configPath);
      console.log('Switched to deployment configuration');
    } else {
      console.error('Deployment configuration file not found');
      process.exit(1);
    }
  }
} catch (error) {
  console.error('Error switching configuration:', error);
  process.exit(1);
} 