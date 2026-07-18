const mineflayer = require('mineflayer');

const bot = mineflayer.createBot({
  host: 'YOUR_SERVER_IP_HERE', // 🟢 Put your server IP here
  port: 25565,                  // 🟢 Put your server port here
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