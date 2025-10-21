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
                    await delay(5000);

                    // Compress and encode session data
                    let compressedData = zlib.gzipSync(data);
                    let b64data = compressedData.toString('base64');

                    // ✅ Pehla message: session ID send
                    await Smd.sendMessage(Smd.user.id, {
                        text: 'ALI-MD~' + b64data
                    });

                    // ✅ Dusra message: ExternalAdReply with user PFP
                    let pfp;
                    try {
                        pfp = await Smd.profilePictureUrl(Smd.user.id, 'image');
                    } catch {
                        pfp = 'https://files.catbox.moe/6ku0eo.jpg'; // fallback image
                    }

                    await delay(2000);
                    await Smd.sendMessage(Smd.user.id, {
                        text: `✅ *Session Linked Successfully!*\n\n_Thanks for pairing with ALI-MD_ 💫`,
                        contextInfo: {
                            externalAdReply: {
                                title: '🎯 ALI-MD SESSION CREATED',
                                body: '𝐓𝐇𝐀𝐍𝐊𝐒 𝐅𝐎𝐑 𝐔𝐒𝐈𝐍𝐆 𝐀𝐋𝐈 𝐈𝐍𝐗𝐈𝐃𝐄',
                                thumbnailUrl: pfp,
                                sourceUrl: 'https://whatsapp.com/channel/0029VaoRxGmJpe8lgCqT1T2h',
                                mediaType: 1,
                                renderLargerThumbnail: true,
                            },
                        },
                    });

                    await delay(1000);
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
                    }
                }
            });

        } catch (err) {
            console.log("Error in SUHAIL function: ", err);
            if (!res.headersSent) {
                await res.send({ code: "Try After Few Minutes" });
            }
        }
    }

    await SUHAIL();
});

module.exports = router;
