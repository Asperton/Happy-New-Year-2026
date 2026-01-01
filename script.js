// Countdown to Jan 1, 2026
function updateCountdown() {
  const now = new Date();
  const newYear = new Date("January 1 2026 00:00:00");
  const diff = newYear - now;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  if (diff <= 0) {
    document.getElementById("countdown").innerText = "🎆 Happy New Year 2026! 🎆";
  } else {
    document.getElementById("countdown").innerText =
      `${days}d ${hours}h ${minutes}m ${seconds}s left until 2026!`;
  }
}
setInterval(updateCountdown, 1000);
updateCountdown();

// Wishes
const form = document.getElementById("wishForm");
const wishList = document.getElementById("wishList");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const wish = document.getElementById("wishInput").value;

  await fetch("/api/wishes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ wish })
  });

  document.getElementById("wishInput").value = "";
  loadWishes();
});

async function loadWishes() {
  const res = await fetch("/api/wishes");
  const data = await res.json();
  wishList.innerHTML = "";
  data.forEach(w => {
    const li = document.createElement("li");
    li.textContent = w.wish;
    wishList.appendChild(li);
  });
}
loadWishes();

// Fireworks animation
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function Firework() {
  this.x = random(0, canvas.width);
  this.y = canvas.height;
  this.targetY = random(canvas.height / 4, canvas.height / 2);
  this.color = `hsl(${random(0, 360)}, 100%, 50%)`;
  this.radius = 2;
  this.speed = random(3, 6);
}

Firework.prototype.update = function() {
  this.y -= this.speed;
  if (this.y <= this.targetY) {
    for (let i = 0; i < 100; i++) {
      particles.push(new Particle(this.x, this.y, this.color));
    }
    fireworks.splice(fireworks.indexOf(this), 1);
  }
};

Firework.prototype.draw = function() {
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
  ctx.fillStyle = this.color;
  ctx.fill();
};

function Particle(x, y, color) {
  this.x = x;
  this.y = y;
  this.color = color;
  this.radius = 2;
  this.speedX = random(-3, 3);
  this.speedY = random(-3, 3);
  this.alpha = 1;
}

Particle.prototype.update = function() {
  this.x += this.speedX;
  this.y += this.speedY;
  this.alpha -= 0.02;
  if (this.alpha <= 0) {
    particles.splice(particles.indexOf(this), 1);
  }
};

Particle.prototype.draw = function() {
  ctx.globalAlpha = this.alpha;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
  ctx.fillStyle = this.color;
  ctx.fill();
  ctx.globalAlpha = 1;
};

let fireworks = [];
let particles = [];

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (Math.random() < 0.05) {
    fireworks.push(new Firework());
  }
  fireworks.forEach(f => { f.update(); f.draw(); });
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animate);
}

animate();
