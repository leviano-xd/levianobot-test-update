const { cmd } = require('../leviano')
const { fetchGif, gifToSticker } = require('../lib/sticker-utils')

cmd({
    pattern: "attp",
    alias: ["attptext", "textsticker", "namesticker", "stickername", "at", "att", "atp"],
    react: "✨",
    desc: "Convert text into animated sticker",
    category: "sticker",
    use: ".attp <text>",
    filename: __filename
},
async (conn, mek, m, { args, reply }) => {
    try {
        if (!args[0]) {
            return reply(
                "*🥺 DO YOU WANT TO CREATE A STICKER OF YOUR NAME?*\n\n" +
                "*Use:* `.attp LEVIANO`\n\n" +
                "*Example:*\n.attp leviano"
            )
        }

        reply("*✨ CREATING YOUR STICKER...*\n*PLEASE WAIT A MOMENT...☺️*")

        const text = encodeURIComponent(args.join(" "))
        const gifBuffer = await fetchGif(
            `https://api-fix.onrender.com/api/maker/attp?text=${text}`
        )

        const sticker = await gifToSticker(gifBuffer)

        await conn.sendMessage(
            m.chat,
            { sticker },
            { quoted: mek }
        )

    } catch (e) {
        console.log("ATTP ERROR:", e)
        reply("*❌ ERROR OCCURRED WHILE CREATING STICKER 🥺*")
    }
})