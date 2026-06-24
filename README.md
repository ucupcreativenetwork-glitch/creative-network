# Creative Network

Company profile website untuk Creative Network — layanan IT Infrastructure, Network, CCTV & Security, dan IT Support di Kudus dan sekitarnya.

## Fitur

- Desain modern, responsif, dan cepat (pure HTML + CSS + JS)
- Tech Explorer interaktif di setiap halaman layanan
- Formulir "Kebutuhan" dengan proteksi anti-spam (honeypot + rate limit)
- Studi kasus asli klien
- Security headers & konfigurasi siap aaPanel

## Struktur

- `index.html` — Beranda + semua section
- `layanan/` — Detail 4 layanan (Network Infra, IT Support, CCTV & Security, Server & Cloud)
- `js/tech-explorer-data.js` + `tech-explorer.js` — Data & UI interaktif merek/platform
- `css/style.css` + `js/main.js`
- `images/` — Aset (case studies, logo, portfolio)
- `.htaccess` + `deploy/nginx-security.conf` — Konfigurasi security untuk Apache/Nginx
- `robots.txt` — Blokir folder sensitif

## Cara Menjalankan Lokal

1. Double click `jalankan-website.bat` (atau jalankan manual):
   ```powershell
   cd "C:\Users\TNN IT\Desktop\company-profile"
   python -m http.server 8080
   ```
2. Buka http://localhost:8080

Atau pakai Live Server extension di VS Code.

## Deploy ke GitHub

Lihat panduan lengkap di chat Grok atau ikuti langkah singkat:

```powershell
# 1. Pastikan Git for Windows sudah terinstall (https://git-scm.com/download/win)
cd "C:\Users\TNN IT\Desktop\company-profile"

git init -b main
git add .
git commit -m "Initial commit: Creative Network company profile website"

# Ganti URL jika repo kamu berbeda
git remote add origin https://github.com/ucupcreativenetwork-glitch/creative-network.git

# Push (saat diminta password, pakai GitHub Personal Access Token)
git push -u origin main
```

## Setelah Push ke GitHub

- Repo: https://github.com/ucupcreativenetwork-glitch/creative-network
- Opsional: aktifkan GitHub Pages (Settings → Pages → Deploy from main branch)
- Untuk production di aaPanel:
  - Clone repo di server, atau
  - Upload folder (kecuali yang di-.gitignore)
  - Terapkan `deploy/nginx-security.conf` atau `.htaccess`
  - Aktifkan SSL Let's Encrypt
  - Restrict Web3Forms key ke domain kamu

## Keamanan yang Sudah Diterapkan

- Honeypot + validasi form + rate limit di `js/main.js` + `form-config.js`
- Security headers di `.htaccess` dan nginx config
- Blokir file sensitif (`jalankan-website.bat`, `.env`, deploy/, dll.)
- `robots.txt` sudah diperbarui

## Kontak / Kebutuhan

Gunakan form di website atau hubungi langsung.

---

Dibuat dengan ❤️ untuk Creative Network — 2026
