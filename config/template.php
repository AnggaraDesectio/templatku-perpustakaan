<?php

// Di-generate oleh php artisan template:zip - hanya berisi flavor "perpustakaan".
// Ganti brand/warna di bawah, atau set TEMPLATE_FLAVOR di .env.

return [
    'flavor' => env('TEMPLATE_FLAVOR', 'perpustakaan'),

    'flavors' => array (
  'perpustakaan' => 
  array (
    'label' => 'Perpustakaan',
    'brand_name' => 'PUSTAKA',
    'brand_tagline' => 'Perpustakaan digital',
    'brand_initials' => 'PU',
    'accent' => '#0369a1',
    'category' => 'pendidikan',
    'home' => 'perpustakaan.index',
    'nav' => 
    array (
      'sections' => 
      array (
        0 => 
        array (
          'label' => 'Perpustakaan',
          'items' => 
          array (
            0 => 
            array (
              'label' => 'Dashboard',
              'to' => '/perpustakaan',
              'icon' => 'LayoutDashboard',
            ),
            1 => 
            array (
              'label' => 'Buku',
              'to' => '/perpustakaan/buku',
              'icon' => 'BookOpen',
            ),
            2 => 
            array (
              'label' => 'Anggota',
              'to' => '/perpustakaan/anggota',
              'icon' => 'Users',
            ),
            3 => 
            array (
              'label' => 'Peminjaman',
              'to' => '/perpustakaan/peminjaman',
              'icon' => 'ArrowLeftRight',
            ),
            4 => 
            array (
              'label' => 'Denda',
              'to' => '/perpustakaan/denda',
              'icon' => 'AlertCircle',
            ),
            5 => 
            array (
              'label' => 'Laporan',
              'to' => '/perpustakaan/laporan',
              'icon' => 'ChartLine',
            ),
          ),
        ),
        1 => 
        array (
          'label' => 'Umum',
          'items' => 
          array (
            0 => 
            array (
              'label' => 'Pengguna',
              'to' => '/users',
              'icon' => 'Users',
            ),
            1 => 
            array (
              'label' => 'Peran',
              'to' => '/roles',
              'icon' => 'ShieldCheck',
            ),
            2 => 
            array (
              'label' => 'Pengaturan',
              'to' => '/settings',
              'icon' => 'Settings',
            ),
            3 => 
            array (
              'label' => 'Profil',
              'to' => '/profile',
              'icon' => 'User',
            ),
          ),
        ),
      ),
    ),
  ),
),
];
