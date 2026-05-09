"use client";

import { useActionState } from 'react';
import { signup } from '@/app/actions/authActions';
import Image from 'next/image';
import Link from 'next/link';

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signup, null);

  return (
    <main className="min-h-[100dvh] flex items-center justify-center p-4">
      <div className="glass w-full max-w-md p-6 rounded-2xl flex flex-col items-center">
        <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-4 border border-white/10 overflow-hidden">
          <Image src="/windtodo.png" alt="WindTodo" width={56} height={56} className="w-full h-full object-contain" />
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