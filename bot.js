var config = require('./config');
var utils = require('./utils');
var Discordie = require('discordie');
var client = new Discordie();
var Events = Discordie.Events;
var steem = require("steem");

client.connect({
    token: config.discord.token
});
client.Dispatcher.on(Events.GATEWAY_READY, function (e) {
    console.log('Connected as: ' + client.User.username);
});

client.Dispatcher.on("MESSAGE_CREATE", function (e) {
        content = e.message.content;
        if (content.startsWith("!steem")) {
            var args = content.replace("!steem", "").trim().split(" ");
            if (args.length === 1) {
                e.message.channel.sendTyping();
                utils.getProfileData(args[0]).then(function (profile) {
                    if (profile.length === 1) {

                        utils.getFollowerCount(profile[0].name).then(function (result) {
                            profile[0].follower = result.follower_count;
                            profile[0].following = result.following_count;
                            profile = utils.getEmbedProfile(profile[0]);
                            e.message.channel.sendMessage("", [], false, profile);
                        }).catch(function(e) {console.log(e);});

                    }
                }).catch(function(e) {console.log(e);});
            }
        }
        if (content.startsWith("!help")) {
            e.message.channel.sendMessage("Hi! I'm SteemDC, a bot to display Steem profiles in Discord. Have a look at my github repo: https://github.com/wehmoen/steemdc");
        }

    }
);


setInterval(function() {
    steem.api.getFollowCount("wehmoen", function (err, result) {
        console.log("Send ping!");
    });
},1000);





