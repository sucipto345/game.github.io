var toggleButton = document.getElementById("toggleButton");
var instructionButton = document.getElementById("instructionButton");
var startGame = document.getElementById("play");
var playGame = document.getElementById("play-game");
var menuContainer = document.getElementById("container");
var usernameInput = document.getElementById("username");
var isGamePaused = false;

// Fungsi untuk menangani klik pada tombol toggleButton
toggleButton.addEventListener("click", function () {
    if (instructionButton.style.display === "none") {
        // Menampilkan instructionButton dan mengubah tampilannya
        instructionButton.style.display = "block";
        instructionButton.style.backgroundColor = "#44200a";
        instructionButton.style.color = "#fffff";
        setTimeout(function() {
            instructionButton.classList.add("show");
        }, 10); // Sedikit delay agar animasi dapat berjalan
    } else {
        // Menyembunyikan instructionButton dengan animasi
        instructionButton.classList.remove("show");
        setTimeout(function() {
            instructionButton.style.display = "none";
        }, 500); // Sesuaikan dengan durasi animasi
    }
});

// Fungsi untuk menangani input username
usernameInput.addEventListener("input", function() {
  if (usernameInput.value.trim() === "") {
    // Jika input username kosong, maka tombol play-game akan di-disable
    startGame.disabled = true;
  } else {
    // Jika input username terisi, maka tombol play-game akan di-enable
    startGame.disabled = false;
  }
});

// Fungsi untuk menangani klik pada tombol startGame
startGame.addEventListener("click", function() {
  if (usernameInput.value.trim()!== "") {
    // Jika input username terisi, maka fungsi startGame akan di-mulai
    playGame.style.display = "flex";
    menuContainer.style.display = "none";
    // Anda dapat menambahkan kode lainnya di sini untuk memulai game
  } else {
    // Jika input username kosong, maka akan menampilkan pesan error
    alert("Silakan isi nama pengguna terlebih dahulu!");
  }
});

const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");
const cards = document.querySelectorAll(".card");
const boxesContainer = document.getElementById("boxesContainer");
let draggedImage = null;
let isImageDropped = false;

// Fungsi untuk menangani saat elemen mulai di-drag
function handleDragStart(event) {
    draggedImage = event.target; // Menyimpan elemen yang di-drag
    event.dataTransfer.setData("text/plain", ""); // Menginisialisasi data transfer
}

// Fungsi untuk menangani saat elemen di-drag di atas target drop
function handleDragOver(event) {
    event.preventDefault(); // Mencegah perilaku default untuk mengizinkan drop
}

// Fungsi untuk menangani saat elemen di-drop di target drop
function handleDrop(event) {
    event.preventDefault(); // Mencegah perilaku default

    const box = event.target; // Mendapatkan target drop
    
    isImageDropped = true; // Set flag to true
    
    if (isImageDropped) {
        // Kirim element lain ke dalam box
        const newElement = document.createElement("image");
    }
}

// Fungsi untuk membuat grid kotak sebagai target drop
function createBoxes(rows, cols) {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const box = document.createElement("div"); // Membuat elemen div untuk kotak
            box.classList.add("box"); // Menambahkan kelas "box" ke elemen
            box.addEventListener("dragover", handleDragOver); // Menambahkan event listener untuk dragover
            box.addEventListener("drop", handleDrop); // Menambahkan event listener untuk drop
            boxesContainer.appendChild(box); // Menambahkan kotak ke container
        }
    }
}

// Menambahkan event listener untuk dragstart pada setiap kartu
cards.forEach((card) => {
    card.addEventListener("dragstart", handleDragStart);
});

// Memanggil fungsi untuk membuat grid kotak 5x8
createBoxes(5, 8);

