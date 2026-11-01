const { cmd } = require('../leviano');
const { updateUserConfig } = require('../lib/database');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');

const MAX_IMAGE_BYTES = 1.5 * 1024 * 1024; // keep the database document small

// Only the account that paired this bot (isMe) may change its menu name/image.
// Settings are stored per bot number, so other bots are never affected.
const adminOnly = (isMe, reply) => {
    if (!isMe) {
        reply("*ONLY THE ADMIN OF THIS BOT CAN CHANGE THIS* 🔒");
        return false;
    }
    return true;
};

const saveConfig = async (botNumber, userConfig, changes) => {
    const newConfig = { ...userConfig, ...changes };
    await updateUserConfig(botNumber, newConfig);
    Object.assign(userConfig, changes);
};

cmd({
    pattern: "setbotname",
    alias: ["setmenuname"],
    desc: "Change the bot name shown in this bot's menu (admin only)",
    category: "settings",
    react: "✏️",
}, async (conn, mek, m, { args, q, isMe, botNumber, userConfig, reply }) => {
    if (!adminOnly(isMe, reply)) return;
    const name = (q || '').trim();
    if (!name) return reply("*Usage:* setbotname <name>\nExample: setbotname MY BOT");
    if (name.length > 30) return reply("❌ Name must be 30 characters or less.");
    try {
        await saveConfig(botNumber, userConfig, { BOT_MENU_NAME: name });
        return reply(`✅ Menu name changed to: *${name}*`);
    } catch (e) {
        console.error(e);
        return reply("❌ Error while saving to database.");
    }
});

cmd({
    pattern: "setbotimage",
    alias: ["setmenuimage"],
    desc: "Change the menu image of this bot (admin only). Reply to an image, or give a URL.",
    category: "settings",
    react: "🖼️",
}, async (conn, mek, m, { from, args, isMe, botNumber, userConfig, reply }) => {
    if (!adminOnly(isMe, reply)) return;
    try {
        const ctxInfo = mek.message?.extendedTextMessage?.contextInfo;
        const quoted = ctxInfo?.quotedMessage;

        // Case 1: a direct URL
        const url = args[0];
        if (url && /^https?:\/\//i.test(url)) {
            await saveConfig(botNumber, userConfig, { BOT_MENU_IMAGE: url, BOT_MENU_IMAGE_B64: null });
            return reply("✅ Menu image updated.");
        }

        // Case 2: an image sent with the command, or a reply to an image
        let source = null;
        if (mek.message?.imageMessage) source = mek;
        else if (quoted?.imageMessage) {
            source = {
                key: { remoteJid: from, id: ctxInfo.stanzaId, participant: ctxInfo.participant, fromMe: false },
                message: quoted,
            };
        }
        if (!source) {
            return reply("*Usage:* reply to an image with setbotimage, or use setbotimage <image-url>");
        }

        const buffer = await downloadMediaMessage(source, 'buffer', {}, { reuploadRequest: conn.updateMediaMessage });
        if (!buffer || buffer.length === 0) return reply("❌ Could not read that image.");
        if (buffer.length > MAX_IMAGE_BYTES) return reply("❌ Image is too large. Use an image under 1.5 MB.");

        await saveConfig(botNumber, userConfig, {
            BOT_MENU_IMAGE_B64: buffer.toString('base64'),
            BOT_MENU_IMAGE: null,
        });
        return reply("✅ Menu image updated.");
    } catch (e) {
        console.error(e);
        return reply("❌ Error while updating the image.");
    }
});

cmd({
    pattern: "resetbot",
    alias: ["resetmenu"],
    desc: "Restore this bot's default menu name and image (admin only)",
    category: "settings",
    react: "♻️",
}, async (conn, mek, m, { isMe, botNumber, userConfig, reply }) => {
    if (!adminOnly(isMe, reply)) return;
    try {
        await saveConfig(botNumber, userConfig, {
            BOT_MENU_NAME: null,
            BOT_MENU_IMAGE: null,
            BOT_MENU_IMAGE_B64: null,
        });
        return reply("✅ Menu name and image restored to default.");
    } catch (e) {
        console.error(e);
        return reply("❌ Error while saving to database.");
    }
});
