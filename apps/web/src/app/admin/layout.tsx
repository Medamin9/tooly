'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Layers,
  PlusCircle,
  ShoppingBag,
  History,
  LogOut,
  ShieldAlert,
  Menu,
  X,
  ExternalLink,
  SlidersHorizontal,
} from 'lucide-react';
import { getProfileApi, logoutApi, AuthUser } from '@/lib/api/auth';
import { Button } from '@/components/ui/Button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login';

  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(!isLoginPage);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isLoginPage) return;

    let isMounted = true;
    getProfileApi()
      .then((profile) => {
        if (!isMounted) return;
        if (!profile || profile.role !== 'ADMIN') {
          router.replace('/admin/login');
        } else {
          setUser(profile);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) router.replace('/admin/login');
      });

    return () => {
      isMounted = false;
    };
  }, [pathname, isLoginPage, router]);

  if (isLoginPage) {
    return <div className="min-h-screen bg-paper text-ink">{children}</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper text-ink">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-tooly-red border-t-transparent animate-spin" />
          <span className="text-xs font-semibold text-muted">التحقق من صلاحيات الإدارة...</span>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logoutApi();
    router.replace('/admin/login');
  };

  const navLinks = [
    { href: '/admin', label: 'لوحة التحكم', icon: LayoutDashboard },
    { href: '/admin/orders', label: 'إدارة الطلبات والتسليم', icon: ShoppingBag },
    { href: '/admin/categories', label: 'إدارة التصنيفات', icon: Layers },
    { href: '/admin/products', label: 'إدارة المنتجات والأسعار', icon: Package },
    { href: '/admin/products/new', label: 'إضافة منتج جديد', icon: PlusCircle },
    { href: '/admin/options', label: 'المدد وطرق التسليم', icon: SlidersHorizontal },
    { href: '/admin/audit', label: 'سجل التدقيق والأمان', icon: History },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-paper text-ink">
      {/* Sidebar Navigation (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-surface border-e border-line p-6 justify-between shrink-0">
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-6 border-b border-line">
            <div className="relative h-9 w-28">
              <Image
                src="/brand/tooly-logo.png"
                alt="Tooly Logo"
                fill
                priority
                className="object-contain"
              />
            </div>
            <span className="text-[10px] font-extrabold uppercase bg-ink text-surface px-2 py-0.5 rounded">
              Admin
            </span>
          </div>

          <div className="p-3 bg-paper rounded-control border border-line text-xs">
            <div className="font-bold text-ink truncate">{user?.name || user?.email}</div>
            <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>مدير نظام موثق</span>
            </div>
          </div>

          <nav className="space-y-1 text-sm font-semibold">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-control transition-colors ${
                    isActive
                      ? 'bg-tooly-soft-red text-tooly-red font-bold'
                      : 'text-muted hover:text-ink hover:bg-paper'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-2 pt-6 border-t border-line">
          <Link
            href="/ar"
            target="_blank"
            className="flex items-center justify-between text-xs text-muted hover:text-ink px-3 py-2 rounded-control hover:bg-paper transition-colors"
          >
            <span>زيارة المتجر</span>
            <ExternalLink className="w-3.5 h-3.5 rtl:rotate-180" />
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full text-xs font-semibold text-danger hover:bg-red-50 px-3 py-2 rounded-control transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden bg-surface border-b border-line px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative h-7 w-24">
            <Image
              src="/brand/tooly-logo.png"
              alt="Tooly Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-[9px] font-bold bg-ink text-surface px-1.5 py-0.5 rounded">
            Admin
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-control border border-line text-ink"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface border-b border-line p-4 space-y-3">
          <nav className="space-y-1 text-sm font-semibold">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-control ${
                    isActive
                      ? 'bg-tooly-soft-red text-tooly-red font-bold'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="pt-3 border-t border-line flex items-center justify-between">
            <Link href="/ar" className="text-xs text-muted hover:text-ink">
              زيارة المتجر
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs text-danger font-semibold flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto max-w-7xl">
        {children}
      </main>
    </div>
  );
}
