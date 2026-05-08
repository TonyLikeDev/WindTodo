import Link from 'next/link';

export default function LoginPage() {
  return (
    <main 
      className="min-h-screen flex items-center justify-center p-4 bg-[#1a1a1a]"
      style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg stroke='%23ffffff' strokeOpacity='0.05' strokeWidth='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2v-4h4v-2h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2v-4h4v-2H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
      }}
    >
      <div className="glass w-full max-w-md p-8 rounded-2xl flex flex-col items-center">
        {/* Logo/Icon area from wireframe */}
        <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6 border border-white/20">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
        </div>
        
        <h1 className="text-2xl font-semibold text-gray-100 mb-8 tracking-tight">WindTodo</h1>
        
        <form className="w-full space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2 px-1">Username</label>
            <input type="text" placeholder="tony@example.com" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2 px-1">Password</label>
            <input type="password" placeholder="••••••••" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all" />
          </div>
          
          <Link href="/" className="block w-full bg-white/90 hover:bg-white text-black font-semibold py-3 rounded-lg transition-all shadow-lg hover:shadow-white/10 transform hover:-translate-y-0.5 active:translate-y-0 text-center">
            Sign In
          </Link>
        </form>
        
        <div className="mt-8 text-center">
          <a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Forgot your password?</a>
        </div>
        
        <div className="mt-6 flex items-center w-full">
          <div className="flex-grow border-t border-white/5"></div>
          <span className="px-4 text-xs text-gray-600 uppercase tracking-widest">or</span>
          <div className="flex-grow border-t border-white/5"></div>
        </div>
        
        <p className="mt-6 text-sm text-gray-400">
          Don't have an account? <a href="#" className="text-gray-200 hover:underline">Sign up</a>
        </p>
      </div>
    </main>
  );
}
