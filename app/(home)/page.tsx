import React from 'react';
import Footer from '../component/Footer';
import { prisma } from '../lib/prisma'; 
import Link from 'next/link';
import { getSessionUser } from '../lib/auth'; 
import CourseCard from '../component/CourseCard';

const Home = async () => {
  const user = await getSessionUser(); 

  // AMBIL DATA RAW
  const rawCourses = await prisma.course.findMany({
    take: 3, 
    orderBy: { createdAt: 'desc' },
    include: {
      category: true,
      enrollments: user ? { where: { userId: user.id } } : false,
      materials: { select: { id: true } }, 
    },
    where: { isPublished: true }
  });

  // HITUNG PROGRESS MANUAL (Promise.all)
  const courses = await Promise.all(rawCourses.map(async (course) => {
    let isCompleted = false;

    if (user && course.enrollments.length > 0) {
      const totalMaterials = course.materials.length;
      
      // Hitung materi yang statusnya 'Completed' untuk user ini
      if (totalMaterials > 0) {
         const completedCount = await prisma.userProgress.count({
           where: {
             userId: user.id,
             materialId: { in: course.materials.map(m => m.id) },
             isCompleted: true
           }
         });
         
         if (completedCount === totalMaterials) {
           isCompleted = true;
         }
      }
    }
    // Gabungkan data asli dengan status isCompleted
    return { ...course, isCompleted };
  }));

  return (
    <div className="bg-white min-h-screen flex flex-col scroll-smooth">
      
      {/* === HERO SECTION === */}
      <section className="max-w-7xl px-4 mx-auto py-16 mt-20 text-black">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
          <div className="lg:col-span-3 text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-extrabold mb-6 text-[#2e385b]">
              Welcome to MyCourse
            </h1>
            <p className="text-lg lg:text-xl mb-10 leading-relaxed text-gray-600">
              Explore Our Courses and Start Your Learning Journey! <br />
              Temukan kursus yang tepat untuk mengembangkan keterampilan baru.
            </p>
            <Link href="/courses">
              <button className="px-8 py-4 bg-[#2e385b] text-white rounded-full text-lg font-bold shadow-md transition-all duration-300 transform hover:shadow-xl hover:shadow-blue-900/20 hover:-translate-y-1">
                Explore Courses
              </button>
            </Link>
          </div>
          <div className="lg:col-span-2 flex justify-center mt-8 lg:mt-0">
            <img src="/welcome.png" alt="Welcome" className="w-full max-w-md object-contain" />
          </div>
        </div>
      </section>

      {/* === ABOUT SECTION === */}
      <section id="about" className="bg-gray-100 py-20 scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4 text-gray-900">
          <p className="text-center text-blue-600 font-bold mb-2 uppercase tracking-wide">About Us</p>
          <h2 className="text-center text-3xl font-extrabold mb-12 text-[#2e385b]">Why MyCourse?</h2>
          <div className="space-y-8 text-lg leading-relaxed text-gray-600 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
            <div> 
              <h3 className="font-bold text-xl mb-2 text-[#2e385b]">
                Transformasi Belajar <em className="italic text-blue-600">Dimulai di Sini!</em>
              </h3>
              <p>MyCourse hadir untuk menjembatani kesenjangan antara ambisi dan realitas. Kami percaya bahwa setiap orang berhak mendapatkan akses ke pendidikan berkualitas tinggi.</p>
            </div>
            <div>
              <p>Melalui kursus online yang dirancang praktis, kami membantu Anda menguasai keterampilan UI/UX, Web Development, hingga Data Science.</p>
            </div>
            <div className="font-medium text-[#2e385b] border-l-4 border-blue-500 pl-4 bg-blue-50 py-2 rounded-r-lg">
              <p className="italic">"Saatnya berinvestasi pada diri sendiri. Saatnya untuk MyCourse."</p>
            </div>
          </div>
        </div>
      </section>

      {/* === POPULAR CLASSES SECTION === */}
      <section className="bg-[#f8faff] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-blue-600 tracking-widest uppercase mb-3">COURSES</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-[#2e385b]">Our Popular Classes</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            {courses.map((course) => (
              <CourseCard 
                key={course.id} 
                course={course} 
                user={user} 
                isEnrolled={user ? course.enrollments.length > 0 : false}
                isCompleted={course.isCompleted} 
              />
            ))}
          </div>

          <div className="text-center mt-16">
             <Link href="/courses">
                <button className="px-8 py-3 rounded-full border-2 border-gray-200 text-[#2e385b] font-bold hover:border-[#2e385b] hover:bg-[#2e385b] hover:text-white transition-all">
                    View All Courses &rarr;
                </button>
             </Link>
          </div>
        </div>
      </section>

      <section id="contact">
        <Footer />
      </section>
    </div>
  );
};

export default Home;