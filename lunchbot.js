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

var LunchTime = function(time) {
    this._time = time;
    this._list = [];
}

LunchTime.prototype.add = function(by, message) {
    this._list.push({by: by, message: message});
}

LunchTime.prototype.signup = function(with_) {
}

LunchTime.prototype.notify = function() {
}

LunchTime.prototype.toString = function() {
    var str = '';
    for (var i = 0; i < this._list.length; i++)
        str += this._time + ' ' + this._list[i].by + ': ' + this._list[i].message + '\n';
    return str;
}

var lunches = {};

var sanitizeNick = function(nick) {
    return nick.replace(/^[%@]/, '');
}

var sanitizeNickList = function(nicks) {
    var clean = [];
    for (var i = 0; i < nicks.length; i++)
        clean.push(sanitizeNick(nicks[i]));
    return clean;
}

var commands = {
ask: cmd.use({
    'ops': function() {
        conn.names(CHAN, function(channel, nicks) {
            var ops = [];
            for (var i = 0; i < nicks.length; i++) {
            console.log(nicks[i]);
                if (nicks[i].indexOf('@') == 0)
                    ops.push(nicks[i]);
            }

            if (ops.length == 0)
                return;

            conn.privmsg(CHAN, sanitizeNickList(ops).join(', ') + ': lunch?');
        });
    },
    _unhandled: function() {
        conn.names(CHAN, function(channel, nicks) {
            conn.privmsg(CHAN, sanitizeNickList(nicks).join(', ') + ': lunch?');
        });
    }
}),

lunch: cmd.use({
    'at': function(command) {
        var args = command.unshifted();
        var time = args[0];
        var match = time.match(/^(0?[0-9]|1[0-9]|2[0-3]):(0[0-9]|[1-5][0-9])$/);
        if (!match)
            conn.privmsg(command.options.channel, sanitizeNick(command.options.nick) + ': invalid time');

        if (!lunches[time])
            lunches[time] = new LunchTime(time);
        lunches[time].add(command.options.nick, args.slice(1).join(' '));
    }
}),

lunches: function(command) {
    var lunchesStr = '';
    for (var time in lunches) {
        if (!lunches.hasOwnProperty(time))
            continue;
        var lunchtime = lunches[time];
        lunchesStr += lunchtime;
    }
    conn.privmsg(command.options.channel, lunchesStr);
}
};

var dispatcher = cmd.use({
    'ask': commands.ask,
    'lunch': commands.lunch,
    'lunches': commands.lunches,
    _unhandled: function(cmd) {
        console.log("don't understand", cmd);
    }
});

var onConnect = function() {
    conn.join(CHAN);
    conn.on('privmsg', function(args) {
            console.dir(args);
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
