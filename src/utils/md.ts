import TurndownService from "turndown";
import MarkdownIt from "markdown-it";

export const td = new TurndownService();
export const userMd = new MarkdownIt().disable(["link", "image"]);
export const adminMd = new MarkdownIt();
