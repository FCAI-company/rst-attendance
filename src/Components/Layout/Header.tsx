import Image from 'next/image';
import React from 'react'

export default function Header() {
  return (
    <header className="max-w-4xl mx-auto px-4">
      <div className="text-center flex items-center justify-center gap-2">
        <Image src="/fcai2.png" alt="FCAI" width={80} height={80} />
      </div>
    </header>
  );
}
