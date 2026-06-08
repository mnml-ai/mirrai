"use client";

import { useEffect } from "react";

/** iOS Safari blocks programmatic video play until the user has interacted with the page. */
export default function TouchInteractionSupport() {
  useEffect(() => {
    let unlocked = false;

    const unlockMedia = () => {
      if (unlocked) return;
      unlocked = true;

      document.querySelectorAll("video").forEach((video) => {
        video.muted = true;
        const previousTime = video.currentTime;
        void video
          .play()
          .then(() => {
            video.pause();
            video.currentTime = previousTime;
          })
          .catch(() => undefined);
      });

      document.removeEventListener("touchstart", unlockMedia, true);
      document.removeEventListener("click", unlockMedia, true);
    };

    document.addEventListener("touchstart", unlockMedia, { capture: true, passive: true });
    document.addEventListener("click", unlockMedia, { capture: true });

    return () => {
      document.removeEventListener("touchstart", unlockMedia, true);
      document.removeEventListener("click", unlockMedia, true);
    };
  }, []);

  return null;
}
