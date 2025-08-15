import fs from 'fs';
import yaml from 'js-yaml';
import { execSync } from 'child_process';

/**
 * 主函数：读取配置并执行prisma db push
 */
function main() {
  try {
    // 读取配置文件
    console.log('读取配置文件 config.local.yaml...');
    const yamlContent = fs.readFileSync('config.local.yaml', 'utf8');
    const config = yaml.load(yamlContent);

    if (!config || !config.db || !config.db.url) {
      throw new Error('配置文件中未找到有效的数据库连接信息');
    }

    console.log('找到数据库连接配置，准备执行 prisma db push...');

    // 执行prisma db push命令，使用配置文件中的数据库URL
    // 这里通过环境变量传递数据库URL，确保使用当前配置
    const env = { ...process.env };
    env.DATABASE_URL = config.db.url;

    // 执行命令
    execSync('npx prisma db push', {
      stdio: 'inherit', // 继承标准输入输出，让用户看到命令执行过程
      env: env, // 传递环境变量
    });

    console.log('prisma db push 执行成功');
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error('错误：找不到 config.local.yaml 文件');
    } else if (error.message.includes('prisma')) {
      console.error('执行 prisma db push 时出错：', error.message);
    } else {
      console.error('错误：', error.message);
    }
    process.exit(1);
  }
}

// 执行主函数
main();
