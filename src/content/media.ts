// Every image and video on the site is declared here, and components only read from this file.
//
// Rules (see README):
// - Stills: ONLY files the site owner places in public/media/stills (WebP, long side <= 1280px).
//   Never scraped or downloaded. Each still needs a caption, an analytic note and a credit.
// - Trailers: official embeds only, played through youtube-nocookie after a click. No thumbnails are
//   fetched from YouTube before that click (the poster is drawn locally).
// - Missing files are fine: the UI renders a themed placeholder for every empty slot.

export type Localized = { id: string; en: string }

export type Still = {
  id: string
  type: 'still' | 'keyvisual'
  /** path under public/, e.g. 'media/stills/plaza.webp'. null = placeholder until provided */
  src: string | null
  width?: number
  height?: number
  alt: Localized
  caption: Localized
  /** why this frame matters: the "review / analysis" context required for fair use */
  note: Localized
  credit: string
  source: { label: string; url: string }
  year: number
}

export type Trailer = {
  id: string
  type: 'trailer'
  youtubeId: string
  title: Localized
  caption: Localized
  credit: string
  source: { label: string; url: string }
  year: number
}

const ANIME_CREDIT = '© Tatsuki Fujimoto / Shueisha · Tatsuki Fujimoto 17-26 Production Committee'

// IDs taken from the owner's Love is Blind fan wiki CREDITS.md (official avex pictures / Prime Video
// uploads for the 17-26 anthology). TODO: re-confirm they are still live on the official channel.
export const TRAILERS: Trailer[] = [
  {
    id: 'pv-anthology',
    type: 'trailer',
    youtubeId: 'NRxLpXAqWiw',
    title: { id: 'Trailer antologi 17-26', en: '17-26 anthology trailer' },
    caption: {
      id: 'Trailer resmi untuk seluruh antologi anime, bukan khusus episode Mermaid Rhapsody.',
      en: 'Official trailer for the whole anime anthology, not specific to the Mermaid Rhapsody episode.',
    },
    credit: '© avex pictures / Prime Video · ' + ANIME_CREDIT,
    source: { label: 'YouTube (official)', url: 'https://www.youtube.com/watch?v=NRxLpXAqWiw' },
    year: 2025,
  },
  {
    id: 'pv-special',
    type: 'trailer',
    youtubeId: 'bnnbCdR6sIE',
    title: { id: 'PV spesial 17-26', en: '17-26 special PV' },
    caption: {
      id: 'PV spesial antologi. Episode Mermaid Rhapsody hanya salah satu dari delapan cerita di dalamnya.',
      en: 'Special PV for the anthology. Mermaid Rhapsody is one of the eight stories in it.',
    },
    credit: '© avex pictures / Prime Video · ' + ANIME_CREDIT,
    source: { label: 'YouTube (official)', url: 'https://www.youtube.com/watch?v=bnnbCdR6sIE' },
    year: 2025,
  },
]

// Empty slots until the owner adds files to public/media/stills. Fill `src`, size, captions and the
// exact credit when a still is provided; until then the gallery shows a themed placeholder.
const slot = (id: string, captionId: string, captionEn: string): Still => ({
  id,
  type: 'still',
  src: null,
  alt: { id: 'Tempat still, gambar belum tersedia', en: 'Still slot, image not provided yet' },
  caption: { id: captionId, en: captionEn },
  note: {
    id: 'Still resmi akan ditaruh di sini bersama catatan kenapa adegan ini penting.',
    en: 'An official still will sit here with a note on why the scene matters.',
  },
  credit: ANIME_CREDIT,
  source: { label: 'TODO', url: '' },
  year: 2025,
})

export const STILLS: Still[] = [
  slot('slot-surface', 'Permukaan', 'The surface'),
  slot('slot-piano', 'Piano', 'The piano'),
  slot('slot-city', 'Kota di bawah', 'The city below'),
  slot('slot-breath', 'Napas', 'Breath'),
  slot('slot-shiju', 'Shiju', 'Shiju'),
]

/** The first stills double as the floating panels in the "Clips" part of the sunken city. */
export const CLIP_STILLS = STILLS.slice(0, 3)
