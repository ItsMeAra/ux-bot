/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

     ___       __       __          __    __       ___       __   __
    /   \     |  |     |  |        |  |  |  |     /   \     |  | |  |
   /  ^  \    |  |     |  |        |  |__|  |    /  ^  \    |  | |  |
  /  /_\  \   |  |     |  |        |   __   |   /  /_\  \   |  | |  |
 /  _____  \  |  `----.|  `----.   |  |  |  |  /  _____  \  |  | |  `----.
/__/     \__\ |_______||_______|   |__|  |__| /__/     \__\ |__| |_______|

 __    __  ___   ___        .______     ______   .___________.
|  |  |  | \  \ /  /        |   _  \   /  __  \  |           |
|  |  |  |  \  V  /   ______|  |_)  | |  |  |  | `---|  |----`
|  |  |  |   >   <   |______|   _  <  |  |  |  |     |  |
|  `--'  |  /  .  \         |  |_)  | |  `--'  |     |  |
 \______/  /__/ \__\        |______/   \______/      |__|


~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

# UX-Bot is a custom slack bot built for (mt)'s UX Team.

# Run the bot from the command line:

    node uxbot.js

    Currently, the bot lives on EK's machine. The goal is to move it to the UX office Mac Mini, or a web-facing server, so it can always run, even when EK's computer is off.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/





/* Start UX-Bot
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
var botToken = 'xoxb-17803994887-uunDoWIhwJ7tMSYpinZ4yL8P';

if (!botToken) {
    console.log('Error: Please specify token');
    process.exit(1);
}

var Botkit = require('./lib/Botkit.js');
var os = require('os');

var controller = Botkit.slackbot({
    debug: true,
});

var bot = controller.spawn({
    token: botToken
}).startRTM();
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */





