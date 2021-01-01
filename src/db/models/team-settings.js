/* eslint-disable @typescript-eslint/no-var-requires */
const Parse = require('./parse-fix');

const Defaults = {
    canPost: 'members',
    canComment: 'members',
    canLike: 'members',
    canCreatePicture: 'members',
    canCreatePoll: 'members',
};

const Levels = ["anyone", "members", "mods", "leaders", "nobody"];

function isMember(team, groupName, userId) {
    console.log("checking membership", groupName, userId);
    return team
        .get(groupName)
        .getUsers()
        .query()
        .contains("id", userId)
        .exists({ useMasterKey: true })
}

const TeamSettings = Parse.Object.extend("TeamSettings", {
    chechLevel: function(field, level) {
        return Levels.indexOf(this.get(field) || "nobody") <= Levels.indexOf(level);
    },
    canDo: function(user, field, team) {
        const lvl = this.get(field) || "nobody";
        console.log("allowed for", team.get("name"), field, user, lvl, typeof lvl, typeof "members", lvl == "members" );
        if (lvl === "anyone") {
            return true
        } else if (lvl === "nobody") {
            return false
        } else if (lvl === "members"  || lvl === "leaders") {
            return isMember(team, lvl, user.id)
        } else if (lvl === "mods" || lvl === "agents") {
            return isMember(team, lvl, user.id) || isMember(team, "leaders", user.id)
        }

        console.log("unknown level, returning false");
        return false;
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
                "canCreatePicture": this.chechLevel("canCreatePicture", "leaders"),
                "canCreatePoll": this.chechLevel("canCreatePoll", "leaders"),
            };
        }

        const teamPermissions = {
            "canPost": this.chechLevel("canPost", "anyone"),
            "canComment": this.chechLevel("canComment", "anyone"),
            "canLike": this.chechLevel("canLike", "anyone"),
            "canCreatePicture": this.chechLevel("canCreatePicture", "anyone"),
            "canCreatePoll": this.chechLevel("canCreatePoll", "anyone"),
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