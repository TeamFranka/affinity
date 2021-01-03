require("./ts-cli-setup.js");

const Parse = require('parse/node');

Parse.initialize(
    process.env.VUE_APP_PARSE_APP_ID,
    process.env.VUE_APP_PARSE_JS_KEY,
    process.env.VUE_APP_PARSE_MASTER_KEY
);
Parse.serverURL = process.env.VUE_APP_PARSE_URL;

const mocks = require('./mock-data/index.ts');
const users = {};
const teams = {};

const getUser = (name) => users[name];
const getTeam = (name) => teams[name];

(async () => {
    console.info("Creating Users")

    await Promise.all(mocks.Users.map(async (e, index) => {
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
        await u.save(e, { useMasterKey: true });
        console.info(` - ${e.username} with password ${e.password}`);
        users[e.username] = u
    }));

    console.info("Looking up Team(s)")
    await Promise.all(mocks.Teams.map(async (data, index) => {
        let team = await (new Parse.Query("Team"))
            .include("settings")
            .equalTo("slug", data.slug)
            .first({ useMasterKey: true });
        if (!team) {
            team = await Parse.Cloudata.run("newRootTeam", {
                slug: data.slug,
                name: data.name,
                admin: getUser(data.admin).id,
            }, {useMasterKey: true});
        }

        await Promise.all(["members", "leaders", "agents", "mods"].map( key => {
            if(!data[key]) return Promise.resolve(key);
            console.info(`Updating membership ${data.name}'${key} adding:${data[key]}`);
            const role = team.relation(key);
            data[key].forEach(u => {
                role.getUsers().add(getUser(u));
            })

            return role.save()
        }));

        if (data.settings) {
            console.info(`Setting ${data.name}' Team Settings`);
            const settings = await (new Parse.Query("TeamSettings"))
                .get(team.get("settings").id, { useMasterKey: true });

            await settings.save(data.settings, {useMasterKey: true});
        }

        teams[team.slug] = team
    }));

    console.info("--- Done");
    console.info("Your teams are:");

    Object.values(teams).forEach((x) => {
        console.info(` - ${x.id}: ${x.get("name")}`);
    })

})().catch(e => {
    // Deal with the fact the chain failed
    console.error("Failed", e);
});
