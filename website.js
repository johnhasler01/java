const os = require('os');
const http = require('http');
const https = require('https');
const net = require('net');
const { Buffer } = require('buffer');
const { exec, execSync } = require('child_process');
const { WebSocket, createWebSocketStream } = require('ws');

const UUID = process.env.UUID || '5f8069c4-869c-4a70-88e4-04eadc9fb913';
const DOMAIN = process.env.DOMAIN || '1234.abc.com';
const AUTO_ACCESS = process.env.AUTO_ACCESS || false;
const SUB_PATH = process.env.SUB_PATH || 'link';
const NAME = process.env.NAME || 'Vls';
const PORT = process.env.PORT || 2600;
const NEWS_API_KEY = process.env.NEWS_API_KEY || 'xxxxxxxxxxxxxxxx'; // 替换为真实 API key

let ISP = 'Unknown';
try {
  const metaInfo = execSync(
    'curl -s https://speed.cloudflare.com/meta | awk -F\\" \'{print $26"-"$18}\' | sed -e \'s/ /_/g\'',
    { encoding: 'utf-8' }
  );
  ISP = metaInfo.trim() || 'Unknown';
} catch (error) {
  console.error('Failed to fetch Cloudflare meta:', error.message);
}

const httpServer = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Stop the War in Gaza</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
          body {
            font-family: 'Roboto', Arial, sans-serif;
            text-align: center;
            padding: 60px 20px;
            background: linear-gradient(135deg, #F5F7FA 0%, #E6F7FF 100%);
            color: #333;
            line-height: 1.6;
            scroll-behavior: smooth;
            margin: 0;
          }
          h1 {
            color: #D32F2F;
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 1px;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
          }
          h2 {
            color: #1E88E5;
            font-size: 1.8rem;
            font-weight: 500;
            margin: 40px 0 20px;
          }
          p {
            font-size: 1.1rem;
            max-width: 700px;
            margin: 15px auto;
            color: #444;
          }
          a {
            color: #1E88E5;
            text-decoration: none;
            transition: color 0.3s ease, transform 0.2s ease;
          }
          a:hover {
            color: #1565C0;
            text-decoration: underline;
            transform: scale(1.05);
          }
          #news {
            margin-top: 60px;
          }
          .article {
            background: #FFFFFF;
            margin: 20px auto;
            padding: 20px;
            max-width: 800px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            text-align: left;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .article:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
          }
          .article img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            margin-bottom: 15px;
          }
          .article h3 {
            margin: 0 0 10px;
            font-size: 1.5rem;
            font-weight: 500;
            color: #333;
          }
          .article p.description {
            font-style: italic;
            color: #666;
            margin-bottom: 10px;
          }
          .article p.content {
            color: #555;
            line-height: 1.7;
            margin-bottom: 15px;
          }
          .article a.read-more {
            font-weight: 500;
            color: #1E88E5;
            display: inline-block;
            padding: 8px 16px;
            border: 1px solid #1E88E5;
            border-radius: 5px;
            transition: background-color 0.3s ease, color 0.3s ease;
          }
          .article a.read-more:hover {
            background-color: #1E88E5;
            color: #FFFFFF;
            text-decoration: none;
          }
          .donate-button {
            display: inline-block;
            padding: 12px 24px;
            background: #D32F2F;
            color: #FFFFFF;
            font-weight: 500;
            border-radius: 8px;
            transition: background 0.3s ease;
          }
          .donate-button:hover {
            background: #B71C1C;
            text-decoration: none;
            transform: scale(1.1);
          }
          iframe {
            width: 100%;
            height: 315px;
            border-radius: 8px;
            margin-top: 15px;
          }
          #google_translate_element {
            margin: 20px auto;
            padding: 10px;
            background: #FFFFFF;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            max-width: 300px;
          }
          .error-message {
            color: #D32F2F;
            font-weight: 500;
            margin: 20px auto;
            max-width: 700px;
          }
          @media (max-width: 768px) {
            h1 { font-size: 2rem; }
            h2 { font-size: 1.5rem; }
            p { font-size: 1rem; }
            .article { padding: 15px; margin: 15px 10px; }
            .article h3 { font-size: 1.3rem; }
            iframe { height: 200px; }
          }
          @media (max-width: 480px) {
            body { padding: 30px 15px; }
            h1 { font-size: 1.8rem; }
            .article { margin: 10px 5px; }
          }
        </style>
      </head>
      <body>
        <div id="google_translate_element"></div>
        <h1>Gaza is in crisis</h1>
        <p>Families are once again fleeing for their lives in search of safety. Homes are destroyed. Basic necessities - food, clean water, and medicine - are quickly running out.</p>
        <p><a href="https://donate.unrwa.org/int/en/gaza" target="_blank" class="donate-button">Donate to UNRWA Now</a></p>
        <div id="news">
          <h2>Live News Updates on Gaza</h2>
          <div id="news-list"><div>Loading news...</div></div>
        </div>
        <script type="text/javascript">
          function googleTranslateElementInit() {
            new google.translate.TranslateElement({
              pageLanguage: 'en',
              includedLanguages: 'ar,zh-CN,zh-TW,fr,es,de,ja,ko,ru,hi',
              layout: google.translate.TranslateElement.InlineLayout.SIMPLE
            }, 'google_translate_element');
          }
        </script>
        <script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
        <script>
          function escapeHTML(str) {
            return String(str || '').replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>').replace(/"/g, '"').replace(/'/g, ''');
          }
          function fetchNews() {
            const newsList = document.getElementById('news-list');
            newsList.innerHTML = '<div>Loading news...</div>'; // 确保初始状态
            fetch('/news')
              .then(response => {
                if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
              })
              .then(data => {
                console.log('NewsAPI response:', data); // 调试：记录完整响应
                if (data.status !== 'ok' || !Array.isArray(data.articles)) {
                  throw new Error(`Invalid NewsAPI response: ${data.message || 'No articles found'}`);
                }
                newsList.innerHTML = ''; // 清空加载提示
                if (data.articles.length === 0) {
                  newsList.innerHTML = '<p class="error-message">No news articles available.</p>';
                  return;
                }
                data.articles.forEach((article, index) => {
                  try {
                    console.log(`Processing article ${index}:`, article.title); // 调试：记录每篇文章
                    const div = document.createElement('div');
                    div.className = 'article';

                    // 标题
                    const title = document.createElement('h3');
                    const titleLink = document.createElement('a');
                    titleLink.href = article.url || '#';
                    titleLink.target = '_blank';
                    titleLink.textContent = article.title || 'Untitled';
                    title.appendChild(titleLink);
                    div.appendChild(title);

                    // 日期
                    const date = document.createElement('p');
                    date.innerHTML = '<strong>' + escapeHTML(new Date(article.publishedAt).toLocaleString()) + '</strong>';
                    div.appendChild(date);

                    // 图片
                    if (article.urlToImage) {
                      const img = document.createElement('img');
                      img.src = article.urlToImage;
                      img.alt = 'News Image';
                      img.loading = 'lazy';
                      div.appendChild(img);
                    }

                    // 描述
                    if (article.description) {
                      const desc = document.createElement('p');
                      desc.className = 'description';
                      desc.textContent = article.description;
                      div.appendChild(desc);
                    }

                    // 正文
                    if (article.content) {
                      let cleanedContent = article.content.replace(/\[.*?\]|\[.*$/g, '').replace(/\s*\.\.\.\s*$/, '');
                      cleanedContent = cleanedContent.trim();
                      if (cleanedContent.length > 200) {
                        cleanedContent = cleanedContent.substring(0, 200).trim();
                      }
                      if (cleanedContent && !cleanedContent.endsWith('...')) {
                        cleanedContent += '...';
                      }
                      const content = document.createElement('p');
                      content.className = 'content';
                      content.textContent = cleanedContent || 'Content unavailable';
                      div.appendChild(content);
                    }

                    // 阅读更多
                    const readMore = document.createElement('p');
                    const readMoreLink = document.createElement('a');
                    readMoreLink.className = 'read-more';
                    readMoreLink.href = article.url || '#';
                    readMoreLink.target = '_blank';
                    readMoreLink.rel = 'noopener';
                    readMoreLink.textContent = 'Read more';
                    readMore.appendChild(readMoreLink);
                    div.appendChild(readMore);

                    // YouTube 视频
                    if (article.url && (article.url.includes('youtube.com/watch') || article.url.includes('youtu.be'))) {
                      let videoId = null;
                      if (article.url.includes('youtube.com/watch')) {
                        const urlParams = new URLSearchParams(article.url.split('?')[1]);
                        videoId = urlParams.get('v');
                      } else if (article.url.includes('youtu.be')) {
                        videoId = article.url.split('/').pop().split('?')[0];
                      }
                      if (videoId) {
                        const iframe = document.createElement('iframe');
                        iframe.src = `https://www.youtube.com/embed/${escapeHTML(videoId)}`;
                        iframe.frameBorder = '0';
                        iframe.allowFullscreen = true;
                        div.appendChild(iframe);
                      }
                    }

                    newsList.appendChild(div);
                  } catch (error) {
                    console.error(`Error processing article ${index}:`, error.message, article);
                  }
                });
              })
              .catch(error => {
                console.error('Error loading news:', error.message);
                newsList.innerHTML = '<p class="error-message">Failed to load news: ' + escapeHTML(error.message) + '</p>';
              });
          }
          fetchNews();
          setInterval(fetchNews, 600000); //30m
        </script>
      </body>
      </html>
    `);
  } else if (req.url === `/${SUB_PATH}`) {
    const vlessURL = `vless://${UUID}@104.18.8.53:443?encryption=none&security=tls&sni=${DOMAIN}&type=ws&host=${DOMAIN}&path=%2F#${NAME}-${ISP}`;
    const base64Content = Buffer.from(vlessURL).toString('base64');
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(base64Content + '\n');
  } else if (req.url.startsWith('/news')) {
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    });
    const newsApiUrl = `https://newsapi.org/v2/everything?q=gaza&sortBy=publishedAt&language=en&pageSize=20&apiKey=${NEWS_API_KEY}`;
    const options = {
      headers: {
        'User-Agent': 'StandWithGaza/1.0 (https://stand-with-gaza.onrender.com)'
      }
    };
    https.get(newsApiUrl, options, (apiRes) => {
      let data = '';
      apiRes.on('data', (chunk) => {
        data += chunk;
      });
      apiRes.on('end', () => {
        console.log('NewsAPI status:', apiRes.statusCode);
        if (apiRes.statusCode !== 200) {
          console.error(`NewsAPI returned status code ${apiRes.statusCode}:`, data);
          res.writeHead(500);
          res.end(JSON.stringify({ error: `NewsAPI error: ${apiRes.statusCode}`, details: data }));
          return;
        }
        try {
          const parsedData = JSON.parse(data);
          console.log('NewsAPI parsed data:', parsedData);
          res.end(JSON.stringify(parsedData));
        } catch (error) {
          console.error('Failed to parse NewsAPI JSON:', error.message, data);
          res.writeHead(500);
          res.end(JSON.stringify({ error: 'Failed to parse NewsAPI response', details: error.message }));
        }
      });
    }).on('error', (error) => {
      console.error('Error fetching NewsAPI:', error.message);
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Failed to fetch news', details: error.message }));
    });
  }
});

