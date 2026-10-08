import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { PageHeader } from '@/components/page-header';
import { DataTable, type Column, type FilterOption } from '@/components/data-table';
import { ToneBadge, type ToneLabel } from '@/components/tone-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { toast } from 'sonner';

interface Peminjaman {
    id: number;
    buku: string;
    anggota: string;
    tgl_pinjam: string;
    tgl_kembali: string;
    status: ToneLabel;
}

export default function PerpustakaanPeminjaman({ peminjamans }: { peminjamans: Record<string, any>[] }) {
    const [rows, setRows] = useState<Peminjaman[]>(() =>
        peminjamans.map((p) => ({
            id: Number(p.id),
            buku: String(p.buku),
            anggota: String(p.anggota),
            tgl_pinjam: String(p.tgl_pinjam),
            tgl_kembali: String(p.tgl_kembali),
            status: p.status as ToneLabel,
        })),
    );
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ buku: '', anggota: '', tgl_kembali: '' });
    const [kembali, setKembali] = useState<Peminjaman | null>(null);

    const fmtTanggal = (iso: string) =>
        iso
            ? new Date(`${iso}T00:00:00`).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
            : '-';

    const save = () => {
        const id = rows.length ? Math.max(...rows.map((r) => r.id)) + 1 : 1;
        setRows((prev) => [
            {
                id,
                buku: form.buku,
                anggota: form.anggota,
                tgl_pinjam: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
                tgl_kembali: fmtTanggal(form.tgl_kembali),
                status: { label: 'Dipinjam', tone: 'info' as const },
            },
            ...prev,
        ]);
        toast.success(`"${form.buku}" dipinjamkan ke ${form.anggota}.`);
        setForm({ buku: '', anggota: '', tgl_kembali: '' });
        setOpen(false);
    };

    const tandaiKembali = () => {
        if (!kembali) return;
        setRows((prev) =>
            prev.map((r) => (r.id === kembali.id ? { ...r, status: { label: 'Kembali', tone: 'success' as const } } : r)),
        );
        toast.success(`"${kembali.buku}" sudah dikembalikan.`);
        setKembali(null);
    };

    const set = (key: 'buku' | 'anggota' | 'tgl_kembali') => (e: { target: { value: string } }) =>
        setForm((f) => ({ ...f, [key]: e.target.value }));

    const columns: Column<Peminjaman>[] = [
        { key: 'buku', header: 'Buku', sortValue: (r) => r.buku },
        { key: 'anggota', header: 'Anggota', sortValue: (r) => r.anggota },
        { key: 'tgl_pinjam', header: 'Tgl Pinjam', mobileHidden: true, sortValue: (r) => r.tgl_pinjam },
        { key: 'tgl_kembali', header: 'Tgl Kembali', mobileHidden: true, sortValue: (r) => r.tgl_kembali },
        {
            key: 'status',
            header: 'Status',
            render: (r) => <ToneBadge label={r.status.label} tone={r.status.tone} />,
        },
    ];

    const filters: FilterOption[] = [
        {
            key: 'status',
            label: 'Status',
            options: [
                { value: 'Dipinjam', label: 'Dipinjam' },
                { value: 'Terlambat', label: 'Terlambat' },
                { value: 'Dikembalikan', label: 'Dikembalikan' },
            ],
            match: (row: any, value: string) => row.status.label === value,
        },
    ];

    return (
        <AuthenticatedLayout>
            <PageHeader
                title="Peminjaman"
                description="Riwayat peminjaman buku beserta batas pengembaliannya."
                breadcrumbs={[{ label: 'Pustaka', href: '/perpustakaan' }, { label: 'Peminjaman' }]}
                actions={
                    <Button size="sm" onClick={() => setOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Peminjaman Baru
                    </Button>
                }
            />
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base">Semua Peminjaman</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        rows={rows}
                        searchKeys={['buku', 'anggota']}
                        filters={filters}
                        pageSize={12}
                        extraRowActions={(row) =>
                            row.status.label === 'Dipinjam' ? (
                                <Button variant="ghost" size="sm" onClick={() => setKembali(row)}>
                                    Kembalikan
                                </Button>
                            ) : null
                        }
                        emptyTitle="Belum ada peminjaman"
                        emptyDescription="Belum ada buku yang dipinjam, catat peminjaman pertama lewat tombol di atas."
                    />
                </CardContent>
            </Card>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Catat Peminjaman</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-2">
                        <div className="grid gap-2">
                            <Label htmlFor="buku">Judul buku</Label>
                            <Input id="buku" value={form.buku} onChange={set('buku')} placeholder="cth: Laskar Pelangi" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="anggota">Nama anggota</Label>
                            <Input id="anggota" value={form.anggota} onChange={set('anggota')} placeholder="cth: Rina Marlina" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="tgl_kembali">Tenggat kembali</Label>
                            <Input id="tgl_kembali" type="date" value={form.tgl_kembali} onChange={set('tgl_kembali')} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setOpen(false)}>Batal</Button>
                        <Button onClick={save} disabled={!form.buku.trim() || !form.anggota.trim()}>Simpan</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={kembali !== null} onOpenChange={(v) => !v && setKembali(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Pengembalian Buku</DialogTitle>
                    </DialogHeader>
                    <p className="py-2 text-sm">
                        Tandai <span className="font-semibold">"{kembali?.buku}"</span> sudah dikembalikan oleh{' '}
                        <span className="font-semibold">{kembali?.anggota}</span>?
                    </p>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setKembali(null)}>Batal</Button>
                        <Button onClick={tandaiKembali}>Sudah Kembali</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
