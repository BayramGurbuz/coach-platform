import React from 'react';
import { Link } from 'react-router-dom';

// Variant: 'login' | 'logout' | 'register'
export default function AuthButton({ variant = 'login', to, onClick, children, className = '' }) {
  const labels = {
    login: children || 'Login',
    logout: children || 'Logout',
    register: children || 'Register',
  };

  const gradients = {
    login: 'bg-gradient-to-br from-emerald-400 to-emerald-500',
    logout: 'bg-gradient-to-br from-rose-400 to-rose-500',
    register: 'bg-gradient-to-br from-sky-500 to-indigo-500',
  };

  const icon = (v) => {
    if (v === 'logout') {
      // Bracket + arrow icon (modern, matches provided sample)
      return (
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M6 4v16" stroke="white" />
          <path d="M10 4h8" stroke="white" />
          <path d="M10 20h8" stroke="white" />
          <path d="M15 8l4 4-4 4" stroke="white" />
        </svg>
      );
    }
    if (v === 'login') {
      return (
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12 12a3 3 0 100-6 3 3 0 000 6z" stroke="white" />
          <path d="M5 21a7 7 0 0114 0" stroke="white" />
          <path d="M20 12h-6" stroke="white" />
          <path d="M17 9l3 3-3 3" stroke="white" />
        </svg>
      );
    }
    // register
    return (
      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 12a3 3 0 100-6 3 3 0 000 6z" stroke="white" />
        <path d="M5 21a7 7 0 0114 0" stroke="white" />
        <path d="M19 8v6" stroke="white" />
        <path d="M16 11h6" stroke="white" />
      </svg>
    );
  };

  const inner = (
    <span className={`inline-flex items-center gap-3 px-4 py-2 rounded-lg text-white font-semibold shadow-md ${gradients[variant]} ${className} transform transition-transform duration-150 ease-in-out hover:scale-105 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/30`}> 
      {icon(variant)}
      <span className="hidden sm:inline">{labels[variant]}</span>
    </span>
  );

  if (to) {
    return (
      <Link to={to} className="inline-block" onClick={onClick} aria-label={labels[variant]}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className="inline-block" aria-label={labels[variant]}>
      {inner}
    </button>
  );
}
