import type { Dict } from './id'

// English copy. Must mirror the shape of id.ts exactly (enforced by the Dict type).
const en: Dict = {
  meta: { langName: 'English', switchTo: 'Switch language' },
  header: {
    archive: 'Fujimoto Archive',
    unofficial: 'Unofficial fan site',
    langLabel: 'Language',
    skip: 'Skip to content',
    about: 'About',
    soundOn: 'Turn on sea sound',
    soundOff: 'Turn off sea sound',
  },
  gauge: { label: 'Depth', jump: 'Dive to', unit: 'm' },
  loader: { filling: 'Filling lungs', ready: '3D sea ready', status: 'Loading the 3D sea' },
  spoiler: {
    hidden: 'This part contains spoilers',
    reveal: 'Reveal spoiler',
    hide: 'Hide again',
    revealAll: 'Reveal all spoilers',
    hideAll: 'Hide all spoilers',
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
      aside: 'That is the premise. The rest is better found on the pages themselves.',
    },
    city: {
      name: 'Sunken city',
      eyebrow: 'Characters',
      title: 'The ones who live down there',
      body: 'Two names from the official premise. Open a card for a short note.',
      more: 'Read note',
      less: 'Close note',
      knownLabel: 'What we know',
      appearsLabel: 'Appears in',
      appears: 'One-shot (2014), 17-26 anime anthology episode (2025)',
      characters: {
        toshihide: {
          name: 'Toshihide',
          role: 'Son of a mermaid',
          known: 'Plays piano underwater. Down there, he can run out of air.',
          note: 'A full profile will be written from the manga itself, not from memory. Coming later.',
        },
        shiju: {
          name: 'Shiju',
          role: 'Mermaid',
          known: 'Saves Toshihide when he runs out of air.',
          note: 'On this page she is drawn as a silhouette on purpose. Try pointing at her in the city.',
        },
      },
    },
    clips: {
      eyebrow: 'Clips',
      title: 'A window in the sea wall',
      body: 'Official videos play straight from YouTube and only load after you click. Stills float by as panels.',
      play: 'Play video',
      consent: 'Playing loads the YouTube player (youtube-nocookie.com).',
      stillSoon: 'Still not provided yet',
      credit: 'Credit',
      source: 'Source',
    },
    themes: {
      name: 'Themes',
      eyebrow: 'Themes & analysis',
      title: 'What sinks along with the story',
      body: 'This is our reading, not an official explanation. Written from the premise, and still kept behind the spoiler filter for anyone who wants to go in blind.',
      items: [
        {
          title: 'Breath as a clock',
          body: 'One thing is certain from the premise: underwater, Toshihide can run out of air. That gives every note he plays a time limit. This site borrows the idea: the depth reading at the side of the screen can also be read as breath left.',
        },
        {
          title: 'Making music where it cannot exist',
          body: 'A piano is not built for the sea. Fujimoto often puts making things at the centre of a story, drawing in Look Back, filmmaking in Goodbye, Eri. Here the art sounds in the least likely place for it.',
        },
        {
          title: 'A child of two worlds',
          body: 'Toshihide is the son of a mermaid, yet he needs air. A premise that simple already holds a bigger question: where can he actually live?',
        },
      ],
      more: 'Scene-by-scene analysis will be added once official stills are available.',
    },
    gallery: {
      name: 'Gallery',
      eyebrow: 'Panels & stills',
      title: 'What you can see through the water',
      body: 'A few, on purpose. Every image comes with context and credit. Not a collection.',
      empty: 'No still yet. This slot is waiting for an official image.',
      open: 'Enlarge',
      close: 'Close',
      prev: 'Previous',
      next: 'Next',
      of: 'of',
    },
    info: {
      name: 'About the work',
      eyebrow: 'Release & adaptation',
      title: 'Where to find this story',
      facts: [
        ['Original title', '人魚ラプソディ (Ningyo Rhapsody)'],
        ['Creator', 'Tatsuki Fujimoto'],
        ['Format', 'One-shot'],
        ['Published', 'Jump SQ.19, 2014'],
        ['Collected in', 'Short story collection 22-26'],
        ['Anime', 'Episode in the 17-26 anthology (2025)'],
      ],
      triviaTitle: 'Small notes',
      trivia: [
        'The numbers 17-21 and 22-26 on Fujimoto’s two short story collections refer to his age when he drew those stories.',
        'The 17-26 anime anthology adapts stories from both books at once.',
      ],
      othersTitle: 'More Fujimoto works in this network',
      hub: 'Every work at Fujimoto Archive',
    },
    seabed: {
      name: 'Seabed',
      eyebrow: 'Seabed',
      title: 'You have reached the bottom.',
      body: 'Thanks for diving all the way down. If the story caught you, read the real thing.',
      back: 'Back to the surface',
      hub: 'More Fujimoto works at Fujimoto Archive',
    },
  },
  footer: {
    disclaimer:
      'Unofficial, non-commercial fan site. Not affiliated with Tatsuki Fujimoto, Shueisha, or the anime production.',
    rights: 'Mermaid Rhapsody and its characters © Tatsuki Fujimoto / Shueisha. Anime material © its respective owners.',
    about: 'About & credits',
    takedown: 'Takedown requests',
    made: 'Made by a fan, with home-made 3D models.',
  },
  about: {
    title: 'About this site',
    close: 'Close',
    intro:
      'This is a semi-wiki fan site for Tatsuki Fujimoto’s one-shot Mermaid Rhapsody, part of the Fujimoto Archive network. It exists to appreciate the work and to get people to read the original.',
    sections: [
      {
        title: 'Unofficial',
        body: 'We are not affiliated with Tatsuki Fujimoto, Shueisha, Jump SQ., or the 17-26 anime production committee. The site sells nothing and runs no ads.',
      },
      {
        title: 'Copyright',
        body: 'Mermaid Rhapsody, its title and characters © Tatsuki Fujimoto / Shueisha. Anime stills and video © Tatsuki Fujimoto / Shueisha · Tatsuki Fujimoto 17-26 Production Committee. Videos play through official embeds and are never re-uploaded. Stills are shown small, always with review context and credit.',
      },
      {
        title: 'Home-made',
        body: 'The whale, the mermaid, the sunken city and every water effect were made by hand in Blender and code. Fonts: Shippori Mincho B1, Hanken Grotesk, Geist Mono (SIL OFL).',
      },
      {
        title: 'Takedown requests',
        body: 'Rights holders who want any material removed can get in touch through the link below. Requests are handled promptly.',
      },
    ],
    contact: 'Send a request',
  },
}

export default en
