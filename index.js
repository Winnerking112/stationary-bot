const mineflayer = require('mineflayer');
const http = require('http');

// 🟢 1. Web server to keep Render running for free
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot is running 24/7!\n');
});
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Web server listening on port ${PORT}`);
});

// 🟢 2. Mineflayer Bot Connection Settings
const bot = mineflayer.createBot({
  host: 'VIFGang2.aternos.me',
  port: 64831,
  username: 'Stationary_Worker',
  checkTimeoutInterval: 60 * 1000
});

let mineInterval = null;

bot.on('spawn', () => {
  console.log('🤖 Bot joined successfully!');
  if (mineInterval) clearInterval(mineInterval);

  mineInterval = setInterval(() => {
    const block = bot.blockAtCursor(4);
    if (block && bot.canDigBlock(block)) {
      bot.dig(block, err => {
        if (err) console.log('Digging interrupted.');
      });
    }
  }, 1200);
});

// Direction commands via chat
bot.on('chat', (username, message) => {
  if (username === bot.username) return;
  const command = message.toLowerCase().trim();
  
  if (command === '!north') bot.look(Math.PI, 0);
  if (command === '!south') bot.look(0, 0);
  if (command === '!east') bot.look(-Math.PI / 2, 0);
  if (command === '!west') bot.look(Math.PI / 2, 0);
});

bot.on('error', err => console.log('Bot Error:', err));
bot.on('kicked', reason => console.log('Kicked for:', reason));
bot.on('end', () => console.log('Disconnected from server.'));
