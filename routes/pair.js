const zlib = require('zlib');
const { makeid } = require('../utils/id');
const express = require('express');
const fs = require('fs-extra');
let router = express.Router();
const pino = require('pino');
const { Boom } = require('@hapi/boom');

const {
  default: makeWASocket,
  useMultiFileAuthState,
  delay,
  makeCacheableSignalKeyStore,
  Browsers,
  DisconnectReason
} = require('@whiskeysockets/baileys');

// 🧹 Remove temp folder
function removeFile(FilePath) {
  if (!fs.existsSync(FilePath)) return false;
  fs.rmSync(FilePath, { recursive: true, force: true });
}

router.get('/', async (req, res) => {
  let num = req.query.number;
  const id = makeid();

  async function ALI_MD() {
    const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);

    try {
      let Smd = makeWASocket({
        auth: {
          creds: state.creds,
          keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' }).child({ level: 'fatal' })),
        },
        printQRInTerminal: false,
        logger: pino({ level: 'fatal' }).child({ level: 'fatal' }),
        browser: Browsers.macOS('Safari'),
      });

      if (!Smd.authState.creds.registered) {
        await delay(1500);
        num = num.replace(/[^0-9]/g, '');
        const code = await Smd.requestPairingCode(num);
        if (!res.headersSent) {
          await res.send({ code });
        }
      }

      Smd.ev.on('creds.update', saveCreds);
      Smd.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'open') {
          console.log('✅ Connected successfully');

          const sessionPath = `./temp/${id}/creds.json`;

          // Wait until file exists
          while (!fs.existsSync(sessionPath)) await delay(3000);

          const data = await fs.promises.readFile(sessionPath);

          // Compress + Encode
          const compressed = zlib.gzipSync(data);
          const encoded = compressed.toString('base64');

          // Try to get profile picture
          let pfp;
          try {
            pfp = await Smd.profilePictureUrl(Smd.user.id, 'image');
          } catch {
            pfp = 'https://files.catbox.moe/6ku0eo.jpg';
          }

          // 🟢 1st message — session id
          await Smd.sendMessage(Smd.user.id, {
            text: `✅ *Session Created Successfully!*\n\n🔐 *Session ID:*\n\n\`\`\`ALI-MD≈${encoded}\`\`\`\n\n🎯 *Copy and paste in your config.SESSION_ID*`,
          });

          await delay(1500);

          // 🟣 2nd message — with ExternalAdReply
          await Smd.sendMessage(Smd.user.id, {
            text: '✨ *Thank you for using ALI MD Session Generator!* 💫\n\n🔗 Join our official channel for updates:',
            contextInfo: {
              externalAdReply: {
                title: '💠 ALI MD SESSION GENERATOR 💠',
                body: 'Powerful. Fast. Secure. 🔐',
                thumbnailUrl: pfp,
                sourceUrl: 'https://whatsapp.com/channel/0029VaoRxGmJpe8lgCqT1T2h',
                mediaType: 1,
                renderLargerThumbnail: true,
              },
            },
          });

          await delay(5000);
          await Smd.ws.close();
          removeFile('./temp/' + id);
        }

        if (connection === 'close') {
          const reason = new Boom(lastDisconnect?.error)?.output.statusCode;
          console.log('Connection closed:', reason);
        }
      });
    } catch (err) {
      console.log('❌ Error in ALI_MD function:', err);
      await fs.emptyDirSync(__dirname + '/auth_info_baileys');
      if (!res.headersSent) {
        await res.send({ code: 'Try After Few Minutes' });
      }
    }
  }

  await ALI_MD();
});

module.exports = router;
