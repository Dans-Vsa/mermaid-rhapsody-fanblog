import type { Still } from '../content/media'
import { useI18n } from '../content/i18n'

/**
 * A still if the file exists, otherwise a themed placeholder (water gradient + a silhouette that
 * matches the slot). Never fetches anything from outside the site.
 */
export function StillArt({ still, sizes = '(max-width: 820px) 90vw, 40vw' }: { still: Still; sizes?: string }) {
  const { lang } = useI18n()
  if (still.src) {
    return (
      <img
        className="still__img"
        src={`${import.meta.env.BASE_URL}${still.src}`}
        alt={still.alt[lang]}
        width={still.width}
        height={still.height}
        loading="lazy"
        decoding="async"
        sizes={sizes}
        draggable={false}
      />
    )
  }
  return (
    <div className="still__placeholder" role="img" aria-label={still.alt[lang]}>
      <svg viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <Silhouette id={still.id} />
      </svg>
    </div>
  )
}

function Silhouette({ id }: { id: string }) {
  const fill = 'rgb(237 230 214 / 0.16)'
  switch (id) {
    case 'slot-piano':
      return <path fill={fill} d="M55 70h48l6-14c4-10-2-18-14-18H70c-10 0-15 6-15 14zM60 70v14M98 70v14M74 70v14" stroke={fill} strokeWidth="2" />
    case 'slot-city':
      return <path fill={fill} d="M10 100V58h14v42zm20 0V44h12v56zm18 0V64h16v36zm22 0V36h10v64zm16 0V60h18v40zm24 0V48h12v52zm18 0V66h22v34z" />
    case 'slot-shiju':
    case 'slot-breath':
      return (
        <path
          fill={fill}
          d="M84 22a6 6 0 1 1-12 0 6 6 0 0 1 12 0zm-5 8c-6 0-9 5-9 12v14c0 8 3 16 6 24 2 6 2 10-4 14 8 0 14-3 14-9-1-8-2-15-1-22 1-8 1-14 1-20 0-8-3-13-7-13z"
        />
      )
    default:
      return <path fill={fill} d="M0 30c20-6 40 6 60 0s40-6 60 0 30 4 40 0v-30H0z" />
  }
}
