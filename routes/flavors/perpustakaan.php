<?php

use App\Http\Controllers\Web\PerpustakaanController;
use Illuminate\Support\Facades\Route;

Route::prefix('perpustakaan')->name('perpustakaan.')->group(function () {
    Route::get('/', [PerpustakaanController::class, 'index'])->name('index');
    Route::get('/buku', [PerpustakaanController::class, 'buku'])->name('buku');
    Route::get('/anggota', [PerpustakaanController::class, 'anggota'])->name('anggota');
    Route::get('/peminjaman', [PerpustakaanController::class, 'peminjaman'])->name('peminjaman');
    Route::get('/denda', [PerpustakaanController::class, 'denda'])->name('denda');
    Route::get('/laporan', [PerpustakaanController::class, 'laporan'])->name('laporan');
});
