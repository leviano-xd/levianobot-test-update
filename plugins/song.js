const { cmd } = require("../leviano");
const yts = require("yt-search");
const axios = require("axios");
const { fakevCard } = require('../lib/fakevCard');

/* YouTube link aano ennu nokkunnu, video ID edukkunnu */
const getYtId = (text) => {
  const m = text.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/);
  return m ? m[1] : null;
};

cmd({
  pattern: "song",
  alias: ["ytmp3", "play", "mp3", "gana", "music", "audio"],
  react: "🎵",
  desc: "YouTube search & MP3 play",
  category: "download",
  use: ".song <name or link>",
  filename: __filename
},
async (conn, mek, m, { from, args, reply }) => {
  try {
    const query = args.join(" ").trim();
    if (!query) return reply("❌ Please Provide Me A song Query or Link");

    await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

    let title, dlUrl, thumbnail, videoUrl;
    const id = getYtId(query);

    if (id) {
      /* 🔗 URL aanenkil: ytmp3 API */
      videoUrl = `https://youtu.be/${id}`;
      const res = await axios.get("https://api.nexray.eu.cc/downloader/ytmp3", {
        params: { url: videoUrl },
        timeout: 60000
      });

      if (!res.data?.status || !res.data?.result?.url) {
        return reply("❌ Audio Not Generated");
      }

      title = res.data.result.title;
      dlUrl = res.data.result.url;
      thumbnail = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
    } else {
      /* 🔍 Song name aanenkil: ytplay API */
      const res = await axios.get("https://api.nexray.eu.cc/downloader/ytplay", {
        params: { q: query },
        timeout: 60000
      });

      if (!res.data?.status || !res.data?.result?.download_url) {
        return reply("❌ No result Found");
      }

      title = res.data.result.title;
      dlUrl = res.data.result.download_url;
      thumbnail = res.data.result.thumbnail;
      videoUrl = res.data.result.url;
    }

    /* 🎵 SEND AUDIO */
    await conn.sendMessage(from, {
      audio: { url: dlUrl },
      mimetype: "audio/mpeg",
      ptt: false,
      fileName: `${title || "song"}.mp3`,
      caption:
        `🎵 *${title || "Unknown Title"}*\n\n` +
        `> © Leviano-XD`,
      contextInfo: {
        externalAdReply: {
          title: title ? title.substring(0, 40) : "YouTube Song",
          body: "▶︎ •၊၊||၊|။||||။‌‌‌‌‌၊|• ★彡ʟᴇᴠɪᴀɴᴏ-xᴅ-ʙᴇᴀᴛꜱ彡★",
          thumbnailUrl: thumbnail,
          sourceUrl: videoUrl,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: fakevCard });

    await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

  } catch (err) {
    console.error("PLAY ERROR:", err);
    reply("❌ Error Found Please Try Later");
    await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
  }
});


cmd({
  pattern: "video1",
  alias: ["vid", "ytv"],
  desc: "Download YouTube Video",
  category: "downloader",
  react: "🪄",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) {
      return reply("Please provide a YouTube link or search query.\n\nExample: .video Pasoori");
    }

    let videoUrl;
    if (q.includes("youtube.com") || q.includes("youtu.be")) {
      videoUrl = q;
    } else {
      const search = await yts(q);
      if (!search?.videos?.length) {
        return reply("No results found.");
      }
      videoUrl = search.videos[0].url;
    }

    const res = await axios.get("https://www.neoapis.xyz/api/downloader/ytdl", {
      params: { url: videoUrl, type: "Mp4" },
      timeout: 60000
    });

    if (!res.data?.status || !res.data?.data?.download) {
      return reply("Failed to fetch video.");
    }

    await conn.sendMessage(from, {
      video: { url: res.data.data.download },
      caption: `*❀༒★[ʟᴇᴠɪᴀɴᴏ-ᴍᴅ]★༒❀*\n\n🎬 ${res.data.data.title || ""}`
    }, { quoted: fakevCard });

  } catch (err) {
    reply("Error while fetching video.");
    console.log(err);
  }
});