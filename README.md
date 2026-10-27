# Mermaid Rhapsody · fan site

Fan site semi-wiki **tidak resmi** untuk one-shot Tatsuki Fujimoto **人魚ラプソディ** (*Mermaid Rhapsody*, Jump SQ.19, 2014),
bagian dari jaringan [Fujimoto Archive](https://dans-vsa.github.io/fujimoto-archive/).

Konsepnya **"Satu Tarikan Napas"**: seluruh halaman adalah satu kali menyelam. Gulir = kedalaman.
Permukaan → melewati paus → kota tenggelam → dasar laut. Angka di sisi layar adalah kedalaman, sekaligus sisa napas.

- Vite + React + TypeScript, three.js lewat React Three Fiber, drei, postprocessing. Scroll: Lenis + GSAP ticker. UI: Motion.
- Spesifikasi desain: `DESIGN.md` (basis Bugatti, palet laut dalam, aksen neon dari judul).
- Dua bahasa (ID/EN) tanpa reload. Semua teks di `src/content/id.ts` dan `src/content/en.ts`.
- Semua model 3D dibuat sendiri di Blender (`blender/`), diekspor GLB + Draco. Total aset ~43 KB.
- Tidak ada aset dari pihak ketiga. YouTube baru dimuat setelah tombol putar diklik.

## Jalankan lokal

```bash
npm install
npm run dev
```

Build: `npm run build` (hasil di `dist/`, `base: './'` sehingga bisa dipasang di path GitHub Pages mana pun).

## Struktur

```
src/content/        teks ID/EN, data karya, media.ts (satu-satunya sumber gambar & video), daftar karya lain
src/scene/          scene 3D: kamera spline, atmosfer, kota, makhluk, partikel, efek
src/sections/       tujuh section penyelaman + halaman Tentang (dialog, deep link #tentang / #about)
src/ui/             header, depth gauge, spoiler, modal, kursor, tombol magnetik, suara
src/lib/            store kedalaman (dive), scroll, ambience WebAudio
blender/            build_assets.py + helpers.py: membangun ulang semua GLB dari nol
public/models/      GLB hasil ekspor
public/draco/       decoder Draco (di-host sendiri)
public/media/stills still resmi yang disediakan pemilik situs (kosong = placeholder bertema)
```

## Menambah still

1. Taruh file WebP (sisi panjang maks ~1280 px) di `public/media/stills/`. Jangan unduh atau scrape dari internet.
2. Isi slot di `src/content/media.ts`: `src`, `width`, `height`, `alt`, `caption`, `note` (konteks ulasan), `credit`, `source`.
3. Tiga still pertama juga muncul sebagai panel melayang di bagian Cuplikan.

## Membangun ulang aset 3D

Buka Blender 5.x, lalu di tab Scripting (atau lewat Blender MCP):

```python
exec(open(r"<repo>/blender/build_assets.py", encoding="utf-8").read())
```

## Hak cipta

Mermaid Rhapsody dan karakternya © Tatsuki Fujimoto / Shueisha. Materi anime © Tatsuki Fujimoto / Shueisha ·
Tatsuki Fujimoto 17-26 Production Committee. Situs ini non-komersial dan tidak berafiliasi dengan pihak mana pun di atas.
