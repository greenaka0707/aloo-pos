export function PinLock(onSuccess) {
  const CORRECT_PIN = "1234"; // 🔑 SILAKAN GANTI PIN IPHONE LO DI SINI GAIS
  let enteredPin = "";

  setTimeout(() => {
    const lockscreen = document.querySelector(".iphone-lockscreen");
    if (!lockscreen) return;

    const dots = lockscreen.querySelectorAll(".pin-dot");
    const keys = lockscreen.querySelectorAll(".key-btn");
    const clearBtn = lockscreen.querySelector(".clear-btn");

    // Fungsi update visual buletan kosong/isi harian
    function updateDots() {
      dots.forEach((dot, index) => {
        if (index < enteredPin.length) {
          dot.classList.add("filled");
        } else {
          dot.classList.remove("filled");
        }
      });
    }

    // Fungsi validasi PIN kancangan gais
    async function verifyPin() {
      if (enteredPin === CORRECT_PIN) {
        lockscreen.classList.add("unlock-fade");
        setTimeout(() => {
          lockscreen.remove(); // Hapus layar lockscreen dari DOM
          if (onSuccess) onSuccess(); // Buka aplikasi utama gais!
        }, 400);
      } else {
        // Efek getar ala iPhone pas PIN salah input
        const codeArea = lockscreen.querySelector(".pin-code-area");
        codeArea.classList.add("shake-error");
        
        setTimeout(() => {
          codeArea.classList.remove("shake-error");
          enteredPin = "";
          updateDots();
        }, 500);
      }
    }

    // Event handler klik tombol angka bulat
    keys.forEach(key => {
      key.addEventListener("click", () => {
        const value = key.dataset.value;
        if (!value || enteredPin.length >= 4) return;

        enteredPin += value;
        updateDots();

        if (enteredPin.length === 4) {
          setTimeout(verifyPin, 200);
        }
      });
    });

    // Tombol Hapus (Clear/Delete)
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        if (enteredPin.length > 0) {
          enteredPin = enteredPin.slice(0, -1);
          updateDots();
        }
      });
    }

  }, 10);

  // Layout HTML murni UI bulat-bulat iOS modern gais
  return `
    <div class="iphone-lockscreen">
      <div class="lockscreen-container">
        
        <div class="lock-header">
          <div class="lock-icon">🔒</div>
          <h3>Masukkan PIN ALOO POS</h3>
        </div>

        <div class="pin-code-area">
          <div class="pin-dot"></div>
          <div class="pin-dot"></div>
          <div class="pin-dot"></div>
          <div class="pin-dot"></div>
        </div>

        <div class="iphone-keypad">
          <button class="key-btn" data-value="1">1</button>
          <button class="key-btn" data-value="2">2</button>
          <button class="key-btn" data-value="3">3</button>
          
          <button class="key-btn" data-value="4">4</button>
          <button class="key-btn" data-value="5">5</button>
          <button class="key-btn" data-value="6">6</button>
          
          <button class="key-btn" data-value="7">7</button>
          <button class="key-btn" data-value="8">8</button>
          <button class="key-btn" data-value="9">9</button>
          
          <div class="empty-space"></div>
          <button class="key-btn" data-value="0">0</button>
          <button class="clear-btn">⌫</button>
        </div>

      </div>
    </div>
  `;
}
