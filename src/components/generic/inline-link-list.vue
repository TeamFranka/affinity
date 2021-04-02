<template>
  <ul>
    <li v-for="l in items" :key="l.target">
      <a :href="l.target" target="_blank">
        <ion-icon v-if="showIcon" :icon="getSocialIcon(l.platform)" />
        <span v-if="showTitle">{{ l.title }}</span>
      </a>
    </li>
    <slot></slot>
  </ul>
</template>
<script lang="ts">
import { IonIcon } from "@ionic/vue";
import {
  logoWhatsapp,
  logoTwitter,
  logoSoundcloud,
  logoGithub,
  logoGitlab,
  logoLinkedin,
  logoAmazon,
  logoFacebook,
  logoStackoverflow,
  logoMedium,
  logoPaypal,
  logoReddit,
  logoSkype,
  logoSnapchat,
  logoTiktok,
  logoYoutube,
  logoVimeo,
  logoXing,
  logoInstagram,
  globeOutline,
} from "ionicons/icons";
import { defineComponent } from "vue";

export const DefaultIcon: any = globeOutline;
export const Icons: Record<string, any> = {
  whatsApp: { icon: logoWhatsapp, title: "WhatsApp", prefix: "whatsapp://" },
  skype: { icon: logoSkype, title: "skype", prefix: "skype://" },
  snapchat: { icon: logoSnapchat, title: "snapchat", prefix: "snapchat://" },
  amazon: { icon: logoAmazon, title: "amazon", prefix: "https://amazon.com" },
  youtube: {
    icon: logoYoutube,
    title: "youtube",
    prefix: "https://youtube.com",
  },
  vimeo: { icon: logoVimeo, title: "vimeo", prefix: "https://vimeo.com" },
  tiktok: { icon: logoTiktok, title: "tiktok", prefix: "https://tiktok.com" },
  soundcloud: {
    icon: logoSoundcloud,
    title: "soundcloud",
    prefix: "https://soundcloud.com",
  },
  stackoverflow: {
    icon: logoStackoverflow,
    title: "stackoverflow",
    prefix: "https://stackoverflow.com",
  },
  facebook: {
    icon: logoFacebook,
    title: "facebook",
    prefix: "https://facebook.com",
  },
  reddit: { icon: logoReddit, title: "reddit", prefix: "https://reddit.com" },
  paypal: { icon: logoPaypal, title: "paypal", prefix: "https://paypal.com" },
  medium: { icon: logoMedium, title: "medium", prefix: "https://medium.com" },
  twitter: {
    icon: logoTwitter,
    title: "twitter",
    prefix: "https://twitter.com/",
  },
  instagram: {
    icon: logoInstagram,
    title: "Instagram",
    prefix: "https://instagram.com/",
  },
  github: { icon: logoGithub, title: "github", prefix: "https://github.com/" },
  gitlab: { icon: logoGitlab, title: "gitlab", prefix: "https://gitlab.com/" },
  linkedin: {
    icon: logoLinkedin,
    title: "linkedin",
    prefix: "https://linkedin.com/",
  },
  xing: { icon: logoXing, title: "xing", prefix: "https://xing.com/" },
  website: { icon: globeOutline, title: "Website", prefix: "https://" },
};

export default defineComponent({
  name: "InlineLinkList",
  components: {
    IonIcon,
  },
  props: {
    showIcon: {
      type: Boolean,
    },
    showTitle: {
      type: Boolean,
    },
    items: {
      type: Array,
    },
  },
  methods: {
    getSocialIcon(l: string): any {
      return (Icons[l] || { icon: DefaultIcon }).icon;
    },
  },
});
</script>
<style scoped>
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
ul li {
  display: inline-block;
  margin-right: 0.2em;
}
ul li a {
  color: var(--menu-color);
  text-transform: uppercase;
  text-decoration: none;
}
</style>
