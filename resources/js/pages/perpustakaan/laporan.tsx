import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { BarChartCard, DonutChartCard, type ChartData } from '@/components/charts';
import { DataTable, type Column } from '@/components/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, BookOpen, Library, Users } from 'lucide-react';

interface BukuPopuler {
    id: number;
    buku: string;
    kali_dipinjam: number;
}

interface Ringkasan {
    koleksi_buku: number;
    total_anggota: number;
    sedang_dipinjam: number;
    terlambat: number;
    denda_bulan_ini_rp: string;
}

export default function PerpustakaanLaporan({
    ringkasan,
    perBulan,
    kategori,
    status,
    populer,
}: {
    ringkasan: Ringkasan;
    perBulan: ChartData;
    kategori: ChartData;
    status: ChartData;
    populer: Record<string, any>[];
}) {
    const rows: BukuPopuler[] = populer.map((p) => ({
        id: Number(p.id),
        buku: String(p.buku),
        kali_dipinjam: Number(p.kali_dipinjam),
    }));

    const columns: Column<BukuPopuler>[] = [
        { key: 'buku', header: 'Buku', sortValue: (r) => r.buku },
        {
            key: 'kali_dipinjam',
            header: 'Kali Dipinjam',
            render: (r) => <span className="tnum font-medium">{r.kali_dipinjam}×</span>,
            sortValue: (r) => r.kali_dipinjam,
        },
    ];

    return (
        <AuthenticatedLayout>
            <PageHeader
                title="Laporan"
                description="Kinerja perpustakaan: sirkulasi, koleksi, dan keterlambatan."
                breadcrumbs={[{ label: 'Pustaka', href: '/perpustakaan' }, { label: 'Laporan' }]}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    label="Koleksi Buku"
                    hint="Jumlah eksemplar buku di seluruh koleksi."
                    value={String(ringkasan.koleksi_buku)}
                    delta="eksemplar"
                    trend="up"
                    icon={Library}
                />
                <StatCard
                    label="Anggota"
                    hint="Anggota perpustakaan yang terdaftar."
                    value={String(ringkasan.total_anggota)}
                    delta="anggota terdaftar"
                    trend="flat"
                    icon={Users}
                />
                <StatCard
                    label="Sedang Dipinjam"
                    hint="Buku yang sedang dibawa pulang anggota."
                    value={String(ringkasan.sedang_dipinjam)}
                    delta={`${ringkasan.terlambat} terlambat kembali`}
                    trend="flat"
                    icon={BookOpen}
                />
                <StatCard
                    label="Denda Bulan Ini"
                    hint="Denda keterlambatan yang terkumpul bulan ini."
                    value={ringkasan.denda_bulan_ini_rp}
                    delta="Oktober 2026"
                    trend="down"
                    icon={AlertCircle}
                />
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base">Peminjaman per Bulan</CardTitle>
                        <p className="text-muted-foreground text-sm">Jumlah buku dipinjam.</p>
                    </CardHeader>
                    <CardContent>
                        <BarChartCard data={perBulan} />
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base">Status Peminjaman</CardTitle>
                        <p className="text-muted-foreground text-sm">Seluruh riwayat peminjaman.</p>
                    </CardHeader>
                    <CardContent>
                        <DonutChartCard data={status} />
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base">Distribusi Buku per Kategori</CardTitle>
                        <p className="text-muted-foreground text-sm">Jumlah judul di tiap kategori.</p>
                    </CardHeader>
                    <CardContent>
                        <DonutChartCard data={kategori} />
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base">Buku Paling Sering Dipinjam</CardTitle>
                        <p className="text-muted-foreground text-sm">Berdasarkan riwayat peminjaman.</p>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            rows={rows}
                            emptyTitle="Belum ada data buku populer"
                            emptyDescription="Daftar buku populer muncul setelah ada peminjaman tercatat."
                        />
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
