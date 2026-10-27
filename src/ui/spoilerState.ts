import { createContext, useContext } from 'react'

export type SpoilerCtx = { revealAll: boolean; setRevealAll: (v: boolean) => void }
export const SpoilerContext = createContext<SpoilerCtx>({ revealAll: false, setRevealAll: () => {} })
export const useSpoilers = () => useContext(SpoilerContext)
