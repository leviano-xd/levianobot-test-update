const { cmd } = require('../leviano');
const { setAntideleteStatus, getAntideleteStatus } = require('../data/Antidelete');

cmd({
    pattern: "antidelete",
    alias: ["antidel"],
    desc: "Turn Antidelete on/off",
    category: "owner",
    react: "🛡️"
},
async(conn, mek, m, { args, isOwner, reply, from }) => {
    if (!isOwner) return reply("*THIS COMMAND IS ONLY FOR ME 😎*");
    const mode = args[0]?.toLowerCase();

    if (mode === 'on' || mode === 'enable') {
        await setAntideleteStatus(from, true);
        await reply("*👑 ANTI-DELETE ACTIVATED 👑*");
    } else if (mode === 'off' || mode === 'disable') {
        await setAntideleteStatus(from, false);
        await reply("*👑 ANTI-DELETE DEACTIVATED 👑*");
    } else {
        const current = await getAntideleteStatus(from);
        await reply(`*CURRENTLY ANTI-DELETE IS* ${current ? "ON" : "OFF"} 😊*`);
    }
});