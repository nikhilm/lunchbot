/* This program is free software. It comes without any warranty, to
 * the extent permitted by applicable law. You can redistribute it
 * and/or modify it under the terms of the Do What The Fuck You Want
 * To Public License, Version 2, as published by Sam Hocevar. See
 * http://sam.zoy.org/wtfpl/COPYING for more details. */

var irc = require('IRC-js');
var cmd = require('cmd');

var SERV = 'irc.mozilla.org';
//var SERV = 'localhost';
var NICK = 'lunchbot';
var CHAN = '#interns';

var conn = new irc({ 'server': SERV, 'nick': NICK });

var sanitizeNick = function(nick) {
    return nick.replace(/^[%@]/, '');
}

var sanitizeNickList = function(nicks) {
    var clean = [];
    for (var i = 0; i < nicks.length; i++)
        clean.push(sanitizeNick(nicks[i]));
    return clean;
}

var getOperators = function(nicks) {
    return nicks
           .filter(function(nick) { return nick[0] == '@' })
           .map(sanitizeNick);
}

var whiteList = [];
var blackList = [];
// returns true if success
// false if already on that list
var editLists = function(nick, addTo, removeFrom) {
    var nick = sanitizeNick(nick);
    if (addTo.indexOf(nick) == -1) {
        addTo.push(nick);
    } else {
        return false;
    }
    var index = removeFrom.indexOf(nick);
    if (index != -1)
        removeFrom.splice(index, 1);
    return true;
}

var commands = {
spam: function(command) {
          console.log("CALLED");
    conn.names(CHAN, function(channel, nicks) {
        var ops = getOperators(nicks);
        var list = ops.filter(function(nick) { return ops.indexOf(nick) == -1; })
                    .concat(whiteList.filter(function(nick) { return ops.indexOf(nick) == -1; }));
        if (list.length != 0)
            conn.privmsg(command.options.channel, list.join(', ') + ': lunch?');
    });
},

whitelist: function(command) {
    if (editLists(command.options.nick, whiteList, blackList))
        conn.privmsg(command.options.channel, command.options.nick + ': ' + 'added to whitelist');
    else
        conn.privmsg(command.options.channel, command.options.nick + ': ' + 'already on whitelist');
},

blacklist: function(command) {
    if (editLists(command.options.nick, blackList, whiteList))
        conn.privmsg(command.options.channel, command.options.nick + ': ' + 'added to blacklist');
    else
        conn.privmsg(command.options.channel, command.options.nick + ': ' + 'already on blacklist');
},

hadlunch: function(command) {
    // TODO
}
};

var dispatcher = cmd.use({
    'spam': commands.spam,
    'whitelist': commands.whitelist,
    'blacklist': commands.blacklist,
    'i': commands.hadlunch,
    _unhandled: function(cmd) {
        console.log("don't understand", cmd);
    }
});

var onConnect = function() {
    conn.join(CHAN);
    conn.on('privmsg', function(args) {
        var message = args['params'][1];
        var regex = new RegExp(NICK + "[:]?\\s*");
        if (message.match(regex)) {
            var arr = message.replace(regex, '').split(' ');
            arr.push('--nick=' + args.person.nick);
            arr.push('--channel=' + args.params[0]);
            dispatcher.apply(dispatcher, arr);
        }
    });
}

conn.connect(function() {
    console.log('Connected');
    setTimeout(onConnect, 1000);
});

process.on('SIGINT', function () {
    saveLists();
    console.log('Got SIGINT.  Press Control-D to exit.');
});
