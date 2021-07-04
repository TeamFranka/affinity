import Parse from 'parse/node';

export async function migratePublishedAt() {
  console.info("Migrating publication times");

  const q = new Parse.Query("Activity")
    .doesNotExist("publishedAt")
    .findAll({useMasterKey: true});

  await Promise.all((await q)
    .map((x: Parse.Object) => x.save({
        publishedAt: x.get("createdAt")
      }, { useMasterKey: true})
    )
  );
  console.info("Done Migrating publication times");
}