var steem = require("steem");
var time_ago = require('time_ago_in_words');

var utils = {
    getProfileData: function (username) {
        return new Promise(function (yes, no) {
            steem.api.getAccounts([username], function (err, result) {
                if (err) no(err);
                yes(result);
            })
        })
    },
    getFollowerCount: function (username) {
        return new Promise(function (yes, no) {
            steem.api.getFollowCount(username, function (err, result) {
                if (err) no(err);
                yes(result);
            });
        })
    },
    getDiscussionByCreated: function(tag, limit) {
        return new Promise(function (yes, no) {
            steem.api.getDiscussionsByCreated({tag: tag, limit: limit}, function (err, result) {
                if(err) no(err);
                yes(result);
            });
        })
    },
    getDiscussionsByHot: function(tag, limit) {
        return new Promise(function (yes, no) {
            steem.api.getDiscussionsByHot({tag: tag, limit: limit}, function (err, result) {
                if(err) no(err);
                yes(result);
            });
        })
    },
    getDiscussionsByTrending: function(tag, limit) {
        return new Promise(function (yes, no) {
            steem.api.getDiscussionsByTrending({tag: tag, limit: limit}, function (err, result) {
                if(err) no(err);
                yes(result);
            });
        })
    },
    printLink: function(result) {
            let value = "Pending Payout : " + result.pending_payout_value;
            value += "\nTotal Votes : " + result.net_votes;
            value += "\nPosted Time : " + time_ago(new Date(result.created) - (1000 * 60));
            value += "\nhttps://steemit.com" + result.url;
            return value;
    },
    getEmbedProfile:
        function (profile) {

            var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            var created = new Date(profile.created);

            created = monthNames[created.getMonth()] + ' ' + created.getDate() + ', ' + created.getFullYear();

            var data = {
                about:"No bio",
                location: "Steem Blockchain",
                website: "No website",
                profile_image:"https://res.cloudinary.com/hpiynhbhq/image/upload/v1506948447/p72avlprkfariyti7q2l.png"
            };

            if (profile.json_metadata.length > 0) {
                data = JSON.parse(profile.json_metadata).profile;
                if (!data.hasOwnProperty("about")) {
                    data.about = "No bio";
                }
                if (!data.hasOwnProperty("location")) {
                    data.location = "Steem Blockchain";
                }
                if (!data.hasOwnProperty("website")) {
                    data.website = "No website";
                }
                if (!data.hasOwnProperty("about")) {
                    data.profile_image = "https://res.cloudinary.com/hpiynhbhq/image/upload/v1506948447/p72avlprkfariyti7q2l.png";
                }
            }

            return {
                color: 0x3498db,
                author: {name: "@" +  profile.name},
                description: data.about,
                title: "Steem profile of @" + profile.name,
                url: "https://steemit.com/@" + profile.name,
                thumbnail: {
                    url: data.profile_image
                },
                fields: [
                    getField("Username", profile.name, true),
                    getField("Reputation", steem.formatter.reputation(profile.reputation), true),
                    getField("Posts", profile.post_count, true),
                    getField("STEEM", profile.balance, true),
                    getField("Followers", profile.follower, true),
                    getField("Following", profile.following, true),
                    getField("Joined", created, true),
                    getField("Location", data.location, true),
                    getField("Website",data.website)
                ],
                footer: {text: "SteemDC is a bot by @wehmoen"}
            };
        }
};


function getField(name, value, inline) {
    return {
        name: name,
        value: value,
        inline: inline
    }
}

module.exports = utils;
