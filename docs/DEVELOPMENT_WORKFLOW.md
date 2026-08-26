# MOS DEVELOPMENT WORKFLOW

## 1. Purpose

Dokumen ini menetapkan workflow standar bagi Claude Code ketika melakukan development pada repository MOS (MOS Tracker).

Workflow ini harus menjaga:
- existing behavior
- architecture
- project state
- documentation consistency
- controlled changes
- traceability

MOS adalah sistem non-AI / manual tracker. Jangan mengasumsikan adanya AI runtime di dalam aplikasi MOS — aplikasi ini tidak menjalankan AI, tidak menghasilkan dokumen, dan tidak menyimpan konten workshop; ia hanya melacak status.

---

## 2. Source of Truth

Source of truth di repository ini terdiri dari tiga kategori yang berbeda, bukan satu ranking ordinal tunggal.

### A. Implementation Truth

- Source code aktual adalah otoritas untuk implementation behavior yang sebenarnya.
- Jika dokumentasi bertentangan dengan source code untuk fakta implementasi, source code yang menjadi dasar.

### B. Governing Instructions

- CLAUDE.md berisi standing development constraints dan operating rules.
- CLAUDE.md bukan factual source yang bersaing dengan dokumen lain.
- Aturan behavioral/governance di CLAUDE.md berlaku secara independen, terlepas dari apa yang dinyatakan dokumen lain.

### C. Documentation / Reference

Dokumen berikut diperlakukan sebagai satu kelompok dokumentasi yang tidak diberi ranking satu sama lain:

