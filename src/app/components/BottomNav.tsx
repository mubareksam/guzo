'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Map, Route, Building2, User } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/', icon: Map, label: 'Map' },
    { href: '/plan', icon: Route, label: 'Plan' },
    { href: '/stations', icon: Building2, label: 'Stations' },
    { href: '/dashboard', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white shadow-lg md:hidden">
      <div className="grid h-16 grid-cols-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                isActive
                  ? 'text-primary-600'
                  : 'text-gray-600 hover:text-primary-500'
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
