export interface ApiEndpointDoc {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  category: 'Members' | 'Events' | 'Finance' | 'Community';
  description: string;
  authRequired: boolean;
  sampleRequest?: string;
  sampleResponse: string;
}

export const API_DOCS_LIST: ApiEndpointDoc[] = [
  {
    method: 'GET',
    path: '/api/members',
    category: 'Members',
    description: 'Mengambil daftar anggota komunitas aktif beserta peran dan status iuran.',
    authRequired: false,
    sampleResponse: `{\n  "status": "success",\n  "count": 6,\n  "data": [\n    {\n      "id": "mem-001",\n      "memberNumber": "KM-2023-001",\n      "fullName": "Arya Pratama",\n      "email": "arya.pratama@komunika.id",\n      "role": "Super Administrator",\n      "status": "aktif"\n    }\n  ]\n}`
  },
  {
    method: 'POST',
    path: '/api/members',
    category: 'Members',
    description: 'Mendaftarkan anggota baru dari aplikasi pihak ketiga.',
    authRequired: true,
    sampleRequest: `{\n  "fullName": "Budi Santoso",\n  "email": "budi.santoso@example.com",\n  "phone": "+62 812-3344-5566",\n  "tier": "reguler"\n}`,
    sampleResponse: `{\n  "status": "created",\n  "data": {\n    "id": "mem-007",\n    "memberNumber": "KM-2026-104",\n    "fullName": "Budi Santoso",\n    "status": "aktif"\n  }\n}`
  },
  {
    method: 'GET',
    path: '/api/events',
    category: 'Events',
    description: 'Mendapatkan agenda kegiatan, meetup, workshop, dan rapat pengurus komunitas.',
    authRequired: false,
    sampleResponse: `{\n  "status": "success",\n  "count": 3,\n  "data": [\n    {\n      "id": "evt-1",\n      "title": "Meetup Komunitas & Hackathon 2026",\n      "date": "2026-10-15",\n      "location": "Jakarta Creative Hub & Online",\n      "registeredAttendees": 42\n    }\n  ]\n}`
  },
  {
    method: 'POST',
    path: '/api/events',
    category: 'Events',
    description: 'Membuat agenda atau event baru komunitas via API.',
    authRequired: true,
    sampleRequest: `{\n  "title": "Workshop PWA & Angular 21",\n  "date": "2026-11-05",\n  "location": "Online via Google Meet",\n  "capacity": 100\n}`,
    sampleResponse: `{\n  "status": "created",\n  "data": {\n    "id": "evt-2",\n    "title": "Workshop PWA & Angular 21",\n    "status": "published"\n  }\n}`
  },
  {
    method: 'GET',
    path: '/api/payments',
    category: 'Finance',
    description: 'Mengambil riwayat transaksi kas dan pembayaran iuran bulanan.',
    authRequired: true,
    sampleResponse: `{\n  "status": "success",\n  "totalTransactions": 6,\n  "balance": 18450000,\n  "data": [\n    {\n      "id": "trx-1",\n      "transactionNumber": "TRX-2026-0901",\n      "amount": 50000,\n      "status": "lunas",\n      "method": "qris"\n    }\n  ]\n}`
  },
  {
    method: 'POST',
    path: '/api/payments',
    category: 'Finance',
    description: 'Memproses konfirmasi atau notifikasi pembayaran iuran (payment webhook).',
    authRequired: true,
    sampleRequest: `{\n  "memberId": "mem-001",\n  "amount": 50000,\n  "method": "qris",\n  "proofUrl": "https://example.com/receipt.jpg"\n}`,
    sampleResponse: `{\n  "status": "processed",\n  "transactionId": "trx-7",\n  "verified": true,\n  "message": "Pembayaran iuran berhasil diverifikasi."\n}`
  }
];
