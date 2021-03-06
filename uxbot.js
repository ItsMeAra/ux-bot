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

    node uxbot.js (for manual restarts/updates)
    OR
    nodemon uxbot.js (for automatic restarts/updates)

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/





/* Start UX-Bot
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
//Set your botToken
var botToken = 'xoxb-17803994887-uunDoWIhwJ7tMSYpinZ4yL8P';

if (!botToken) {
    console.log('Error: Please specify token');
    process.exit(1);
}

//Include your libraries
var Botkit = require('./lib/Botkit.js');
var os = require('os');
// Allow jQuery
var $ = require('jquery');
// Allow XMLHttpRequest
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

//Show Debugging info in CLI?
var controller = Botkit.slackbot({
    debug: true,
});

//Start your bot
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





/* Basic (mt) custom responses
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
function botReply ( hashtags, responses ) {
    controller.hears( hashtags, 'direct_message,direct_mention,mention,message_received,ambient', function ( bot, message ) {
        var botResponse = responses[Math.floor(Math.random()*responses.length)];
        bot.reply(message, botResponse);
    });
}

// Example:
/*
botReply(['#foo', '#bar'], [
    'baz',
    'fatigued'
]);
*/

botReply(['#uxtest'], [
    'You passed bruh!'
]);

botReply(['#baptized'], [
    'http://ara-vision.com/gif-library/fail/baptized.gif'
]);

botReply(['#casinonight'], [
    'http://media1.giphy.com/media/Ef7aMJT141V7i/giphy.gif'
]);

botReply(['#chromeriver'], [
    'https://49.media.tumblr.com/69b9ccbd01d405070c04fa0c01e7a94f/tumblr_nkkmr4ZzQA1uo61smo1_500.gif'
]);

botReply(['#coffee', '#whoops'], [
    'http://i.giphy.com/tId80dcdksC8U.gif'
]);

botReply(['#devbox','#devboxes'], [
    'http://ara-vision.com/gif-library/seinfeld/george-costanza.gif'
]);

botReply(['#fatigued', '#fatigado'], [
    'http://new.tinygrab.com/219da34c65fb5ffb028e32a00d430b318c38a5ca70.jpg', 
    'http://gph.is/1gVrqmL'
]);

botReply(['#fts'], [
    'http://cdn.someecards.com/someecards/usercards/1335298036781_3013300.png'
]);

botReply(['#gridlaunch','#premium'], [
    'http://i.giphy.com/26tP41fh76vmLO3iU.gif'
]);

botReply(['#grim'], [
    'http://i.imgur.com/cIwwfJ9.gif'
]);

botReply(['#lazy'], [
    'http://i.ato.la/NYgy'
]);

botReply(['#mediocre'], [
    'http://i2.kym-cdn.com/photos/images/original/001/025/902/7d5.gif'
]);

botReply(['#moneyback'], [
    'https://media.giphy.com/media/spu7pCVzwmvm/giphy.gif'
]);

botReply(['#obamajam'], [
    ':car: :bus: :truck: :bus: :car: :car: :bus: :truck: :bus: :car: :car: :bus: :truck: :bus: :car: :car: :bus: :truck: :bus: :car: :car: :bus: :truck: :bus: :car: :car: :bus: :truck: :bus: :car: :car: :bus: :truck: :bus: :car: :car: :bus: :truck: :bus: :car: :car: :bus: :truck: :bus: :car: :car: :bus: :truck: :bus: :car: :car: :bus: :truck: :bus: :car: :car: :bus: :truck: :bus: :car: :car: :bus: :truck: :bus: :car: :car: :bus: :truck: :bus: :car: :car: :bus: :truck: :bus: :car: :car: :bus: :truck: :bus: :car: :car: :bus: :truck: :bus: :car: :car: :bus: :truck: :bus: :car: :car: :bus: :truck: :bus: :car: :car: :bus: :truck: :bus: :car: :car: :bus: :truck: :bus: :car: :car: :bus: :truck: :bus: :car: :car: :bus: :truck: :bus: :car: :car: :bus: :truck: :bus: :car: :car: :bus: :truck: :bus: :car: :car: :bus: :truck: :bus: :car: :car: :bus: :truck: :bus: :car: :car: :bus: :truck: :bus: :car: :car: :bus: :truck: :bus: :car: :car: :bus: :truck: :bus: :car: :car: :bus: :truck: :bus: :car: :car: :bus: :truck: :bus: :car: :car: :bus: :truck: :bus: :car: :car: :bus: :truck: :bus: :car: :car: :bus: :truck: :bus: :car: :car: :bus: :truck: :bus: :car: :car: :bus: :truck: :bus: :car: :car: :bus: :truck: :bus: :car: :car: :bus: :truck: :bus: :car: :car: :bus: :truck: :bus: :car:'
]);

