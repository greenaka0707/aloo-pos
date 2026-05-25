// ==========================================================================
// FILE: src/components/PinLock.jsx (MURNI JSX REACT COMPONENT - FIX AUTO-RENDER)
// ==========================================================================

import React, { useState } from "react";

export function PinLock({ onSuccess }) {
  const CORRECT_PIN = "1234"; // 🔑 SILAKAN GANTI PIN IPHONE KAMU DI SINI GAIS
  const [enteredPin, setEnteredPin] = useState("");
  const [isShaking, setIsShaking] = useState(false);

  // Handle Ketukan Tombol Angka Bulat gais
  const handleKeyClick = (value) => {
    if (enteredPin.length >= 4 || isShaking) return;

    const nextPin = enteredPin + value;
    setEnteredPin(nextPin);

    // Jika inputan sudah genap 4 digit gais
    if (nextPin.length === 4) {
      if (nextPin === CORRECT_PIN) {
        if (onSuccess) onSuccess(); // Sukses! Buka gerbang utama POS gais
      } else {
        // Picu efek getar ala iPhone pas salah input PIN
        setIsShaking(true);
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]); // Getar rill di HP Android/iOS pendukung
        
        setTimeout(() => {
          setEnteredPin("");
          setIsShaking(false);
        }, 500);
      }
    }
  };

  // Handle Tombol Hapus (Clear/Delete ⌫)
  const handleClearClick = () => {
    if (enteredPin.length > 0 && !isShaking) {
      setEnteredPin(enteredPin.slice(0, -1));
    }
  };

  return (
    <div className="iphone-lockscreen" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#0f172a", color: "white", fontFamily: "sans-serif" }}>
      <div className="lockscreen-container" style={{ width: "100%", maxWidth: "360px", padding: "20px", textAlign: "center" }}>
        
        <div className="lock-header" style={{ marginBottom: "30px" }}>
          <div className="lock-icon" style={{ fontSize: "40px", marginBottom: "10px" }}>🔒</div>
          <h3 style={{ fontSize: "18px", fontWeight: "600", margin: 0, color: "#94a3b8" }}>Masukkan PIN ALOO POS</h3>
        </div>

        {/* ALUR BULATAN PIN DENGAN EFEK SHAKE ERROR */}
        <div 
          className={`pin-code-area ${isShaking ? "shake-error" : ""}`} 
          style={{ 
            display: "flex", 
            justifyContent: "center", 
            gap: "20px", 
            marginBottom: "50px",
            animation: isShaking ? "shake 0.4s ease-in-out" : "none"
          }}
        >
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`pin-dot ${index < enteredPin.length ? "filled" : ""}`}
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                border: "2px solid #f97316",
                backgroundColor: index < enteredPin.length ? "#f97316" : "transparent",
                transition: "all 0.1s ease"
              }}
            />
          ))}
        </div>

        {/* KEYPAD BULAT ALA IOS MODERN */}
        <div className="iphone-keypad" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", justifyItems: "center" }}>
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
            <button
              key={num}
              className="key-btn"
              onClick={() => handleKeyClick(num)}
              style={{ width: "70px", height: "70px", borderRadius: "50%", border: "none", backgroundColor: "#334155", color: "white", fontSize: "24px", fontWeight: "500", cursor: "pointer" }}
            >
              {num}
            </button>
          ))}
          
          <div className="empty-space" />
          
          <button
            className="key-btn"
            onClick={() => handleKeyClick("0")}
            style={{ width: "70px", height: "70px", borderRadius: "50%", border: "none", backgroundColor: "#334155", color: "white", fontSize: "24px", fontWeight: "500", cursor: "pointer" }}
          >
            0
          </button>
          
          <button
            className="clear-btn"
            onClick={handleClearClick}
            style={{ width: "70px", height: "70px", borderRadius: "50%", border: "none", backgroundColor: "transparent", color: "#94a3b8", fontSize: "24px", cursor: "pointer" }}
          >
            ⌫
          </button>
        </div>

        {/* STYLING KEYPAD ANIMATION INLINE */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-10px); }
            40%, 80% { transform: translateX(10px); }
          }
        `}} />

      </div>
    </div>
  );
}
