require("./ts-cli-setup.js");

const Parse = require('parse/node');
const fs = require("fs");

console.warn("Targeting", process.env.VUE_APP_PARSE_URL);

Parse.initialize(
    process.env.VUE_APP_PARSE_APP_ID,
    process.env.VUE_APP_PARSE_JS_KEY,
    process.env.VUE_APP_PARSE_MASTER_KEY
);
Parse.serverURL = process.env.VUE_APP_PARSE_URL;

const mocks = require('./mock-data/index.ts');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require("constants");
const users = {};
const userTokens = {};
const teams = {};
let defaultTeamId;

const getUser = (name) => users[name];
const getTeam = (slug) => teams[slug];
const getUserToken = async (username) => {
    if (!userTokens[username]){
        const user = await Parse.User.logIn(username, username);
        userTokens[username] = user.getSessionToken();
    }
    return userTokens[username]
}

const REMAPPINGS = {
    "author": getUser,
    "user": getUser,
    "team": getTeam,
    "defaultTeamId": (x) => getTeam(x).id ,
    "subOf": getTeam,
    "channels": (channel) => {
        const splitted = channel.split(':', 1);
        const teamName = splitted[0];
        const item = splitted[1];
        return `${getTeam(teamName)}:${item}`
    },
    "participants": (x) => x.map(getUser),
};

function remap(d) {
    Object.entries(REMAPPINGS).forEach(([key, map]) => {
        if (d[key]) {
            d[key] = map(d[key]);
        }
    });

    if (d.cls){
        delete d.cls
    }

    return d
}

const args = process.argv.slice(2);
console.log('myArgs: ', args);

(async () => {
    console.info("Creating Users")

    await Promise.all(mocks.Users.map(async (e) => {
        let u = await (new Parse.Query(Parse.User))
            .equalTo("username", e.username)
            .first({ useMasterKey: true });
        if (!u) {
            u = new Parse.User(e);
            await u.signUp();
        }
        if (e.avatar)  {
            const f = await e.avatar.save();
            e.avatar = f;
        }
        const userData = Object.assign({}, e, mocks.UserOverrides[e.username]);
        await u.save(userData, { useMasterKey: true });
        console.info(` - ${e.username} with password ${e.password}`);
        users[e.username] = u
    }));

    console.info("Looking up Team(s)")
    await Promise.all(mocks.Teams.map(async (data, index) => {
        const Team = Parse.Object.extend("Team");
        let team = await (new Parse.Query(Team))
            .equalTo("slug", data.slug)
            .first({ useMasterKey: true });
        if (!team) {
            team = new Team(Object.assign({
                slug: data.slug,
                name: data.name,
                admin: getUser(data.admin).id
            }, remap(data.params)));
            await team.save(null, { useMasterKey: true });
        }
        if (index === 0){
            defaultTeamId = team.id
        }

        await Promise.all(["members", "leaders", "agents", "mods"].map( key => {
            if(!data[key]) return Promise.resolve(key);
            console.info(`Updating membership ${data.name}'${key} adding: ${data[key]}`);
            const role = team.get(key);
            const users = role.getUsers();
            users.add(data[key].map(getUser));
            return role.save(null, { useMasterKey: true })
        }));

        if (data.settings) {
            console.info(`Setting ${data.name}' Team Settings`);
            const settings = await (new Parse.Query("TeamSettings"))
                .get(team.get("settings").id, { useMasterKey: true });

            await settings.save(data.settings, {useMasterKey: true});
        }

        teams[data.slug] = team
    }));

    console.info("Ensuring Devices");
    for (let i = 0; i < mocks.Devices.length; i++) {
        const d = mocks.Devices[i]
        const sessionToken = await getUserToken(d.user);
        await Parse.Cloud.run("claimInstallation", d, {sessionToken});
    }


    if (args.includes("with-faq")) {
        console.info("Adding FAQ")
        const FaqEntry = Parse.Object.extend("FaqEntry");
        for (let i = 0; i < mocks.FAQs.length; i++) {
            const d = mocks.FAQs[i]
            const sessionToken = await getUserToken(d.author);
            await (new FaqEntry(remap(d))).save(null, {sessionToken})
        }
    }

    if (args.includes("with-posts")) {
        console.info("Adding Posts")
        const Activity = Parse.Object.extend("Activity");
        for (let i = 0; i < mocks.Posts.length; i++) {
            const username = mocks.Posts[i].author;
            const data = remap(mocks.Posts[i]);
            const sessionToken = await getUserToken(username);
            if (data.objects) {
                data.objects = await Promise.all(data.objects.map( async (o) => {
                    const obj = new (Parse.Object.extend(o.cls))(
                        Object.assign({
                            team: data.team,
                        }, remap(o))
                    );
                    await obj.save(null, {sessionToken});
                    return obj.toPointer();
                }));
            } else {
                data.objects = [];
            }
            await (new Activity(data)).save(null, {sessionToken});
        }
    }

    console.info("--- Done");
    console.info("Your teams are:");
    console.info("----------------------------------")

    Object.values(teams).forEach((x) => {
        console.info(` - ${x.id} ${x.id === defaultTeamId ?" (default)":""}: ${x.get("name")} `);
    })

    fs.writeFileSync(".env.development.local.template", `VUE_APP_DEFAULT_TEAM="${defaultTeamId}"`)


    console.info("Template saved at .env.development.local.template.");
    console.info("to use it rename it to .env.development.local and restart your compiler");
    console.info("  cp .env.development.local.template .env.development.local");



})().catch(e => {
    // Deal with the fact the chain failed
    console.error("Failed", e);
});
