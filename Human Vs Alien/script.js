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
  if (usernameInput.value.trim() !== "") {
    // Jika input username terisi, maka fungsi startGame akan di-mulai
    playGame.style.display = "block";
    menuContainer.style.display = "none";
    username = usernameInput.value.trim(); // Simpan nama pengguna
    // Anda dapat menambahkan kode lainnya di sini untuk memulai game
  } else {
    // Jika input username kosong, maka akan menampilkan pesan error
    alert("Silakan isi nama pengguna terlebih dahulu!");
  }
});

// Fungsi untuk memperbarui tampilan status permainan dengan nama pengguna


const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.height = 600;
canvas.width = 900;

// global variables
const cellSize = 100;
const cellGap = 3;
let enemiesInterval = 1000;
let frame = 0;
let gameOver = false;
let numberOfResources = 50;
let score = 0;
const winningScore = 50;
let chosenDefender = 1;
let username = '';

const gameGrid = [];
const defenders = [];
const enemies = [];
const defenderPositions = [];
const enemyPositions = [];
const projectiles = [];
const resources = [];

// mouse
const mouse = {
  x: 10,
  y: 10,
  width: 0.1,
  height: 0.1,
  clicked: false
}

canvas.addEventListener('mousedown', function(){
  mouse.clicked = true;
});

canvas.addEventListener('mouseup', function(){
  mouse.clicked = false;
});

let canvasPosition = canvas.getBoundingClientRect();

