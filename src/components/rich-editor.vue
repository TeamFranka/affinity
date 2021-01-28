<template>
  <ion-toolbar v-if="showToolbar">
    <ion-button
      v-for="a in actions"
      :title="a.title"
      :key="a.title"
      size="small"
      fill="clear"
      @click="execute(a.action)"
      :color="(a.stateKey && selected.includes(a.stateKey)) ? 'dark' : 'medium'"
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
import {
  IonToolbar, IonButton,
} from '@ionic/vue';
// import {
// } from 'ionicons/icons';
import { adminMd, userMd, td } from '../utils/md';

import { defineComponent } from 'vue';

const formatBlock = 'formatBlock'
const queryCommandState = (command: string) => document.queryCommandState(command)
const queryCommandValue = (command: string) => document.queryCommandValue(command)

export const exec = (command: string, value: any = null) => document.execCommand(command, false, value)

const defaultActions: Record<string, any> = {
  bold: {
    icon: '<b>B</b>',
    title: 'Bold',
    stateKey: 'bold',
    action: () => exec('bold')
  },
  italic: {
    icon: '<i>I</i>',
    title: 'Italic',
    stateKey: 'italic',
    action: () => exec('italic')
  },
  underline: {
    icon: '<u>U</u>',
    title: 'Underline',
    stateKey: 'underline',
    action: () => exec('underline')
  },
  strikethrough: {
    icon: '<strike>S</strike>',
    title: 'Strike-through',
    stateKey: 'strikeThrough',
    action: () => exec('strikeThrough')
  },
  heading1: {
    icon: '<b>H<sub>1</sub></b>',
    title: 'Heading 1',
    action: () => exec(formatBlock, '<h1>')
  },
  heading2: {
    icon: '<b>H<sub>2</sub></b>',
    title: 'Heading 2',
    action: () => exec(formatBlock, '<h2>')
  },
  heading3: {
    icon: '<b>H<sub>3</sub></b>',
    title: 'Heading 3',
    action: () => exec(formatBlock, '<h3>')
  },
  paragraph: {
    icon: '&#182;',
    title: 'Paragraph',
    action: () => exec(formatBlock, '<p>')
  },
  quote: {
    icon: '&#8220; &#8221;',
    title: 'Quote',
    action: () => exec(formatBlock, '<blockquote>')
  },
  olist: {
    icon: '&#35;',
    title: 'Ordered List',
    action: () => exec('insertOrderedList')
  },
  ulist: {
    icon: '&#8226;',
    title: 'Unordered List',
    action: () => exec('insertUnorderedList')
  },
  code: {
    icon: '&lt;/&gt;',
    title: 'Code',
    action: () => exec(formatBlock, '<pre>')
  },
  line: {
    icon: '&#8213;',
    title: 'Horizontal Line',
    action: () => exec('insertHorizontalRule')
  }
};

export const DefaultActions = ['bold', 'italic', 'underline'];

export const AllActions = [
  'bold', 'italic', 'underline', 'strikethrough',
  'heading1', 'heading2', 'heading3',
  'pagragraph', 'quote', 'olist', 'ulist',
//  'line', 'code',
];

export default defineComponent({
  name: 'RichEditor',
  components: {
    IonToolbar,
    IonButton, //RenderMd
  },
  emits: ['change'],
  props: {
    classes: { },
    defaultParagraphSeparator: {
      type: String,
      required: true,
      default: "p",
    },
    showToolbar: {
      type: Boolean,
      default: true
    },
    enabledActions: {
      default: DefaultActions,
    },
    extraActions: {
      default: []
    },
    startText: {
      type: String,
      default: ''
    },
    isAdminMd: {
      type: Boolean
    },
    placeholder: {
      type: String,
      default: "Type your text here"
    },
    debounce: {
      type: Number,
      default: 500,
    }
  },
  data(props) {
    const r = props.isAdminMd ? adminMd : userMd;
    const startingContent = r.render(props.startText);
    const timeoutId: any = null;
    return {
      selected: [''],
      startingContent,
      timeoutId,
    }
  },
  computed: {
    content(): HTMLElement {
      return (this.$refs.content as HTMLElement)
    },
    paragrapher(): string {
      return `<${this.defaultParagraphSeparator}>`;
    },
    actions(): any[] {
      const actions = this.enabledActions.map(x => defaultActions[x]).filter(x=>!!x);
      return actions.concat(this.extraActions);
    },
    actionStates(): string[] {
      return this.actions.filter(x => !!x.stateKey ).map(x => x.stateKey)
    },
  },
  methods: {
    clear(){
      this.content.innerHTML = '';
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
      this.selected = this.actionStates.filter(a => queryCommandState(a));
    },
    oninput(ev: InputEvent) {
      const content = this.content;
      const firstChild = (ev.target as Node).firstChild;
      if (firstChild && firstChild.nodeType === 3) exec(formatBlock, this.paragrapher)
      else if (content.innerHTML === '<br>') content.innerHTML = ''
      this.refreshSelected();
      this.emitChanged();
    },
    onkeydown(event: KeyboardEvent) {
      if (event.key === 'Enter' && queryCommandValue(formatBlock) === 'blockquote') {
        setTimeout(() => exec(formatBlock, this.paragrapher), 0)
      }
      this.refreshSelected();
    }
  }
});
</script>
<style scoped>
[contenteditable]{
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
