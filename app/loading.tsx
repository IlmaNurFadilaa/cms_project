export default function Loading() {
  return (
    // Background disamakan dengan Navbar (bg-gray-100)
    <div className="flex items-center justify-center min-h-screen bg-gray-100 z-50">
      <div className="relative">
        {/* Lingkaran Luar (Abu tipis) */}
        <div className="w-16 h-16 border-4 border-gray-300 rounded-full"></div>
        
        {/* Lingkaran Putar (Warna Utama Website #2e385b) */}
        <div className="w-16 h-16 border-4 border-[#2e385b] border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
      </div>
    </div>
  );
}