botReply(['#pandemonium'], [
    'http://pop.h-cdn.co/assets/15/21/1431967859-madmax-guitar.gif',
    'http://i.imgur.com/6WFjtDB.gif%20alt='
]);

botReply(['#ravenous'], [
    'http://i.ato.la/NYb0'
]);

botReply(['#ripvinson'], [
    'https://www.youtube.com/watch?v=o4T_miEDCMQ&feature=youtu.be'
]);

botReply(['#sadtrombone','#wompwomp'], [
    'https://wompwompwomp.com/'
]);

botReply(['#savage'], [
    'https://media.giphy.com/media/7TBgfTpoLDGg0/giphy.gif'
]);

botReply(['#serenitynow'], [
    'http://ofmindsandmotorcycles.com/wp-content/uploads/2015/02/serenity.jpeg', 
    'http://gph.is/15vF1rk'
]);

botReply(['#shakeitoff'], [
    'https://media.giphy.com/media/YGZd0mhLqkvO8/giphy.gif'
]);

botReply(['#shotsfired'], [
    'http://ara-vision.com/gif-library/favorites/shots-fired-compilation.gif',
    'https://localtvwnep.files.wordpress.com/2012/12/shots_fired.jpg'
]);

botReply(['#hacked'], [
    'http://i.imgur.com/ye5udHZ.gif'
]);

botReply(['#stabbed'], [
    'http://i.imgur.com/ey5hIyJ.gif'
]);

botReply(['#stress'], [
    'http://union.io/images/repo/20160204-00--b17773.png',
    'http://38.media.tumblr.com/d04494b57e344367e55bbc2fd357f6fa/tumblr_n9b5pyRSQm1rwt6qvo3_400.jpg',
    'http://ara-vision.com/gif-library/angry/smash-phone.gif',
    'http://ara-vision.com/gif-library/angry/robin-doesnt-work.gif',
    'http://ara-vision.com/gif-library/angry/stick-fuuuu.gif'
]);

botReply(['#strugglelunch'], [
    'The Point',
    'Signature Cafe',
    'An apple from the basket in the kitchen',
    'Chipotle (RIP)',
    'A swig of Coffee Mate',
    'Xenomorph Grill',
    'Bowl of Fruity Pebbles',
    'Cap’n Crunch',
    'That weird fish thing from the Point\'s Facebook page',
    'https://files.slack.com/files-tmb/T02BHKTRC-F0K6DL1JQ-c87324613e/img_6627_1024.jpg'
]);

botReply(['#struggleplate'], [
    'https://scontent.xx.fbcdn.net/hphotos-xtf1/v/t1.0-9/11012491_1074533075909459_1097248340093578678_n.jpg?oh=14b780b4795d75b0d84c908aca02e12c&oe=5707482F',
    'https://scontent.xx.fbcdn.net/hphotos-xfp1/v/t1.0-9/11011522_1077599628936137_2509595278427732007_n.jpg?oh=30b03e6f8ac1925a89435ac560354692&oe=573F3DF0',
    'https://scontent.xx.fbcdn.net/hphotos-xpa1/v/t1.0-9/604107_615157078513730_221830912_n.jpg?oh=41dc2d7ed461c51c33637097b97b53c6&oe=5736B0A2',
    'https://files.slack.com/files-tmb/T02BHKTRC-F0K6DL1JQ-c87324613e/img_6627_1024.jpg',
    'http://i.imgur.com/tdUNOYj.jpg',
    'http://i.imgur.com/RnvbRg3.jpg',
    'http://i.imgur.com/5RbGmJb.jpg',
    'http://i.imgur.com/cshWr5P.jpg',
    'http://i.imgur.com/SVjJiO1.jpg',
    'http://i.imgur.com/rGh7S0p.jpg',
    'http://i.imgur.com/bRglqp4.jpg',
    'http://i.imgur.com/wAEH2nA.jpg',
    'http://i.imgur.com/sW7QxJx.jpg',
    'https://files.slack.com/files-pri/T02BHKTRC-F0KHZHQRX/img_2118.jpg',
    'http://38.media.tumblr.com/d04494b57e344367e55bbc2fd357f6fa/tumblr_n9b5pyRSQm1rwt6qvo3_400.jpg',
    'https://41.media.tumblr.com/tumblr_mdwklaGa521rle9pfo1_500.jpg',
    'https://36.media.tumblr.com/43f16eec0221724e2d82149273b20c7c/tumblr_mn4mdggUYe1qc7fcbo1_1280.jpg',
    'https://scontent.xx.fbcdn.net/hphotos-xaf1/t31.0-8/466582_434010223295084_1939809895_o.jpg',
    'https://scontent.xx.fbcdn.net/hphotos-xfa1/t31.0-8/471181_411296902233083_740881165_o.jpg',
    'http://38.media.tumblr.com/d04494b57e344367e55bbc2fd357f6fa/tumblr_n9b5pyRSQm1rwt6qvo3_400.jpg',
    'https://scontent.xx.fbcdn.net/hphotos-xat1/v/t1.0-9/12190794_1160788300617269_5858725134886156556_n.jpg?oh=fbb7f97a640975a3c3c449f38c733fe8&oe=5731F813',
    'https://scontent.xx.fbcdn.net/hphotos-xat1/v/t1.0-9/12144707_1151539811542118_4126216404777350078_n.jpg?oh=fb913f2b510e06e2a5efead6d4654a5c&oe=572486C9',
    'https://scontent.xx.fbcdn.net/hphotos-xft1/v/t1.0-9/11206104_1113210295375070_8208117772588246922_n.jpg?oh=1b42b866a3ffce4208932fefc5cb27dd&oe=57706470'
]);

