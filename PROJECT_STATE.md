# PROJECT STATE — MOS

Persistent state record. Read this to understand where the project actually stands right now, without relying on prior conversation memory. For instructions on *how to work* in this repo, see [CLAUDE.md](CLAUDE.md).

## 1. Project Identity

**Nama:** MOS Tracker

**Deskripsi:** Pelacak progres visual manual untuk alur kerja Marketing Operating System (MOS): `Marketing Landscape Analysis → Brand Strategy Development → split → cabang Organic / cabang Paid Media`. Untuk setiap proyek, pengguna mencatat sendiri status (8 status) dan file location/link tiap workshop; sistem menurunkan (derive) progres per skill, per cabang, dan per proyek dari input manual tersebut.

**Jenis sistem:** Manual / non-AI tracker. Tidak menjalankan AI, tidak menghasilkan dokumen, tidak menyimpan konten workshop — hanya melacak status.

## 2. Current Version

`0.1.0` — satu-satunya entri versi yang tercatat, di [CHANGELOG.md](CHANGELOG.md): "Initial extraction from Claude Artifact". Tidak ada entri versi lain di repository.

## 3. Current Architecture

- **Root documentation** — `README.md`, `ARCHITECTURE.md`, `FEATURES.md`, `CHANGELOG.md`, `ROADMAP.md`, `CLAUDE.md`.
- **`src/`** — aplikasi: `index.html` (shell, memuat CSS lalu `js/app.js` sebagai ES module).
- **`src/config/`** — `config.js`: data terkunci (status vocabulary, blueprint skill/workshop, pengelompokan cabang). Tanpa logika, tanpa dependensi.
- **`src/js/`** — `storage.js` (localStorage + migrasi + backup), `state.js` (store pub/sub, mutator, derivasi murni), `ui.js` (render orchestrator + helper), `app.js` (init + event delegation).
- **`src/js/modules/`** — satu fungsi render per halaman: `projects.js`, `tracker.js`, `blueprint.js`, `status-guide.js`.
- **`src/css/`** — 5 file, urutan load: `base` → `layout` → `components` → `pages` → `responsive`.
- **`docs/`** — `SYSTEM_DESIGN.md`, `MODULE_OVERVIEW.md`, `DEVELOPMENT_GUIDE.md`, `MIGRATION_REPORT.md`.

**Data flow aktual (dari source code):** user event → event delegation `data-act` di `app.js` → mutator di `state.js` (ubah `state.raw`, panggil `saveState()`, lalu `emit()`) → `render()` di `ui.js` menghitung ulang `getProjects()`/`deriveProject()` dan menulis HTML ke `#app` → `lucide.createIcons()` mengecat ulang ikon. Data turunan (status/progress) tidak pernah disimpan — selalu dihitung ulang dari status workshop mentah.

## 4. Current Implementation Status

Tersedia dan ada di repository saat ini:
- Hasil ekstraksi dari Claude Artifact React (`mos-manual-tracker.jsx`) menjadi proyek HTML/CSS/JS vanilla.
- HTML: `src/index.html`.
- CSS: 5 file di `src/css/`.
- JavaScript: `app.js`, `state.js`, `storage.js`, `ui.js`, dan 4 module render di `src/js/modules/`.
- Configuration: `src/config/config.js`.
- State management: store pub/sub + mutator + derivasi murni di `state.js`.
- Storage: load/save `localStorage`, migrasi skema, export/import backup JSON di `storage.js`.
- UI: render loop + helper (`esc`/`escAttr`, icon, mark, rail navigasi) di `ui.js`.
- Modules: Projects, Project Tracker, System Blueprint, Status Guide (4 halaman).
- Documentation: 5 dokumen root + 4 dokumen `docs/` + `CLAUDE.md`.

## 5. Validation Status

### Validated
- Sintaks JS — seluruh module lolos `node --check --input-type=module` (per `MIGRATION_REPORT.md`).
- Import graph — setiap `import` diverifikasi manual mengarah ke `export` yang ada.
- Nilai CSS — disalin verbatim dari artifact asli.

### Not Yet Validated
- Live browser run — aplikasi belum pernah dibuka dan dijalankan di browser.
- Behavior parity — belum ada perbandingan langsung terhadap artifact React asli.
- Persistence round-trip — save/reload/import/export belum diuji saat runtime.
- Cross-browser / mobile.

### Requires Manual Verification
Sesuai rekomendasi `MIGRATION_REPORT.md`: serve `src/`, tambah proyek, atur beberapa status, tambah file link, reload (data harus persist), toggle Project Type, export, lalu re-import.

**Sistem ini belum dinyatakan production-ready.**

## 6. Completed Work

Berdasarkan `CHANGELOG.md` [0.1.0]:
- Ekstraksi artifact React satu-file menjadi struktur HTML/CSS/JS terpisah (index.html, 5 file CSS, config.js, module JS per halaman).
- Port persistensi: `window.storage` (Claude host) → `localStorage`, dengan key dan logika migrasi dipertahankan.
- Port rendering: React (`useState`/JSX) → vanilla store dengan full re-render.
- Port ikon: `lucide-react` → Lucide via CDN.
- Fonts: dipertahankan melalui Google Fonts CDN eksternal (tidak berubah dari artifact asli), per `CHANGELOG.md`.
- Penambahan fitur baru: Export/Import backup JSON (tidak ada di artifact asli).
- Penulisan dokumentasi pendukung: `ARCHITECTURE.md`, `FEATURES.md`, `docs/SYSTEM_DESIGN.md`, `docs/MODULE_OVERVIEW.md`, `docs/DEVELOPMENT_GUIDE.md`, `docs/MIGRATION_REPORT.md`.
- Penambahan `CLAUDE.md` sebagai instruksi operasional untuk Claude Code.

