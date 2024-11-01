

const util = require('util');
const fs = require('fs-extra');
const axios = require('axios');
const { adams } = require(__dirname + "/../Ibrahim/adams");
const { format } = require(__dirname + "/../Ibrahim/mesfonctions");
const os = require("os");
const moment = require("moment-timezone");
const s = require(__dirname + "/../config");

const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);

const runtime = function (seconds) { 
    seconds = Number(seconds); 
    var d = Math.floor(seconds / (3600 * 24)); 
    var h = Math.floor((seconds % (3600 * 24)) / 3600); 
    var m = Math.floor((seconds % 3600) / 60); 
    var s = Math.floor(seconds % 60); 
    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " d, ") : ""; 
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " h, ") : ""; 
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " m, ") : ""; 
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " s") : ""; 
    return dDisplay + hDisplay + mDisplay + sDisplay; 
};

// GitHub repo data
const fetchGitHubStats = async () => {
    try {
        const repo = 'Devibraah/BWM-XMD';
        const response = await axios.get(`https://api.github.com/repos/${repo}`);
        const forks = response.data.forks_count;
        const stars = response.data.stargazers_count;
        const totalUsers = (forks * 2) + (stars * 2);
        return { forks, stars, totalUsers };
    } catch (error) {
        console.error("Error fetching GitHub stats:", error);
        return { forks: 0, stars: 0, totalUsers: 0 }; 
    }
};

// Array of song URLs for random playback
const songUrls = [
    "sng1.mp3",
    "sng2.mp3",
    "sng3.mp3",
    "sng4.mp3",
    "sng5.mp3"
];

// Function to get a random song from the array
const getRandomSongs = () => {
    const shuffled = songUrls.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
};

// Array of image URLs
const imageUrls = [
    "https://files.catbox.moe/0xa925.jpg",
    "https://files.catbox.moe/k13s7u.jpg",
    "https://files.catbox.moe/h2ydge.jpg"
];

// Function to get a random image from the array
const getRandomImage = () => {
    return imageUrls[Math.floor(Math.random() * imageUrls.length)];
};

