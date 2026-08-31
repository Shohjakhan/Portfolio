import type { PanelDefinition, SceneObjectDefinition } from "@/types/scene";

/**
 * Source of truth for what each room object is and where it leads.
 * Mirrors the mapping fixed in CLAUDE.md §2 — update both together.
 *
 * `label` is doing two jobs on purpose: it's the button's accessible name
 * *and* the hover callout's handwritten title (see HoverLabel). These are
 * deliberately the storybook/destination-flavored names from the
 * interaction-system brief ("About Me", not "Coffee") rather than a literal
 * object name — paired with `description` via aria-describedby, a screen
 * reader still gets the full picture ("About Me, button — About me, my
 * story, my journey"), and a sighted visitor gets a more inviting cue than
 * a plain object label. Don't drift the two apart into a third "display
 * name" — one string, two jobs, is the whole point.
 */
export const sceneObjects: SceneObjectDefinition[] = [
  {
    id: "coffee",
    label: "About Me",
    description: "My story, my journey — pull up a chair.",
    panel: "about",
  },
  {
    id: "laptop",
    label: "My Work",
    description: "Projects, experience, recognitions, events & more.",
    panel: "work",
  },
  {
    id: "bookshelf",
    label: "My Library",
    description: "My writings, fantasy novel, favorite books, and more.",
    panel: "writings",
  },
  {
    id: "easel",
    label: "My Art",
    description: "Paintings, sketches, digital art & photography.",
    panel: "art",
  },
  {
    id: "journal",
    label: "Find me elsewhere",
    description: "Instagram, Telegram — where I write in shorter bursts.",
    panel: "notes",
  },
  {
    id: "memoryWall",
    label: "Memories",
    description: "Photos, moments, events, people.",
    panel: "memories",
  },
  {
    id: "moviePoster",
    label: "Cinema",
    description: "Favorite movies & reviews.",
    panel: "movies",
  },
  {
    id: "phone",
    label: "Let's talk",
    description: "Get in touch — happy to hear from you.",
    panel: "contact",
  },
  {
    id: "cat",
    label: "Cat & Plants",
    description: "They move, breathe, and sometimes the cat wakes up.",
    panel: "about",
  },
  {
    id: "plants",
    label: "Plants",
    description: "Just some quiet greenery keeping the room alive.",
    panel: "about",
  },
  {
    id: "plushie",
    label: "Plushie",
    description: "Anime, mangas & comfort characters.",
    panel: "writings",
  },
];

export const panels: PanelDefinition[] = [
  { id: "about", title: "About Me", subtitle: "Coffee break" },
  { id: "work", title: "My Work", subtitle: "The laptop screen" },
  { id: "writings", title: "Writings & Books", subtitle: "The bookshelf" },
  { id: "art", title: "Art", subtitle: "The easel" },
  { id: "notes", title: "Journal", subtitle: "Instagram + Telegram" },
  { id: "memories", title: "Memories", subtitle: "The photo wall" },
  { id: "movies", title: "Movies", subtitle: "The poster by the lamp" },
  { id: "contact", title: "Contact", subtitle: "The rotary phone" },
];

export function getSceneObject(id: string): SceneObjectDefinition | undefined {
  return sceneObjects.find((object) => object.id === id);
}

export function getPanel(id: string): PanelDefinition | undefined {
  return panels.find((panel) => panel.id === id);
}
