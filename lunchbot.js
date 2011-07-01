var irc = require('IRC-js');

var SERV = 'localhost';
var NICK = 'lunchbot';
var CHAN = '#lunchbot';

var onConnect = function() {
    conn.join(CHAN);
    conn.on('privmsg', function(args) {
        var message = args['params'][1];
        if (message.indexOf('lunchbot') != -1) {
            conn.names(CHAN, function(channel, nicks) {
                var ops = [];
                for (var i = 0; i < nicks.length; i++) {
                    if (nicks[i].indexOf('@') == 0)
                        ops.push(nicks[i].replace('@', ''));
                }

                console.log(ops);
                console.log(channel);
                conn.privmsg(CHAN, ops.join(', ') + ': lunch?');
            });
        }
    });
}

var conn = new irc({ 'server': SERV, 'nick': NICK });
conn.connect(function() {
    console.log('Connected');
    setTimeout(onConnect, 5000);
});
