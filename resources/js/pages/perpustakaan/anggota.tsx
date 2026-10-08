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

interface Anggota {
    id: number;
    nama: string;
    id_anggota: string;
    tipe: string;
    sejak: string;
    status: ToneLabel;
}

export default function PerpustakaanAnggota({ anggotas }: { anggotas: Record<string, any>[] }) {
    const [rows, setRows] = useState<Anggota[]>(() =>
        anggotas.map((a) => ({
            id: Number(a.id),
            nama: String(a.nama),
            id_anggota: String(a.id_anggota),
            tipe: String(a.tipe),
            sejak: String(a.sejak),
            status: a.status as ToneLabel,
        })),
    );
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Anggota | null>(null);
    const [form, setForm] = useState({ nama: '', tipe: 'Umum' });

    const openAdd = () => {
        setEditing(null);
        setForm({ nama: '', tipe: 'Umum' });
        setOpen(true);
    };

    const openEdit = (row: Anggota) => {
        setEditing(row);
        setForm({ nama: row.nama, tipe: row.tipe });
        setOpen(true);
    };

    const save = () => {
        if (editing) {
            setRows((prev) => prev.map((r) => (r.id === editing.id ? { ...r, ...form } : r)));
            toast.success(`Data ${form.nama} diperbarui.`);
        } else {
            const id = rows.length ? Math.max(...rows.map((r) => r.id)) + 1 : 1;
            setRows((prev) => [
                ...prev,
                {
                    id,
                    ...form,
                    id_anggota: `AGT-${String(id).padStart(4, '0')}`,
                    sejak: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
                    status: { label: 'Aktif', tone: 'success' as const },
                },
            ]);
            toast.success(`${form.nama} terdaftar sebagai anggota.`);
        }
        setOpen(false);
    };

    const set = (key: 'nama') => (e: { target: { value: string } }) =>
        setForm((f) => ({ ...f, [key]: e.target.value }));

    const columns: Column<Anggota>[] = [
        { key: 'nama', header: 'Nama', sortValue: (r) => r.nama },
        { key: 'id_anggota', header: 'ID Anggota', sortValue: (r) => r.id_anggota },
        { key: 'tipe', header: 'Tipe', sortValue: (r) => r.tipe },
        { key: 'sejak', header: 'Anggota Sejak', mobileHidden: true, sortValue: (r) => r.sejak },
        {
            key: 'status',
            header: 'Status',
            render: (r) => <ToneBadge label={r.status.label} tone={r.status.tone} />,
        },
    ];

    const filters: FilterOption[] = [
        {
            key: 'tipe',
            label: 'Tipe',
            options: [
                { value: 'Pelajar', label: 'Pelajar' },
                { value: 'Mahasiswa', label: 'Mahasiswa' },
                { value: 'Umum', label: 'Umum' },
            ],
            match: (row: any, value: string) => row.tipe === value,
        },
        {
            key: 'status',
            label: 'Status',
            options: [
                { value: 'Aktif', label: 'Aktif' },
                { value: 'Nonaktif', label: 'Nonaktif' },
            ],
            match: (row: any, value: string) => row.status.label === value,
        },
    ];

    return (
        <AuthenticatedLayout>
            <PageHeader
                title="Anggota"
                description="Data anggota perpustakaan: tipe dan status keanggotaan."
                breadcrumbs={[{ label: 'Pustaka', href: '/perpustakaan' }, { label: 'Anggota' }]}
                actions={
                    <Button size="sm" onClick={openAdd}>
                        <Plus className="mr-2 h-4 w-4" /> Tambah Anggota
                    </Button>
                }
            />
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base">Semua Anggota</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        rows={rows}
                        searchKeys={['nama', 'id_anggota']}
                        filters={filters}
                        pageSize={10}
                        onEdit={openEdit}
                        emptyTitle="Belum ada anggota"
                        emptyDescription="Daftarkan anggota pertama, isi nama dan tipenya lewat tombol Tambah Anggota di atas."
                    />
                </CardContent>
            </Card>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editing ? 'Ubah Anggota' : 'Tambah Anggota'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-2">
                        <div className="grid gap-2">
                            <Label htmlFor="nama">Nama anggota</Label>
                            <Input id="nama" value={form.nama} onChange={set('nama')} placeholder="cth: Rina Marlina" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Tipe anggota</Label>
                            <Select value={form.tipe} onValueChange={(v) => setForm((f) => ({ ...f, tipe: v }))}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {['Umum', 'Pelajar', 'Mahasiswa', 'Guru/Dosen'].map((t) => (
                                        <SelectItem key={t} value={t}>{t}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setOpen(false)}>Batal</Button>
                        <Button onClick={save} disabled={!form.nama.trim()}>Simpan</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
