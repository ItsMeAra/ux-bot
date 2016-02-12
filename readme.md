# UX-Bot - Responding to hashtags one gif at a time

UX-Bot is built with [BotKit](https://github.com/howdyai/botkit/blob/master/readme.md).

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



## Installation

UX-Bot is available via Git.

```bash
git clone git@github.com:kieckhafer/ux-bot.git
```

After cloning the Git repository, you have to install the node dependencies. Navigate to the root of your cloned repository and use npm to install all necessary dependencies.
```bash
npm install
```

Use the `--production` flag to skip the installation of devDependencies.
```bash
npm install --production
```


## Running UX-Bot

UX-Bot runs in Node. Our Auth-token is built into uxbot.js, so you don't need to pass anything while starting it up.

```bash
node uxbot.js
```

The current production UX-Bot lives on EK's machine. The goal is to move it to the UX office Mac Mini, or a web-facing server, so it can always run, even when EK's computer is off.



## Adding a new call & response

It's easy to create a new call & response - simply replace the KEYWORD and the RESPONSE in the code below. You'll need to restart Node to access the new call & response.

```javascript

// KEYWORD
controller.hears(['KEYWORD'],'direct_message,direct_mention,mention,message_received,ambient',function(bot, message) {

    bot.reply(message,'RESPONSE');

});

```

You can also have multiple keywords call the same response.

```javascript

// KEYWORD
controller.hears(['KEYWORD1','KEYWORD2','KEYWORD3'],'direct_message,direct_mention,mention,message_received,ambient',function(bot, message) {

    bot.reply(message,'RESPONSE');

});

```

Want to pull a random response from a list? Cool. You can.

```javascript

// KEYWORD
controller.hears(['KEYWORD'],'direct_message,direct_mention,mention,message_received,ambient',function(bot, message) {

    var responses = Array(
        'RANDOM-RESPONSE-A',
        'RANDOM-RESPONSE-B',
        'RANDOM-RESPONSE-C',
        'RANDOM-RESPONSE-D',
        'RANDOM-RESPONSE-E'
    );

    var botResponse = responses[Math.floor(Math.random()*responses.length)];

    bot.reply(message, botResponse);

});

```

Please try and keep uxbot.js organized by adding new keywords in alphabetical order.


## Expanded usage

You can do pretty much anything with [BotKit](http://howdy.ai/botkit/). Feel free to expand on it in any way you want.



## Creating your own Bot

If you'd like to create your own bot, contact EK with the desired name of your bot, and he'll set it up on the Slack platform and get you a new Auth-token to use.

You'll need to invite your new bot into any channel you want it to be available in.

```bash
/invite @<my bot>
```

## What does UX-Bot do?

Responds to our various #'s

```bash
#grim
#stabbed
etc.
```

Tells you your commute time

```bash
#drivetime {address}
#walktime {address}
```
