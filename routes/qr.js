const { exec } = require("child_process");
const express = require('express');
let router = express.Router()
const pino = require("pino");
let { toBuffer } = require("qrcode");
const path = require('path');
const fs = require("fs-extra");
const { Boom } = require("@hapi/boom");
const { makeid } = require('../utils/id');
const zlib = require('zlib');
const id = makeid();


// List of audio URLs
const audioUrls = [
    "https://files.catbox.moe/brusa6.mp4",
      "https://files.catbox.moe/3j1zy4.mp4",
      "https://files.catbox.moe/4g3dwj.mp4",
      "https://files.catbox.moe/su4wyp.mp4",
      "https://files.catbox.moe/8cuz5m.mp4",
      "https://files.catbox.moe/pdjieu.mp4",
      "https://files.catbox.moe/esixn9.mp4",
      "https://files.catbox.moe/dqj2fq.mp4",
      "https://files.catbox.moe/dnyop2.mp4"
];

// Function to get a random audio URL
function getRandomAudioUrl() {
    const randomIndex = Math.floor(Math.random() * audioUrls.length);
    return audioUrls[randomIndex];
};

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
};


  const { default: makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore, delay, Browsers, DisconnectReason } = require("@whiskeysockets/baileys");

// Store active sessions
const activeSessions = new Map();

// Clean up auth directory on start
if (fs.existsSync('./auth_info_baileys')) {
    fs.emptyDirSync('./auth_info_baileys');
}

router.get('/', async (req, res) => {
    const sessionId = Date.now().toString();
         async function generateQRSession() {
           const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);

        try {
            let Smd = makeWASocket({
                 auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
                },
                printQRInTerminal: false,
                logger: pino({ level: "fatal" }).child({ level: "fatal" }),
                browser: Browsers.macOS("Safari"),
            });

            // Store session reference
            activeSessions.set(sessionId, { Smd });

            Smd.ev.on('creds.update', saveCreds);

            Smd.ev.on("connection.update", async (update) => {
                const { connection, lastDisconnect, qr } = update;

                if (qr && !res.headersSent) {
                    try {
                        const qrBuffer = await toBuffer(qr);
                        const qrBase64 = `data:image/png;base64,${qrBuffer.toString('base64')}`;

                        return res.json({
                            success: true,
                            qr: qrBase64,
                            sessionId: sessionId
                        });
                    } catch (error) {
                        console.error("Error generating QR Code:", error);
                        return res.status(500).json({
                            success: false,
                            error: "Failed to generate QR code"
                        });
                    }
                }

                if (connection === "open") {

  await delay(20000);
  let data = fs.readFileSync(`./temp/${id}/creds.json`);
                    await delay(8000);

                    // Compress and encode session data
                    let compressedData = zlib.gzipSync(data); // Compress
                    let b64data = compressedData.toString('base64'); // Base64 encode

                    // Send session data first
     await Smd.sendMessage(Smd.user.id, {
                        text: 'ALI-MD~' + b64data
                    });

                    const randomAudioUrl = getRandomAudioUrl(); // Get a random audio URL
                    await Smd.sendMessage(Smd.user.id, {
                        audio: { url: randomAudioUrl },
                        mimetype: 'audio/mp4', // MIME type for voice notes
                        ptt: true,
                        waveform: [100, 0, 100, 0, 100, 0, 100], // Optional waveform pattern
                        fileName: 'shizo',
                        contextInfo: {
                            mentionedJid: [Smd.user.id], // Mention the sender in the audio message
                            externalAdReply: {
                                title: '𝐓𝐇𝐀𝐍𝐊𝐒 𝐅𝐎𝐑 𝐂𝐇𝐎𝐎𝐒𝐈𝐍𝐆 𝐀𝐋𝐈 𝐌𝐃',
                                body: '𝐑𝐄𝐆𝐀𝐑𝐃𝐒 𝐀𝐋𝐈 𝐈𝐍𝐗𝐈𝐃𝐄',
                                thumbnailUrl: 'https://files.catbox.moe/6ku0eo.jpg',
                                sourceUrl: 'https://whatsapp.com/channel/0029VaoRxGmJpe8lgCqT1T2h',
                                mediaType: 1,
                                renderLargerThumbnail: true,
                            },
                        },
                    });

                    await delay(100);
                    await Smd.ws.close();
                    return await removeFile('./temp/' + id);   
                }

                // Handle connection closures
                if (connection === "close") {
                    let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
                    if (reason === DisconnectReason.connectionClosed) {
                        console.log("Connection closed!");
                    } else if (reason === DisconnectReason.connectionLost) {
                        console.log("Connection Lost from Server!");
                    } else if (reason === DisconnectReason.restartRequired) {
                        console.log("Restart Required, Restarting...");
                        generateQRSession().catch(err => console.log(err));
                    } else if (reason === DisconnectReason.timedOut) {
                        console.log("Connection TimedOut!");
                    } else {
                        console.log('Connection closed with bot. Please run again.');
                        console.log(reason);
                        await delay(5000);
                        exec('pm2 restart qasim');
                    }
                }
            });

        } catch (err) {
            console.log("Error in QR session:", err);
            await fs.emptyDirSync('./auth_info_baileys');
            if (!res.headersSent) {
                res.status(500).json({
                    success: false,
                    error: "Failed to initialize WhatsApp connection"
                });
            }
        }
    }
    await generateQRSession();

});

 
module.exports = router;