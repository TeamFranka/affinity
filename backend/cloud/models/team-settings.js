/* eslint-disable @typescript-eslint/no-var-requires */
const Parse = require('./parse-fix');

const Defaults = {
    canPost: 'members',
    canPublish: 'publishers',
    canComment: 'members',
    canLike: 'members',
    canCreatePicture: 'members',
    canCreatePoll: 'members',
    canCreateLink: 'members',
    canCreateDocument: 'mods',
    canCreateFaqEntry: 'mods',
    canEditFaqEntry: 'mods',
};

const Levels = ["anyone", "members", "publishers", "mods", "leaders", "nobody"];

function isMember(team, groupName, userId) {
    return team
        .get(groupName)
        .getUsers()
        .query()
        .contains("id", userId)
        .exists({ useMasterKey: true })
}

const TeamSettings = Parse.Object.extend("TeamSettings", {
    chechLevel: function(field, level) {
        return Levels.indexOf(this.get(field) || Defaults[field]) <= Levels.indexOf(level);
    },
    canDo: function(user, field, team) {
        const lvl = this.get(field) || Defaults[field];
        console.log("allowed for", team.get("name"), field, user, lvl);
        if (lvl === "anyone") {
            return true
        } else if (lvl === "nobody") {
            return false
        } else if (lvl === "members"  || lvl === "leaders") {
            return isMember(team, lvl, user.id)
        } else if (lvl === "mods" || lvl === "agents" || lvl === "publishers") {
            return isMember(team, lvl, user.id) ? true : isMember(team, "leaders", user.id)
        }

        console.log("unknown level, returning false");
        return false;
    },
    genPermissions: function(isLeader, isMod, isAgent, isPublisher, isMember) {
        if (isLeader) {
            // FIXME: some might be limited even for admins later
            const perms = {
                "isAdmin": true,
                "canPublish": true,
                "canModerate": true,
            };

            Object.keys(Defaults).forEach(key => {
                perms[key] = this.chechLevel(key, "leaders")
            });
            return perms
        }

        const teamPermissions = {
            "isAdmin": false,
            "canModerate": false,
            "canPublish": false,
        };

        Object.keys(Defaults).forEach(key => {
            teamPermissions[key] = this.chechLevel(key, "anyone")
        });

        const upgrades = [];
        if (isMember) upgrades.push("members");
        if (isMod) {
            teamPermissions["canModerate"] = true;
            upgrades.push("mods");
        }
        if (isPublisher) {
            teamPermissions["canPublish"] = true;
            upgrades.push("publishers");
        }

        upgrades.forEach(u => {
            Object.keys(Defaults).forEach((k) => {
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