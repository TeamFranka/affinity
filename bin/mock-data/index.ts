// Mock Images are copyright by BBC World Wide.

const Parse = require('parse/node');
const fs = require('fs');

const makeFile = (path: string) => {
    return new Parse.File(
        path,
        {base64: fs.readFileSync(`${__dirname}/files/${path}`, {encoding: "base64"})}
    );
}


export const Users = [
    { // Clara
        username: "clara",
        password: "clara",
        name: "Clara Oswald",
        avatar: makeFile('clara.png')
    },
    {
        username: "river",
        password: "river",
        name: "River Song",
        avatar: makeFile('river.png')
    },
    {
        username: "bill",
        password: "bill",
        name: "Bill",
        avatar: makeFile('bill.png')
    },
    {
        username: "ryan",
        password: "ryan",
        name: "Ryan",
        avatar: makeFile('ryan.png')
    },
    {
        username: "yaz",
        password: "yaz",
        name: "Yaz",
        avatar: makeFile('yaz.png')
    },
    {
        username: "graham",
        password: "graham",
        name: "Graham",
        avatar: makeFile('graham.png')
    }
]


export const Teams = [
    { // Clara
        slug: "doctor-who",
        name: "Doctor Who",
        admin: 'river',
        settings: {
            avatar: makeFile('doctor.png')
        }
    },
    // {
    //     slug: "team-franka",
    //     name: "Team Franka"
    // }
]