- PROJECT_STATE.md
- ARCHITECTURE.md
- FEATURES.md
- CHANGELOG.md
- ROADMAP.md
- README.md
- docs/*

Setiap dokumen ini harus mencerminkan source code aktual dan current project state, sesuai fungsinya masing-masing. Tidak ada urutan prioritas di antara dokumen-dokumen ini.

Jika terjadi konflik:
- fakta implementasi → source code yang menjadi otoritas
- aturan development/governance → CLAUDE.md yang menjadi otoritas
- dokumentasi yang berkonflik harus diperbaiki agar sesuai dengan dua sumber otoritatif di atas

Konflik dokumentasi harus dicatat dan tidak boleh diam-diam diabaikan.

---

## 3. Session Start

Setiap development session harus dimulai dengan membaca:

- CLAUDE.md
- PROJECT_STATE.md

Kemudian membaca dokumentasi lain yang relevan dengan task.

Setelah itu inspect source code yang relevan.

Claude tidak boleh langsung mengubah source code hanya berdasarkan permintaan singkat tanpa memahami konteks repository.

---

## 4. Understand the Task

Sebelum melakukan perubahan, identifikasi:

### Objective
Apa yang ingin dicapai.

### Scope
Apa yang termasuk dan tidak termasuk.

### Files Potentially Affected
File yang kemungkinan perlu diubah.

### Dependencies
Module atau file lain yang bergantung pada bagian tersebut.

### Risks
Kemungkinan regression atau perubahan behavior.

### Validation
Cara memastikan perubahan benar.

Jika requirement ambigu atau berpotensi menyebabkan perubahan architecture/destructive behavior:

STOP dan minta klarifikasi.

---

## 5. Planning

**Definisi "perubahan signifikan":** sebuah perubahan dianggap signifikan apabila dapat memengaruhi architecture, behavior, data/schema/storage contract, locked configuration, dependencies, user-visible functionality, atau melibatkan banyak file/module secara terkoordinasi. Jika ragu apakah suatu perubahan signifikan atau tidak, perlakukan sebagai signifikan dan gunakan proses planning/approval penuh. Claude tidak boleh mengklasifikasikan perubahan yang ambigu sebagai "kecil" hanya untuk melewati proses ini.

Untuk perubahan yang signifikan, Claude harus membuat implementation plan terlebih dahulu.

Plan minimal berisi:

- Objective
- Current behavior
- Proposed change
- Files affected
- Logic impact
- Risks
- Validation method

Claude tidak boleh melakukan perubahan signifikan sebelum user memberikan approval.

Untuk perubahan kecil, jelas, dan terisolasi — yaitu yang tidak memengaruhi architecture, behavior, data/schema/storage contract, locked configuration, dependencies, user-visible functionality, atau banyak file/module sekaligus — implementation dapat langsung dilakukan apabila tidak melanggar CLAUDE.md atau architecture.

Lightweight path ini tidak pernah membebaskan Claude dari: instruksi eksplisit user ketika disyaratkan, locked-configuration protection, schema/migration protection, validation, serta otorisasi commit dan push yang terpisah dan eksplisit (lihat §6, §7, §8, §12, §15). Lightweight path hanya mengurangi ceremony pada planning/approval dan pada review/reporting (§11, §13) — bukan pada gate keamanan atau otorisasi.

---

## 6. Implementation Rules

Saat melakukan implementation:

- ubah hanya file yang diperlukan
- jangan melakukan unrelated refactor
- jangan mengubah data schema atau storage contract tanpa migration plan yang disetujui user SEBELUM implementation dimulai; memeriksa migration impact saja tidak cukup sebagai otorisasi
- `src/config/config.js` berstatus LOCKED — hanya boleh diubah ketika user secara eksplisit menginstruksikan perubahan tersebut; reasoning Claude sendiri, kebutuhan yang disimpulkan, atau justifikasi yang "dapat diverifikasi" bukan izin yang cukup

Untuk batasan implementasi umum, perubahan arsitektur, penghapusan functionality, dan penambahan dependency, ikuti CLAUDE.md §6. DEVELOPMENT_WORKFLOW.md tidak menduplikasi aturan tersebut di sini.

Jika menemukan masalah di luar scope:
catat sebagai finding. Jangan otomatis memperbaikinya.

---

## 7. Validation

Setelah implementation:

Lakukan validation yang tersedia.

Periksa minimal:

- syntax
- imports
- module dependency
- affected logic
- regression risk
- consistency dengan architecture
- consistency dengan documented behavior

Hasil validation harus dibagi menjadi:

### VALIDATED
Benar-benar telah diverifikasi.

### NOT YET VALIDATED
Belum dapat diverifikasi.

### REQUIRES MANUAL VERIFICATION
Membutuhkan browser/user/manual testing.

Jangan menyatakan "working", "fixed", atau "complete" jika belum diverifikasi.

---

## 8. Browser Validation

Jika perubahan menyentuh UI/browser behavior:

Browser validation harus dipisahkan dari static/source validation.

Static validation tidak boleh dianggap sebagai browser validation.

Jika browser validation belum dilakukan:
catat secara eksplisit sebagai NOT YET VALIDATED atau REQUIRES MANUAL VERIFICATION.

**Catatan kondisi saat ini:** MOS saat ini belum memiliki browser-validation baseline karena live browser validation belum pernah dilakukan (lihat CLAUDE.md §4 dan PROJECT_STATE.md §5). Oleh karena itu:

- static validation hanya dapat memberi keyakinan pada syntax/structural correctness;
- browser validation tetap menjadi requirement terpisah ketika relevan;
- regression-risk assessment saat ini dibatasi oleh belum adanya browser baseline yang pernah tervalidasi sebelumnya.

Jangan menyatakan bahwa browser validation sudah dilakukan jika belum benar-benar dilakukan.

---

## 9. Documentation

Dokumentasi hanya diperbarui jika perubahan memang relevan.

Gunakan:

- FEATURES.md → perubahan feature
- ARCHITECTURE.md → perubahan architecture
- CHANGELOG.md → perubahan signifikan
- ROADMAP.md → perubahan arah/rencana
- PROJECT_STATE.md → perubahan current state
- README.md → perubahan pada feature list / "What it does", run/setup instructions, atau repository structure yang didokumentasikan README.md
- docs/* → detail teknis yang relevan

Jangan mengubah seluruh dokumentasi hanya karena satu file berubah. README.md tidak perlu diperbarui untuk perubahan yang tidak memengaruhi area di atas.

---

## 10. PROJECT_STATE Maintenance

PROJECT_STATE.md bukan changelog.

PROJECT_STATE.md hanya menggambarkan kondisi project saat ini.

**Definisi "material change"** (khusus untuk PROJECT_STATE.md — tidak sama dengan "perubahan signifikan" di §5): sebuah perubahan bersifat material apabila mengubah fakta yang saat ini tercatat di PROJECT_STATE.md — khususnya validation status, known limitations, current risks, current implementation status, completed work, next development gate, atau current-state information lainnya.

"Signifikan" (§5) dan "material" (bagian ini) adalah dua sumbu yang berbeda:
- Perubahan yang signifikan secara kode (mis. mengubah architecture) tidak otomatis memerlukan update PROJECT_STATE.md apabila fakta current-state yang tercatat di PROJECT_STATE.md tidak berubah.
- Perubahan yang kecil tetap bisa bersifat material apabila ia mengubah salah satu fakta current-state yang tercatat di PROJECT_STATE.md (contoh: menyelesaikan item yang sebelumnya tercatat sebagai "belum divalidasi").

Perbarui PROJECT_STATE.md hanya jika perubahan bersifat material sesuai definisi di atas.

Jangan memasukkan historical detail yang seharusnya berada di CHANGELOG.md.

Setelah perubahan yang material selesai, pastikan PROJECT_STATE.md tetap akurat.

---

## 11. Change Review

Sebelum commit, lakukan review terhadap seluruh perubahan.

**Untuk perubahan signifikan** (sesuai definisi §5), periksa seluruh poin berikut:

- apakah semua perubahan memang diperlukan?
- apakah ada file yang berubah tanpa alasan?
- apakah ada accidental modification?
- apakah source code tetap konsisten?
- apakah documentation masih konsisten?
- apakah ada regression risk?
- apakah ada secret atau credential?
- apakah ada temporary file?

**Untuk perubahan kecil, jelas, dan terisolasi** (sesuai definisi §5), review dapat disingkat menjadi pemeriksaan inti berikut — tidak boleh dilewati:

- apakah ada file yang berubah tanpa alasan (accidental modification)?
- apakah ada secret atau credential?
- apakah ada temporary file?

Jika ragu apakah suatu perubahan memenuhi kriteria kecil/jelas/terisolasi, gunakan review lengkap.

---

## 12. Git Rules

Claude Code TIDAK melakukan commit atau push secara otomatis.

Commit hanya dilakukan setelah user meminta.

Sebelum commit:

1. inspect git status
2. inspect git diff
3. pastikan scope perubahan benar
4. pastikan tidak ada accidental file
5. pastikan tidak ada secret
6. pastikan `.DS_Store` atau temporary files tidak masuk

Commit message harus singkat dan menjelaskan perubahan.

Push ke remote hanya dilakukan jika user meminta.

---

## 13. Session Completion

**Untuk perubahan signifikan** (sesuai definisi §5), sebelum mengakhiri development task Claude harus memberikan laporan lengkap:

### Changed
Daftar file yang berubah.

### Implemented
Apa yang dilakukan.

### Validation
Apa yang sudah diverifikasi.

### Not Yet Validated
Apa yang belum diverifikasi.

### Documentation
Dokumentasi yang diperbarui.

### Risks
Risiko yang masih ada.

### Next Step
Langkah berikutnya jika memang ada.

**Untuk perubahan kecil, jelas, dan terisolasi** (sesuai definisi §5), laporan dapat disingkat menjadi minimal: file yang berubah, apa yang dilakukan, dan status validasi. Bagian lain boleh diringkas atau digabung apabila memang tidak relevan.

Jika ragu apakah suatu perubahan memenuhi kriteria kecil/jelas/terisolasi, gunakan laporan lengkap.

---

## 14. Uncertainty / Safety Gate

Claude harus STOP dan meminta approval jika menemukan:

- architecture conflict
- unclear requirement
- destructive change
- data migration issue
- schema conflict
- behavior conflict
- undocumented dependency
- significant scope expansion

Jangan mengambil keputusan arsitektural besar berdasarkan asumsi.

---

## 15. Core Workflow

Gunakan workflow:

```
READ
  ↓
UNDERSTAND
  ↓
INSPECT
  ↓
PLAN
  ↓
APPROVE
  ↓
IMPLEMENT
  ↓
VALIDATE
  ↓
DOCUMENT
  ↓
REVIEW
  ↓
USER APPROVAL
  ↓
COMMIT
  ↓
PUSH
```

Review approval authorizes implementation acceptance only. It does not authorize git commit or git push. Commit and push each require their own separate, explicit user request — approval of the change is not approval to commit, and permission to commit is not permission to push. This section does not override CLAUDE.md §10, which remains the governing rule for commit and push.

Tidak ada langkah yang boleh dilewati untuk perubahan signifikan.

---

## 16. Core Principle

MOS development harus bersifat:

- controlled
- traceable
- reversible
- documented
- validated
- scope-controlled

Chat conversation bukan project source of truth.

Repository adalah persistent project environment.
