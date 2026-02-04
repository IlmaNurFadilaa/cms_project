'use client';

import { useState } from 'react';
import { HiCheckCircle } from 'react-icons/hi';
import { markMaterialComplete } from '@/app/actions/learning';
import { useRouter } from 'next/navigation';

interface Props {
  materialId: string;
  initialCompleted: boolean;
}

export default function CompleteButton({ materialId, initialCompleted }: Props) {
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    setLoading(true);
    
    const newState = !isCompleted;
    setIsCompleted(newState);

    await markMaterialComplete(materialId, newState);
    
    setLoading(false);
    router.refresh(); 
  };

  return (
    <button 
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition shadow-sm active:scale-95 ${
        isCompleted 
          ? 'bg-green-600 text-white hover:bg-green-700' 
          : 'bg-white border border-gray-300 text-gray-500 hover:border-green-500 hover:text-green-600'
      }`}
    >
      {loading ? '...' : (isCompleted ? 'Selesai' : 'Tandai Selesai')}
      {isCompleted && <HiCheckCircle className="text-lg" />}
    </button>
  );
}