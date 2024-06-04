// Mendapatkan elemen kontainer permainan, tombol, dan layar game over
var gameContainer = document.getElementById("game-container");
var buttons = document.querySelectorAll(".button");
var gameOverContainer = document.getElementById("gameover");

// Mendapatkan tombol untuk memulai ulang permainan
var restartButton = document.getElementById("restart-button");

// Array untuk menyimpan lingkaran yang sedang aktif dan status permainan
var activeCircles = [];
var isGamePaused = false;

// Menambahkan event listener untuk klik pada tombol restart
restartButton.addEventListener("click", function () {
  restartGame();
});

// Fungsi untuk menampilkan layar game over dan menjeda permainan
function showGameOver() {
  console.log("game over");
  gameOverContainer.classList.add("active"); // Menambahkan kelas "active" untuk menampilkan layar game over
  isGamePaused = true; // Menyetel status permainan menjadi dijeda
  document.removeEventListener("keydown", handleKeyPress); // Menghapus event listener untuk keydown
}

// Fungsi untuk memulai ulang permainan
function restartGame() {
  gameOverContainer.classList.remove("active"); // Menghapus kelas "active" untuk menyembunyikan layar game over
  gameOverContainer.removeEventListener("click", restartGame); // Menghapus event listener untuk klik pada layar game over
  document.addEventListener("keydown", handleKeyPress); // Menambahkan kembali event listener untuk keydown

  // Menghapus semua lingkaran aktif dari gameContainer
  var circlesCopy = activeCircles.slice(); // Membuat salinan array activeCircles untuk menghindari modifikasi selama iterasi
  circlesCopy.forEach(function (circle) {
    if (circle.parentElement === gameContainer) {
      gameContainer.removeChild(circle);
    }
  });

  // Mengatur ulang array activeCircles menjadi kosong dan status permainan menjadi tidak dijeda
  activeCircles = [];
  isGamePaused = false;
}

// Fungsi untuk membuat lingkaran dan mengatur animasinya
function createCircle(button) {
  var circle = document.createElement("div"); // Membuat elemen div untuk lingkaran
  circle.classList.add("circle"); // Menambahkan kelas "circle" ke elemen lingkaran

  // Mengatur posisi awal lingkaran di atas tengah tombol yang dipilih
  var buttonRect = button.getBoundingClientRect();
  var buttonCenterX = buttonRect.left + buttonRect.width / 2;
  circle.style.left = buttonCenterX - 20 + "px"; // Mengatur posisi horizontal lingkaran
  circle.style.top = "-20px"; // Mengatur posisi vertikal lingkaran di atas layar

  // Menambahkan elemen lingkaran ke gameContainer
  gameContainer.appendChild(circle);

  // Mengatur animasi untuk menggerakkan lingkaran ke bawah layar dan menangani peristiwa ketika animasi selesai
  setTimeout(function () {
    circle.style.top = gameContainer.offsetHeight + "px"; // Mengatur posisi vertikal akhir lingkaran

    circle.addEventListener("transitionend", function (event) {
      if (
        event.propertyName === "top" &&
        circle.parentElement === gameContainer
      ) {
        gameContainer.removeChild(circle); // Menghapus elemen lingkaran dari gameContainer
        showGameOver(); // Menampilkan layar game over jika lingkaran mencapai bawah layar
      }
    });
  }, 100);

  // Menambahkan lingkaran ke array activeCircles untuk melacak lingkaran yang aktif
  activeCircles.push(circle);

  return circle; // Mengembalikan elemen lingkaran yang dibuat
}

// Fungsi untuk memeriksa tabrakan antara lingkaran dan tombol
function checkCollision(circle, button) {
  var circleRect = circle.getBoundingClientRect(); // Mendapatkan informasi persegi panjang yang melingkupi lingkaran
  var buttonRect = button.getBoundingClientRect(); // Mendapatkan informasi persegi panjang yang melingkupi tombol

  // Memeriksa apakah ada tabrakan antara lingkaran dan tombol berdasarkan posisi mereka
  return (
    circleRect.bottom >= buttonRect.top &&
    circleRect.top <= buttonRect.bottom &&
    circleRect.left >= buttonRect.left &&
    circleRect.right <= buttonRect.right
  );
}

// Fungsi untuk menangani penekanan tombol oleh pemain
function handleKeyPress(event) {
  if (isGamePaused) return; // Keluar dari fungsi jika permainan dijeda
  var key = event.key.toUpperCase(); // Mendapatkan tombol yang ditekan dalam huruf besar

  buttons.forEach(function (button) {
    if (button.dataset.key === key) {
      button.classList.add("pressed"); // Menambahkan kelas "pressed" untuk memberi efek tekanan pada tombol

      // Memeriksa tabrakan antara lingkaran dan tombol yang ditekan, menghapus lingkaran jika ada tabrakan
      activeCircles.forEach(function (circle) {
        if (checkCollision(circle, button)) {
          gameContainer.removeChild(circle); // Menghapus elemen lingkaran dari gameContainer
          activeCircles.splice(activeCircles.indexOf(circle), 1); // Menghapus lingkaran dari array activeCircles
        }
      });

      // Menghapus kelas "pressed" dari tombol setelah jeda 100 milidetik
      setTimeout(function () {
        button.classList.remove("pressed");
      }, 100);
    }
  });
}

// Fungsi untuk memunculkan lingkaran secara acak di atas tombol
function spawnCircle() {
  if (isGamePaused) return; // Keluar dari fungsi jika permainan dijeda
  var randomButton = buttons[Math.floor(Math.random() * buttons.length)]; // Memilih tombol secara acak dari array tombol
  createCircle(randomButton); // Membuat lingkaran di atas tombol yang dipilih
}

// Menambahkan event listener untuk keydown dan menjalankan fungsi spawnCircle setiap 1000 milidetik
