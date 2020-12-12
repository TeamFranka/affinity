
import Parse from 'parse';

Parse.initialize("pJ63XHNU3C14XQpdLVYDbQR3mSU4aye4LQhxap3R", "73v5ZKTHd2Wxl71zJv7NiWXLbZlZXwnESZhCUtcH");
Parse.serverURL = 'https://parseapi.back4app.com/';
// Parse.enableEncryptedUser();
Parse.enableLocalDatastore();

const VERSION = "0.0.1";
const DEFAULT_COMMUNITY = "US2YJKbs7U";

const Team = Parse.Object.extend("Team");
const Conversation = Parse.Object.extend("Conversation");

export {
    Parse, VERSION, DEFAULT_COMMUNITY,
    // models
    Team, Conversation,
}