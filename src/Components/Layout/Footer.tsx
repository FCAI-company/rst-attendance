import Image from 'next/image';
import React from 'react'

export default function Footer() {
  return (
    <footer className="  ">
      <div className="max-w-4xl mx-auto px-4 text-center flex items-center justify-center gap-2">
        <Image src="/One.svg" alt="One" width={50} height={50} />
        <p className="text-sm P-0 M-0 text-muted-foreground">
          © 2025. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