const wss = new WebSocket.Server({ server: httpServer });
const uuid = UUID.replace(/-/g, "");

wss.on('connection', ws => {
  ws.once('message', msg => {
    const [VERSION] = msg;
    const id = msg.slice(1, 17);
    if (!id.every((v, i) => v == parseInt(uuid.substr(i * 2, 2), 16))) return;
    let i = msg.slice(17, 18).readUInt8() + 19;
    const port = msg.slice(i, i += 2).readUInt16BE(0);
    const ATYP = msg.slice(i, i += 1).readUInt8();
    const host = ATYP == 1 ? msg.slice(i, i += 4).join('.') :
      (ATYP == 2 ? new TextDecoder().decode(msg.slice(i + 1, i += 1 + msg.slice(i, i + 1).readUInt8())) :
      (ATYP == 3 ? msg.slice(i, i += 16).reduce((s, b, i, a) => (i % 2 ? s.concat(a.slice(i - 1, i + 1)) : s), []).map(b => b.readUInt16BE(0).toString(16)).join(':') : ''));
    ws.send(new Uint8Array([VERSION, 0]));
    const duplex = createWebSocketStream(ws);
    net.connect({ host, port }, function() {
      this.write(msg.slice(i));
     あなた
duplex.on('error', () => {}).pipe(this).on('error', () => {}).pipe(duplex);
    }).on('error', () => {});
  }).on('error', () => {});
});

async function addAccessTask() {
  if (!AUTO_ACCESS) return;
  try {
    if (!DOMAIN) {
      console.log('URL is empty. Skip Adding Automatic Access Task');
      return;
    }
    const fullURL = `https://${DOMAIN}`;
    console.log(`Simulating POST request to add access for ${fullURL}`);
  } catch (error) {
    console.error('Error adding access task:', error.message);
  }
}

httpServer.listen(PORT, () => {
  addAccessTask();
  console.log(`Server is running on port ${PORT}`);
});
