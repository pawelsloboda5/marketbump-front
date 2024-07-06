"use client";

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import HomeIconOutline from '../icons/HomeIconOutline';
import HomeIconFilled from '../icons/HomeIconFilled';
import ProfileIconOutline from '../icons/ProfileIconOutline';
import ProfileIconFilled from '../icons/ProfileIconFilled';
import LikesIconOutline from '../icons/LikesIconOutline';
import LikesIconFilled from '../icons/LikesIconFilled';
import SearchIconOutline from '../icons/SearchIconOutline';
import SearchIconFilled from '../icons/SearchIconFilled';

const TopMenu = () => {
  const pathname = usePathname();
  const [hovered, setHovered] = useState<string | null>(null);

  const getIcon = (path: string, IconOutline: any, IconFilled: any) => {
    if (pathname === path || hovered === path) {
      return <IconFilled className="w-6 h-6 sm:w-8 sm:h-8 text-white" />;
    }
    return <IconOutline className="w-6 h-6 sm:w-8 sm:h-8 text-white" />;
  };

  return (
    <nav className="bg-gray-900 fixed top-0 w-full p-4 shadow-md z-50">
      <ul className="flex justify-around max-w-6xl mx-auto">
        <li
          onMouseEnter={() => setHovered('/')}
          onMouseLeave={() => setHovered(null)}
        >
          <Link href="/">
            {getIcon('/', HomeIconOutline, HomeIconFilled)}
          </Link>
        </li>
        <li
          onMouseEnter={() => setHovered('/login')}
          onMouseLeave={() => setHovered(null)}
        >
          <Link href="/user-profile">
            {getIcon('/login', ProfileIconOutline, ProfileIconFilled)}
          </Link>
        </li>
        <li
          onMouseEnter={() => setHovered('/likes')}
          onMouseLeave={() => setHovered(null)}
        >
          <Link href="/likes">
            {getIcon('/likes', LikesIconOutline, LikesIconFilled)}
          </Link>
        </li>
        <li
          onMouseEnter={() => setHovered('/search')}
          onMouseLeave={() => setHovered(null)}
        >
          <Link href="/search">
            {getIcon('/search', SearchIconOutline, SearchIconFilled)}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default TopMenu;
