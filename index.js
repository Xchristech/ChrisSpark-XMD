const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const { default: makeWASocket, useMultiFileAuthState } = require('@fizzxydev/baileys-pro');
const P = require('pino');

// Web Server
app.get('/', (req, res) => {
  res.send('CHRISSPARK-XMD bot is live!');
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// WhatsApp Bot Setup
async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('session');
  const sock = makeWASocket({
    logger: P({ level: 'silent' }),
    printQRInTerminal: true,
    auth: state
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection } = update;
    if (connection === 'open') {
      console.log('Bot connected!');
      await sock.sendMessage('2348069675806@s.whatsapp.net', {
        text: '✅ Your WhatsApp Bot (CHRISSPARK-XMD) is connected!'
      });
    }
  });
}

startBot();
  
