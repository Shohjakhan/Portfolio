"use client";

import { useEffect, useRef, useState } from "react";
import { LayeredArt } from "@/components/shared/LayeredArt";
import { getSceneObject } from "@/data/sceneObjects";
import { audioManager } from "@/lib/audio/manager";
import { InteractiveObject } from "@/primitives/InteractiveObject";
import { SoundTrigger } from "@/primitives/SoundTrigger";
import { sceneActions } from "@/state/sceneStore";
import { cn } from "@/utils/cn";

const definition = getSceneObject("phone")!;

/** Must match `.phone-ring`'s animation duration in animations.css — how
 * long the ring-and-lift plays before the click actually opens Contact,
 * so picking up the phone reads as a real beat rather than an instant cut. */
const RING_DURATION_MS = 700;

/**
 * The rotary phone → "Let's talk". Clicking doesn't call `onActivate`
 * immediately — `ringing` plays the ring (the whole phone shakes, see
 * `.phone-ring`) first, then opens Contact after `RING_DURATION_MS`, so the
 * click has a real beat instead of an instant cut to the modal.
 */
export function Phone() {
  const [ringing, setRinging] = useState(false);
  const [ringCount, setRingCount] = useState(0);
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  const handleActivate = () => {
    if (ringing) return;
    setRinging(true);
    setRingCount((count) => count + 1);
    timeoutRef.current = window.setTimeout(() => {
      // The "telephone interaction" cue — a distinct handset-pickup/click
      // sound at the moment the call actually "connects," separate from
      // the ring that's been playing for the last RING_DURATION_MS.
      audioManager.playInteraction("phoneHandset");
      sceneActions.openPanel(definition.panel);
      setRinging(false);
    }, RING_DURATION_MS);
  };

  return (
    <InteractiveObject
      id={definition.id}
      label={definition.label}
      description={definition.description}
      onActivate={handleActivate}
      idleAnimation="none"
      hoverEffect="glow"
      className="h-full w-full"
    >
      {/* One painted phone (art-source/06-landing-objects/). The handset
          isn't a separate layer in this art, so the old handset-lift is
          gone; the ring still shakes the whole phone before Contact opens. */}
      <LayeredArt
        glowSrc="/assets/scene/desk/phone.png"
        aspect="380 / 355"
        className={cn("drop-shadow-[var(--shadow-warm-md)]", ringing ? "phone-ring" : "phone-idle-tremble")}
        layers={[{ src: "/assets/scene/desk/phone.png" }]}
      />
      {/* Wired now, gated on sceneStore.audioEnabled, silently no-ops
          until a real ring sound file exists at this cue's path. */}
      <SoundTrigger cue="phoneRing" trigger={ringCount} />
    </InteractiveObject>
  );
}
