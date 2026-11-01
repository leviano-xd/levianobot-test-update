const { cmd, commands } = require("../leviano");
const moment = require("moment-timezone");
const { fakevCard } = require('../lib/fakevCard');

cmd({
    pattern: "menu",
    alias: ["commandlist", "allmenu", "help"],
    desc: "Fetch and display all available bot commands",
    category: "system",
    filename: __filename,
}, async (conn, mek, m, { reply, userConfig }) => {
    try {
        let totalCommands = 0;
        let grouped = {};

        // Group commands by category
        for (const cmd of commands) {
            if (!cmd.pattern || !cmd.category) continue;

            totalCommands++;
            if (!grouped[cmd.category]) grouped[cmd.category] = [];
            grouped[cmd.category].push(cmd.pattern);
        }

        let menuText = "";
        for (const cat in grouped) {
            menuText += `\n🧚‍♀️ *${cat.toUpperCase()}*\n`;
            menuText += grouped[cat].map(c => `🍒 ${c}`).join("\n") + "\n";
        }

        const time = moment().tz("Africa/Kampala").format("HH:mm:ss");
        const date = moment().tz("Africa/Kampala").format("dddd, MMMM Do YYYY");

        const menuName = userConfig.BOT_MENU_NAME || "LEVIANO-XD";
        const menuImage = userConfig.BOT_MENU_IMAGE_B64
            ? Buffer.from(userConfig.BOT_MENU_IMAGE_B64, 'base64')
            : { url: userConfig.BOT_MENU_IMAGE || "https://levianoxd.orionbey76.workers.dev/f/Img-1793369696735.jpg" };

        const caption = `
╭━━━《 *${menuName}* 》━━━┈⊷
┃ ✦╭─────────────┈⊷
┃ ✦│▸ Total Commands : *${totalCommands}*
┃ ✦│▸ Time           : ${time}
┃ ✦│▸ Date           : ${date}
┃ ✦│▸ Platform       : arslanmd.xo.je
┃ ✦╰─────────────┈⊷
╰━━━━━━━━━━━━┈⊷
${menuText}
`.trim();

        await conn.sendMessage(m.chat, {
            image: menuImage,
            caption,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                mentionedJid: [m.sender],
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363407983133153@newsletter",
                    newsletterName: "𝗟𝗘𝗩𝗜𝗔𝗡𝗢-𝗫𝗗 𝗠𝗶𝗻𝗶 𝗩²",
                    serverMessageId: 2,
                },
            },
        }, { quoted: fakevCard });

    } catch (err) {
        console.error("AllMenu Error:", err);
        reply("❌ Error while generating menu.");
    }
});
