/* global Parse */

const models = require("../../src/db/models");

module.exports = {
    User: models.User,
    Role: models.Role,
    Team: models.Team,
    Activity: models.Activity,
    Group: models.Team, // Legacy Alias
    Conversation: models.Conversation,
    Message: models.Message,
    Document: models.Document,
    Comment: models.Comment,
    Link: models.Link,
    Picture: models.Picture,
    Video: models.Video,
    Objects: models.Objects,
    SLUG_MATCH: /^[a-z0-9-]+$/i,
    UNI_MATCH: /^[a-zA-Z0-9- ]+$/i,
}