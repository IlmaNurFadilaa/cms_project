import { prisma } from '@/app/lib/prisma';
import Link from 'next/link';
import Search from '@/app/component/Search';
import UserRow from '@/app/component/UserRow';

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const params = await searchParams;
  const query = params.query || '';

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
      ],
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
        <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
          <Search placeholder="Cari nama atau email..." />
          <Link href="/admin/users/create">
            <button className="bg-[#2e385b] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#1e253d] shadow-lg transition">
              + Tambah User
            </button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 text-xs font-bold uppercase tracking-wider">
                <th className="p-4">Pengguna</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <UserRow key={user.id} user={user} />
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center p-12 text-gray-400">
                    Tidak ada data pengguna ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}