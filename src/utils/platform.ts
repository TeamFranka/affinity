import { computed } from "vue";
import { isPlatform } from "@ionic/vue";

const isAndroid = computed(() => isPlatform("android"));
const isIos = computed(() => isPlatform("ios"));
const isDesktop = computed(() => isPlatform("desktop"));
const isMobile = computed(() => isPlatform("android") || isPlatform("ios"));

export { isAndroid, isIos,isDesktop, isMobile }