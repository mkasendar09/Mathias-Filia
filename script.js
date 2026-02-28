// ========================================
// 🎵 BACKGROUND MUSIC AUTOPLAY FIX
// ========================================
window.addEventListener("load", () => {
  const music = document.getElementById("bgMusic");
  if (!music) return;

  music.volume = 0.5;

  const playPromise = music.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      document.body.addEventListener(
        "click",
        () => {
          music.play();
        },
        { once: true }
      );
    });
  }
});

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
