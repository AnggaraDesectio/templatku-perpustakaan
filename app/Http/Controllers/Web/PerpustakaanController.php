<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Support\Demo\PerpustakaanData;
use Inertia\Inertia;
use Inertia\Response;

/** Halaman-halaman Perpustakaan (Inertia). */
class PerpustakaanController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('perpustakaan/index', [
            'ringkasan'   => PerpustakaanData::ringkasan(),
            'peminjaman'  => PerpustakaanData::peminjamanPerBulan(),
            'terbaru'     => array_slice(PerpustakaanData::peminjamans(), 0, 5),
        ]);
    }

    public function buku(): Response
    {
        return Inertia::render('perpustakaan/buku', [
            'bukus' => PerpustakaanData::bukus(),
        ]);
    }

    public function anggota(): Response
    {
        return Inertia::render('perpustakaan/anggota', [
            'anggotas' => PerpustakaanData::anggotas(),
        ]);
    }

    public function peminjaman(): Response
    {
        return Inertia::render('perpustakaan/peminjaman', [
            'peminjamans' => PerpustakaanData::peminjamans(),
        ]);
    }

    public function denda(): Response
    {
        return Inertia::render('perpustakaan/denda', [
            'dendas' => PerpustakaanData::dendas(),
        ]);
    }

    public function laporan(): Response
    {
        return Inertia::render('perpustakaan/laporan', [
            'ringkasan'   => PerpustakaanData::ringkasan(),
            'perBulan'    => PerpustakaanData::peminjamanPerBulan(),
            'kategori'    => PerpustakaanData::distribusiKategori(),
            'status'      => PerpustakaanData::distribusiStatus(),
            'populer'     => PerpustakaanData::bukuTerpopuler(),
        ]);
    }
}
