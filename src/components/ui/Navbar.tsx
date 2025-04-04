'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/lib/constants';

const Navbar: React.FC = () => {
  const [, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-black bg-opacity-90 shadow-lg`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
            <Image
              src="/images/logo.png"
              alt="League of Flex"
              width={40}
              height={40}
              className="w-10 h-10"
              priority
            />
            <span className="text-xl font-bold text-white">
              League of <span className="text-gold">Flex</span>
            </span>
          </Link>

          <div className="hidden md:flex space-x-8 items-center">
            {NAV_ITEMS.map(item => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium uppercase transition-colors hover:text-gold ${
                  pathname === item.href ? 'text-gold' : 'text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <a
              href="https://discord.gg/leagueofflex"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium uppercase text-white transition-colors hover:text-gold"
            >
              Join Discord
            </a>
          </div>

          <button
            className="md:hidden text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gold rounded"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        <div
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMobileMenuOpen ? 'max-h-96 opacity-100 pt-4 pb-2' : 'max-h-0 opacity-0'
          }`}
        >
          {isMobileMenuOpen && (
            <div className="flex flex-col space-y-4">
              {NAV_ITEMS.map(item => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block text-sm font-medium uppercase transition-colors hover:text-gold ${
                    pathname === item.href ? 'text-gold' : 'text-white'
                  }`}
                  onClick={closeMobileMenu}
                >
                  {item.name}
                </Link>
              ))}
              <a
                href="https://discord.gg/leagueofflex"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm font-medium uppercase text-white transition-colors hover:text-gold"
                onClick={closeMobileMenu}
              >
                Join Discord
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
