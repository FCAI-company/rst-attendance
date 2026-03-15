"use client";

import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function QRScanner() {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: 250,
      },
      false,
    );

    scanner.render(
      (decodedText) => {
        console.log("QR Code:", decodedText);
        alert(decodedText);
      },
      (error) => {
        console.warn(error);
      },
    );

    return () => {
      scanner.clear().catch(console.error);
    };
  }, []);

  return <div id="reader" style={{ width: "300px" }} />;
}
