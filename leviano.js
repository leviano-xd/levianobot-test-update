var commands = [];

function cmd(info, func) {
    var data = info;
    data.function = func;
    
    // If you don't have the pattern, use cmdname.
    if (!data.pattern && data.cmdname) data.pattern = data.cmdname;
    
    if (!data.alias) data.alias = [];
    if (!data.dontAddCommandList) data.dontAddCommandList = false;
    if (!data.desc) data.desc = '';
    if (!data.fromMe) data.fromMe = false;
    if (!data.category) data.category = 'misc';
    
    commands.push(data);
    return data;
}

module.exports = {
    cmd,
    AddCommand: cmd,
    Function: cmd,
    commands,
};

