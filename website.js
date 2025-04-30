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
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 40px;
            background-color: #e6f7ff; 
            color: #333;
          }
          h1 {
            color: #d32f2f;
          }
          p {
            font-size: 1.2em;
            max-width: 600px;
            margin: 20px auto;
          }
          a {
            color: #1976d2;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          #news {
            margin-top: 50px;
          }
          .article {
            background: #fff;
            margin: 20px auto;
            padding: 15px;
            max-width: 700px;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            text-align: left;
          }
          .article img {
            max-width: 100%;
            height: auto;
            border-radius: 6px;
          }
          .article h3 {
            margin-top: 0;
          }
          iframe {
            width: 100%;
            height: 315px;
            margin-top: 10px;
          }
          #google_translate_element {
            margin: 20px auto;
          }
          .article p.description {
            font-style: italic;
            color: #444;
          }
          .article p.content {
            color: #555;
            line-height: 1.5;
          }
          .article a.read-more {
            font-weight: bold;
            color: #1976d2;
          }
        </style>
      </head>
      <body>
        <!-- Google Translate Widget -->
        <div id="google_translate_element"></div>

        <h1>Gaza is in crisis</h1>
        <p>Families are once again fleeing for their lives in search of safety. Homes are destroyed. Basic necessities - food, clean water, and medicine - are quickly running out.</p>
        <p><a href="https://donate.unrwa.org/int/en/gaza" target="_blank">The donation page for UNRWA</a></p>

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