botReply(['#strugglemvp'], [
    'https://scontent.xx.fbcdn.net/hphotos-xtf1/v/t1.0-9/11012491_1074533075909459_1097248340093578678_n.jpg?oh=14b780b4795d75b0d84c908aca02e12c&oe=5707482F'
]);

botReply(['#tgif'], [
    'http://38.media.tumblr.com/64a41920bf57be7bfba92b508df983a2/tumblr_mhm9yobHrw1qgig4oo1_1280.gif'
]);

botReply(['#tigerwoods'], [
    'http://i.giphy.com/bYhT4QtsrIUJG.gif'
]);

botReply(['#topperformer'], [
    'http://union.io/images/repo/20150917-00--a1bd5f.jpg',
    'http://www.bytecolumn.com/wp-content/uploads/2011/08/business-success-crop.jpg',
    'http://www.automaxrecruitingandtraining.com/wp-content/uploads/2012/02/top-industry-performer.jpg',
    'http://idgresearch.com/wp-content/uploads/2015/02/Top-Performer.png',
    'http://staffingadvisors.com/wp-content/uploads/2014/10/iStock_000009738389Large-1170x712.jpg'
]);

botReply(['#trashthelogo'], [
    'http://i.imgur.com/D2afGyp.gif'
]);

botReply(['#tripleboost'], [
    'http://i.imgur.com/IC1Ad7g.gif'
]);

botReply(['#idgaf'], [
    'http://ara-vision.com/gif-library/idgaf/idgaf-dance.gif',
    'http://ara-vision.com/gif-library/idgaf/looking-for-f-to-give.gif',
    'http://ara-vision.com/gif-library/idgaf/scarface-idgaf.gif',
    'http://ara-vision.com/gif-library/idgaf/smokey-idgaf.gif',
    'https://media.giphy.com/media/JEJYvwfHmBlgQ/giphy.gif',
    'https://vine.co/v/OAEZLKjjM0D'
]);

botReply(['#mindblown'], [
    'http://ara-vision.com/gif-library/mind-blown/kramer-mind-blown.gif',
    'http://ara-vision.com/gif-library/mind-blown/magic.gif',
    'http://ara-vision.com/gif-library/mind-blown/mind-blown-2.gif',
    'http://ara-vision.com/gif-library/seinfeld/kramer-shocked-2.gif',
    'http://ara-vision.com/gif-library/mind-blown/mind-blown.gif'
]);

botReply(['#disgust'], [
    'http://ara-vision.com/gif-library/disgust/gangsta-what-the.gif',
    'http://ara-vision.com/gif-library/disgust/disgust.gif',
    'http://ara-vision.com/gif-library/disgust/disgust-jony-depp.gif'
]);

botReply(['#wasted'], [
    'http://gph.is/1fly6c8',
    'http://gph.is/1cVkBQk'
]);

