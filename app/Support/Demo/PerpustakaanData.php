<?php

namespace App\Support\Demo;

/**
 * Data demo Perpustakaan (PUSTAKA): buku, anggota, peminjaman, denda.
 * Denda Rp2.000/hari dihitung dari peminjaman berstatus Terlambat
 * (posisi 8 Okt 2026). Kontrak status: ['label' => .., 'tone' => ..]
 * tanpa HTML, tone ∈ success | warning | destructive | info.
 */
class PerpustakaanData
{
    private const DENDA_PER_HARI = 2000;

    private static function rp(int $value): string
    {
        return 'Rp'.number_format($value, 0, ',', '.');
    }

    /** Baris mentah buku, dipakai internal agar tidak rekursi. */
    private static function bukuRows(): array
    {
        return [
            ['id' => 1,  'judul' => 'Laskar Pelangi',                'penulis' => 'Andrea Hirata',          'kategori' => 'Fiksi',            'stok' => 8],
            ['id' => 2,  'judul' => 'Bumi Manusia',                 'penulis' => 'Pramoedya Ananta Toer',  'kategori' => 'Fiksi',            'stok' => 5],
            ['id' => 3,  'judul' => 'Atomic Habits',                'penulis' => 'James Clear',            'kategori' => 'Pengembangan Diri','stok' => 12],
            ['id' => 4,  'judul' => 'Sapiens',                      'penulis' => 'Yuval Noah Harari',      'kategori' => 'Sains',            'stok' => 6],
            ['id' => 5,  'judul' => 'Sejarah Indonesia Modern',     'penulis' => 'M.C. Ricklefs',          'kategori' => 'Sejarah',          'stok' => 4],
            ['id' => 6,  'judul' => 'Pemrograman Python',           'penulis' => 'Budi Raharjo',           'kategori' => 'Teknologi',        'stok' => 10],
            ['id' => 7,  'judul' => 'Filsafat Ilmu',                'penulis' => 'Jujun S. Suriasumantri', 'kategori' => 'Filsafat',         'stok' => 3],
            ['id' => 8,  'judul' => 'Harry Potter dan Batu Bertuah','penulis' => 'J.K. Rowling',           'kategori' => 'Fiksi',            'stok' => 7],
            ['id' => 9,  'judul' => 'The Design of Everyday Things','penulis' => 'Don Norman',             'kategori' => 'Desain',           'stok' => 5],
            ['id' => 10, 'judul' => 'Safinatun Najah',              'penulis' => 'Salim bin Sumair',       'kategori' => 'Agama',            'stok' => 9],
            ['id' => 11, 'judul' => 'Algoritma & Struktur Data',    'penulis' => 'Rinaldi Munir',          'kategori' => 'Teknologi',        'stok' => 6],
            ['id' => 12, 'judul' => 'Dilan 1990',                   'penulis' => 'Pidi Baiq',              'kategori' => 'Fiksi',            'stok' => 11],
        ];
    }

    /** Koleksi buku. */
    public static function bukus(): array
    {
        return self::bukuRows();
    }

    /** Baris mentah anggota. */
    private static function anggotaRows(): array
    {
        return [
            ['id' => 1,  'nama' => 'Ahmad Fauzi',    'id_anggota' => 'AGT-001', 'tipe' => 'Pelajar',   'sejak' => 'Jan 2025', 'status' => ['label' => 'Aktif',    'tone' => 'success']],
            ['id' => 2,  'nama' => 'Siti Rahma',     'id_anggota' => 'AGT-002', 'tipe' => 'Mahasiswa', 'sejak' => 'Mar 2025', 'status' => ['label' => 'Aktif',    'tone' => 'success']],
            ['id' => 3,  'nama' => 'Budi Hartono',   'id_anggota' => 'AGT-003', 'tipe' => 'Umum',      'sejak' => 'Jun 2024', 'status' => ['label' => 'Aktif',    'tone' => 'success']],
            ['id' => 4,  'nama' => 'Dewi Anggraini', 'id_anggota' => 'AGT-004', 'tipe' => 'Pelajar',   'sejak' => 'Sep 2025', 'status' => ['label' => 'Aktif',    'tone' => 'success']],
            ['id' => 5,  'nama' => 'Rudi Setiawan',  'id_anggota' => 'AGT-005', 'tipe' => 'Umum',      'sejak' => 'Nov 2024', 'status' => ['label' => 'Nonaktif', 'tone' => 'warning']],
            ['id' => 6,  'nama' => 'Maya Kusuma',    'id_anggota' => 'AGT-006', 'tipe' => 'Mahasiswa', 'sejak' => 'Jan 2026', 'status' => ['label' => 'Aktif',    'tone' => 'success']],
            ['id' => 7,  'nama' => 'Andi Wijaya',    'id_anggota' => 'AGT-007', 'tipe' => 'Pelajar',   'sejak' => 'Feb 2026', 'status' => ['label' => 'Aktif',    'tone' => 'success']],
            ['id' => 8,  'nama' => 'Lina Marlina',   'id_anggota' => 'AGT-008', 'tipe' => 'Umum',      'sejak' => 'Apr 2025', 'status' => ['label' => 'Aktif',    'tone' => 'success']],
            ['id' => 9,  'nama' => 'Fajar Ramadhan', 'id_anggota' => 'AGT-009', 'tipe' => 'Mahasiswa', 'sejak' => 'Agu 2025', 'status' => ['label' => 'Aktif',    'tone' => 'success']],
            ['id' => 10, 'nama' => 'Ratna Sari',     'id_anggota' => 'AGT-010', 'tipe' => 'Pelajar',   'sejak' => 'Sep 2026', 'status' => ['label' => 'Aktif',    'tone' => 'success']],
        ];
    }

