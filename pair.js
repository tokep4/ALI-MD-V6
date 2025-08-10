const zlib = require('zlib'); // For compression
const PastebinAPI = require('pastebin-js'),
pastebin = new PastebinAPI('EMWTMkQAVfJa9kM-MRUrxd5Oku1U7pgL');
const { makeid } = require('./id');
const express = require('express');
const fs = require('fs');
let router = express.Router();
const pino = require("pino");
const {
    default: Ibrahim_Adams,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers
} = require("@whiskeysockets/baileys");

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


// List of random facts and quotes
const factsAndQuotes = [
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
    "In the end, we only regret the chances we didn’t take.",
    "The best way to predict the future is to create it. - Peter Drucker",
    "Don’t watch the clock; do what it does. Keep going. - Sam Levenson",
    "Happiness is not something ready made. It comes from your own actions. - Dalai Lama",
    "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle. - Christian D. Larson",
    "Act as if what you do makes a difference. It does. - William James"
];

// Function to get a random audio URL
function getRandomAudioUrl() {
    const randomIndex = Math.floor(Math.random() * audioUrls.length);
    return audioUrls[randomIndex];
}


// Function to get a random fact/quote
function getRandomFactOrQuote() {
    const randomIndex = Math.floor(Math.random() * factsAndQuotes.length);
    return factsAndQuotes[randomIndex];
}

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
};

router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;

    async function BWM_XMD_PAIR_CODE() {
        const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);
        try {
            let Pair_Code_By_Ibrahim_Adams = Ibrahim_Adams({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
                },
                printQRInTerminal: false,
                logger: pino({ level: "fatal" }).child({ level: "fatal" }),
                browser: Browsers.macOS('Chrome')
            });
            if (!Pair_Code_By_Ibrahim_Adams.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                const code = await Pair_Code_By_Ibrahim_Adams.requestPairingCode(num);
                if (!res.headersSent) {
                    await res.send({ code });
                }
            }

            Pair_Code_By_Ibrahim_Adams.ev.on('creds.update', saveCreds);
            Pair_Code_By_Ibrahim_Adams.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect } = s;

                if (connection === "open") {
                    await delay(50000);
                    let data = fs.readFileSync(__dirname + `/temp/${id}/creds.json`);
                    await delay(8000);

                    // Compress and encode session data
                    let compressedData = zlib.gzipSync(data); // Compress
                    let b64data = compressedData.toString('base64'); // Base64 encode

                    // Send session data first
                    let sessionMessage = await Pair_Code_By_Ibrahim_Adams.sendMessage(Pair_Code_By_Ibrahim_Adams.user.id, {
                        text: 'ALI-MD~' + b64data
                    });

                   
                    // Send the random audio URL as a voice note
                    const randomAudioUrl = getRandomAudioUrl(); // Get a random audio URL
                    await Pair_Code_By_Ibrahim_Adams.sendMessage(Pair_Code_By_Ibrahim_Adams.user.id, {
                        audio: { url: randomAudioUrl },
                        mimetype: 'audio/mp4', // MIME type for voice notes
                        ptt: true,
                        waveform: [100, 0, 100, 0, 100, 0, 100], // Optional waveform pattern
                        fileName: 'shizo',
                        contextInfo: {
                            mentionedJid: [Pair_Code_By_Ibrahim_Adams.user.id], // Mention the sender in the audio message
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
                    await Pair_Code_By_Ibrahim_Adams.ws.close();
                    return await removeFile('./temp/' + id);
                } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    await delay(10000);
                    BWM_XMD_PAIR_CODE();
                }
            });
        } catch (err) {
            console.log("service restarted");
            await removeFile('./temp/' + id);
            if (!res.headersSent) {
                await res.send({ code: "Service is Currently Unavailable" });
            }
        }
    }

    return await BWM_XMD_PAIR_CODE();
});

module.exports = router;
