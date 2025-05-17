// 配置目标容器地址和请求参数
const TARGET_URL = 'https://your-container-endpoint.com'; // 替换为你的容器地址
const TIMEZONE_OFFSET = 8; // 时区偏移（UTC+8，北京时间）
const PAUSE_START_HOUR = 23; // 暂停开始时间（23:00）
const PAUSE_END_HOUR = 6; // 暂停结束时间（6:00）

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 11.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Linux; Android 13; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.6045.163 Mobile Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/120.0.2210.91',
  'Mozilla/5.0 (iPad; CPU OS 16_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Linux; U; Android 12; en-us; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.5845.140 Mobile Safari/537.36',
];

// 生成随机 User-Agent
function getRandomUserAgent() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

// 生成随机延迟（5-15 秒）
function getRandomDelay() {
  return Math.floor(Math.random() * 10000) + 5000;
}

// 检查是否在暂停时间段内
function isInPausePeriod() {
  const now = new Date();
  // 转换为目标时区时间（UTC + TIMEZONE_OVER)
  const localHour = (now.getUTCHours() + TIMEZONE_OFFSET) % 24;
  
  // 检查是否在 23:00 到 6:00 之间
  if (localHour >= PAUSE_START_HOUR || localHour < PAUSE_END_HOUR) {
    return true;
  }
  return false;
}

// 处理 HTTP 请求（手动触发）
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  if (request.url.includes('/keep-alive')) {
    // 检查是否在暂停时间段
    if (isInPausePeriod()) {
      return new Response('In pause period, skipping keep-alive', { status: 200 });
    }

    try {
      const headers = new Headers({
        'User-Agent': getRandomUserAgent(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://www.google.com/',
        'Connection': 'keep-alive',
      });

      const response = await fetch(TARGET_URL, {
        method: 'GET',
        headers: headers,
      });

      if (response.ok) {
        return new Response('Container pinged successfully', { status: 200 });
      } else {
        return new Response('Failed to ping container', { status: 500 });
      }
    } catch (error) {
      return new Response(`Error: ${error.message}`, { status: 500 });
    }
  }

  return new Response('Invalid endpoint', { status: 404 });
}

// 定时触发
addEventListener('scheduled', event => {
  event.waitUntil(triggerKeepAlive());
});

async function triggerKeepAlive() {
  // 检查是否在暂停时间段
  if (isInPausePeriod()) {
    console.log('In pause period, skipping keep-alive');
    return;
  }

  // 随机延迟避免固定模式
  await new Promise(resolve => setTimeout(resolve, getRandomDelay()));

  const headers = new Headers({
    'User-Agent': getRandomUserAgent(),
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Referer': 'https://www.google.com/',
    'Connection': 'keep-alive',
  });

  try {
    const response = await fetch(TARGET_URL, {
      method: 'GET',
      headers: headers,
    });
    console.log(`Pinged container: ${response.status}`);
  } catch (error) {
    console.error(`Error pinging container: ${error}`);
  }
}
