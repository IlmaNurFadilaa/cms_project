import { prisma } from '@/app/lib/prisma';
import Link from 'next/link';
import { createCourse } from '../../../actions/admin';

export default async function CreateCoursePage() {
  const categories = await prisma.category.findMany();

  return (
    <div className="min-h-screen bg-[#f4f6f9] text-[#2e385b] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">

        {/* === FORMULIR LANGSUNG === */}
        <form action={createCourse} className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-200 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Judul Kursus */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-bold mb-2 ml-1 text-gray-700">Judul Kursus</label>
              <input 
                name="title" 
                type="text" 
                placeholder="Contoh: Mastering Next.js 14" 
                className="w-full p-4 rounded-xl border border-gray-200 bg-[#f8fafc] text-[#2e385b] focus:ring-2 focus:ring-[#2e385b] focus:bg-white outline-none transition"
                required 
              />
            </div>

            {/* Kategori */}
            <div>
              <label className="block text-sm font-bold mb-2 ml-1 text-gray-700">Kategori</label>
              <div className="relative">
                <select 
                  name="categoryId" 
                  defaultValue="" 
                  className="w-full p-4 rounded-xl border border-gray-200 bg-[#f8fafc] text-[#2e385b] appearance-none focus:ring-2 focus:ring-[#2e385b] focus:bg-white outline-none cursor-pointer"
                  required
                >
                  <option value="" disabled>Pilih Kategori...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <span className="absolute right-4 top-4 text-gray-400 pointer-events-none text-xs">▼</span>
              </div>
            </div>

            {/* Level */}
            <div>
              <label className="block text-sm font-bold mb-2 ml-1 text-gray-700">Level</label>
              <div className="relative">
                <select 
                  name="level" 
                  defaultValue="PEMULA" 
                  className="w-full p-4 rounded-xl border border-gray-200 bg-[#f8fafc] text-[#2e385b] appearance-none focus:ring-2 focus:ring-[#2e385b] focus:bg-white outline-none cursor-pointer"
                >
                  <option value="PEMULA">Pemula</option>
                  <option value="MENENGAH">Menengah</option>
                  <option value="LANJUTAN">Lanjutan</option>
                  <option value="SEMUA_LEVEL">Semua Level</option>
                </select>
                <span className="absolute right-4 top-4 text-gray-400 pointer-events-none text-xs">▼</span>
              </div>
            </div>

            {/* Deskripsi */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-bold mb-2 ml-1 text-gray-700">Deskripsi</label>
              <textarea 
                name="description" 
                rows={4} 
                placeholder="Jelaskan tentang kursus ini..." 
                className="w-full p-4 rounded-xl border border-gray-200 bg-[#f8fafc] text-[#2e385b] focus:ring-2 focus:ring-[#2e385b] focus:bg-white outline-none resize-none"
                required
              ></textarea>
            </div>

            {/* Upload Gambar */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-bold mb-2 ml-1 text-gray-700">Upload Gambar Sampul</label>
              <div className="relative border border-gray-200 bg-[#f8fafc] rounded-xl p-2">
                <input 
                  name="image" 
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-bold
                    file:bg-[#eef2ff] file:text-[#2e385b]
                    hover:file:bg-[#e0e7ff]
                    cursor-pointer"
                  required
                />
              </div>
            </div>

            {/* Checkbox Publish */}
            <div className="flex items-center gap-3 ml-2 mt-2">
               <input type="checkbox" name="isPublished" id="isPublished" className="w-5 h-5 accent-[#2e385b] cursor-pointer" />
               <label htmlFor="isPublished" className="font-medium cursor-pointer select-none text-gray-700">Langsung Publish?</label>
            </div>

          </div>

          {/* Tombol Aksi */}
          <div className="flex justify-end gap-4 mt-10 pt-6 border-t border-gray-100">
            <Link href="/admin/courses">
              <button type="button" className="px-8 py-3 rounded-xl bg-white border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 hover:text-red-500 transition">
                Cancel
              </button>
            </Link>
            <button type="submit" className="px-10 py-3 rounded-xl bg-[#2e385b] text-white font-bold hover:bg-[#1e253d] shadow-lg shadow-blue-900/20 transition active:scale-95">
              Add Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}