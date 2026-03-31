"use client";

import { useEffect } from "react";
// import { Html5QrcodeScanner } from "html5-qrcode";
import { Html5Qrcode } from "html5-qrcode";


export default function QRScanner() {
 useEffect(() => {
   const scanner = new Html5Qrcode("reader");

   let isRunning = false;

   scanner
     .start(
       { facingMode: "environment" },
       { fps: 10, qrbox: 250 },
       (decodedText) => {
        window.location.replace(decodedText);
       },
       (error) => {
         console.warn(error);
       },
     )
     .then(() => {
       isRunning = true; // mark that scanner is running
     })
     .catch((err) => {
       console.error("Failed to start scanner:", err);
     });

   return () => {
     if (isRunning) {
       scanner
         .stop()
         .then(() => scanner.clear())
         .catch(console.error);
     }
   };
 }, []);
  // useEffect(() => {
  //   const scanner = new Html5QrcodeScanner(
  //     "reader",
      
  //     {
  //       fps: 10,
  //       qrbox: 250,
        
  //     },
  //     false,
  //   );

  //   scanner.render(
  //     (decodedText) => {
  //       console.log("QR Code:", decodedText);
  //       alert(decodedText);
  //     },
  //     (error) => {
  //       console.warn(error);
  //     },
  //   );

  //   return () => {
  //     scanner.clear().catch(console.error);
  //   };
  // }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        // height: "100vh", // full viewport height
      }}
    >
      <div
        id="reader"
        style={{
          borderColor: "transparent",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      />
    </div>
  );
}
