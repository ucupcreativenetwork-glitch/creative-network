window.TECH_EXPLORER_DATA = {
  'server-cloud': {
    title: 'Platform & Tools',
    desc: 'Klik kartu teknologi untuk melihat kegunaan, fungsi, dan skenario pemakaiannya.',
    categories: [
      { id: 'all', label: 'Semua' },
      { id: 'os', label: 'OS Server' },
      { id: 'virt', label: 'Virtualisasi' },
      { id: 'cloud', label: 'Cloud' },
      { id: 'ops', label: 'Backup & Container' }
    ],
    items: [
      {
        id: 'windows-server',
        name: 'Windows Server',
        category: 'os',
        categoryLabel: 'OS Server',
        tagline: 'Pusat layanan server untuk lingkungan Microsoft.',
        use: ['File server & sharing dokumen tim', 'Active Directory & manajemen user', 'Database & aplikasi bisnis Windows'],
        functions: ['Kelola hak akses & kebijakan password', 'Jalankan layanan jaringan internal (DNS, DHCP)', 'Remote Desktop untuk admin jarak jauh'],
        fit: 'Kantor yang sudah memakai ekosistem Windows & Microsoft 365.'
      },
      {
        id: 'ubuntu-centos',
        name: 'Ubuntu / CentOS',
        category: 'os',
        categoryLabel: 'OS Server',
        tagline: 'Server Linux stabil dengan biaya lisensi lebih hemat.',
        use: ['Web server & API backend', 'Database MySQL / PostgreSQL', 'Aplikasi custom & open source'],
        functions: ['Hosting website & sistem internal', 'Menjalankan container Docker', 'Otomasi task server via shell script'],
        fit: 'Startup, developer, dan kantor yang butuh fleksibilitas Linux.'
      },
      {
        id: 'vmware',
        name: 'VMware ESXi',
        category: 'virt',
        categoryLabel: 'Virtualisasi',
        tagline: 'Virtualisasi enterprise untuk banyak VM dalam satu server fisik.',
        use: ['Konsolidasi server (hemat hardware)', 'Pemisahan lingkungan produksi & testing', 'Disaster recovery antar host'],
        functions: ['vMotion & live migration VM', 'Snapshot sebelum update besar', 'Alokasi CPU/RAM dinamis per VM'],
        fit: 'Perusahaan menengah–besar yang butuh virtualisasi matang.'
      },
      {
        id: 'proxmox',
        name: 'Proxmox',
        category: 'virt',
        categoryLabel: 'Virtualisasi',
        tagline: 'Platform virtualisasi open source dengan web dashboard.',
        use: ['VM & container dalam satu host', 'Lab IT sekolah / kantor kecil', 'Cluster HA hemat biaya'],
        functions: ['Backup VM terjadwal', 'Kelola via browser (web UI)', 'KVM + LXC dalam satu platform'],
        fit: 'UMKM & menengah yang ingin virtualisasi profesional tanpa lisensi mahal.'
      },
      {
        id: 'hyper-v',
        name: 'Hyper-V',
        category: 'virt',
        categoryLabel: 'Virtualisasi',
        tagline: 'Virtualisasi native bawaan Windows Server.',
        use: ['Lingkungan Windows murni', 'Replikasi VM ke server cadangan', 'Isolasi aplikasi legacy'],
        functions: ['Live Migration antar host Hyper-V', 'Integrasi Active Directory', 'Replica untuk business continuity'],
        fit: 'Kantor yang sudah investasi di Windows Server.'
      },
      {
        id: 'aws',
        name: 'AWS',
        category: 'cloud',
        categoryLabel: 'Cloud',
        tagline: 'Cloud publik Amazon — skalabel dan global.',
        use: ['VPS & aplikasi production di internet', 'Storage arsip & backup offsite', 'Database managed (RDS)'],
        functions: ['EC2 compute on-demand', 'S3 object storage', 'Auto Scaling sesuai traffic'],
        fit: 'Bisnis yang butuh akses global tanpa kelola server fisik.'
      },
      {
        id: 'gcp',
        name: 'Google Cloud',
        category: 'cloud',
        categoryLabel: 'Cloud',
        tagline: 'Cloud Google untuk compute, data, dan analitik.',
        use: ['Hosting aplikasi modern', 'Integrasi dengan Google Workspace', 'Kubernetes & microservices'],
        functions: ['Compute Engine VM', 'Cloud Storage & Cloud SQL', 'BigQuery untuk analitik data'],
        fit: 'Tim yang sudah di ekosistem Google atau butuh data analytics.'
      },
      {
        id: 'veeam',
        name: 'Veeam Backup',
        category: 'ops',
        categoryLabel: 'Backup',
        tagline: 'Backup & disaster recovery untuk server dan VM.',
        use: ['Proteksi data dari ransomware', 'Recovery setelah hardware rusak', 'Replikasi ke site cadangan'],
        functions: ['Backup VM VMware/Hyper-V/Proxmox', 'Instant recovery ke titik waktu tertentu', 'Restore file granular tanpa full restore'],
        fit: 'Semua bisnis dengan data penting — kantor, sekolah, pemdes, finance.'
      },
      {
        id: 'docker',
        name: 'Docker',
        category: 'ops',
        categoryLabel: 'Container',
        tagline: 'Deploy aplikasi ringan dalam container terisolasi.',
        use: ['Microservices & aplikasi web modern', 'CI/CD pipeline', 'Portabilitas antar server & cloud'],
        functions: ['Container isolasi per aplikasi', 'Docker Compose multi-service', 'Deploy konsisten dev → production'],
        fit: 'Developer & tim yang sering rilis update aplikasi.'
      }
    ]
  },
  'network-infra': {
    title: 'Vendor & Platform',
    desc: 'Jelajahi merek jaringan dan media transmisi yang kami gunakan di proyek lapangan.',
    categories: [
      { id: 'all', label: 'Semua' },
      { id: 'router', label: 'Router & Firewall' },
      { id: 'wifi', label: 'WiFi & Switch' },
      { id: 'cable', label: 'Kabel & Fiber' }
    ],
    items: [
      {
        id: 'mikrotik',
        name: 'MikroTik',
        category: 'router',
        categoryLabel: 'Router',
        tagline: 'Router & firewall fleksibel untuk UMKM–menengah.',
        use: ['Gateway internet kantor', 'Bandwidth management & QoS', 'VPN site-to-site antar cabang'],
        functions: ['Firewall rules & NAT', 'Hotspot & voucher WiFi', 'Monitoring traffic real-time'],
        fit: 'UMKM, warnet, kantor kecil yang butuh kontrol bandwidth.'
      },
      {
        id: 'unifi',
        name: 'Ubiquiti UniFi',
        category: 'wifi',
        categoryLabel: 'WiFi Enterprise',
        tagline: 'Ekosistem WiFi + switch terkelola satu dashboard.',
        use: ['WiFi kantor & sekolah', 'Guest network terpisah', 'Coverage multi-lantai'],
        functions: ['UniFi Controller terpusat', 'Roaming seamless antar AP', 'Traffic analytics per SSID'],
        fit: 'Kantor, sekolah, hotel kecil yang butuh WiFi rapi & terkelola.'
      },
      {
        id: 'cisco',
        name: 'Cisco',
        category: 'router',
        categoryLabel: 'Enterprise',
        tagline: 'Standar jaringan korporat skala besar.',
        use: ['Core switch data center', 'Router enterprise multi-site', 'Jaringan kampus luas'],
        functions: ['High availability & redundancy', 'Advanced routing (OSPF, BGP)', 'Security integrasi enterprise'],
        fit: 'Korporat, institusi, dan gedung dengan kebutuhan jaringan tinggi.'
      },
      {
        id: 'omada',
        name: 'TP-Link Omada',
        category: 'wifi',
        categoryLabel: 'Managed Network',
        tagline: 'Jaringan terkelola dengan budget terjangkau.',
        use: ['Kantor menengah', 'Retail multi-outlet', 'Deploy cepat dengan cloud controller'],
        functions: ['SDN controller Omada', 'AP + switch + router satu ekosistem', 'Zero-touch provisioning'],
        fit: 'Bisnis yang ingin managed network tanpa biaya enterprise.'
      },
      {
        id: 'ruijie',
        name: 'Ruijie',
        category: 'wifi',
        categoryLabel: 'WiFi & Switch',
        tagline: 'Solusi jaringan untuk sekolah & gedung menengah.',
        use: ['Jaringan sekolah & kampus', 'Kantor pemerintahan', 'Proyek dengan banyak titik LAN'],
        functions: ['Switch managed Layer 2/3', 'Access point indoor/outdoor', 'Topologi ringan & stabil'],
        fit: 'Sekolah, pemdes, dan instansi dengan banyak user.'
      },
      {
        id: 'fortigate',
        name: 'FortiGate',
        category: 'router',
        categoryLabel: 'Firewall',
        tagline: 'Firewall keamanan jaringan dari Fortinet.',
        use: ['Proteksi dari ancaman internet', 'VPN remote worker', 'Filtering konten & aplikasi'],
        functions: ['UTM (Unified Threat Management)', 'IPS/IDS & antivirus gateway', 'SD-WAN antar cabang'],
        fit: 'Kantor yang butuh keamanan jaringan tingkat lanjut.'
      },
      {
        id: 'sophos',
        name: 'Sophos',
        category: 'router',
        categoryLabel: 'Firewall & Security',
        tagline: 'Firewall, endpoint protection & keamanan jaringan terpadu.',
        use: ['Gateway keamanan kantor & cabang', 'Proteksi web & email threat', 'VPN site-to-site & remote access'],
        functions: ['XG Firewall UTM', 'Synchronized Security dengan endpoint', 'Central management via Sophos Central'],
        fit: 'Kantor menengah yang ingin keamanan terintegrasi firewall + endpoint.'
      },
      {
        id: 'aruba',
        name: 'Aruba',
        category: 'wifi',
        categoryLabel: 'WiFi Enterprise',
        tagline: 'Solusi WiFi & switching enterprise dari HPE Aruba.',
        use: ['Kampus & gedung korporat', 'WiFi high-density ruang meeting', 'Jaringan kritis dengan SLA ketat'],
        functions: ['Aruba Central cloud management', 'ClearPass policy & guest access', 'Switching PoE terintegrasi dengan AP'],
        fit: 'Perusahaan & institusi yang butuh WiFi enterprise kelas atas.'
      },
      {
        id: 'alliedtelesis',
        name: 'Allied Telesis',
        category: 'wifi',
        categoryLabel: 'Switch & LAN',
        tagline: 'Switch managed & infrastruktur LAN andal untuk kantor.',
        use: ['Jaringan LAN kantor & sekolah', 'Segmentasi VLAN departemen', 'Upgrade infrastruktur switch legacy'],
        functions: ['Switch Layer 2/3 managed', 'Autonomous Management Framework (AMF)', 'PoE untuk AP & IP phone'],
        fit: 'Kantor, sekolah, dan pemdes yang butuh switching stabil & mudah dikelola.'
      },
      {
        id: 'cat6',
        name: 'Cat6 / Cat6A',
        category: 'cable',
        categoryLabel: 'Kabel LAN',
        tagline: 'Kabel structured cabling standar kecepatan tinggi.',
        use: ['Jaringan LAN kantor', 'Lab komputer sekolah', 'Koneksi AP & IP phone'],
        functions: ['1 Gbps (Cat6) hingga 10 Gbps jarak pendek (Cat6A)', 'PoE untuk AP & kamera', 'Labeling & dokumentasi rack'],
        fit: 'Semua proyek kabel struktur — fondasi jaringan yang stabil.'
      },
      {
        id: 'fiber',
        name: 'Fiber Optic',
        category: 'cable',
        categoryLabel: 'Fiber',
        tagline: 'Backbone cepat antar lantai, gedung, atau site.',
        use: ['Backbone antar lantai', 'Koneksi antar gedung', 'Link ke tower ISP'],
        functions: ['Transmisi jarak jauh tanpa degradasi', 'Immune terhadap interferensi EMI', 'Single-mode & multi-mode'],
        fit: 'Kantor multi-lantai, pabrik, dan kampus.'
      },
      {
        id: 'ruckus',
        name: 'Ruckus',
        category: 'wifi',
        categoryLabel: 'WiFi Dense',
        tagline: 'Access point performa tinggi untuk area padat.',
        use: ['Auditorium & ruang kelas padat', 'Hotel & convention', 'Stadium kecil'],
        functions: ['BeamFlex adaptive antenna', 'Kinerja stabil banyak client', 'Controller zone management'],
        fit: 'Lokasi dengan ratusan user WiFi bersamaan.'
      }
    ]
  },
  'it-support': {
    title: 'Tools & Platform yang Kami Kuasai',
    desc: 'Teknologi pendukung untuk helpdesk, maintenance, dan operasional IT harian.',
    categories: [
      { id: 'all', label: 'Semua' },
      { id: 'os', label: 'Sistem Operasi' },
      { id: 'cloud', label: 'Kolaborasi Cloud' },
      { id: 'security', label: 'Keamanan' },
      { id: 'device', label: 'Perangkat' }
    ],
    items: [
      {
        id: 'windows',
        name: 'Windows 10/11',
        category: 'os',
        categoryLabel: 'Desktop OS',
        tagline: 'OS utama workstation kantor modern.',
        use: ['Setup PC baru karyawan', 'Troubleshooting blue screen & lag', 'Update patch keamanan'],
        functions: ['Optimasi startup & performa', 'Join domain Active Directory', 'Recovery & reinstall OS'],
        fit: 'Hampir semua kantor berbasis Windows.'
      },
      {
        id: 'm365',
        name: 'Microsoft 365',
        category: 'cloud',
        categoryLabel: 'Productivity',
        tagline: 'Email, Office, Teams & cloud storage Microsoft.',
        use: ['Email bisnis @domain perusahaan', 'Kolaborasi dokumen tim', 'Meeting online via Teams'],
        functions: ['Setup mailbox & alias', 'SharePoint & OneDrive', 'Lisensi user management'],
        fit: 'Kantor yang pakai Outlook, Word, Excel secara rutin.'
      },
      {
        id: 'gworkspace',
        name: 'Google Workspace',
        category: 'cloud',
        categoryLabel: 'Productivity',
        tagline: 'Kolaborasi cloud dari Google.',
        use: ['Email Gmail bisnis', 'Dokumen & spreadsheet online', 'Google Meet untuk rapat'],
        functions: ['Admin console user & grup', 'Drive sharing permission', 'Migrasi email dari provider lain'],
        fit: 'Tim yang prefer ekosistem Google & kolaborasi real-time.'
      },
      {
        id: 'remote',
        name: 'TeamViewer / AnyDesk',
        category: 'device',
        categoryLabel: 'Remote Support',
        tagline: 'Akses jarak jauh untuk bantuan cepat.',
        use: ['Troubleshoot tanpa datang ke lokasi', 'Install software remote', 'Training user dari jauh'],
        functions: ['Screen sharing & control', 'File transfer antar PC', 'Unattended access untuk server'],
        fit: 'Dukungan IT multi-cabang seperti MUF & outlet retail.'
      },
      {
        id: 'antivirus',
        name: 'Kaspersky / ESET',
        category: 'security',
        categoryLabel: 'Endpoint Security',
        tagline: 'Proteksi virus, malware & ransomware.',
        use: ['Scan & bersihkan infeksi', 'Deploy antivirus ke seluruh PC', 'Kebijakan keamanan endpoint'],
        functions: ['Real-time protection', 'Quarantine file mencurigakan', 'Central management console'],
        fit: 'Semua bisnis yang simpan data sensitif di PC.'
      },
      {
        id: 'ad',
        name: 'Active Directory',
        category: 'security',
        categoryLabel: 'Identity',
        tagline: 'Manajemen user terpusat di jaringan Windows.',
        use: ['Akun login karyawan baru/resign', 'Group policy keamanan', 'Kontrol akses folder'],
        functions: ['Single sign-on di domain', 'Password policy & lockout', 'Organizational Unit (OU) per departemen'],
        fit: 'Kantor 10+ PC dengan server Windows.'
      },
      {
        id: 'printer',
        name: 'HP / Canon / Epson',
        category: 'device',
        categoryLabel: 'Printer',
        tagline: 'Dukungan printer & scanner kantor.',
        use: ['Instalasi driver & sharing printer', 'Perbaikan paper jam & error', 'Setup scan-to-email'],
        functions: ['Network printer mapping', 'Toner & maintenance alert', 'Scan dokumen ke folder bersama'],
        fit: 'Kantor, sekolah, klinik dengan kebutuhan cetak harian.'
      },
      {
        id: 'linux-desktop',
        name: 'Linux Desktop',
        category: 'os',
        categoryLabel: 'Desktop OS',
        tagline: 'Workstation Linux untuk kebutuhan spesifik.',
        use: ['PC developer & engineering', 'Thin client alternatif', 'Lab komputer open source'],
        functions: ['Distro setup (Ubuntu, Mint, dll.)', 'Driver & peripheral compatibility', 'Dual-boot dengan Windows'],
        fit: 'Tim tech & institusi yang adopt open source.'
      }
    ]
  },
  'cctv-security': {
    title: 'Merek & Platform',
    desc: 'Teknologi keamanan fisik — kamera, akses, dan standar integrasi yang kami implementasikan.',
    categories: [
      { id: 'all', label: 'Semua' },
      { id: 'camera', label: 'CCTV' },
      { id: 'access', label: 'Access Control' },
      { id: 'infra', label: 'Infrastruktur' }
    ],
    items: [
      {
        id: 'hikvision',
        name: 'Hikvision',
        category: 'camera',
        categoryLabel: 'CCTV IP',
        tagline: 'Ekosistem CCTV terlengkap — kamera, NVR, analytics.',
        use: ['Kantor & pabrik skala menengah–besar', 'Proyek pemerintahan & sekolah', 'Smart detection (motion, line crossing)'],
        functions: ['NVR/DVR recording', 'Mobile app Hik-Connect', 'POE camera deployment'],
        fit: 'Proyek yang butuh reliabilitas & ekosistem matang.'
      },
      {
        id: 'dahua',
        name: 'Dahua',
        category: 'camera',
        categoryLabel: 'CCTV IP',
        tagline: 'CCTV IP dengan fitur lengkap & harga kompetitif.',
        use: ['Retail & UMKM', 'Perumahan & ruko', 'Gudang & parkir'],
        functions: ['WDR & night vision IR', 'DMSS mobile viewing', 'Integrasi ONVIF'],
        fit: 'Budget efisien tanpa mengorbankan fitur inti.'
      },
      {
        id: 'uniview',
        name: 'Uniview',
        category: 'camera',
        categoryLabel: 'CCTV Enterprise',
        tagline: 'Kualitas gambar tinggi untuk proyek premium.',
        use: ['Gedung perkantoran', 'Site industri', 'Area dengan lighting challenging'],
        functions: ['4MP–8MP resolution', 'Smart codec hemat storage', 'Central management platform'],
        fit: 'Klien yang prioritaskan kualitas rekaman detail.'
      },
      {
        id: 'scati',
        name: 'Scati',
        category: 'camera',
        categoryLabel: 'Platform VMS',
        tagline: 'Platform video surveillance & keamanan terintegrasi untuk lingkungan korporat.',
        use: ['Gedung perkantoran & corporate office', 'Multi-site dengan monitoring terpusat', 'Integrasi CCTV + access control dalam satu platform'],
        functions: ['Cloud & on-premise VMS', 'Real-time analytics & alert', 'Central management multi-kamera'],
        fit: 'Perusahaan yang butuh platform keamanan enterprise terintegrasi & skalabel.'
      },
      {
        id: 'vigi',
        name: 'TP-Link VIGI',
        category: 'camera',
        categoryLabel: 'CCTV UMKM',
        tagline: 'CCTV terjangkau untuk kantor & toko kecil.',
        use: ['Toko & warung chain', 'Kantor kecil', 'Depan rumah / ruko'],
        functions: ['Setup cepat via app', 'Cloud recording opsional', 'POE & WiFi camera options'],
        fit: 'UMKM yang butuh CCTV simpel & mudah dipantau.'
      },
      {
        id: 'zkteco',
        name: 'ZKTeco',
        category: 'access',
        categoryLabel: 'Access Control',
        tagline: 'Pintu aman dengan sidik jari, kartu, atau wajah.',
        use: ['Absensi karyawan otomatis', 'Kontrol pintu server room', 'Integrasi dengan CCTV event'],
        functions: ['Fingerprint & RFID reader', 'Time attendance report', 'Door lock relay control'],
        fit: 'Kantor, pabrik, sekolah yang butuh kontrol akses fisik.'
      },
      {
        id: 'hid',
        name: 'HID Access Control',
        category: 'access',
        categoryLabel: 'Access Control Enterprise',
        tagline: 'Standar global kontrol akses — kartu RFID, reader, dan mobile credential.',
        use: ['Gedung perkantoran & kawasan industri', 'Multi-pintu dengan hak akses berjenjang', 'Site multi-lokasi dengan manajemen terpusat'],
        functions: ['RFID card & mobile credential', 'Controller & reader HID', 'Audit log & manajemen user terpusat'],
        fit: 'Perusahaan menengah–besar yang butuh sistem akses enterprise & skalabel.'
      },
      {
        id: 'hikconnect',
        name: 'Hik-Connect',
        category: 'camera',
        categoryLabel: 'Mobile App',
        tagline: 'Pantau CCTV live & playback dari smartphone.',
        use: ['Monitoring oleh owner/manager', 'Notifikasi motion alert', 'Akses multi-user untuk tim keamanan'],
        functions: ['Live view & playback', 'Push notification event', 'Sharing akses terbatas ke staff'],
        fit: 'Semua proyek Hikvision — wajib untuk monitoring mobile.'
      },
      {
        id: 'poe',
        name: 'POE Switch',
        category: 'infra',
        categoryLabel: 'Infrastruktur',
        tagline: 'Satu kabel untuk data + listrik kamera IP.',
        use: ['Instalasi kamera tanpa power outlet dekat', 'Rack NVR terpusat', 'Perluasan channel CCTV'],
        functions: ['802.3af/at power delivery', 'VLAN isolasi traffic CCTV', 'Budgeting watt per port'],
        fit: 'Semua instalasi CCTV IP profesional.'
      },
      {
        id: 'onvif',
        name: 'ONVIF',
        category: 'infra',
        categoryLabel: 'Standar',
        tagline: 'Standar agar kamera & NVR berbagai merek kompatibel.',
        use: ['Mix merek kamera dengan NVR tertentu', 'Migrasi sistem lama', 'Integrasi pihak ketiga (VMS)'],
        functions: ['Profile S/G/T interoperability', 'Discovery kamera otomatis', 'Future-proof investasi hardware'],
        fit: 'Proyek yang butuh fleksibilitas merek atau upgrade bertahap.'
      }
    ]
  }
};