botReply(['#seinfeld'], [
    'http://ara-vision.com/gif-library/seinfeld/george-costanza.gif',
    'http://ara-vision.com/gif-library/seinfeld/george-shocked.gif',
    'http://ara-vision.com/gif-library/seinfeld/kramer-eat-in-bed.gif',
    'http://ara-vision.com/gif-library/seinfeld/kramer-fall.gif',
    'http://ara-vision.com/gif-library/seinfeld/kramer-mind-blown.gif',
    'http://ara-vision.com/gif-library/seinfeld/kramer-shocked-2.gif',
    'http://ara-vision.com/gif-library/seinfeld/kramer-shocked.gif',
    'http://ara-vision.com/gif-library/seinfeld/kramer-snow-face.gif',
    'http://ara-vision.com/gif-library/seinfeld/kramer-surprise.gif',
    'http://ara-vision.com/gif-library/seinfeld/Kramer-whaaa.gif',
    'http://ara-vision.com/gif-library/seinfeld/seinfeld-had-enough.gif',
    'http://ara-vision.com/gif-library/seinfeld/seinfeld-shocked.gif',
    'http://ara-vision.com/gif-library/seinfeld/kramer-thats-true.gif',
    'http://gph.is/1KET6Fd',
    'http://gph.is/1emYn4u',
    'http://gph.is/1c35BPv',
    'http://gph.is/1a5EPor'
]);





