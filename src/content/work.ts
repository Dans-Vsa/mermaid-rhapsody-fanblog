// Facts about the work. Source: Fujimoto Archive hub data (js/works.js). Every value here still
// needs a primary source before launch; anything unverified is flagged `todo`.
export const WORK = {
  titleJp: '人魚ラプソディ',
  titleRomaji: 'Ningyo Rhapsody',
  titleEn: 'Mermaid Rhapsody',
  author: 'Tatsuki Fujimoto',
  year: 2014,
  venue: 'Jump SQ.19',
  published: '2014-12-19', // TODO: verify against Shueisha / Jump SQ.19 issue listing
  collection: '藤本タツキ短編集 22-26',
  anime: {
    title: '藤本タツキ 17-26',
    year: 2025,
    studio: '100studio', // TODO: verify (hub data, no primary source yet)
  },
  hubUrl: 'https://dans-vsa.github.io/fujimoto-archive/',
  // takedown requests: issues on this site's own repository
  takedownUrl: 'https://github.com/Dans-Vsa/mermaid-rhapsody-fanblog/issues/new',
  hubWorkUrl: 'https://dans-vsa.github.io/fujimoto-archive/karya.html?id=mermaid-rhapsody',
} as const