## 7. Current Work

No active development task.

## 8. Known Limitations

- Browser validation belum dilakukan (lihat §5).
- Ketergantungan pada CDN eksternal: Lucide (icons) dan Google Fonts — butuh koneksi internet, tidak di-vendor.
- Belum ada build system (no bundler, no transpiler).
- Belum ada package manager / `package.json` (dikonfirmasi tidak ada di root repository).
- Data `localStorage` tidak otomatis mewarisi data lama dari lingkungan artifact (`window.storage`) — lingkungan penyimpanan berbeda.
- **Governance:** `CHANGELOG.md` saat ini belum mencatat penambahan `CLAUDE.md` dan `PROJECT_STATE.md`, sementara `CLAUDE.md` §9 menetapkan bahwa perubahan signifikan harus dicatat di `CHANGELOG.md`. Catatan ini hanya merekam kondisi aktual; `CHANGELOG.md` tidak diperbarui sebagai bagian dari revisi ini.
- **Code consistency:** di `src/js/storage.js`, `newProject()` men-default `type` proyek baru ke `"both"`, sedangkan `migrate()` men-default `type` yang hilang/kosong ke `"organic"`. Documented code inconsistency / behavior difference — dua jalur default yang berbeda untuk kasus serupa, belum disebut di dokumentasi lain.

## 9. Current Risks

Dari `docs/MIGRATION_REPORT.md` §9:
- Nama ikon Lucide diambil via CDN by name; jika nama berubah/dihapus upstream, ikon terkait bisa tidak muncul (layout tetap jalan).
- `window.storage` → `localStorage`: data proyek lama dari environment Artifact tidak akan muncul di repository/runtime ini (lingkungan penyimpanan berbeda; lihat juga §8).
- Full re-render memengaruhi fokus/caret pada input teks; pada pengetikan cepat/urutan tab tertentu posisi caret berpotensi terasa berbeda dari versi React.
- Stroke-width ikon status memakai default CDN, sedikit berbeda secara visual dari artifact asli (bukan pixel-identical).
- Risiko re-implementasi: render layer dibangun ulang (bukan hasil transpile), sehingga interaksi tertentu berpotensi berbeda dari artifact — hanya validasi live browser yang bisa memastikan.
- Import backup menggantikan (replace) seluruh data proyek saat ini, tidak ada mekanisme merge.

## 10. Next Development Gate

Sesuai `ROADMAP.md`: tidak ada fitur baru yang direncanakan saat ini. Langkah berikutnya yang diketahui adalah **logic refactor**, direncanakan berjalan *setelah* hasil ekstraksi ini divalidasi di browser. Refactor tersebut harus dimulai dari baseline yang sudah terverifikasi (lihat `docs/MIGRATION_REPORT.md`). Selain itu, arah pengembangan belum ditentukan.

## 11. Important Constraints

Berdasarkan `CLAUDE.md`:
- `src/config/config.js` bertanda LOCKED di kode — tidak diubah tanpa instruksi eksplisit.
- Storage key `mos-manual-tracker-v1` dan bentuk data `{ projects: [...] }` adalah kontrak data yang dipakai `migrate()` — tidak diubah tanpa rencana migrasi.
- Tidak menghapus functionality yang ada tanpa instruksi eksplisit.
- Tidak melakukan redesign UI/behavior tanpa instruksi eksplisit.
- Tidak mengubah arsitektur modul tanpa memahami dependency graph terlebih dahulu.
- Tidak mengubah data schema tanpa rencana migrasi.
- Tidak melakukan refactor besar tanpa instruksi eksplisit (refactor besar memang direncanakan, tapi baru setelah validasi browser dan atas instruksi).
- Mempertahankan behavior yang ada (tujuan proyek adalah parity dengan artifact asli, bukan perbaikan).
- Tidak menambah dependency/framework/build tool baru tanpa instruksi eksplisit.
- Tidak mengubah dependency eksternal (Lucide CDN, Google Fonts CDN) tanpa instruksi eksplisit.
- Tidak membuat commit atau push otomatis tanpa instruksi eksplisit dari user.

## 12. Repository Structure

Top level: root documentation (termasuk `CLAUDE.md` dan `PROJECT_STATE.md`), `src/` (aplikasi: `index.html`, `css/`, `config/`, `js/`, `js/modules/`), dan `docs/` (dokumentasi pendukung).

For the complete repository tree, see [README.md](README.md).

## 13. Source of Truth

- **Source code repository** — source of truth untuk implementation aktual.
- **CLAUDE.md** — instruction operasional untuk Claude Code.
- **PROJECT_STATE.md** (file ini) — current-state record.
- **ARCHITECTURE.md** — architecture documentation.
- **CHANGELOG.md** — historical change record.
- **ROADMAP.md** — future planning.

## 14. Last Updated

2026-08-14