    /** Daftar anggota. */
    public static function anggotas(): array
    {
        return self::anggotaRows();
    }

    /**
     * Baris mentah peminjaman. hari_telat dihitung per 8 Okt 2026
     * (buku belum dikembalikan & melewati tgl kembali).
     */
    private static function peminjamanRows(): array
    {
        return [
            ['id' => 1,  'buku' => 'Laskar Pelangi',                 'anggota' => 'Ahmad Fauzi',    'tgl_pinjam' => '01 Okt 2026', 'tgl_kembali' => '15 Okt 2026', 'hari_telat' => 0, 'status' => ['label' => 'Dipinjam',     'tone' => 'info']],
            ['id' => 2,  'buku' => 'Atomic Habits',                 'anggota' => 'Siti Rahma',     'tgl_pinjam' => '28 Sep 2026', 'tgl_kembali' => '12 Okt 2026', 'hari_telat' => 0, 'status' => ['label' => 'Dipinjam',     'tone' => 'info']],
            ['id' => 3,  'buku' => 'Sapiens',                       'anggota' => 'Budi Hartono',   'tgl_pinjam' => '20 Sep 2026', 'tgl_kembali' => '04 Okt 2026', 'hari_telat' => 4, 'status' => ['label' => 'Terlambat',    'tone' => 'destructive']],
            ['id' => 4,  'buku' => 'Bumi Manusia',                  'anggota' => 'Dewi Anggraini', 'tgl_pinjam' => '25 Sep 2026', 'tgl_kembali' => '09 Okt 2026', 'hari_telat' => 0, 'status' => ['label' => 'Dikembalikan', 'tone' => 'success']],
            ['id' => 5,  'buku' => 'Pemrograman Python',            'anggota' => 'Maya Kusuma',    'tgl_pinjam' => '02 Okt 2026', 'tgl_kembali' => '16 Okt 2026', 'hari_telat' => 0, 'status' => ['label' => 'Dipinjam',     'tone' => 'info']],
            ['id' => 6,  'buku' => 'Harry Potter dan Batu Bertuah', 'anggota' => 'Andi Wijaya',    'tgl_pinjam' => '18 Sep 2026', 'tgl_kembali' => '02 Okt 2026', 'hari_telat' => 6, 'status' => ['label' => 'Terlambat',    'tone' => 'destructive']],
            ['id' => 7,  'buku' => 'Dilan 1990',                    'anggota' => 'Lina Marlina',   'tgl_pinjam' => '30 Sep 2026', 'tgl_kembali' => '14 Okt 2026', 'hari_telat' => 0, 'status' => ['label' => 'Dipinjam',     'tone' => 'info']],
            ['id' => 8,  'buku' => 'Sejarah Indonesia Modern',     'anggota' => 'Fajar Ramadhan', 'tgl_pinjam' => '15 Sep 2026', 'tgl_kembali' => '29 Sep 2026', 'hari_telat' => 0, 'status' => ['label' => 'Dikembalikan', 'tone' => 'success']],
            ['id' => 9,  'buku' => 'Algoritma & Struktur Data',     'anggota' => 'Ahmad Fauzi',    'tgl_pinjam' => '22 Sep 2026', 'tgl_kembali' => '06 Okt 2026', 'hari_telat' => 2, 'status' => ['label' => 'Terlambat',    'tone' => 'destructive']],
            ['id' => 10, 'buku' => 'Filsafat Ilmu',                 'anggota' => 'Ratna Sari',     'tgl_pinjam' => '05 Okt 2026', 'tgl_kembali' => '19 Okt 2026', 'hari_telat' => 0, 'status' => ['label' => 'Dipinjam',     'tone' => 'info']],
            ['id' => 11, 'buku' => 'Safinatun Najah',               'anggota' => 'Siti Rahma',     'tgl_pinjam' => '27 Sep 2026', 'tgl_kembali' => '11 Okt 2026', 'hari_telat' => 0, 'status' => ['label' => 'Dikembalikan', 'tone' => 'success']],
            ['id' => 12, 'buku' => 'The Design of Everyday Things', 'anggota' => 'Budi Hartono',   'tgl_pinjam' => '03 Okt 2026', 'tgl_kembali' => '17 Okt 2026', 'hari_telat' => 0, 'status' => ['label' => 'Dipinjam',     'tone' => 'info']],
        ];
    }

