import { migratePublishedAt } from "./published_at";


export async function migrate() {
    await migratePublishedAt()
}