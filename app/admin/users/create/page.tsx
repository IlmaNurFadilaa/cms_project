import UserForm from '@/app/component/UserForm';
import Link from 'next/link';

export default function CreateUserPage() {
  return (
    <div className="min-h-screen bg-[#f4f6f9] text-[#2e385b] p-8">
      <div className="max-w-3xl mx-auto">
        <UserForm />
      </div>
    </div>
  );
}