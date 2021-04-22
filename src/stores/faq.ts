
import { Parse } from "../config/Consts";
import { FaqEntry } from "../db/models";
import { genFeedState } from "./globals";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FaqT { }

const MODEL_KEYS = ["objects", "author", "team"];

export const Faq = genFeedState(
  "faq",
  () => new Parse.Query(FaqEntry)
      .descending("createdAt")
      .include(MODEL_KEYS),
  MODEL_KEYS
);