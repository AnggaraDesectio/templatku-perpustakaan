import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { PageHeader } from '@/components/page-header';
import { DataTable, type Column, type FilterOption } from '@/components/data-table';
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
import { useState } from 'react';
import { toast } from 'sonner';

interface Buku {
    id: number;
    judul: string;
    penulis: string;
    kategori: string;
    stok: number;
}

export default function PerpustakaanBuku({ bukus }: { bukus: Record<string, any>[] }) {
    const [rows, setRows] = useState<Buku[]>(() =>
        bukus.map((b) => ({
            id: Number(b.id),
            judul: String(b.judul),
            penulis: String(b.penulis),
            kategori: String(b.kategori),
            stok: Number(b.stok),
        })),
    );
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Buku | null>(null);
    const [form, setForm] = useState({ judul: '', penulis: '', kategori: '', stok: '1' });

    const openAdd = () => {
        setEditing(null);
        setForm({ judul: '', penulis: '', kategori: '', stok: '1' });
        setOpen(true);
    };

    const openEdit = (row: Buku) => {
        setEditing(row);
        setForm({ judul: row.judul, penulis: row.penulis, kategori: row.kategori, stok: String(row.stok) });
        setOpen(true);
    };

    const save = () => {
        const data = { judul: form.judul, penulis: form.penulis, kategori: form.kategori || 'Umum', stok: Math.max(0, Number(form.stok) || 0) };
        if (editing) {
            setRows((prev) => prev.map((r) => (r.id === editing.id ? { ...r, ...data } : r)));
            toast.success(`Buku "${form.judul}" diperbarui.`);
        } else {
            const id = rows.length ? Math.max(...rows.map((r) => r.id)) + 1 : 1;
            setRows((prev) => [{ id, ...data }, ...prev]);
            toast.success(`Buku "${form.judul}" ditambahkan ke koleksi.`);
        }
        setOpen(false);
    };

    const set = (key: 'judul' | 'penulis' | 'kategori' | 'stok') => (e: { target: { value: string } }) =>
        setForm((f) => ({ ...f, [key]: e.target.value }));

    const columns: Column<Buku>[] = [
        { key: 'judul', header: 'Judul', sortValue: (r) => r.judul },
        { key: 'penulis', header: 'Penulis', mobileHidden: true, sortValue: (r) => r.penulis },
        { key: 'kategori', header: 'Kategori', sortValue: (r) => r.kategori },
        {
            key: 'stok',
            header: 'Stok',
            render: (r) => <span className="tnum font-medium">{r.stok} eksemplar</span>,
            sortValue: (r) => r.stok,
        },
    ];

    const filters: FilterOption[] = [
        {
            key: 'kategori',
            label: 'Kategori',
            options: [
                { value: 'Fiksi', label: 'Fiksi' },
                { value: 'Pengembangan Diri', label: 'Pengembangan Diri' },
                { value: 'Sains', label: 'Sains' },
                { value: 'Sejarah', label: 'Sejarah' },
                { value: 'Teknologi', label: 'Teknologi' },
                { value: 'Filsafat', label: 'Filsafat' },
                { value: 'Desain', label: 'Desain' },
                { value: 'Agama', label: 'Agama' },
            ],
            match: (row: any, value: string) => row.kategori === value,
        },
    ];

    return (
        <AuthenticatedLayout>
            <PageHeader
                title="Buku"
                description="Katalog koleksi buku: judul, penulis, kategori, dan stok."
                breadcrumbs={[{ label: 'Pustaka', href: '/perpustakaan' }, { label: 'Buku' }]}
                actions={
                    <Button size="sm" onClick={openAdd}>
                        <Plus className="mr-2 h-4 w-4" /> Tambah Buku
                    </Button>
                }
            />
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base">Semua Buku</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        rows={rows}
                        searchKeys={['judul', 'penulis', 'kategori']}
                        filters={filters}
                        pageSize={12}
                        onEdit={openEdit}
                        emptyTitle="Belum ada buku"
                        emptyDescription="Katalogkan buku pertama, isi judul, penulis, dan jumlah eksemplarnya lewat tombol Tambah Buku di atas."
                    />
                </CardContent>
            </Card>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editing ? 'Ubah Buku' : 'Tambah Buku'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-2">
                        <div className="grid gap-2">
                            <Label htmlFor="judul">Judul buku</Label>
                            <Input id="judul" value={form.judul} onChange={set('judul')} placeholder="cth: Laskar Pelangi" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="penulis">Penulis</Label>
                                <Input id="penulis" value={form.penulis} onChange={set('penulis')} placeholder="cth: Andrea Hirata" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="kategori">Kategori</Label>
                                <Input id="kategori" value={form.kategori} onChange={set('kategori')} placeholder="cth: Fiksi" />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="stok">Jumlah eksemplar</Label>
                            <Input id="stok" type="number" min={0} value={form.stok} onChange={set('stok')} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setOpen(false)}>Batal</Button>
                        <Button onClick={save} disabled={!form.judul.trim()}>Simpan</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
