// 🎵 Autoplay Fix (browser sometimes block autoplay with sound)
window.addEventListener("load", () => {
  const music = document.getElementById("bgMusic");
  music.volume = 0.5;

  const playPromise = music.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      document.body.addEventListener("click", () => {
        music.play();
      }, { once: true });
    });
  }
});

// 📸 Swiper Carousel
document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".carousel-track");

  // Clone semua slide sekali
  const slides = Array.from(track.children);
  slides.forEach(slide => {
    const clone = slide.cloneNode(true);
    track.appendChild(clone);
  });

  let position = 0;
  let speed = 0.5; // makin kecil makin lambat (0.3 - 1 ideal)
  let totalWidth = 0;

  // Tunggu gambar load dulu supaya width akurat
  window.addEventListener("load", () => {
    totalWidth = track.scrollWidth / 2;
  });

  function animate() {
    position -= speed;

    if (Math.abs(position) >= totalWidth) {
      position = 0;
    }

    track.style.transform = `translateX(${position}px)`;
    requestAnimationFrame(animate);
  }

  animate();
});

// ———————————————————————————————
// Guest Wishes
// ———————————————————————————————

const wishForm = document.getElementById("wishForm");
const wishesList = document.getElementById("wishesList");

// Simpan wish ke Firebase
wishForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("nameInput").value.trim();
  const msg = document.getElementById("msgInput").value.trim();

  if (!name || !msg) return;

  db.collection("wishes").add({
    name: name,
    message: msg,
    created: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    wishForm.reset();
  });
});

// Tampilkan realtime
db.collection("wishes")
.orderBy("created", "desc")
.onSnapshot(snapshot => {
  wishesList.innerHTML = "";
  snapshot.forEach(doc => {
    const data = doc.data();
    const div = document.createElement("div");
    div.classList.add("wish");
    div.innerHTML = `
      <strong>${data.name}</strong>
      <p>${data.message}</p>
      <hr>
    `;
    wishesList.appendChild(div);
  });
});
