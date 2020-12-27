
import { createGesture, Gesture } from '@ionic/vue';

const DOUBLE_CLICK_THRESHOLD = 500;

export function doubleTapGesture(el: any, fn: any): Gesture {

    let lastOnStart = 0;

    return createGesture({
      el,
      gestureName: "double-tap-like",
      threshold: 0,
      onStart: () => {
        const now = Date.now();

        if (Math.abs(now - lastOnStart) <= DOUBLE_CLICK_THRESHOLD) {
          fn()
          lastOnStart = 0;
        } else {
          lastOnStart = now;
        }
      }
    });
}