// Main bot function
adams({ nomCom: "men", categorie: "General" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre, prefixe, nomAuteurMessage } = commandeOptions;
    let { cm } = require(__dirname + "/../Ibrahim/adams");
    var coms = {};
    var mode = (s.MODE.toLocaleLowerCase() === "public") ? "public" : "Private";

    // Send a random image immediately
    try {
        const randomImage = getRandomImage();
        await zk.sendMessage(dest, {
            image: { url: randomImage },
            caption: "Here is a random image for you!",
            contextInfo: {
                externalAdReply: {
                    thumbnailUrl: randomImage,
                    renderLargerThumbnail: true,
                    mediaType: 1
                }
            }
        });

        // Fetch GitHub stats asynchronously
        const { totalUsers } = await fetchGitHubStats();
        const formattedTotalUsers = totalUsers.toLocaleString();

        // Prepare bot info and menu after sending the image
        moment.tz.setDefault('${s.TZ}');
        const temps = moment().format('HH:mm:ss');
        const date = moment().format('DD/MM/YYYY');
        const hour = moment().hour();
        let greeting = "Good night";
        if (hour >= 0 && hour <= 11) greeting = "Good morning";
        else if (hour >= 12 && hour <= 16) greeting = "Good afternoon";
        else if (hour >= 16 && hour <= 21) greeting = "Good evening";

        // Updated infoMsg with a smaller menu
        let infoMsg = `
        ╭─────═━┈┈━═──━┈⊷
        ┇ ʙᴏᴛ ɴᴀᴍᴇ: *ʙᴍᴡ ᴍᴅ*
        ┇ ᴏᴡɴᴇʀ: ɪʙʀᴀʜɪᴍ ᴀᴅᴀᴍs
        ┇ ᴍᴏᴅᴇ: *${mode}*
        ┇ ᴘʀᴇғɪx: *[ ${prefixe} ]*
        ┇ ᴘʟᴀᴛғᴏʀᴍ: *${os.platform()}*
        ┇ ᴛʏᴘᴇ: *ᴠ6x*
        ┇ ᴅᴀᴛᴇ: *${date}*
        ┇ ᴛɪᴍᴇ: *${temps}*
        ┇ ᴄᴀᴘᴀᴄɪᴛʏ ${format(os.totalmem() - os.freemem())}/${format(os.totalmem())}
        ╰─────═━┈┈━═──━┈⊷\n\n
        🌍 *BEST WHATSAPP BOT* 🌍\n\n`;

        // Simplified menuMsg
        let menuMsg = `${readmore}  
        ╭─── *COMMAND LIST* ───╮\n`;

        Object.keys(coms).sort().forEach((cat) => {
            menuMsg += `\n*${cat}*:\n`;
            coms[cat].forEach((cmd) => {
                menuMsg += `- ${cmd}\n`;
            });
        });
        menuMsg += "\n╰──────────────────╯";

        // Send the main menu message
        await zk.sendMessage(dest, { 
            text: infoMsg + menuMsg,
            contextInfo: {
                mentionedJid: [nomAuteurMessage],
                externalAdReply: {
                    title: "BWM XMD WHATSAPP HELPER",
                    thumbnailUrl: "https://files.catbox.moe/0xa925.jpg",
                    renderLargerThumbnail: true,
                    mediaType: 2
                }
            }
        });

        // Send random songs after the menu
        const songs = getRandomSongs();
        for (const songUrl of songs) {
            await zk.sendMessage(dest, { 
                audio: { 
                    url: songUrl 
                }, 
                mimetype: 'audio/mp4', 
                ptt: false,
                caption: "BMW MD SONG",
                contextInfo: {
                    externalAdReply: {
                        thumbnailUrl: "https://files.catbox.moe/va22vq.jpeg",
                        renderLargerThumbnail: true,
                        mediaType: 1
                    }
                }
            });
        }
    } catch (e) {
        console.log("🥵🥵 Menu error " + e);
        repondre("🥵🥵 Menu error " + e);
    }
});

