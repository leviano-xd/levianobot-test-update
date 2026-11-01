const { cmd } = require('../leviano');
const { updateUserConfig } = require('../lib/database');

// Helper function to update userConfig in memory and database
const updateConfig = async (key, value, botNumber, userConfig, reply) => {
    try {
        // 1. Update in-memory userConfig (Immediate)
        userConfig[key] = value;
        
        // 2. Update in Database (Persistent)
        const newConfig = { ...userConfig }; 
        newConfig[key] = value;
        
        await updateUserConfig(botNumber, newConfig);
        
        return reply(`✅ *${key}* has been updated to: *${value}*`);
    } catch (e) {
        console.error(e);
        return reply("❌ Error while saving to database.");
    }
};

// ============================================================
// 1. PRESENCE MANAGEMENT (Recording / Typing)
// ============================================================

cmd({
    pattern: "autorecording",
    alias: ["autorec", "arecording"],
    desc: "Enable/Disable auto recording simulation",
    category: "settings",
    react: "👑"
},
async(conn, mek, m, { args, isOwner, reply, botNumber, userConfig }) => {
    if (!isOwner) return reply("*THIS COMMAND IS JUST FOR ME 😎*");
    const value = args[0]?.toLowerCase();
    
    if (value === 'on' || value === 'true') {
        await updateConfig('AUTO_RECORDING', 'true', botNumber, userConfig, reply);
    } else if (value === 'off' || value === 'false') {
        await updateConfig('AUTO_RECORDING', 'false', botNumber, userConfig, reply);
    } else {
        reply(`*CURRENT :❯ ${userConfig.AUTO_RECORDING} 😊\n\nTo enable auto-recording, type: ☺️\n👑 ❮AUTORECORDING ON❯ 👑\nTo disable auto-recording, type: ☺️\n👑 ❮AUTORECORDING OFF❯ 👑*`);
    }
});

cmd({
    pattern: "autotyping",
    alias: ["autotype", "atyping"],
    desc: "Enable/Disable auto typing simulation",
    category: "settings",
    react: "👑"
},
async(conn, mek, m, { args, isOwner, reply, botNumber, userConfig }) => {
    if (!isOwner) return reply("*THIS COMMAND IS JUST FOR ME 😎*");
    const value = args[0]?.toLowerCase();
    
    if (value === 'on' || value === 'true') {
        await updateConfig('AUTO_TYPING', 'true', botNumber, userConfig, reply);
    } else if (value === 'off' || value === 'false') {
        await updateConfig('AUTO_TYPING', 'false', botNumber, userConfig, reply);
    } else {
        reply(`*CURRENT :❯ ${userConfig.AUTO_TYPING} 😊*\n\n*To enable auto-typing, type ☺️*\n*👑 ❮AUTOTYPING ON❯ 👑*\n*To disable auto-typing, type ☺️*\n*👑 ❮AUTOTYPING OFF❯ 👑*`);
    }
});

// ============================================================
// 2. CALL MANAGEMENT (Anti-Call)
// ============================================================

cmd({
    pattern: "anticall",
    alias: "acall",
    desc: "Auto reject calls",
    category: "settings",
    react: "👑"
},
async(conn, mek, m, { args, isOwner, reply, botNumber, userConfig }) => {
    if (!isOwner) return reply("*This command is only for me ☺️*");
    const value = args[0]?.toLowerCase();
    
    if (value === 'on' || value === 'true') {
        await updateConfig('ANTI_CALL', 'true', botNumber, userConfig, reply);
    } else if (value === 'off' || value === 'false') {
        await updateConfig('ANTI_CALL', 'false', botNumber, userConfig, reply);
    } else {
        reply(`*CURRENT :❯ ${userConfig.ANTI_CALL || userConfig.AUTO_RECORDING} 😊\n\nAny incoming calls will be automatically rejected. 😃 To enable this setting, type: ☺️\n👑 ❮ANTICALL ON❯ 👑\nTo disable it, type: ☺️\n👑 ❮ANTICALL OFF❯ 👑*`);
    }
});

// ============================================================
// 3. GROUP MANAGEMENT (Welcome / Goodbye)
// ============================================================

cmd({
    pattern: "welcome",
    desc: "Enable/Disable welcome messages",
    category: "settings",
    react: "👑"
},
async(conn, mek, m, { args, isOwner, reply, botNumber, userConfig }) => {
    if (!isOwner) return reply("*This command is only for me ☺️*");
    const value = args[0]?.toLowerCase();
    
    if (value === 'on' || value === 'true') {
        await updateConfig('WELCOME', 'true', botNumber, userConfig, reply);
    } else if (value === 'off' || value === 'false') {
        await updateConfig('WELCOME', 'false', botNumber, userConfig, reply);
    } else {
        reply(`*CURRENT :❯ ${userConfig.WELCOME} 😊*\n\n*WHEN A NEW MEMBER JOINS THE GROUP, A WELCOME MESSAGE WILL BE SENT 😃 TO ENABLE THIS SETTING TYPE ☺️*\n*👑 ❮WELCOME ON❯ 👑*\n*TO DISABLE WELCOME TYPE ☺️*\n*👑 ❮WELCOME OFF❯ 👑*`);
    }
});

