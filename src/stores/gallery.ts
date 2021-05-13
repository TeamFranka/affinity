import { Parse } from "@/config/Consts";
import { Picture } from "@/db/models";
import { genFeedState } from "./globals";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GalleryT { }

const MODEL_KEYS = ["objects", "author", "team"];

export const Gallery = genFeedState({
  keyword:"gallery",
  baseQueryFn: () => new Parse.Query(Picture)
      .descending("createdAt")
      .include(MODEL_KEYS),
  keys: MODEL_KEYS
});