canvas.addEventListener('mousemove', function(e){
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

canvas.addEventListener('mouseleave', function(){
  mouse.x = undefined;
  mouse.y = undefined;
});

// 1. Struktur data untuk menyimpan riwayat pemain
let playerHistory = {};

// 2. Simpan riwayat saat game berakhir
function savePlayerHistory(username, score) {
    if (!(username in playerHistory) || playerHistory[username] < score) {
        playerHistory[username] = score;
    }
}

// 3. Tampilkan riwayat pemain saat tombol restart diklik
function showPlayerHistory() {
    // Tampilkan riwayat pemain di sini, misalnya di dalam sebuah div dengan id "player-history"
    const playerHistoryDiv = document.getElementById("player-history");
    playerHistoryDiv.innerHTML = "<h3>Player History</h3>";
    for (const [username, score] of Object.entries(playerHistory)) {
        playerHistoryDiv.innerHTML += `<p>${username}: ${score}</p>`;
    }
}

// 4. Logika untuk menyimpan dan menampilkan riwayat
startGame.addEventListener("click", function() {
    if (usernameInput.value.trim() !== "") {
        playGame.style.display = "block";
        menuContainer.style.display = "none";
        username = usernameInput.value.trim();
        showPlayerHistory(); // Tampilkan riwayat saat memulai game
        // Anda dapat menambahkan kode lainnya di sini untuk memulai game
    } else {
        alert("Silakan isi nama pengguna terlebih dahulu!");
    }
});

// Logika untuk menyimpan riwayat saat game berakhir
function handleGameStatus() {
    // ...
    if (gameOver) {
        savePlayerHistory(username, score);
        showPlayerHistory(); // Tampilkan riwayat saat game berakhir
        // ...
    }
}



// highscoreboard

function updateGameStatus() {
  document.getElementById("high-score").textContent = localStorage.getItem("highScore") || 0;
  document.getElementById("username-display-value").textContent = username;
}

// Fungsi untuk menyimpan skor tertinggi ke localStorage
function saveHighScore(score) {
  const highScore = localStorage.getItem("highScore") || 0;
  if (score > highScore) {
    localStorage.setItem("highScore", score);
    updateGameStatus();
  }
}

// Panggil fungsi untuk memperbarui tampilan status permainan
updateGameStatus();

// Di dalam loop permainan, panggil saveHighScore(score) untuk menyimpan skor tertinggi
// Contoh: jika pemain menang, panggil saveHighScore(score);


// gameboard
const controlsBar = {
  width: canvas.width,
  height: cellSize
}

class Cell {
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.width = cellSize;
    this.height = cellSize;
  }
  draw(){
    if (mouse.x && mouse.y && collision(this, mouse)){
      ctx.strokeStyle = 'black';
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
  }
}

function createGrid(){
  for (let y = cellSize; y < canvas.height; y += cellSize){
    for (let x = 0; x < canvas.width; x += cellSize){
      gameGrid.push(new Cell(x, y));
    }
  }
}
createGrid();

function handleGameGrid(){
  for (let i = 0; i < gameGrid.length; i++){
    gameGrid[i].draw();
  }
}
// LawnMower
const lawnmover = new Image();
lawnmover.src = 'General/lawnmowerIdle.gif';
class LawnMower {
  constructor(y) {
    this.x = 0; // Dimulai dari kolom pertama
    this.y = y; // Baris di mana pemotong rumput ditempatkan
    this.width = cellSize;
    this.height = cellSize;
    this.active = false; // Atur ke true saat pemotong rumput aktif
  }

  activate() {
    this.active = true;
    this.x = 0; // Mulai dari kolom pertama lagi
  }

  update() {
    if (this.active) {
      this.x += cellSize; // Gerakkan pemotong rumput ke kanan
      if (this.x >= canvas.width) {
        // Pemotong rumput mencapai ujung kanan
        this.active = false;
      }
    }
  }

  draw() {
    if (this.active) {
      // Gambar pemotong rumput (gambar atau persegi)
      ctx.fillStyle = 'green';
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
}

// Membuat pemotong rumput di setiap baris
const lawnMowers = [];
for (let i = 0; i < canvas.height; i += cellSize) {
  lawnMowers.push(new LawnMower(i));
}

// Perbarui fungsi untuk menangani LawnMower
function handleLawnMowers() {
  for (const mower of lawnMowers) {
    mower.update();
    mower.draw();
    // Deteksi tabrakan dengan musuh jika LawnMower aktif
    if (mower.active) {
      for (let i = 0; i < enemies.length; i++) {
        if (
          enemies[i].y === mower.y &&
          enemies[i].x > mower.x &&
          enemies[i].x < mower.x + cellSize
        ) {
          // Musuh bersentuhan dengan LawnMower
          enemies[i].health = 0; // Matikan musuh
          enemies.splice(i, 1); // Hapus musuh dari daftar
          i--; // Kurangi indeks karena menghapus elemen dari array
        }
      }
    }
  }
}

// projectiles
const projectile = new Image();
projectile.src = 'General/pea.png'

const IceProjectile = new Image();
IceProjectile.src = 'General/icePea.png';

class Projectiles {
  constructor(x, y, chosenDefender){
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 30;
    this.chosenDefender = chosenDefender;
    this.speed = 5;
    if (this.chosenDefender === 1) {
      this.power = 20;
    } else if (this.chosenDefender === 2) {
      this.power = 30;
    }
  }
  update(){
    this.x += this.speed;
  }
  draw(){
    if(this.chosenDefender === 1){
      ctx.drawImage(projectile, this.x, this.y, this.width, this.height);
    } else if(this.chosenDefender === 2){
      ctx.drawImage(IceProjectile, this.x, this.y, this.width, this.height);
    }
  }
}


function handleProjectiles(){
  for (let i = 0; i < projectiles.length; i++){
    projectiles[i].update();
    projectiles[i].draw();

    for (let j = 0; j < enemies.length; j++){
      if (enemies[j] && projectiles[i] && collision(projectiles[i], enemies[j])){
        // Simpan kecepatan awal musuh sebelum terkena proyektil
        if (!enemies[j].initialMovement) {
          enemies[j].initialMovement = enemies[j].movement;
        }
        enemies[j].health -= projectiles[i].power;
        if (projectiles[i].chosenDefender === 2) {
          // Mengurangi kecepatan pergerakan musuh
          enemies[j].movement = 0.5; // Musuh bergerak lambat
        }
        projectiles.splice(i, 1);
        i--;
      }
    }

    if (projectiles[i] && projectiles[i].x > canvas.width - cellSize){
      projectiles.splice(i, 1);
      i--;
    }
  }

  // Kembalikan kecepatan musuh ke kecepatan awal setelah beberapa waktu
  for (let j = 0; j < enemies.length; j++){
    if (enemies[j].initialMovement !== undefined) {
      enemies[j].timer = enemies[j].timer ? enemies[j].timer + 1 : 1;
      if (enemies[j].timer >= 600) { // 10 detik pada 60 fps
        enemies[j].movement = enemies[j].initialMovement; // Kembalikan kecepatan awal
        enemies[j].initialMovement = undefined; // Reset kecepatan awal
        enemies[j].timer = 0; // Reset timer
      }
    }
  }
}

// gain resources
const sunFlower = new Image();
sunFlower.src = 'S.png';
const resource = [50]
class ResourceFactory {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = cellSize - cellGap * 2;
    this.height = cellSize - cellGap * 2;
    this.health = 1000;
    this.timer = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.spriteWidth = 126;
    this.spriteHeight = 136;
    this.minFrame = 0;
    this.maxFrame = 24;
    this.resourceInterval = 600; // 10 detik pada 60 fps
  }

  draw() {
    ctx.drawImage(sunFlower, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
  }

  update() {
    if (frame % 8 === 0) {
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = this.minFrame;
    }

    // Periksa apakah sudah waktunya menghasilkan resource baru
    this.timer++;
    if (this.timer >= this.resourceInterval) {
      const randomY = Math.random() * (canvas.height - cellSize);
      resources.push(new Resource(this.x + this.width + cellGap, randomY)); // Resource muncul di samping (x) dan posisi acak di y
      this.timer = 0;
    }
  }
}



// shielder
const wallNut = new Image();
wallNut.src = 'WN.png';
class Shielder{
  constructor(x, y){
    this.x = x;
    this.y = y,
    this.width = cellSize - cellGap * 2;
    this.height = cellSize - cellGap * 2;
    this.health = 1000;
    this.timer = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.spriteWidth = 127;
    this.spriteHeight = 137;
    this.minFrame = 0;
    this.maxFrame = 32;
    this.chosenDefender = chosenDefender;
  }
  draw(){
    ctx.drawImage(wallNut, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height)
  }
  update(){
    if (frame % 8 === 0){
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = this.minFrame;
    }
  }
}

// shooter
const pea = new Image();
pea.src = 'P.png'
const icePea = new Image();
icePea.src = 'IP.png'

class Shooter {
  constructor(x, y, chosenDefender){
    this.x = x;
    this.y = y;
    this.width = cellSize - cellGap * 2;
    this.height = cellSize - cellGap * 2;
    this.shooting = false;
    this.shootNow = false;
    this.health = 100;
    this.projectiles = [];
    this.timer = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.spriteWidth = 126;
    this.spriteHeight = 136;
    this.minFrame = 0;
    this.maxFrame = 29;
    this.chosenDefender = chosenDefender;
  }
  draw(){
    if (this.chosenDefender === 1){
      ctx.drawImage(pea, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height );
    } else if(this.chosenDefender === 2) {
      ctx.drawImage(icePea, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height );
    }
  }
  update(){
    if (frame % 8 === 0){
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = this.minFrame;
      if(this.frameX === 15) this.shootNow = true;
    }
    if (this.shooting && this.shootNow){
      projectiles.push(new Projectiles(this.x + 70, this.y + 20, this.chosenDefender));
      this.shootNow = false;
      
    }
    
  }
  contains(mouseX, mouseY) {
    return (
      mouseX > this.x &&
      mouseX < this.x + this.width &&
      mouseY > this.y &&
      mouseY < this.y + this.height
    );
  }
}


function handleDefenders(){
  for (let i = 0; i < defenders.length; i++){
    defenders[i].draw();
    defenders[i].update();
    if (enemyPositions.indexOf(defenders[i].y) !== -1){
      defenders[i].shooting = true;
    } else {
      defenders[i].shooting = false;
    }
    for (let j = 0; j < enemies.length; j++){
      if (defenders[i] && collision(defenders[i], enemies[j])){
        enemies[j].movement = 0;
        defenders[i].health -= 0.2;
      }
      if (defenders[i] && defenders[i].health <= 0){
        defenders.splice(i, 1);
        i--;
        enemies[j].movement = enemies[j].speed;
      }
    }
  }
}


const peaSeed = new Image();
peaSeed.src = 'Seeds/PeaShooterSeed.png'
const icePeaSeed = new Image();
icePeaSeed.src = 'Seeds/IcePeaSeed.png';
const wallNutSeed = new Image();
wallNutSeed.src = 'Seeds/WallNutSeed.png';
const sunFlowerSeed = new Image();
sunFlowerSeed.src = 'Seeds/SunFlowerSeed.png';
const shovel = new Image();
shovel.src = 'General/Shovel.png';


const card1 = {
  x:  210,
  y: 4,
  width: 60,
  height: 85
}
const card2 = {
  x:  280,
  y: 4,
  width: 60,
  height: 85
}
const card3 = {
  x:  350,
  y: 4,
  width: 60,
  height: 85
}
const card4 = {
  x: 420,
  y: 4,
  width: 60,
  height: 85
}
const card5 = {
  x: 720,
  y: 9,
  width: 50,
  height: 75
}



function chooseDefender() {
  let card1stroke = 'black';
  let card2stroke = 'black';
  let card3stroke = 'black';
  let card4stroke = 'black';
  let card5stroke = 'black'; // tambahkan ini untuk card5

  if (collision(mouse, card1) && mouse.clicked) {
    chosenDefender = 1;
  } else if (collision(mouse, card2) && mouse.clicked) {
    chosenDefender = 2;
  } else if (collision(mouse, card3) && mouse.clicked) {
    chosenDefender = 3;
  } else if (collision(mouse, card4) && mouse.clicked) {
    chosenDefender = 4;
  } else if (collision(mouse, card5) && mouse.clicked){
    chosenDefender = 5;
    removeDefender();
  }

  if (chosenDefender === 1) {
    card1stroke = 'gold';
  } else if (chosenDefender === 2) {
    card2stroke = 'gold';
  } else if (chosenDefender === 3) {
    card3stroke = 'gold';
  } else if (chosenDefender === 4) {
    card4stroke = 'gold';
  } else if(chosenDefender === 5){
    card5stroke = 'gold';
  }

  ctx.lineWidth = 1;
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fillRect(card1.x, card1.y, card1.width, card1.height);
  ctx.strokeStyle = card1stroke;
  ctx.strokeRect(card1.x, card1.y, card1.width, card1.height);
  ctx.drawImage(peaSeed, 0, 0, peaSeed.width, peaSeed.height, card1.x, card1.y, card1.width, card1.height);

  ctx.fillRect(card2.x, card2.y, card2.width, card2.height);
  ctx.strokeStyle = card2stroke;
  ctx.strokeRect(card2.x, card2.y, card2.width, card2.height);
  ctx.drawImage(icePeaSeed, 0, 0, icePeaSeed.width, icePeaSeed.height, card2.x, card2.y, card2.width, card2.height);

  ctx.fillRect(card3.x, card3.y, card3.width, card3.height);
  ctx.strokeStyle = card3stroke;
  ctx.strokeRect(card3.x, card3.y, card3.width, card3.height);
  ctx.drawImage(sunFlowerSeed, 0, 0, sunFlowerSeed.width, sunFlowerSeed.height, card3.x, card3.y, card3.width, card3.height);

  ctx.fillRect(card4.x, card4.y, card4.width, card4.height);
  ctx.strokeStyle = card4stroke;
  ctx.strokeRect(card4.x, card4.y, card4.width, card4.height);
  ctx.drawImage(wallNutSeed, 0, 0, wallNutSeed.width, wallNutSeed.height, card4.x, card4.y, card4.width, card4.height);

  ctx.fillRect(card5.x, card5.y, card5.width, card5.height);
  ctx.strokeStyle = card5stroke; // ubah stroke sesuai variabel card5stroke
  ctx.strokeRect(card5.x, card5.y, card5.width, card5.height);
  ctx.drawImage(shovel, 0, 0, shovel.width, shovel.height, card5.x, card5.y, card5.width, card5.height);
}

function removeDefender() {
  for (let i = 0; i < defenders.length; i++) {
    if (collision(mouse, defenders[i]) && mouse.clicked) {
      defenders.splice(i, 1);
      return;
    }
  }
}

// Floating Messages
const floatingMessages = [];
class FloatingMessages {
  constructor(value, x, y, size, color){
    this.value = value;
    this.x = x;
    this.y = y;
    this.size = size;
    this.lifeSpan = 0;
    this.color = color;
    this.opacity = 1;
  }
  update(){
    this.y -= 0.3;
    this.lifeSpan += 1;
    if (this.opacity > 0.05) this.opacity -= 0.05;
  }
  draw(){
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.font = this.size + 'px Arial';
    ctx.fillText(this.value, this.x, this.y);
    ctx.globalAlpha = 1;
  }
}

function handleFloatingMessages(){
  for (let i = 0; i < floatingMessages.length; i++){
    floatingMessages[i].update();
    floatingMessages[i].draw();
    if (floatingMessages[i].lifeSpan >= 50){
      floatingMessages.splice(i, 1);
      i--;
    }
  }
}

// enemies
const enemyTypes = [];
const enemy1 = new Image();
enemy1.src = 'zombie1.png';
enemyTypes.push(enemy1);

class Enemy {
  constructor(verticalPosition){
    this.x = canvas.width;
    this.y = verticalPosition;
    this.width = cellSize - cellGap * 2;
    this.height = cellSize - cellGap * 2;
    this.speed = Math.random() * 0.15 + 0.35;
    this.movement = this.speed;
    this.health = 100;
    this.maxHealth = this.health;
    this.enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    this.frameX = 0;
    this.frameY = 0;
    this.minFrame = 1;
    this.maxFrame = 33;
    this.spriteWidth = 94;
    this.spriteHeight = 138;
  }
  update(){
    this.x -= this.movement;
    if(frame % 8 === 0){
       if (this.frameX < this.maxFrame) this.frameX++;
    else this.frameX = this.minFrame;
    }
  }
  draw(){
    ctx.drawImage(this.enemyType , this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y,  this.width, this.height);
  }
}

function handleEnemies(){
  for (let i = 0; i < enemies.length; i++){
    enemies[i].update();
    enemies[i].draw();
    if (enemies[i].x < 0){
      gameOver = true;
    }
    if (enemies[i].health <= 0){
      let gainedResources = enemies[i].maxHealth / 10;
      numberOfResources += gainedResources;
      score += gainedResources;
      const findThisIndex = enemyPositions.indexOf(enemies[i].y);
      enemyPositions.splice(findThisIndex, 1);
      enemies.splice(i, 1);
      i--;
    }
  }
  if (frame % enemiesInterval === 0 && score < winningScore){
    let verticalPosition = Math.floor(Math.random() * 5 + 1) * cellSize + cellGap;
    enemies.push(new Enemy(verticalPosition));
    enemyPositions.push(verticalPosition);
    if (enemiesInterval > 120) enemiesInterval -= 50;
  }
}

// resources
const sun = new Image();
sun.src = 'General/Sun.png'
const amouts = [50];
class Resource {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = cellSize * 0.6;
    this.height = cellSize * 0.6;
    this.amouts = amouts[Math.floor(Math.random() * amouts.length)];
    this.speed = 1; // Kecepatan pergerakan resource ke bawah
  }
  
  draw() {
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.font = '20px Arial';
    ctx.fillText(this.amouts, this.x + 15, this.y + 25);
    ctx.drawImage(sun, this.x, this.y, this.width, this.height);
  }

  update() {
    this.y += this.speed;
  }
}

// Memastikan fungsi handleResources tetap bekerja
function handleResources() {
  for (let i = 0; i < resources.length; i++) {
    resources[i].update(); // Perbarui posisi resource
    resources[i].draw();
    
    // Periksa apakah mouse.x dan mouse.y sudah terdefinisi
    if (mouse.x && mouse.y) {
      if (collision(resources[i], mouse)) {
        numberOfResources += resources[i].amouts;
        floatingMessages.push(new FloatingMessages('+' + resources[i].amouts, resources[i].x, resources[i].y, 30));
        resources.splice(i, 1);
        i--;
      }
    }

    // Hapus resource jika sudah keluar dari canvas
    if (resources[i] && resources[i].y > canvas.height) {
      resources.splice(i, 1);
      i--;
    }
  }
}


// utilities
function handleGameStatus(){
  // ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText('Score: ' + score, 485, 40);
  ctx.fillText('Username: ' + username, 485, 80); // Tambahkan ini untuk mencetak nama pengguna
  ctx.fillText(numberOfResources, 155, 95);
  if (gameOver){
    ctx.fillStyle = 'black';
    ctx.font = '90px Arial';
    ctx.fillText('GAME OVER', 135, 330);
    const restartButton = document.createElement("button");
    restartButton.textContent = "Restart";
    restartButton.addEventListener("click", function() {
    // Kembali ke menu awal
    menuContainer.style.display = "block";
    playGame.style.display = "none";
});

// Tempatkan tombol restart pada tampilan game
    playGame.appendChild(restartButton);
  }
  if (score > winningScore && enemies.length === 0){
    ctx.font = '60px Arial';
    ctx.fillText('YOU WIN!', 130, 300);
    ctx.font = '30px Arial';
    ctx.fillText('Congratulations! Your Score: ' + score + ' points', 134, 340);
    const restartButton = document.createElement("button");
    restartButton.textContent = "Restart";
    restartButton.addEventListener("click", function() {
    // Kembali ke menu awal
    menuContainer.style.display = "block";
    playGame.style.display = "none";
});

// Tempatkan tombol restart pada tampilan game
playGame.appendChild(restartButton);
  }
}

canvas.addEventListener('click', function () {
  const gridPositionX = mouse.x - (mouse.x % cellSize) + cellGap;
  const gridPositionY = mouse.y - (mouse.y % cellSize) + cellGap;
  if (gridPositionY < cellSize) return;

  for (let i = 0; i < defenders.length; i++) {
    if (defenders[i].x === gridPositionX && defenders[i].y === gridPositionY) return;
  }

  let defenderCost = 50;
  if (chosenDefender === 1) {
    defenderCost = 100;
  } else if (chosenDefender === 2) {
    defenderCost = 175;
  }
  if (numberOfResources >= defenderCost) {
    if (chosenDefender === 1 || chosenDefender === 2) {
      defenders.push(new Shooter(gridPositionX, gridPositionY, chosenDefender));
    } else if (chosenDefender === 3) {
      defenders.push(new ResourceFactory(gridPositionX, gridPositionY));
    } else if (chosenDefender === 4) {
      defenders.push(new Shielder(gridPositionX, gridPositionY));
    }
    numberOfResources -= defenderCost;
  } else {
    floatingMessages.push(new FloatingMessages('need more resources', mouse.x, mouse.y, 15));
  }
});


function animate(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // ctx.fillStyle = 'blue';
  ctx.fillRect(0, 0, controlsBar.width, controlsBar.height);
  handleGameGrid();
  handleLawnMowers(); // Perbarui untuk menangani LawnMowers
  handleDefenders();
  handleResources();
  handleProjectiles();
  if (frame > 33 * 60) {
    handleEnemies();
  }
  chooseDefender();
  handleGameStatus();
  handleFloatingMessages();
  
  frame++;
  if (!gameOver) requestAnimationFrame(animate);
}
animate(); // Mulai permainan

function collision(first, second) {
  if (
    !(first.x > second.x + second.width ||
      first.x + first.width < second.x ||
      first.y > second.y + second.height ||
      first.y + first.height < second.y)
  ) {
    return true;
  }
  return false;
}

window.addEventListener('resize', function(){
  canvasPosition = canvas.getBoundingClientRect();
});
