
const zlib = require('zlib');
const { makeid } = require('../utils/id');
const express = require('express');
const fs = require('fs-extra');
let router = express.Router();
const pino = require("pino");
const { Boom } = require("@hapi/boom");
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
}

const {
    default: makeWASocket,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers,
    DisconnectReason
} = require("@whiskeysockets/baileys");

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

router.get('/', async (req, res) => {
    let num = req.query.number;

    async function SUHAIL() {
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

            if (!Smd.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                const code = await Smd.requestPairingCode(num);
                if (!res.headersSent) {
                    await res.send({ code });
                }
            }

            Smd.ev.on('creds.update', saveCreds);
            Smd.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect } = s;

                if (connection === "open") {
                    await delay(20000);
                    let data = fs.readFileSync(`./temp/${id}/creds.json`);
                    await delay(8000);

                    // Compress and encode session data
                    let compressedData = zlib.gzipSync(data);
                    let b64data = compressedData.toString('base64');

                    // Send session data first
                    await Smd.sendMessage(Smd.user.id, {
                        text: 'ALI-MD~' + b64data
                    });

                    // Send the random audio URL as a voice note
                    const randomAudioUrl = getRandomAudioUrl();
                    await Smd.sendMessage(Smd.user.id, {
                        audio: { url: randomAudioUrl },
                        mimetype: 'audio/mp4',
                        ptt: true,
                        waveform: [100, 0, 100, 0, 100, 0, 100],
                        fileName: 'shizo',
                        contextInfo: {
                            mentionedJid: [Smd.user.id],
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

                if (connection === "close") {
                    let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
                    if (reason === DisconnectReason.connectionClosed) {
                        console.log("Connection closed!");
                    } else if (reason === DisconnectReason.connectionLost) {
                        console.log("Connection Lost from Server!");
                    } else if (reason === DisconnectReason.restartRequired) {
                        console.log("Restart Required, Restarting...");
                        SUHAIL().catch(err => console.log(err));
                    } else if (reason === DisconnectReason.timedOut) {
                        console.log("Connection TimedOut!");
                    } else {
                        console.log('Connection closed with bot. Please run again.');
                        console.log(reason);
                        await delay(5000);
                        console.log('Attempting to restart service...');
                    }
                }
            });

        } catch (err) {
            console.log("Error in SUHAIL function: ", err);
            console.log("Service error occurred");
            await fs.emptyDirSync(__dirname + '/auth_info_baileys');
            if (!res.headersSent) {
                await res.send({ code: "Try After Few Minutes" });
            }
        }
    }

    await SUHAIL();
});

module.exports = router;
