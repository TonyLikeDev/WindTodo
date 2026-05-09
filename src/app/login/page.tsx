import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="min-h-[100dvh] flex items-center justify-center p-4">
      <div className="glass w-full max-w-md p-6 rounded-2xl flex flex-col items-center">
        {/* Logo/Icon area from wireframe */}
        <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mb-4 border border-white/20">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
        </div>
        
        <h1 className="text-xl font-semibold text-gray-100 mb-5 tracking-tight">WindTodo</h1>
        
        <form className="w-full space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1 px-1">Username</label>
            <input type="text" placeholder="tony@example.com" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1 px-1">Password</label>
            <input type="password" placeholder="••••••••" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all" />
          </div>
          
          <Link href="/" className="block w-full bg-white/90 hover:bg-white text-black font-semibold py-2.5 mt-2 rounded-lg transition-all shadow-lg hover:shadow-white/10 transform hover:-translate-y-0.5 active:translate-y-0 text-center text-sm">
            Sign In
          </Link>
        </form>
        
        <div className="mt-5 text-center">
          <a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Forgot your password?</a>
        </div>
        
        <div className="mt-5 flex items-center w-full">
          <div className="flex-grow border-t border-white/5"></div>
          <span className="px-3 text-xs text-gray-600 uppercase tracking-widest">or</span>
          <div className="flex-grow border-t border-white/5"></div>
        </div>
        
        <p className="mt-5 text-sm text-gray-400">
          Don&apos;t have an account? <a href="#" className="text-gray-200 hover:underline">Sign up</a>
        </p>
      </div>
    </main>
  );
}
