import type { Dict } from './id'

// English copy. Must mirror the shape of id.ts exactly (enforced by the Dict type).
const en: Dict = {
  meta: { langName: 'English', switchTo: 'Switch language' },
  header: {
    archive: 'Fujimoto Archive',
    unofficial: 'Unofficial fan site',
    langLabel: 'Language',
    skip: 'Skip to content',
  },
  gauge: {
    label: 'Depth',
    jump: 'Dive to',
    unit: 'm',
  },
  sections: {
    surface: {
      name: 'Surface',
      eyebrow: 'One-shot · 2014 · Tatsuki Fujimoto',
      title: 'Mermaid Rhapsody',
      lede: 'A piano at the bottom of the sea. Take a breath, then sink with it slowly.',
      dive: 'Dive',
      scrollHint: 'Scroll to dive',
    },
    whale: {
      name: 'Whale',
      eyebrow: 'Spoiler-free synopsis',
      title: 'A boy, a piano, and water that never runs out.',
      body: 'Toshihide, the son of a mermaid, plays piano underwater. When he runs out of air, a mermaid named Shiju saves him.',
    },
    city: {
      name: 'Sunken city',
      eyebrow: 'Characters',
      title: 'The ones who live down there',
      body: 'Character cards and official clips will surface here.',
    },
    themes: {
      name: 'Themes',
      eyebrow: 'Themes & analysis',
      title: 'What sinks along with the story',
      body: 'This part holds spoilers and will sit behind the spoiler filter.',
    },
    gallery: {
      name: 'Gallery',
      eyebrow: 'Panels & stills',
      title: 'What you can see through the water',
      body: 'An asymmetric gallery with a lightbox. Images only from the provided folder.',
    },
    info: {
      name: 'About the work',
      eyebrow: 'Release & adaptation',
      title: 'Where to find this story',
      body: 'Published in Jump SQ.19 (2014), collected in 22-26, then adapted in the 17-26 anime anthology (2025).',
    },
    seabed: {
      name: 'Seabed',
      eyebrow: 'Seabed',
      title: 'You have reached the bottom.',
      body: 'This is an unofficial, non-commercial fan site. Mermaid Rhapsody and its characters belong to Tatsuki Fujimoto and Shueisha.',
      back: 'Back to the surface',
      hub: 'More Fujimoto works at Fujimoto Archive',
    },
  },
}

export default en
