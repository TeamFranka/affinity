<template>
  <ion-toolbar v-if="showToolbar">
    <ion-button
      v-for="a in actions"
      :title="a.title"
      :key="a.title"
      size="small"
      fill="clear"
      @click="execute(a.action)"
      :color="a.stateKey && selected.includes(a.stateKey) ? 'dark' : 'medium'"
      v-html="a.icon"
    />
  </ion-toolbar>
  <div
    class="ion-padding-bottom"
    :data-placeholder="placeholder"
    ref="content"
    data-cy="richEditor"
    contenteditable="true"
    @input="oninput"
    @keydown="onkeydown"
    @mouseup="refreshSelected"
    @keyup="refreshSelected"
    v-html="startingContent"
  />
</template>
<script lang="ts">
import { IonToolbar, IonButton } from "@ionic/vue";
// import {
// } from 'ionicons/icons';
import { adminMd, userMd, td } from "../utils/md";
import i18n from "@/utils/i18n";

import { defineComponent } from "vue";

const formatBlock = "formatBlock";
const queryCommandState = (command: string) =>
  document.queryCommandState(command);
const queryCommandValue = (command: string) =>
  document.queryCommandValue(command);

export const exec = (command: string, value: any = null) =>
  document.execCommand(command, false, value);

const $t = (x: string) => i18n.global.t(x);

const defaultActions: Record<string, any> = {
  bold: {
    icon: $t("richEditor.actions.boldIcon"),
    title: $t("richEditor.actions.bold"),
    stateKey: "bold",
    action: () => exec("bold"),
  },
  italic: {
    icon: $t("richEditor.actions.italicIcon"),
    title: $t("richEditor.actions.italic"),
    stateKey: "italic",
    action: () => exec("italic"),
  },
  underline: {
    icon: $t("richEditor.actions.underlineIcon"),
    title: $t("richEditor.actions.underline"),
    stateKey: "underline",
    action: () => exec("underline"),
  },
  strikethrough: {
    icon: $t("richEditor.actions.strikethroughIcon"),
    title: $t("richEditor.actions.strikethrough"),
    stateKey: "strikeThrough",
    action: () => exec("strikeThrough"),
  },
  heading1: {
    icon: $t("richEditor.actions.h1Icon"),
    title: $t("richEditor.actions.h1"),
    action: () => exec(formatBlock, "<h1>"),
  },
  heading2: {
    icon: $t("richEditor.actions.h2Icon"),
    title: $t("richEditor.actions.h2"),
    action: () => exec(formatBlock, "<h2>"),
  },
  heading3: {
    icon: $t("richEditor.actions.h3Icon"),
    title: $t("richEditor.actions.h3"),
    action: () => exec(formatBlock, "<h3>"),
  },
  paragraph: {
    icon: $t("richEditor.actions.paragraphIcon"),
    title: $t("richEditor.actions.paragraph"),
    action: () => exec(formatBlock, "<p>"),
  },
  quote: {
    icon: $t("richEditor.actions.quoteIcon"),
    title: $t("richEditor.actions.quote"),
    action: () => exec(formatBlock, "<blockquote>"),
  },
  olist: {
    icon: $t("richEditor.actions.orderedListIcon"),
    title: $t("richEditor.actions.orderedList"),
    action: () => exec("insertOrderedList"),
  },
  ulist: {
    icon: $t("richEditor.actions.unorderedListIcon"),
    title: $t("richEditor.actions.unorderedList"),
    action: () => exec("insertUnorderedList"),
  },
  code: {
    icon: $t("richEditor.actions.codeIcon"),
    title: $t("richEditor.actions.code"),
    action: () => exec(formatBlock, "<pre>"),
  },
  line: {
    icon: $t("richEditor.actions.hrIcon"),
    title: $t("richEditor.actions.hr"),
    action: () => exec("insertHorizontalRule"),
  },
};

export const DefaultActions = ["bold", "italic", "underline"];

export const AllActions = [
  "bold",
  "italic",
  "underline",
  "strikethrough",
  "heading1",
  "heading2",
  "heading3",
  "pagragraph",
  "quote",
  "olist",
  "ulist",
  //  'line', 'code',
];

export default defineComponent({
  name: "RichEditor",
  components: {
    IonToolbar,
    IonButton, //RenderMd
  },
  emits: ["change"],
  props: {
    classes: {},
    defaultParagraphSeparator: {
      type: String,
      required: true,
      default: "p",
    },
    showToolbar: {
      type: Boolean,
      default: true,
    },
    enabledActions: {
      default: DefaultActions,
    },
    extraActions: {
      default: [],
    },
    startText: {
      type: String,
      default: "",
    },
    isAdminMd: {
      type: Boolean,
    },
    placeholder: {
      type: String,
      default: $t("richtEditor.defaults.placeholder"),
    },
    debounce: {
      type: Number,
      default: 500,
    },
  },
  data(props) {
    const r = props.isAdminMd ? adminMd : userMd;
    const startingContent = r.render(props.startText);
    const timeoutId: any = null;
    return {
      selected: [""],
      startingContent,
      timeoutId,
    };
  },
  computed: {
    content(): HTMLElement {
      return this.$refs.content as HTMLElement;
    },
    paragrapher(): string {
      return `<${this.defaultParagraphSeparator}>`;
    },
    actions(): any[] {
      const actions = this.enabledActions
        .map((x) => defaultActions[x])
        .filter((x) => !!x);
      return actions.concat(this.extraActions);
    },
    actionStates(): string[] {
      return this.actions.filter((x) => !!x.stateKey).map((x) => x.stateKey);
    },
  },
  methods: {
    clear() {
      this.content.innerHTML = "";
    },
    emitChanged() {
      this.timeoutId && clearTimeout(this.timeoutId);

      this.timeoutId = setTimeout(() => {
        this.$emit("change", td.turndown(this.content.innerHTML));
        this.timeoutId = null;
      }, this.debounce);
    },
    execute(action: any) {
      action();
      this.refreshSelected();
      this.focus();
    },
    focus() {
      this.content.focus();
    },
    refreshSelected() {
      this.selected = this.actionStates.filter((a) => queryCommandState(a));
    },
    oninput(ev: InputEvent) {
      const content = this.content;
      const firstChild = (ev.target as Node).firstChild;
      if (firstChild && firstChild.nodeType === 3)
        exec(formatBlock, this.paragrapher);
      else if (content.innerHTML === "<br>") content.innerHTML = "";
      this.refreshSelected();
      this.emitChanged();
    },
    onkeydown(event: KeyboardEvent) {
      if (
        event.key === "Enter" &&
        queryCommandValue(formatBlock) === "blockquote"
      ) {
        setTimeout(() => exec(formatBlock, this.paragrapher), 0);
      }
      this.refreshSelected();
    },
  },
});
</script>
<style scoped>
[contenteditable] {
  padding-left: var(--padding-start);
  padding-right: var(--padding-end);
  padding-top: var(--padding-top);
  padding-bottom: var(--padding-bottom);
}
[contenteditable]:empty:before {
  content: attr(data-placeholder);
  color: var(--ion-color-medium);
  display: inline-block;
  font-style: italic;
}
</style>
