

// ========================================
// 📸 INFINITE CAROUSEL (SMOOTH)
// ========================================
document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".carousel-track");
  if (!track) return;

  const slides = Array.from(track.children);

  // Clone slides sekali saja
  slides.forEach((slide) => {
    const clone = slide.cloneNode(true);
    track.appendChild(clone);
  });

  let position = 0;
  let speed = window.innerWidth < 768 ? 0.2 : 0.5;
  let totalWidth = 0;

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

// ========================================
// 💌 RSVP SUBMIT
// ========================================
document.addEventListener("DOMContentLoaded", () => {
  const rsvpForm = document.getElementById("rsvpForm");
  const rsvpMessage = document.getElementById("rsvpMessage");

  if (!rsvpForm) return;

  let isSubmitting = false;

  rsvpForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    isSubmitting = true;

    const name = document.getElementById("name").value.trim();
    const attendance = document.getElementById("attendance").value;
    const guests = document.getElementById("guests").value || 1;

    if (!name || !attendance) {
      isSubmitting = false;
      return;
    }

    try {
      await db.collection("rsvp").add({
        name: name,
        attendance: attendance,
        guests: Number(guests),
        created: firebase.firestore.FieldValue.serverTimestamp(),
      });

      rsvpMessage.innerText = "Thank you for your response 🤍";
      rsvpForm.reset();
    } catch (error) {
      console.error(error);
      rsvpMessage.innerText = "Something went wrong.";
    }

    isSubmitting = false;
  });
});

// ========================================
// ✨ GUEST WISHES
// ========================================
document.addEventListener("DOMContentLoaded", () => {
  const wishForm = document.getElementById("wishForm");
  const wishesList = document.getElementById("wishesList");

  if (!wishForm || !wishesList) return;

  let isSubmitting = false;

  // Submit Wish
  wishForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    isSubmitting = true;

    const name = document.getElementById("nameInput").value.trim();
    const msg = document.getElementById("msgInput").value.trim();

    if (!name || !msg) {
      isSubmitting = false;
      return;
    }

    try {
      await db.collection("wishes").add({
        name: name,
        message: msg,
        created: firebase.firestore.FieldValue.serverTimestamp(),
      });

      wishForm.reset();
    } catch (error) {
      console.error(error);
    }

    isSubmitting = false;
  });

  // Realtime Display
  db.collection("wishes")
    .orderBy("created", "desc")
    .onSnapshot((snapshot) => {
      wishesList.innerHTML = "";

      snapshot.forEach((doc) => {
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
});

// ========================================
// 🎬 INTRO SCREEN LOGIC
// ========================================
document.addEventListener("DOMContentLoaded", () => {
  const introScreen = document.getElementById("introScreen");
  const introVideo = document.getElementById("introVideo");
  const openBtn = document.getElementById("openBtn");
  const mainContent = document.getElementById("mainContent");
  const music = document.getElementById("bgMusic");

  if (!introVideo || !openBtn || !mainContent) return;

  // Saat video selesai → munculkan tombol
  introVideo.addEventListener("ended", () => {
    openBtn.classList.add("show");
  });

  // Kalau user klik tombol
  openBtn.addEventListener("click", async () => {
    introScreen.classList.add("fade-out");

    // Play music setelah user interaction
    if (music) {
    try {
    music.volume = 0;
    await music.play();

    const targetVolume = 0.5;
    const fadeDuration = 4000; // 4 detik (bisa 5000 kalau mau lebih lama)

    const startTime = performance.now();

    function fadeAudio(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / fadeDuration, 1);

      // easing biar makin smooth (ease-in)
      const eased = progress * progress;

      music.volume = eased * targetVolume;

      if (progress < 1) {
        requestAnimationFrame(fadeAudio);
      }
    }

    requestAnimationFrame(fadeAudio);

  } catch (err) {
    console.log("Music blocked:", err);
  }
}

    // Fade in main content TANPA display:none
    mainContent.classList.add("show");

    // Hapus intro setelah animasi selesai
    setTimeout(() => {
      introScreen.style.display = "none";
    }, 1200);
  });
});
