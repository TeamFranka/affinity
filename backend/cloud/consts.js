/* global Parse */

const models = require("./models");

module.exports = {
    User: models.User,
    Role: models.Role,
    Team: models.Team,
    Activity: models.Activity,
    Conversation: models.Conversation,
    Message: models.Message,
    Document: models.Document,
    Comment: models.Comment,
    Link: models.Link,
    Notification: models.Notification,
    Picture: models.Picture,
    Video: models.Video,
    Objects: models.Objects,
    SLUG_MATCH: /^[a-z0-9-]+$/i,
    UNI_MATCH: /^[a-zA-Z0-9- ]+$/i,
}