cmd({
    pattern: "goodbye",
    desc: "Enable/Disable goodbye messages",
    category: "settings",
    react: "👑"
},
async(conn, mek, m, { args, isOwner, reply, botNumber, userConfig }) => {
    if (!isOwner) return reply("*THIS COMMAND IS ONLY FOR ME 😎*");
    const value = args[0]?.toLowerCase();
    
    if (value === 'on' || value === 'true') {
        await updateConfig('GOODBYE', 'true', botNumber, userConfig, reply);
    } else if (value === 'off' || value === 'false') {
        await updateConfig('GOODBYE', 'false', botNumber, userConfig, reply);
    } else {
        reply(`*CURRENT :❯ ${userConfig.GOODBYE} 😊*\n\n*WHEN A MEMBER LEAVES THE GROUP, A GOODBYE MESSAGE WILL BE SENT 😃 TO ENABLE THIS SETTING TYPE ☺️*\n*👑 ❮GOODBYE ON❯ 👑*\n*TO DISABLE GOODBYE TYPE ☺️*\n*👑 ❮GOODBYE OFF❯ 👑*`);
    }
});

// ============================================================
// 4. READ & STATUS MANAGEMENT
// ============================================================

cmd({
    pattern: "autoread",
    desc: "Enable/Disable auto read messages (Blue Tick)",
    category: "settings",
    react: "👀"
},
async(conn, mek, m, { args, isOwner, reply, botNumber, userConfig }) => {
    if (!isOwner) return reply("*THIS COMMAND IS ONLY FOR ME 😎*");
    const value = args[0]?.toLowerCase();
    
    if (value === 'on' || value === 'true') {
        await updateConfig('READ_MESSAGE', 'true', botNumber, userConfig, reply);
    } else if (value === 'off' || value === 'false') {
        await updateConfig('READ_MESSAGE', 'false', botNumber, userConfig, reply);
    } else {
        reply(`*CURRENT :❯ ${userConfig.READ_MESSAGE} 😊*\n*ALL INCOMING MESSAGES WILL BE AUTOMATICALLY MARKED AS READ*`);
    }
});

cmd({
    pattern: "autoviewsview",
    alias: ["avs", "statusseen", "astatus"],
    desc: "Auto view status updates",
    category: "settings",
    react: "😎"
},
async(conn, mek, m, { args, isOwner, reply, botNumber, userConfig }) => {
    if (!isOwner) return reply("*THIS COMMAND IS ONLY FOR ME 😎*");
    const value = args[0]?.toLowerCase();
    
    if (value === 'on' || value === 'true') {
        await updateConfig('AUTO_VIEW_STATUS', 'true', botNumber, userConfig, reply);
    } else if (value === 'off' || value === 'false') {
        await updateConfig('AUTO_VIEW_STATUS', 'false', botNumber, userConfig, reply);
    } else {
        reply(`*CURRENT :❯ ${userConfig.AUTO_VIEW_STATUS} 😊*\n\n*ANY POSTED STATUS WILL BE AUTOMATICALLY VIEWED 😃 TO ENABLE THIS SETTING TYPE ☺️*\n*👑 ❮AUTOSTATUSVIEW ON❯ 👑*\n*TO DISABLE TYPE ☺️*\n*👑 ❮AUTOSTATUSVIEW OFF❯ 👑*`);
    }
});

cmd({
    pattern: "autolikestatus",
    alias: ["als"],
    desc: "Auto like status updates",
    category: "settings",
    react: "❤️"
},
async(conn, mek, m, { args, isOwner, reply, botNumber, userConfig }) => {
    if (!isOwner) return reply("🚫 Owner only!");
    const value = args[0]?.toLowerCase();
    
    if (value === 'on' || value === 'true') {
        await updateConfig('AUTO_LIKE_STATUS', 'true', botNumber, userConfig, reply);
    } else if (value === 'off' || value === 'false') {
        await updateConfig('AUTO_LIKE_STATUS', 'false', botNumber, userConfig, reply);
    } else {
        reply(`Current Status: ${userConfig.AUTO_LIKE_STATUS}\nUsage: .autolikestatus on/off`);
    }
});

// ============================================================
// 5. SYSTEM (Mode & Prefix)
// ============================================================

cmd({
    pattern: "mode",
    desc: "Change bot mode (public/private/groups/inbox)",
    category: "settings",
    react: "⚙️"
},
async(conn, mek, m, { args, isOwner, reply, botNumber, userConfig }) => {
    if (!isOwner) return reply("*THIS COMMAND IS ONLY FOR ME 😎*");
    const mode = args[0]?.toLowerCase();
    const validModes = ['public', 'private', 'groups', 'inbox'];

    if (validModes.includes(mode)) {
        await updateConfig('WORK_TYPE', mode, botNumber, userConfig, reply);
    } else {
        reply(`*INVALID INPUT 🥺*\n*TYPE LIKE THIS ☺️* Type ❮MODE❯ followed by one of these options where you want the bot to work 🤗*\n ${validModes.join(', ')}\nCurrent: ${userConfig.WORK_TYPE}`);
    }
});

cmd({
    pattern: "setprefix",
    desc: "Change bot prefix",
    category: "settings",
    react: "👑"
},
async(conn, mek, m, { args, isOwner, reply, botNumber, userConfig }) => {
    if (!isOwner) return reply("*THIS COMMAND IS ONLY FOR ME 😎*");
    const newPrefix = args[0];

    if (newPrefix) {
        // Ensure prefix is short (single character or short string)
        if (newPrefix.length > 1 && newPrefix !== 'noprefix') return reply("❌ Prefix must be short (e.g. . or ! or #)");
        
        await updateConfig('PREFIX', newPrefix, botNumber, userConfig, reply);
    } else {
        reply(`*CURRENT PREFIX IS ❮ ${userConfig.PREFIX} ❯ ☺️*\nSET ANY SYMBOL YOU WANT TO RUN THE BOT WITH LIKE THIS 😊*\n*❮SETPREFIX . ! + _ -❯*\n*WHATEVER YOU PREFER 😍❣️*`);
    }
});