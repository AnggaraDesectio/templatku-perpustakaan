import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { BarChartCard, type ChartData } from '@/components/charts';
import { DataTable, type Column } from '@/components/data-table';
import { ToneBadge, type ToneLabel } from '@/components/tone-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, BookOpen, Library, Users } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface Peminjaman {
    id: number;
    buku: string;
    anggota: string;
    tgl_pinjam: string;
    tgl_kembali: string;
    status: ToneLabel;
}

interface Ringkasan {
    koleksi_buku: number;
    total_anggota: number;
    sedang_dipinjam: number;
    terlambat: number;
    denda_bulan_ini_rp: string;
}

export default function PerpustakaanIndex({
    ringkasan,
    peminjaman,
    terbaru,
}: {
    ringkasan: Ringkasan;
    peminjaman: ChartData;
    terbaru: Record<string, any>[];
}) {
    const rows: Peminjaman[] = terbaru.map((p) => ({
        id: Number(p.id),
        buku: String(p.buku),
        anggota: String(p.anggota),
        tgl_pinjam: String(p.tgl_pinjam),
        tgl_kembali: String(p.tgl_kembali),
        status: p.status as ToneLabel,
    }));

    const columns: Column<Peminjaman>[] = [
        { key: 'buku', header: 'Buku', sortValue: (r) => r.buku },
        { key: 'anggota', header: 'Anggota', sortValue: (r) => r.anggota },
        { key: 'tgl_pinjam', header: 'Tgl Pinjam', mobileHidden: true },
        { key: 'tgl_kembali', header: 'Tgl Kembali', mobileHidden: true },
        {
            key: 'status',
            header: 'Status',
            render: (r) => <ToneBadge label={r.status.label} tone={r.status.tone} />,
        },
    ];

    return (
        <AuthenticatedLayout>
            <PageHeader
                title="Dashboard Perpustakaan"
                description="Pantau buku yang beredar dan siapa yang terlambat mengembalikan."
                actions={
                    <Button size="sm" asChild>
                        <Link href="/perpustakaan/peminjaman">Catat Peminjaman</Link>
                    </Button>
                }
                breadcrumbs={[{ label: 'Pustaka' }]}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    label="Koleksi Buku"
                    value={String(ringkasan.koleksi_buku)}
                    delta="eksemplar tersedia"
                    trend="up"
                    icon={Library}
                    hint="Jumlah eksemplar buku yang tersedia di rak."
                />
                <StatCard
                    label="Anggota"
                    value={String(ringkasan.total_anggota)}
                    delta="anggota terdaftar"
                    trend="flat"
                    icon={Users}
                    hint="Orang yang terdaftar sebagai anggota perpustakaan."
                />
                <StatCard
                    label="Sedang Dipinjam"
                    value={String(ringkasan.sedang_dipinjam)}
                    delta={`${ringkasan.terlambat} terlambat kembali`}
                    trend="flat"
                    icon={BookOpen}
                    hint="Buku yang sedang dibawa pulang anggota."
                />
                <StatCard
                    label="Denda Bulan Ini"
                    value={ringkasan.denda_bulan_ini_rp}
                    delta="Oktober 2026"
                    trend="down"
                    icon={AlertCircle}
                    hint="Denda keterlambatan yang terkumpul bulan ini."
                />
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
                <Card className="shadow-sm xl:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-base">Peminjaman per Bulan</CardTitle>
                        <p className="text-muted-foreground text-sm">Jumlah buku dipinjam, Mei, Oktober 2026.</p>
                    </CardHeader>
                    <CardContent>
                        <BarChartCard data={peminjaman} />
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base">Perlu Diingatkan</CardTitle>
                        <p className="text-muted-foreground text-sm">Peminjaman melewati batas kembali.</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {rows
                            .filter((r) => r.status.label === 'Terlambat')
                            .map((r) => (
                                <div key={r.id} className="flex items-center justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium">{r.buku}</p>
                                        <p className="text-muted-foreground text-xs">{r.anggota}</p>
                                    </div>
                                    <span className="text-muted-foreground text-xs whitespace-nowrap">
                                        Jatuh tempo {r.tgl_kembali}
                                    </span>
                                </div>
                            ))}
                    </CardContent>
                </Card>
            </div>
            <div className="mt-4">
                <DataTable
                    columns={columns}
                    rows={rows}
                    searchKeys={['buku', 'anggota']}
                    emptyTitle="Belum ada peminjaman"
                    emptyDescription="Buku yang dipinjam tercatat di halaman Peminjaman."
                />
            </div>
        </AuthenticatedLayout>
    );
}
