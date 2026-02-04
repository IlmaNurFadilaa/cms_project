'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { HiSearch } from 'react-icons/hi'; 

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="relative w-full md:w-96">
      <input
        type="text"
        placeholder={placeholder}
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('query')?.toString()}
        className="w-full border border-gray-200 bg-[#f8fafc] text-[#2e385b] rounded-xl px-4 py-3 pl-10 outline-none focus:ring-2 focus:ring-[#2e385b] transition"
      />
      
      <HiSearch className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
    </div>
  );
}