const mineflayer = require('mineflayer');
const http = require('http');

// 🟢 1. Free Hosting Trick: Create a dummy web server so Render runs it for $0
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot is running 24/7!\n');
});
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Web server listening on port ${PORT}`);
});

// 🟢 2. Your Minecraft Bot Settings (Updated with horsefish address!)
const bot = mineflayer.createBot({
  host: 'horsefish.aternos.host', 
  port: 22540,                  
  username: 'Stationary_Worker'
});

let mineInterval = null;

bot.on('spawn', () => {
  console.log('🤖 Bot joined! Ready for teleportation.');
  if (mineInterval) clearInterval(mineInterval);

  // Automatically mine whatever block it looks at every 1200ms
  mineInterval = setInterval(() => {
    const block = bot.blockAtCursor(4);
    if (block && bot.canDigBlock(block)) {
      bot.dig(block, err => {
        if (err) console.log('Digging interrupted.');
      });
    }
  }, 1200);
});

// Snap direction commands via in-game chat
bot.on('chat', (username, message) => {
  if (username === bot.username) return;
  const command = message.toLowerCase().trim();
  
  if (command === '!north') bot.look(Math.PI, 0);
  if (command === '!south') bot.look(0, 0);
  if (command === '!east') bot.look(-Math.PI / 2, 0);
  if (command === '!west') bot.look(Math.PI / 2, 0);
});

bot.on('error', err => console.log('Bot Error:', err));
bot.on('end', () => console.log('Disconnected.'));
