import { ref, Ref, watchEffect } from "@vue/runtime-core";

const DEFAULT_STYLES: Partial<CSSStyleDeclaration> = {
  background: "transparent",
  backgroundImage:
    "linear-gradient(to right, var(--ion-color-secondary) 0%, var(--ion-color-primary) 100%)",
};

export default function useHeaderStyles(profile: Ref<{ customStyles?: Partial<CSSStyleDeclaration>, background?: Parse.File }>) {
  const styles = ref<Partial<CSSStyleDeclaration>[]>([DEFAULT_STYLES]);

  watchEffect(() => {
    const customStyles = profile.value?.customStyles;
    const extraStyles: Partial<CSSStyleDeclaration> = {};
    const backgroundImage = profile.value?.background;
    if (backgroundImage) {
      extraStyles.backgroundImage = `url(${ backgroundImage.url })`;
      extraStyles.backgroundSize = "cover";
    }
    return [DEFAULT_STYLES, customStyles, extraStyles];
  });

  return styles;
}