/* Calls & Responses
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/* BotKit Defaults
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
controller.hears(['hello','hi'],'direct_message,direct_mention,mention',function(bot, message) {

    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'robot_face',
    },function(err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(',err);
        }
    });


    controller.storage.users.get(message.user,function(err, user) {
        if (user && user.name) {
            bot.reply(message,'Hello ' + user.name + '!!');
        } else {
            bot.reply(message,'Hello.');
        }
    });
});

controller.hears(['call me (.*)'],'direct_message,direct_mention,mention',function(bot, message) {
    var matches = message.text.match(/call me (.*)/i);
    var name = matches[1];
    controller.storage.users.get(message.user,function(err, user) {
        if (!user) {
            user = {
                id: message.user,
            };
        }
        user.name = name;
        controller.storage.users.save(user,function(err, id) {
            bot.reply(message,'Got it. I will call you ' + user.name + ' from now on.');
        });
    });
});

controller.hears(['what is my name','who am i'],'direct_message,direct_mention,mention',function(bot, message) {

    controller.storage.users.get(message.user,function(err, user) {
        if (user && user.name) {
            bot.reply(message,'Your name is ' + user.name);
        } else {
            bot.reply(message,'I don\'t know yet!');
        }
    });
});


controller.hears(['shutdown','leave us alone now'],'direct_message,direct_mention,mention',function(bot, message) {

    bot.startConversation(message,function(err, convo) {
        convo.ask('Are you sure you want me to shutdown?',[
            {
                pattern: bot.utterances.yes,
                callback: function(response, convo) {
                    convo.say('Bye!');
                    convo.next();
                    setTimeout(function() {
                        process.exit();
                    },3000);
                }
            },
        {
            pattern: bot.utterances.no,
            default: true,
            callback: function(response, convo) {
                convo.say('*Phew!*');
                convo.next();
            }
        }
        ]);
    });
});


controller.hears(['uptime','identify yourself','who are you','what is your name'],'direct_message,direct_mention,mention',function(bot, message) {

    var hostname = os.hostname();
    var uptime = formatUptime(process.uptime());

    bot.reply(message,':robot_face: I am a bot named <@' + bot.identity.name + '>. I have been running for ' + uptime + ' on ' + hostname + '.');

});

function formatUptime(uptime) {
    var unit = 'second';
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'minute';
    }
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'hour';
    }
    if (uptime != 1) {
        unit = unit + 's';
    }

    uptime = uptime + ' ' + unit;
    return uptime;
}



/* (mt) custom responses
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

// #araonsabbatical
controller.hears(['#araonsabbatical'],'direct_message,direct_mention,mention,message_received,ambient',function(bot, message) {

    bot.reply(message,'http://ara-vision.com/gif-library/seinfeld/kramer-eat-in-bed.gif');

});



// #baptized
controller.hears(['#baptized'],'direct_message,direct_mention,mention,message_received,ambient',function(bot, message) {

    bot.reply(message,'http://ara-vision.com/gif-library/fail/baptized.gif');

});



// #casinonight
controller.hears(['#casinonight'],'direct_message,direct_mention,mention,message_received,ambient',function(bot, message) {

    bot.reply(message,'http://media1.giphy.com/media/Ef7aMJT141V7i/giphy.gif');

});



// #coffee, #whoops
controller.hears(['#coffee', '#whoops'],'direct_message,direct_mention,mention,message_received,ambient',function(bot, message) {

    bot.reply(message,'http://i.giphy.com/tId80dcdksC8U.gif');

});



// #devbox, #devboxes
controller.hears(['#devbox','#devboxes'],'direct_message,direct_mention,mention,message_received,ambient',function(bot, message) {

    bot.reply(message,'http://ara-vision.com/gif-library/seinfeld/george-costanza.gif');

});



// #fatigued
controller.hears(['#fatigued'],'direct_message,direct_mention,mention,message_received,ambient',function(bot, message) {

    bot.reply(message,'http://new.tinygrab.com/219da34c65fb5ffb028e32a00d430b318c38a5ca70.jpg');

});



// #fts
controller.hears(['#fts'],'direct_message,direct_mention,mention,message_received,ambient',function(bot, message) {

    bot.reply(message,'http://cdn.someecards.com/someecards/usercards/1335298036781_3013300.png');

});



// #gridlaunch, #premium
controller.hears(['#gridlaunch','#premium'],'direct_message,direct_mention,mention,message_received,ambient',function(bot, message) {

    bot.reply(message,'http://i.giphy.com/26tP41fh76vmLO3iU.gif');

});



// #grim
controller.hears(['#grim'],'direct_message,direct_mention,mention,message_received,ambient',function(bot, message) {

    bot.reply(message,'http://i.imgur.com/cIwwfJ9.gif');

});



// #lazy
controller.hears(['#lazy'],'direct_message,direct_mention,mention,message_received,ambient',function(bot, message) {

    bot.reply(message,'http://i.ato.la/NYgy');

});



// #mediocre
controller.hears(['#mediocre'],'direct_message,direct_mention,mention,message_received,ambient',function(bot, message) {

    bot.reply(message,'http://i2.kym-cdn.com/photos/images/original/001/025/902/7d5.gif');

});



// #moneyback
controller.hears(['#moneyback'],'direct_message,direct_mention,mention,message_received,ambient',function(bot, message) {

    bot.reply(message,'https://media.giphy.com/media/spu7pCVzwmvm/giphy.gif');

});



// #ravenous
controller.hears(['#ravenous'],'direct_message,direct_mention,mention,message_received,ambient',function(bot, message) {

    bot.reply(message,'http://i.ato.la/NYb0');

});



// #sadtrombone, #wompwomp
controller.hears(['#sadtrombone','#wompwomp'],'direct_message,direct_mention,mention,message_received,ambient',function(bot, message) {

    bot.reply(message,'https://wompwompwomp.com/');

});



// #savage
controller.hears(['#savage'],'direct_message,direct_mention,mention,message_received,ambient',function(bot, message) {

    bot.reply(message,'https://media.giphy.com/media/7TBgfTpoLDGg0/giphy.gif');

});



// #serenitynow
controller.hears(['#serenitynow'],'direct_message,direct_mention,mention,message_received,ambient',function(bot, message) {

    bot.reply(message,'http://ofmindsandmotorcycles.com/wp-content/uploads/2015/02/serenity.jpeg');

});



// #shakeitoff
controller.hears(['#shakeitoff'],'direct_message,direct_mention,mention,message_received,ambient',function(bot, message) {

    bot.reply(message,'https://media.giphy.com/media/YGZd0mhLqkvO8/giphy.gif');

});



// #shotsfired
controller.hears(['#shotsfired'],'direct_message,direct_mention,mention,message_received,ambient',function(bot, message) {

    bot.reply(message,'https://localtvwnep.files.wordpress.com/2012/12/shots_fired.jpg');

});



// #stabbed
controller.hears(['#stabbed'],'direct_message,direct_mention,mention,message_received,ambient',function(bot, message) {

    bot.reply(message,'http://i.imgur.com/ey5hIyJ.gif');

});



// #struggleplatez
controller.hears(['#struggleplatez'],'direct_message,direct_mention,mention,message_received,ambient',function(bot, message) {

    bot.reply(message,'http://i.imgur.com/sW7QxJx.jpg');

});



// #tigerwoods
controller.hears(['#tigerwoods'],'direct_message,direct_mention,mention,message_received,ambient',function(bot, message) {

    bot.reply(message,'http://i.giphy.com/bYhT4QtsrIUJG.gif');

});



// #trashthelogo
controller.hears(['#trashthelogo'],'direct_message,direct_mention,mention,message_received,ambient',function(bot, message) {

    bot.reply(message,'http://i.imgur.com/D2afGyp.gif');

});



// #tripleboost
controller.hears(['#tripleboost'],'direct_message,direct_mention,mention,message_received,ambient',function(bot, message) {

    bot.reply(message,'http://i.imgur.com/IC1Ad7g.gif');

});
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
