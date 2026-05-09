"use client";

import { useActionState } from 'react';
import { signup } from '@/app/actions/authActions';
import Link from 'next/link';

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signup, null);

  return (
    <main className="min-h-[100dvh] flex items-center justify-center p-4">
      <div className="glass w-full max-w-md p-6 rounded-2xl flex flex-col items-center">
        <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-4 border border-white/10">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
        </div>
        
        <h1 className="text-xl font-bold text-white mb-5 tracking-tight">Create Account</h1>
        
        <form className="w-full space-y-4" action={formAction}>
          {state?.error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
              <p className="text-sm text-red-400">{state.error}</p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1 px-1">Email</label>
            <input type="email" name="email" placeholder="tony@stark.com" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all" required />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1 px-1">Password</label>
            <input type="password" name="password" placeholder="••••••••" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1 px-1">Confirm Password</label>
            <input type="password" name="confirmPassword" placeholder="••••••••" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all" required />
          </div>
          
          <button 
            type="submit"
            disabled={isPending}
            className="w-full bg-white/90 hover:bg-white text-black font-bold py-2.5 mt-2 rounded-lg transition-all shadow-lg hover:shadow-white/10 transform hover:-translate-y-0.5 active:translate-y-0 text-center text-sm disabled:opacity-50 disabled:transform-none"
          >
            {isPending ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        
        <div className="mt-5 flex items-center w-full">
          <div className="flex-grow border-t border-white/5"></div>
          <span className="px-3 text-xs text-gray-600 uppercase tracking-widest">or</span>
          <div className="flex-grow border-t border-white/5"></div>
        </div>
        
        <p className="mt-5 text-sm text-gray-400">
          Already have an account? <Link href="/login" className="text-white hover:underline">Sign in</Link>
        </p>
      </div>
    </main>
  );
}