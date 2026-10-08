import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { PageHeader } from '@/components/page-header';
import { DataTable, type Column, type FilterOption } from '@/components/data-table';
import { ToneBadge, type ToneLabel } from '@/components/tone-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Denda {
    id: number;
    anggota: string;
    buku: string;
    hari_telat: number;
    jumlah_rp: string;
    status: ToneLabel;
}

export default function PerpustakaanDenda({ dendas }: { dendas: Record<string, any>[] }) {
    const rows: Denda[] = dendas.map((d) => ({
        id: Number(d.id),
        anggota: String(d.anggota),
        buku: String(d.buku),
        hari_telat: Number(d.hari_telat),
        jumlah_rp: String(d.jumlah_rp),
        status: d.status as ToneLabel,
    }));

    const columns: Column<Denda>[] = [
        { key: 'anggota', header: 'Anggota', sortValue: (r) => r.anggota },
        { key: 'buku', header: 'Buku', sortValue: (r) => r.buku },
        {
            key: 'hari_telat',
            header: 'Keterlambatan',
            render: (r) => <span className="tnum">{r.hari_telat} hari</span>,
            sortValue: (r) => r.hari_telat,
        },
        {
            key: 'jumlah_rp',
            header: 'Jumlah Denda',
            render: (r) => <span className="tnum font-medium">{r.jumlah_rp}</span>,
            sortValue: (r) => r.jumlah_rp,
        },
        {
            key: 'status',
            header: 'Status Bayar',
            render: (r) => <ToneBadge label={r.status.label} tone={r.status.tone} />,
        },
    ];

    const filters: FilterOption[] = [
        {
            key: 'status',
            label: 'Status Bayar',
            options: [
                { value: 'Belum Bayar', label: 'Belum Bayar' },
                { value: 'Sudah Bayar', label: 'Sudah Bayar' },
            ],
            match: (row: any, value: string) => row.status.label === value,
        },
    ];

    return (
        <AuthenticatedLayout>
            <PageHeader
                title="Denda"
                description="Denda keterlambatan pengembalian buku, Rp2.000 per hari."
                breadcrumbs={[{ label: 'Pustaka', href: '/perpustakaan' }, { label: 'Denda' }]}
            />
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base">Semua Denda</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        rows={rows}
                        searchKeys={['anggota', 'buku']}
                        filters={filters}
                        pageSize={10}
                        emptyTitle="Tidak ada denda"
                        emptyDescription="Denda akan muncul ketika ada pengembalian terlambat."
                    />
                </CardContent>
            </Card>
        </AuthenticatedLayout>
    );
}
