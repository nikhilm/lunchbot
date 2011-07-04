/* This program is free software. It comes without any warranty, to
 * the extent permitted by applicable law. You can redistribute it
 * and/or modify it under the terms of the Do What The Fuck You Want
 * To Public License, Version 2, as published by Sam Hocevar. See
 * http://sam.zoy.org/wtfpl/COPYING for more details. */

var irc = require('IRC-js');
var cmd = require('cmd');

var SERV = 'localhost';
var NICK = 'lunchbot';
var CHAN = '#lunchbot';

var conn = new irc({ 'server': SERV, 'nick': NICK });

var sanitizeNickList = function(nicks) {
    var clean = [];
    for (var i = 0; i < nicks.length; i++)
        clean.push(nicks[i].replace(/^[%@]/, ''));
    return clean;
}

var commands = {
ask: cmd.use({
    'ops': function() {
        conn.names(CHAN, function(channel, nicks) {
            var ops = [];
            for (var i = 0; i < nicks.length; i++) {
                if (nicks[i].indexOf('@') == 0)
                    ops.push(nicks[i]);
            }

            conn.privmsg(CHAN, sanitizeNickList(ops).join(', ') + ': lunch?');
        });
    },
    _unhandled: function() {
        conn.names(CHAN, function(channel, nicks) {
            conn.privmsg(CHAN, sanitizeNickList(nicks).join(', ') + ': lunch?');
        });
    }
})
};

var dispatcher = cmd.use({
    'ask': commands.ask,
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
            dispatcher.apply(dispatcher, arr);
        }
    });
}

conn.connect(function() {
    console.log('Connected');
    setTimeout(onConnect, 1000);
});
