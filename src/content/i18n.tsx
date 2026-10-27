import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import id, { type Dict } from './id'
import en from './en'

export type Lang = 'id' | 'en'
export const LANGS: Lang[] = ['id', 'en']
const DICTS: Record<Lang, Dict> = { id, en }
const KEY = 'mr-lang'

type Ctx = { lang: Lang; t: Dict; setLang: (l: Lang) => void }
const I18n = createContext<Ctx | null>(null)

function initialLang(): Lang {
  const saved = localStorage.getItem(KEY)
  if (saved === 'id' || saved === 'en') return saved
  return navigator.language.toLowerCase().startsWith('id') ? 'id' : 'en'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)
  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    localStorage.setItem(KEY, l)
  }, [])
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])
  const value = useMemo(() => ({ lang, t: DICTS[lang], setLang }), [lang, setLang])
  return <I18n.Provider value={value}>{children}</I18n.Provider>
}

export function useI18n() {
  const ctx = useContext(I18n)
  if (!ctx) throw new Error('useI18n outside I18nProvider')
  return ctx
}
