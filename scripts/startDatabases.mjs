import fs from 'fs';
import yaml from 'js-yaml';
import { execSync } from 'child_process';

/**
 * 解析PostgreSQL连接URL，提取必要信息
 * @param {string} url - PostgreSQL连接URL
 * @returns {Object} 解析后的配置信息
 */
function parsePostgresUrl(url) {
  const pattern = /postgresql:\/\/(\w+):(\w+)@([\d.]+):(\d+)\/(\w+)\?.*/;
  const match = url.match(pattern);

  if (!match) {
    throw new Error(`无法解析PostgreSQL URL: ${url}`);
  }

  return {
    user: match[1],
    password: match[2],
    host: match[3],
    port: match[4],
    dbname: match[5],
  };
}

/**
 * 解析Redis连接URL，提取必要信息
 * @param {string} url - Redis连接URL
 * @returns {Object} 解析后的配置信息
 */
function parseRedisUrl(url) {
  const pattern = /redis:\/\/([\d.]+):(\d+)/;
  const match = url.match(pattern);

  if (!match) {
    throw new Error(`无法解析Redis URL: ${url}`);
  }

  return {
    host: match[1],
    port: match[2],
  };
}

/**
 * 检查容器是否存在
 * @param {string} name - 容器名称
 * @returns {boolean} 容器是否存在
 */
function containerExists(name) {
  try {
    execSync(`docker inspect ${name}`, { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * 启动Docker容器
 * @param {string} name - 容器名称
 * @param {string} image - Docker镜像
 * @param {string} portMapping - 端口映射
 * @param {Object} envVars - 环境变量
 */
function startContainer(name, image, portMapping, envVars = {}) {
  try {
    if (containerExists(name)) {
      // 容器已存在，启动它
      console.log(`启动已存在的容器: ${name}`);
      execSync(`docker start ${name}`, { stdio: 'inherit' });
    } else {
      // 容器不存在，创建并启动它
      console.log(`创建并启动新容器: ${name}`);

      // 构建环境变量参数
      const envArgs = Object.entries(envVars)
        .map(([key, value]) => `-e ${key}=${value}`)
        .join(' ');

      const cmd = `docker run -d --name ${name} ${envArgs} -p ${portMapping} ${image}`;
      execSync(cmd, { stdio: 'inherit' });
    }

    console.log(`容器 ${name} 已成功启动`);
  } catch (e) {
    console.error(`启动容器 ${name} 失败:`, e.message);
    process.exit(1);
  }
}

/**
 * 主函数
 */
function main() {
  // 读取配置文件
  try {
    const yamlContent = fs.readFileSync('config.local.yaml', 'utf8');
    const config = yaml.load(yamlContent);

    // 解析数据库配置
    const postgresConfig = parsePostgresUrl(config.db.url);
    const redisConfig = parseRedisUrl(config.redis.url);

    // 启动PostgreSQL容器
    console.log('\n启动PostgreSQL...');
    const pgEnv = {
      POSTGRES_USER: postgresConfig.user,
      POSTGRES_PASSWORD: postgresConfig.password,
      POSTGRES_DB: postgresConfig.dbname,
    };
    startContainer('nestjs-postgres', 'postgres:14', `${postgresConfig.port}:5432`, pgEnv);

    // 启动Redis容器
    console.log('\n启动Redis...');
    startContainer('nestjs-redis', 'redis:alpine', `${redisConfig.port}:6379`);

    console.log('\n所有数据库容器已启动成功');
  } catch (e) {
    if (e.code === 'ENOENT') {
      console.error('错误: 找不到 config.local.yaml 文件');
    } else {
      console.error('错误:', e.message);
    }
    process.exit(1);
  }
}

// 执行主函数
main();
