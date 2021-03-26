import Parse from "parse/node";

const EXTRA_DEFAULT_FIELDS: Record<string, string[]> = {
  _Role: ["name", "users", "roles"],
  _User: ["emailVerified", "authData", "username", "password", "email"],
  _Installation: [
    "installationId",
    "deviceToken",
    "deviceType",
    "pushType",
    "GCMSenderId",
    "timeZone",
    "localeIdentifier",
    "badge",
    "appVersion",
    "appName",
    "parseVersion",
    "appIdentifier",
    "channelUris",
    "channels",
  ],
};

// This function update, migrate and create Classes
export const buildSchemas = async (localSchemas: any[]) => {
  try {
    const timeout = setTimeout(() => {
      if (process.env.NODE_ENV === "production") process.exit(1);
    }, 20000);
    const allCloudSchema = (await Parse.Schema.all()).filter(
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      (s: any) => !lib.isDefaultSchema(s.className)
    );
    clearTimeout(timeout);
    // Hack to force session schema to be created
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    await lib.createDeleteSession();
    await Promise.all(
      localSchemas.map(async (localSchema) =>
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        lib.saveOrUpdate(allCloudSchema, localSchema)
      )
    );
  } catch (e) {
    console.error(e);
    if (process.env.NODE_ENV === "production") process.exit(1);
  }
};

export const lib = {
  createDeleteSession: async () => {
    const session = new Parse.Session();
    await session.save(null, { useMasterKey: true });
    await session.destroy({ useMasterKey: true });
  },
  saveOrUpdate: async (allCloudSchema: any[], localSchema: any) => {
    const cloudSchema = allCloudSchema.find(
      (sc) => sc.className === localSchema.className
    );
    if (cloudSchema) {
      await lib.updateSchema(localSchema, cloudSchema);
    } else {
      await lib.saveSchema(localSchema);
    }
  },
  saveSchema: async (localSchema: any) => {
    console.log("New: ", localSchema.className);
    const newLocalSchema = new Parse.Schema(localSchema.className);
    // Handle fields
    Object.keys(localSchema.fields)
      .filter(
        (fieldName) => !lib.isDefaultFields(localSchema.className, fieldName)
      )
      .forEach((fieldName) => {
        const { type, ...others } = localSchema.fields[fieldName];
        lib.handleFields(newLocalSchema, fieldName, type, others);
      });
    // Handle indexes
    if (localSchema.indexes) {
      Object.keys(localSchema.indexes).forEach((indexName) =>
        newLocalSchema.addIndex(indexName, localSchema.indexes[indexName])
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    newLocalSchema.setCLP(localSchema.classLevelPermissions);
    return newLocalSchema.save();
  },
  updateSchema: async (localSchema: any, cloudSchema: any) => {
    console.info("Updating: ", localSchema.className);
    const newLocalSchema: any = new Parse.Schema(localSchema.className);

    // Handle fields
    // Check addition
    Object.keys(localSchema.fields)
      .filter(
        (fieldName) => !lib.isDefaultFields(localSchema.className, fieldName)
      )
      .forEach((fieldName) => {
        const { type, ...others } = localSchema.fields[fieldName];
        if (!cloudSchema.fields[fieldName])
          lib.handleFields(newLocalSchema, fieldName, type, others);
      });

    // Check deletion
    await Promise.all(
      Object.keys(cloudSchema.fields)
        .filter(
          (fieldName) => !lib.isDefaultFields(localSchema.className, fieldName)
        )
        .map(async (fieldName) => {
          const field = cloudSchema.fields[fieldName];
          if (!localSchema.fields[fieldName]) {
            newLocalSchema.deleteField(fieldName);
            console.info(localSchema.className, "deleting", fieldName);
            await newLocalSchema.update();
            return;
          }
          const localField = localSchema.fields[fieldName];
          if (!lib.paramsAreEquals(field, localField)) {
            newLocalSchema.deleteField(fieldName);
            console.info(
              localSchema.className,
              "changeds in",
              fieldName,
              "deleting"
            );
            await newLocalSchema.update();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { type, ...others } = localField;
            lib.handleFields(newLocalSchema, fieldName, type, others);
          }
        })
    );

    // Handle Indexes
    // Check addition
    const cloudIndexes = lib.fixCloudIndexes(cloudSchema.indexes);

    if (localSchema.indexes) {
      Object.keys(localSchema.indexes).forEach((indexName) => {
        if (
          !cloudIndexes[indexName] &&
          !lib.isNativeIndex(localSchema.className, indexName)
        )
          newLocalSchema.addIndex(indexName, localSchema.indexes[indexName]);
      });
    }

    const indexesToAdd: any[] = [];

    // Check deletion
    Object.keys(cloudIndexes).forEach(async (indexName) => {
      if (!lib.isNativeIndex(localSchema.className, indexName)) {
        if (!localSchema.indexes[indexName]) {
          newLocalSchema.deleteIndex(indexName);
        } else if (
          !lib.paramsAreEquals(
            localSchema.indexes[indexName],
            cloudIndexes[indexName]
          )
        ) {
          newLocalSchema.deleteIndex(indexName);
          indexesToAdd.push({
            indexName,
            index: localSchema.indexes[indexName],
          });
        }
      }
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    console.info(localSchema.className, "setting class level permissions");
    newLocalSchema.setCLP(localSchema.classLevelPermissions);
    await newLocalSchema.update();
    indexesToAdd.forEach((o) => newLocalSchema.addIndex(o.indexName, o.index));
    console.info(localSchema.className, "updating indexes");
    return newLocalSchema.update();
  },

  isDefaultSchema: (className: string) =>
    [
      "_Session",
      "_PushStatus",
      //	'_Installation'
    ].indexOf(className) !== -1,

  isDefaultFields: (className: string, fieldName: string) => {
    if (
      ["objectId", "createdAt", "updatedAt", "ACL"].indexOf(fieldName) !== -1
    ) {
      return true;
    }
    return (EXTRA_DEFAULT_FIELDS[className] || []).indexOf(fieldName) !== -1;
  },

  fixCloudIndexes: (cloudSchemaIndexes: any) => {
    if (!cloudSchemaIndexes) return {};
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id_, ...others } = cloudSchemaIndexes;

    return {
      objectId: { objectId: 1 },
      ...others,
    };
  },

  isNativeIndex: (className: string, indexName: string) => {
    if (indexName === "objectId") {
      return true;
    }
    if (className === "_User") {
      switch (indexName) {
        case "case_insensitive_username":
          return true;
        case "case_insensitive_email":
          return true;
        case "username_1":
          return true;
        case "objectId":
          return true;
        case "email_1":
          return true;
        default:
          break;
      }
    }
    if (className === "_Role") {
      return true;
    }
    return false;
  },

  paramsAreEquals: (indexA: any, indexB: any) => {
    const keysIndexA = Object.keys(indexA);
    const keysIndexB = Object.keys(indexB);

    // Check key name
    if (keysIndexA.length !== keysIndexB.length) return false;
    return keysIndexA.every((k) => indexA[k] === indexB[k]);
  },

  handleFields: (
    newLocalSchema: Parse.Schema,
    fieldName: string,
    type: string,
    others: any
  ) => {
    if (type === "Relation") {
      newLocalSchema.addRelation(fieldName, others.targetClass);
    } else if (type === "Pointer") {
      const { targetClass, ...others2 } = others;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      newLocalSchema.addPointer(fieldName, targetClass, others2);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      newLocalSchema.addField(fieldName, type as any, others);
    }
  },
};
