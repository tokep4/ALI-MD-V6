const zlib = require('zlib');
const { makeid } = require('../utils/id');
const express = require('express');
const fs = require('fs-extra');
let router = express.Router();
const pino = require("pino");
const { Boom } = require("@hapi/boom");
const id = makeid();

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

if (fs.existsSync('./auth_info_baileys')) {
    fs.emptyDirSync('./auth_info_baileys');
}

router.get('/', async (req, res) => {
    let num = req.query.number;

    async function ALI_MD() {
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
                    await delay(5000);
                    const sessionPath = `./temp/${id}/creds.json`;
                    const data = await fs.promises.readFile(sessionPath);

                    // Compress + Encode session
                    const compressedData = zlib.gzipSync(data);
                    const b64data = compressedData.toString('base64');

                    // Get user profile picture
                    let pfp;
                    try {
                        pfp = await Smd.profilePictureUrl(Smd.user.id, 'image');
                    } catch {
                        pfp = 'https://files.catbox.moe/6ku0eo.jpg';
                    }

                    // 🟢 1st Message — Only Session
                    await Smd.sendMessage(Smd.user.id, {
                        text: `✅ *Session Created Successfully!*\n\n🔐 *Session ID:*\n\n\`\`\`ALI-MD≈${b64data}\`\`\`\n\n🎯 *Copy it and set in your config.SESSION_ID*`,
                    });

                    await delay(1000);

                    // 🟣 2nd Message — ExternalAdReply with pfp + text
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

                    await delay(1000);
                    await Smd.ws.close();
                    removeFile('./temp/' + id);
                    return;
                }

                if (connection === "close") {
                    let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
                    console.log("Connection closed:", reason);
                }
            });

        } catch (err) {
            console.log("❌ Error in ALI_MD function:", err);
            await fs.emptyDirSync(__dirname + '/auth_info_baileys');
            if (!res.headersSent) {
                await res.send({ code: "Try After Few Minutes" });
            }
        }
    }

    await ALI_MD();
});

module.exports = router;
