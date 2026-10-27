import { useCallback, useEffect, useState } from 'react'
import { About } from './About'
import { City } from './City'
import { Gallery } from './Gallery'
import { Info } from './Info'
import { Seabed } from './Seabed'
import { Surface } from './Surface'
import { Themes } from './Themes'
import { Whale } from './Whale'

const ABOUT_HASHES = ['#tentang', '#about']

/** The dive, top to bottom. Section ids match content/sections.ts (camera keyframes, gauge ticks). */
export function Sections() {
  const [about, setAbout] = useState(() => ABOUT_HASHES.includes(location.hash))

  useEffect(() => {
    const onHash = () => setAbout(ABOUT_HASHES.includes(location.hash))
    const onOpen = () => setAbout(true)
    addEventListener('hashchange', onHash)
    addEventListener('mr:about', onOpen)
    return () => {
      removeEventListener('hashchange', onHash)
      removeEventListener('mr:about', onOpen)
    }
  }, [])

  const close = useCallback(() => {
    setAbout(false)
    if (ABOUT_HASHES.includes(location.hash)) history.replaceState(null, '', location.pathname + location.search)
  }, [])

  return (
    <>
      <main id="main">
        <Surface />
        <Whale />
        <City />
        <Themes />
        <Gallery />
        <Info />
        <Seabed onAbout={() => setAbout(true)} />
      </main>
      <About open={about} onClose={close} />
    </>
  )
}