    /** Riwayat peminjaman buku. */
    public static function peminjamans(): array
    {
        return self::peminjamanRows();
    }

    /** Denda dari peminjaman yang terlambat (Rp2.000/hari). */
    public static function dendas(): array
    {
        $bayar = [9]; // id peminjaman yang dendanya sudah dibayar
        $rows  = [];
        $i     = 1;
        foreach (self::peminjamanRows() as $p) {
            if ($p['status']['label'] !== 'Terlambat') {
                continue;
            }
            $jumlah = $p['hari_telat'] * self::DENDA_PER_HARI;
            $rows[] = [
                'id'        => $i++,
                'anggota'   => $p['anggota'],
                'buku'      => $p['buku'],
                'hari_telat'=> $p['hari_telat'],
                'jumlah'    => $jumlah,
                'jumlah_rp' => self::rp($jumlah),
                'status'    => in_array($p['id'], $bayar, true)
                    ? ['label' => 'Sudah Bayar', 'tone' => 'success']
                    : ['label' => 'Belum Bayar', 'tone' => 'destructive'],
            ];
        }

        return $rows;
    }

    /** Ringkasan angka dashboard (dihitung dari data). */
    public static function ringkasan(): array
    {
        $koleksi    = array_sum(array_column(self::bukuRows(), 'stok'));
        $dipinjam   = count(array_filter(self::peminjamanRows(), fn ($p) => in_array($p['status']['label'], ['Dipinjam', 'Terlambat'], true)));
        $dendaBulan = array_sum(array_column(self::dendas(), 'jumlah'));

        return [
            'koleksi_buku'    => $koleksi,
            'total_anggota'   => count(self::anggotaRows()),
            'sedang_dipinjam' => $dipinjam,
            'terlambat'       => count(array_filter(self::peminjamanRows(), fn ($p) => $p['status']['label'] === 'Terlambat')),
            'denda_bulan_ini' => $dendaBulan,
            'denda_bulan_ini_rp' => self::rp($dendaBulan),
        ];
    }

    /** Peminjaman per bulan (bar chart). */
    public static function peminjamanPerBulan(): array
    {
        return [
            'labels'   => ['Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt'],
            'datasets' => [['label' => 'Peminjaman', 'data' => [85, 92, 78, 88, 95, 102]]],
        ];
    }

    /** Distribusi buku per kategori (donut chart). */
    public static function distribusiKategori(): array
    {
        $agg = [];
        foreach (self::bukuRows() as $b) {
            $agg[$b['kategori']] = ($agg[$b['kategori']] ?? 0) + 1;
        }

        return [
            'labels'   => array_keys($agg),
            'datasets' => [['label' => 'Judul buku', 'data' => array_values($agg)]],
        ];
    }

    /** Distribusi status peminjaman (donut chart). */
    public static function distribusiStatus(): array
    {
        $agg = [];
        foreach (self::peminjamanRows() as $p) {
            $agg[$p['status']['label']] = ($agg[$p['status']['label']] ?? 0) + 1;
        }

        return [
            'labels'   => array_keys($agg),
            'datasets' => [['label' => 'Peminjaman', 'data' => array_values($agg)]],
        ];
    }

    /** Buku paling sering dipinjam (dihitung dari riwayat). */
    public static function bukuTerpopuler(): array
    {
        $agg = [];
        foreach (self::peminjamanRows() as $p) {
            $agg[$p['buku']] = ($agg[$p['buku']] ?? 0) + 1;
        }
        arsort($agg);
        $rows = [];
        $i    = 1;
        foreach ($agg as $buku => $kali) {
            $rows[] = ['id' => $i++, 'buku' => $buku, 'kali_dipinjam' => $kali];
            if ($i > 6) {
                break;
            }
        }

        return $rows;
    }
}
