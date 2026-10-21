/** A worn green coat and a mustard scarf on a wooden wall hook — environmental, swaying a hair. */
export function CoatOnHook() {
  return (
    <div aria-hidden className="pointer-events-none relative h-full w-full">
      {/* eslint-disable-next-line @next/next/no-img-element -- painted art, matches the room's plain <img> convention */}
      <img
        src="/assets/scene/living/coat.png"
        alt=""
        className="coat-sway h-full w-full object-contain object-top drop-shadow-[3px_6px_8px_rgba(0,0,0,0.5)]"
      />
    </div>
  );
}
