import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center p-4 text-center">
      <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mb-8 border border-white/10 shadow-xl">
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
        </svg>
      </div>
      
      <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
        Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">WindTodo</span>
      </h1>
      
      <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed">
        A modern, glassmorphism-inspired task manager built with Next.js and Supabase. Organize your workflow seamlessly with a beautiful and responsive interface.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link 
          href="/signup" 
          className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-all shadow-lg hover:shadow-white/20 transform hover:-translate-y-0.5"
        >
          Join Now
        </Link>
        <Link 
          href="/login" 
          className="px-8 py-3 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 border border-white/10 transition-all"
        >
          Sign In
        </Link>
      </div>
    </main>
  );
}