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
const NEWS_API_KEY = process.env.NEWS_API_KEY || 'xxxxxxxxxxxxxxxx'; // 你的 API key

const metaInfo = execSync(
  'curl -s https://speed.cloudflare.com/meta | awk -F\\" \'{print $26"-"$18}\' | sed -e \'s/ /_/g\'',
  { encoding: 'utf-8' }
);
const ISP = metaInfo.trim();

const httpServer = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Stop the War in Gaza</title>
<style>
  /* 引入 Google Fonts */
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Roboto', sans-serif;
  background: linear-gradient(to right, #e0f7fa, #f1f8e9);
  color: #333;
  text-align: center;
  padding: 60px 20px;
  line-height: 1.6;
}

h1 {
  font-size: 3rem;
  color: #d32f2f;
  font-weight: 700;
  margin-bottom: 20px;
  letter-spacing: 1px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 2rem;
  color: #1976d2;
  margin: 50px 0 25px;
}

p {
  font-size: 1.15rem;
  max-width: 700px;
  margin: 15px auto;
  color: #444;
}

a {
  color: #1565c0;
  text-decoration: none;
  transition: all 0.3s ease;
}
a:hover {
  color: #0d47a1;
  text-decoration: underline;
}

#google_translate_element {
  background: #fff;
  padding: 10px 15px;
  margin: 20px auto;
  border-radius: 8px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  display: inline-block;
}

#news {
  margin-top: 60px;
}

.article {
  background: #ffffff;
  margin: 25px auto;
  padding: 25px;
  max-width: 850px;
  border-radius: 14px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
  text-align: left;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.article:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.2);
}

.article img {
  width: 100%;
  height: auto;
  border-radius: 10px;
  margin-bottom: 18px;
}

.article h3 {
  font-size: 1.6rem;
  color: #222;
  margin-bottom: 10px;
}

.article p.description {
  font-style: normal;         /* 取消斜体 */
  font-weight: 700;           /* 加粗 */
  font-size: 1.2rem;          /* 字体变大 */
  color: #333;                /* 字体颜色更深 */
  margin-bottom: 12px;
}

.donate-button {
  display: inline-block;
  background-color: #D32F2F;
  color: white;
  padding: 14px 28px;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  text-decoration: none;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.donate-button:hover {
  background-color: #B71C1C;
  transform: scale(1.05);
  text-decoration: none;
}

.article p.content {
  color: #555;
  line-height: 1.7;
  margin-bottom: 15px;
}

.article a.read-more {
  display: inline-block;
  padding: 10px 18px;
  border: 2px solid #1976d2;
  color: #1976d2;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.article a.read-more:hover {
  background-color: #1976d2;
  color: #fff;
}

iframe {
  width: 100%;
  height: 340px;
  border-radius: 10px;
  margin-top: 15px;
}

@media (max-width: 768px) {
  h1 {
    font-size: 2.2rem;
  }

  h2 {
    font-size: 1.6rem;
  }

  p {
    font-size: 1rem;
  }

  .article {
    padding: 20px;
    margin: 20px 10px;
  }

  .article h3 {
    font-size: 1.4rem;
  }

  iframe {
    height: 220px;
  }
}

@media (max-width: 480px) {
  body {
    padding: 30px 10px;
  }

  h1 {
    font-size: 2rem;
  }

  .article {
    padding: 18px;
    margin: 15px 5px;
  }
}
</style>
      </head>
      <body>
        <!-- Google Translate Widget -->
        <div id="google_translate_element"></div>

        <h1>Gaza is in crisis</h1>
        <p>Families are once again fleeing for their lives in search of safety. Homes are destroyed. Basic necessities - food, clean water, and medicine - are quickly running out.</p>
        <p>
          <a class="donate-button" href="https://donate.unrwa.org/int/en/gaza" target="_blank" rel="noopener">
            Donate to UNRWA Now
          </a>
        </p>

        <div id="news">
          <h2>Live News Updates on Gaza</h2>
          <div id="news-list"><div>Loading news...</div></div>
        </div>

        <!-- Google Translate Script -->
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
          function fetchNews() {
            fetch('/news')
              .then(function(response) {
                return response.json();
              })
              .then(function(data) {
                var newsList = document.getElementById('news-list');
                newsList.innerHTML = '';

                for (var i = 0; i < data.articles.length; i++) {
                  var article = data.articles[i];
                  var div = document.createElement('div');
                  div.className = 'article';

                  var html = '<h3><a href="' + article.url + '" target="_blank">' + article.title + '</a></h3>';
                  html += '<p><strong>' + new Date(article.publishedAt).toLocaleString() + '</strong></p>';

                  if (article.urlToImage) {
                    html += '<img src="' + article.urlToImage + '" alt="News Image">';
                  }

                  if (article.description) {
                    html += '<p class="description">' + article.description + '</p>';
                  }

                  if (article.content) {
                    html += '<p class="content">' + article.content.replace(/\[+\d+ chars\]/, '...') + '</p>';
                  }

                  html += '<p><a class="read-more" href="' + article.url + '" target="_blank" rel="noopener">Read more</a></p>';

                  if (article.url.indexOf("youtube.com/watch") !== -1) {
                    var videoId = article.url.split("v=")[1];
                    if (videoId) {
                      html += '<iframe src="https://www.youtube.com/embed/' + videoId + '" frameborder="0" allowfullscreen></iframe>';
                    }
                  }

                  div.innerHTML = html;
                  newsList.appendChild(div);
                }
              })
              .catch(function(error) {
                document.getElementById('news-list').innerText = 'Failed to load news.';
                console.error('Error loading news:', error);
              });
          }

          fetchNews();
          setInterval(fetchNews, 600000); // Refresh every 10 minutes
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
      'Content-Type': 'application/json',
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
        if (apiRes.statusCode !== 200) {
          console.error(`NewsAPI returned status code ${apiRes.statusCode}:`, data);
          res.writeHead(500);
          res.end(JSON.stringify({ error: `NewsAPI error: ${apiRes.statusCode}` }));
          return;
        }

        try {
          JSON.parse(data); // 确保是合法 JSON
          res.end(data);
        } catch (error) {
          console.error('Failed to parse NewsAPI JSON:', error);
          res.writeHead(500);
          res.end(JSON.stringify({ error: 'Failed to parse NewsAPI response' }));
        }
      });
    }).on('error', (error) => {
      console.error('Error fetching NewsAPI:', error);
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Failed to fetch news' }));
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
    } else {
      const fullURL = `https://${DOMAIN}`;
      const command = `curl -X POST "https://www.google.com" -H "Content-Type: application/json" -d '{"url": "${fullURL}"}'`;
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error('Error sending request:', error.message);
          return;
        }
        console.log('Automatic Access Task added successfully:', stdout);
      });
    }
  } catch (error) {
    console.error('Error added Task:', error.message);
  }
}

httpServer.listen(PORT, () => {
  addAccessTask();
  console.log(`Server is running on port ${PORT}`);
});
