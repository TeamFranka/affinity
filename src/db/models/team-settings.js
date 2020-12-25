/* eslint-disable @typescript-eslint/no-var-requires */
const Parse = require('./parse-fix');

const Defaults = {
    canPost: 'members',
    canComment: 'members',
    canLike: 'members',
};

const Levels = ["anyone", "members", "mods", "leaders", "nobody"];

const TeamSettings = Parse.Object.extend("TeamSettings", {
    chechLevel: function(field, level) {
        return Levels.indexOf(this.get(field) || "nobody") <= Levels.indexOf(level);
    },
    genPermissions: function(isLeader, isMod, isAgent, isPublisher, isMember) {
        if (isLeader) {
            // FIXME: some might be limited even for admins later
            return {
                "isAdmin": true,
                "canPublish": true,
                "canModerate": true,
                "canPost": this.chechLevel("canPost", "leaders"),
                "canComment": this.chechLevel("canComment", "leaders"),
                "canLike": this.chechLevel("canLike", "leaders"),
            };
        }

        // FIXME: should be possible to configure via team settings
        const teamPermissions = {
            "canPost": this.chechLevel("canPost", "anyone"),
            "canComment": this.chechLevel("canComment", "anyone"),
            "canLike": this.chechLevel("canLike", "anyone"),
        }

        const upgrades = [];
        if (isMember) upgrades.push("members");
        if (isMod) upgrades.push("mods");
        if (isPublisher) upgrades.push("publishers");


        upgrades.forEach(u => {
            Object.keys(teamPermissions).forEach((k) => {
                if (!teamPermissions[k] && this.chechLevel(k, u)){
                    teamPermissions[k] = true
                }
            })
        })

        return teamPermissions
    }
}, {
    // static
    getDefaults: function() {
        return (new TeamSettings(Object.assign({}, Defaults)));
    }
});

module.exports = {
    TeamSettingsDefaults: Defaults,
    TeamSettings: TeamSettings
}