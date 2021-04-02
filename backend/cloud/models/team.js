/* eslint-disable */
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

const Team = Parse.Object.extend("Team", {
    applyForMembership: async function(user) {
        const accessLevel = this.get("membershipAccess") || 'open';
        switch(accessLevel) {
            case "open":
                await this.get("members").getUsers().add(user).save(null, {useMasterKey: true});
                console.log("done for", user);
                break
            default:
                throw "Access to team denied. Level not implemeted: " + accessLevel;
        }
    },
    isMember: function(groupName, userId) {
        return this
            .get(groupName)
            .getUsers()
            .query()
            .contains("id", userId)
            .exists({ useMasterKey: true })
    },
    checkLevel: function(field, level) {
        return Levels.indexOf(this.get(field) || Defaults[field]) <= Levels.indexOf(level);
    },
    canDo: function(user, field) {
        const lvl = this.get(field) || Defaults[field];
        console.log("allowed for", this.get("name"), field, user, lvl);
        if (lvl === "anyone") {
            return true
        } else if (lvl === "nobody") {
            return false
        } else if (lvl === "members"  || lvl === "leaders") {
            return this.isMember(lvl, user.id)
        } else if (lvl === "mods" || lvl === "agents" || lvl === "publishers") {
            return this.isMember(lvl, user.id) ? true : this.isMember("leaders", user.id)
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
                perms[key] = this.checkLevel(key, "leaders")
            });
            return perms
        }

        const teamPermissions = {
            "isAdmin": false,
            "canModerate": false,
            "canPublish": false,
        };

        Object.keys(Defaults).forEach(key => {
            teamPermissions[key] = this.checkLevel(key, "anyone")
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
                if (!teamPermissions[k] && this.checkLevel(k, u)){
                    teamPermissions[k] = true
                }
            })
        })

        return teamPermissions
    }
}, {
    // static
    getDefaults: function() {
        return (new Team(Object.assign({}, Defaults)));
    }
});

module.exports = {
    PermissionDefaults: Defaults,
    Team: Team
}