/*
const util = require('util');
const fs = require('fs-extra');
const axios = require('axios');
const { adams } = require(__dirname + "/../Ibrahim/adams");
const { format } = require(__dirname + "/../Ibrahim/mesfonctions");
const os = require("os");
const moment = require("moment-timezone");
const s = require(__dirname + "/../config");

const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);

const runtime = function (seconds) { 
    seconds = Number(seconds); 
    var d = Math.floor(seconds / (3600 * 24)); 
    var h = Math.floor((seconds % (3600 * 24)) / 3600); 
    var m = Math.floor((seconds % 3600) / 60); 
    var s = Math.floor(seconds % 60); 
    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " d, ") : ""; 
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " h, ") : ""; 
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " m, ") : ""; 
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " s") : ""; 
    return dDisplay + hDisplay + mDisplay + sDisplay; 
};

// Function to fetch GitHub repo data
const fetchGitHubStats = async () => {
    try {
        const repo = 'Devibraah/BWM-XMD';
        const response = await axios.get(`https://api.github.com/repos/${repo}`);
        const forks = response.data.forks_count;
        const stars = response.data.stargazers_count;
        const totalUsers = (forks * 2) + (stars * 2);
        return { forks, stars, totalUsers };
    } catch (error) {
        console.error("Error fetching GitHub stats:", error);
        return { forks: 0, stars: 0, totalUsers: 0 }; 
    }
};

// Array of song URLs for random playback
const songUrls = [
    "https://files.catbox.moe/song1.mp3",
    "https://files.catbox.moe/song2.mp3",
    "https://files.catbox.moe/song3.mp3",
    "https://files.catbox.moe/song4.mp3",
    "https://files.catbox.moe/song5.mp3"
];

// Function to get a random song from the array
const getRandomSongs = () => {
    const shuffled = songUrls.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
};

adams({ nomCom: "men", categorie: "General" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre, prefixe, nomAuteurMessage } = commandeOptions;
    let { cm } = require(__dirname + "/../Ibrahim/adams");
    var coms = {};
    var mode = "public";

    if ((s.MODE).toLocaleLowerCase() != "public") {
        mode = "Private";
    }

    cm.map(async (com) => {
        const categoryUpper = com.categorie.toUpperCase();
        if (!coms[categoryUpper]) coms[categoryUpper] = [];
        coms[categoryUpper].push(com.nomCom);
    });

    moment.tz.setDefault('${s.TZ}');
    const temps = moment().format('HH:mm:ss');
    const date = moment().format('DD/MM/YYYY');
    const hour = moment().hour();
    let greeting = "Good night";
    if (hour >= 0 && hour <= 11) greeting = "Good morning";
    else if (hour >= 12 && hour <= 16) greeting = "Good afternoon";
    else if (hour >= 16 && hour <= 21) greeting = "Good evening";

    const { totalUsers } = await fetchGitHubStats();
    const formattedTotalUsers = totalUsers.toLocaleString();

    // Updated infoMsg with a smaller menu
    let infoMsg = `
╭─────═━┈┈━═──━┈⊷
┇ ʙᴏᴛ ɴᴀᴍᴇ: *ʙᴍᴡ ᴍᴅ*
┇ ᴏᴡɴᴇʀ: ɪʙʀᴀʜɪᴍ ᴀᴅᴀᴍs
┇ ᴍᴏᴅᴇ: *${mode}*
┇ ᴘʀᴇғɪx: *[ ${prefixe} ]*
┇ ᴘʟᴀᴛғᴏʀᴍ: *${os.platform()}*
┇ ᴛʏᴘᴇ: *ᴠ6x*
┇ ᴅᴀᴛᴇ: *${date}*
┇ ᴛɪᴍᴇ: *${temps}*
┇ ᴄᴀᴘᴀᴄɪᴛʏ ${format(os.totalmem() - os.freemem())}/${format(os.totalmem())}
╰─────═━┈┈━═──━┈⊷\n\n
🌍 *BEST WHATSAPP BOT* 🌍\n\n`;

    // Simplified menuMsg
    let menuMsg = `${readmore}  
╭─── *COMMAND LIST* ───╮\n`;

    const sortedCategories = Object.keys(coms).sort();
    sortedCategories.forEach((cat) => {
        menuMsg += `\n*${cat}*:\n`;
        coms[cat].forEach((cmd) => {
            menuMsg += `- ${cmd}\n`;
        });
    });
    menuMsg += "\n╰──────────────────╯";

    try {
        await zk.sendMessage(dest, { 
            text: infoMsg + menuMsg,
            contextInfo: {
                mentionedJid: [nomAuteurMessage],
                externalAdReply: {
                    title: "BWM XMD WHATSAPP HELPER",
                    thumbnailUrl: "https://files.catbox.moe/0xa925.jpg",
                    renderLargerThumbnail: true, // Enlarges the image
                    mediaType: 2
                }
            }
        });

        const songs = getRandomSongs();
        for (const songUrl of songs) {
            await zk.sendMessage(dest, { 
                audio: { 
                    url: songUrl 
                }, 
                mimetype: 'audio/mp4', 
                ptt: false,
                caption: "BMW MD SONG",
                contextInfo: {
                    externalAdReply: {
                        thumbnailUrl: "https://files.catbox.moe/va22vq.jpeg",
                        renderLargerThumbnail: true, // Enlarges the image for the song
                        mediaType: 1
                    }
                }
            });
        }
    } catch (e) {
        console.log("🥵🥵 Menu error " + e);
        repondre("🥵🥵 Menu error " + e);
    }
});
*/
