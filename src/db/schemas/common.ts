// Follow the JSON structure from REST API https://docs.parseplatform.org/rest/guide/#schema
export const CommonFields = {
  objectId: {
    type: "String",
  },
  createdAt: {
    type: "Date",
  },
  updatedAt: {
    type: "Date",
  },
  ACL: {
    type: "ACL",
  },
};

export const ViewTracking = {
  viewsCount: {
    type: "Number",
  },
  sharesCount: {
    type: "Number",
  },
  profileClicksCount: {
    type: "Number",
  },
};

export const Interactable = {
  commentsCount: {
    type: "Number",
  },
  likesCount: {
    type: "Number",
  },
  likedBy: {
    type: "Array",
  },
  reactions: {
    type: "Object",
  },
};

export const Closable = {
  closesAt: {
    type: "Date",
  },
  closedAt: {
    type: "Date",
  },
  closedBy: {
    type: "Pointer",
    targetClass: "_User",
  },
};
