// Mock Images are copyright by BBC World Wide.

import { User } from "parse";

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

export const UserOverrides = {
    'clara': {
        'emailVerified': true,
    },
    'graham': {
        'emailVerified': true,
    },
    'river':  {
        'emailVerified': true,
    },
    'yaz':  {
        'emailVerified': true,
    },
}


export const Devices = [
    { // Clara's Android
        "channels": [
            "doctor-who:notifications",
            "doctor-who:news"
        ],
        "defaultTeamId": "doctor-who",
        "user": "clara",
        "deviceName": "Galaxy A40",
        "deviceModel": "SM-A405FN",
        "appIdentifier": "jetzt.franka.affinity",
        "appName": "TeamFranka",
        "appVersion": "1.0",
        "appBuild": "1",
        "deviceType": "android",
        "installationId": "adsfasdf12",
        "GCMSenderId": "11215447asdfasdfasd3685",
        "deviceToken": "56oH2ElRDQ9GYOgb4RMS61b:asdfadsfasdf-EbFHPKNwrNPbdmfVZt00nr370xa3nDXRRuI-JD",
    },
    { // Grahams's iPhone
        "channels": [
            "doctor-who:notifications",
            "doctor-who:news",
            "team-earth:news"
        ],
        "defaultTeamId": "doctor-who",
        "user": "graham",
        "deviceName": "iPhone 6",
        "deviceModel": "as-asdf",
        "appIdentifier": "jetzt.franka.affinity",
        "appName": "TeamFranka",
        "appVersion": "1.0",
        "appBuild": "1",
        "deviceType": "ios",
        "installationId": "adsfasdf23",
        "GCMSenderId": "11215447asdfasdfasd3685",
        "deviceToken": "foH2ElRDQ9GY34Ogb4RMS61b:asdfadsfasdf-EbFHPKNwrNPbdmfVZt00nr370xa3nDXRRuI-JD",
    },
    { // Grahams's iPad (news only)
        "channels": [
            "doctor-who:news",
            "team-earth:news"
        ],
        "defaultTeamId": "doctor-who",
        "user": "graham",
        "deviceName": "iPad Mini",
        "deviceModel": "as-asdf",
        "appIdentifier": "jetzt.franka.affinity",
        "appName": "TeamFranka",
        "appVersion": "1.0",
        "appBuild": "1",
        "deviceType": "ios",
        "installationId": "adsfasdf34",
        "GCMSenderId": "11215447asdfasdfasd3685",
        "deviceToken": "foH212ElRDQ9GYOgb4RMS61b:asdfadsfasdf-EbFHPKNwrNPbdmfVZt00nr370xa3nDXRRuI-JD",
    },
]


export const Teams = [
    {
        slug: "doctor-who",
        name: "Doctor Who",
        admin: 'river',
        members: ['clara', 'graham', 'yaz'],
        agents: ['yaz'],
        params: {
            avatar: makeFile('doctor.png')
        }
    },
    {
        slug: "team-earth",
        name: "Team Earth",
        admin: 'graham',
        members: ['graham', 'yaz'],
        agents: ['yaz'],
        params: {
            subOf: "doctor-who",
            avatar: makeFile('doctor.png')
        }
    }
];


export const FAQs = [
    {
        team: "doctor-who",
        author: 'river',
        title: "Does the Doctor have a PhD, or is that just his nickname or something?",
        text: "It's a name he picked for himself. We don't know what his real name is, and maybe never will (it has been 52 years, after all).",
        tags: ["about"]
    },
    {
        team: "doctor-who",
        author: 'river',
        title: 'Do we actually called the Doctor "Doctor Who," or is that title of the show just silly, because no one knows who he is? Like a "Who\'s on first?" joke?',
        text: 'We call him "The Doctor." The title is exactly like a "who\'s on first" joke, but more British.',
        tags: ["about"]
    },
    {
        team: "doctor-who",
        author: 'river',
        title: 'I know the police box is important. Why do people call that TARDIS?',
        text: 'TARDIS stands for "Time And Relative Dimension In Space." It is supposed to change it\'s outside depending on where in space in time it lands, but that circuit broke when the Doctor was in London in 1963, so for now until forever it looks like a 1960s British police phone box.',
        tags: ["about", "tardis"]
    },
]


export const Posts = [
    {
        team: "doctor-who",
        verb: "post",
        author: 'river',
        text: "Willkommen euch allen!",
        visibility: "public",
    },
    {
        team: "doctor-who",
        verb: "announce",
        author: 'clara',
        text: "Ein freundliches Hallo zu Yaz!!!",
        visibility: "public",
        objects: [
            {cls: "Picture", file: makeFile('yaz-huge.jpg')}
        ]
    },
    {
        team: "team-earth",
        verb: "announce",
        author: 'clara',
        text: "Ein freundliches Hallo zu Doctor huge!!!",
        visibility: "public",
        objects: [
            {cls: "Picture", file: makeFile('doctor-huge.jpg')}
        ]
    }
]

const randomUser = () => Users[Math.floor(Math.random() * Users.length)].username;

for (var i = 0; i < 100; i++) {
    Posts.push({
        team: i % 5 ? "team-earth" : "doctor-who",
        verb: i % 7 ? "announce" :  "post",
        author: i % 7 ? 'river' : randomUser(),
        text: "This is post number " + i,
        visibility: "public",
    })
}