/* More Complicated Shit
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

// #drivetime
controller.hears(['#drivetime (.*)'],'direct_message,direct_mention,mention,message_received,ambient',function(bot, message) {

    var mtAddress = '8520+National+Blvd+90232';
    var inputAddress = message.text.match(/#drivetime (.*)/i);
    var destinationAddress = inputAddress[1];
    var encodedDestinationAddress = encodeURIComponent(destinationAddress);

    var apiUrl = 'https://maps.googleapis.com/maps/api/directions/json?departure_time=now&traffic_model=best_guess&c&origin='+ mtAddress +'&destination='+ encodedDestinationAddress +'&key=AIzaSyBjVGPCTLOZvRJfecKKu69n7_WGajNJVTY';
    var googleMapsUrl = 'https://www.google.com/maps/dir/'+ mtAddress +'/'+ encodedDestinationAddress;

    var request = new XMLHttpRequest();
    request.open('GET', apiUrl, true);

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            // Success!
            var data = JSON.parse(request.responseText);

            if(data.routes[0]){
                if(data.routes[0].legs[0].duration_in_traffic){
                    var driveTime = data.routes[0].legs[0].duration_in_traffic.text;
                }
                else {
                    if(data.routes[0].legs[0].duration){
                        var driveTime = data.routes[0].legs[0].duration.text +'. Traffic is not included in this route.';
                    }
                    else {
                        var driveTime = 'not available. Please try another query.';
                    }
                }
            }
            else {
                var driveTime = 'not available. Please try another more specific query - or a location that\'s not overseas.';
            }


            var driveTimeOutput = 'Drivetime to ' + destinationAddress + ' is '+ driveTime;
            // var driveTimeOutput = 'Drivetime to ' + destinationAddress + ' is '+ driveTime +' <'+googleMapsUrl+'>';

            bot.reply(message,{
                'attachments': [
                    {
                        'fallback': driveTimeOutput,
                        'pretext': driveTimeOutput,
                        'title': 'See it on the map',
                        'title_link': googleMapsUrl,
                        'text': ':car: :bus: :truck: :bus: :car:',
                        'color': '#2956B2'
                    }
                ]
            });
        }
        else {
        // We reached our target server, but it returned an error
            bot.reply(message,'Drivetime to ' + destinationAddress + ' is currently unknown due to an API error. Hopefully you can see it on Google Maps: '+googleMapsUrl);
        }
    };

    request.onerror = function() {
        bot.reply(message,'Drivetime to ' + destinationAddress + ' is currently unknown due to an API error. Hopefully you can see it on Google Maps: '+googleMapsUrl);
    };

    request.send();

});



// #walktime
controller.hears(['#walktime (.*)'],'direct_message,direct_mention,mention,message_received,ambient',function(bot, message) {

    var mtAddress = '8520+National+Blvd+90232';
    var inputAddress = message.text.match(/#walktime (.*)/i);
    var destinationAddress = inputAddress[1];
    var encodedDestinationAddress = encodeURIComponent(destinationAddress);

    var timeNow = Math.floor(Date.now()) + 100;

    var apiUrl = 'https://maps.googleapis.com/maps/api/directions/json?departure_time=now&mode=walking&origin='+ mtAddress +'&destination='+ encodedDestinationAddress +'&key=AIzaSyBjVGPCTLOZvRJfecKKu69n7_WGajNJVTY';
    var googleMapsUrl = 'https://www.google.com/maps/dir/'+ mtAddress +'/'+ encodedDestinationAddress;

    var request = new XMLHttpRequest();
    request.open('GET', apiUrl, true);

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            // Success!
            var data = JSON.parse(request.responseText);

            if(data.routes[0]){

                if(data.routes[0].legs[0].duration){
                    var driveTime = data.routes[0].legs[0].duration.text +'.';
                }
                else {
                    var driveTime = 'not available. Please try another query.';
                }

            }
            else {
                var driveTime = 'not available. Please try another more specific query.';
            }


            var driveTimeOutput = 'Walktime to ' + destinationAddress + ' is '+ driveTime;
            // var driveTimeOutput = 'Drivetime to ' + destinationAddress + ' is '+ driveTime +' <'+googleMapsUrl+'>';

            bot.reply(message,{
                'attachments': [
                    {
                        'fallback': driveTimeOutput,
                        'pretext': driveTimeOutput,
                        'title': 'See it on the map',
                        'title_link': googleMapsUrl,
                        'text': ':walking: :walking::skin-tone-2: :walking::skin-tone-3: :walking::skin-tone-4: :walking::skin-tone-5:',
                        'color': '#2956B2'
                    }
                ]
            });
        }
        else {
        // We reached our target server, but it returned an error
            bot.reply(message,'Walktime to ' + destinationAddress + ' is currently unknown due to an API error. Hopefully you can see it on Google Maps: '+googleMapsUrl);
        }
    };

    request.onerror = function() {
        bot.reply(message,'Walktime to ' + destinationAddress + ' is currently unknown due to an API error. Hopefully you can see it on Google Maps: '+googleMapsUrl);
    };

    request.send();

});



// #biketime
controller.hears(['#biketime (.*)'],'direct_message,direct_mention,mention,message_received,ambient',function(bot, message) {

    var mtAddress = '8520+National+Blvd+90232';
    var inputAddress = message.text.match(/#biketime (.*)/i);
    var destinationAddress = inputAddress[1];
    var encodedDestinationAddress = encodeURIComponent(destinationAddress);

    var timeNow = Math.floor(Date.now()) + 100;

    var apiUrl = 'https://maps.googleapis.com/maps/api/directions/json?departure_time=now&mode=bicycling&origin='+ mtAddress +'&destination='+ encodedDestinationAddress +'&key=AIzaSyBjVGPCTLOZvRJfecKKu69n7_WGajNJVTY';
    var googleMapsUrl = 'https://www.google.com/maps/dir/'+ mtAddress +'/'+ encodedDestinationAddress;

    var request = new XMLHttpRequest();
    request.open('GET', apiUrl, true);

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            // Success!
            var data = JSON.parse(request.responseText);

            if(data.routes[0]){

                if(data.routes[0].legs[0].duration){
                    var driveTime = data.routes[0].legs[0].duration.text +'.';
                }
                else {
                    var driveTime = 'not available. Please try another query.';
                }

            }
            else {
                var driveTime = 'not available. Please try another more specific query.';
            }


            var driveTimeOutput = 'Biketime to ' + destinationAddress + ' is '+ driveTime;
            // var driveTimeOutput = 'Drivetime to ' + destinationAddress + ' is '+ driveTime +' <'+googleMapsUrl+'>';

            bot.reply(message,{
                'attachments': [
                    {
                        'fallback': driveTimeOutput,
                        'pretext': driveTimeOutput,
                        'title': 'See it on the map',
                        'title_link': googleMapsUrl,
                        'text': ':bicyclist: :bicyclist::skin-tone-2: :bicyclist::skin-tone-3: :bicyclist::skin-tone-4: :bicyclist::skin-tone-5:',
                        'color': '#2956B2'
                    }
                ]
            });
        }
        else {
        // We reached our target server, but it returned an error
            bot.reply(message,'Biketime to ' + destinationAddress + ' is currently unknown due to an API error. Hopefully you can see it on Google Maps: '+googleMapsUrl);
        }
    };

    request.onerror = function() {
        bot.reply(message,'Biketime to ' + destinationAddress + ' is currently unknown due to an API error. Hopefully you can see it on Google Maps: '+googleMapsUrl);
    };

    request.send();

});

controller.hears(['#bothelp', '#bothelp-long'],'direct_message,direct_mention,mention,message_received,ambient',function(bot, message) {
    // TODO: Add help to each keyword
    var feed = '';
    var botResponse = bot.botkit.allKeywords;
    var _response = '```';

    if( message.text == '#bothelp-long'){
        feed = '\n';
    }

    for(k in botResponse){
        _response += k + '  ' + feed;
    }

    _response += '```';
    bot.reply(message, _response );
});
