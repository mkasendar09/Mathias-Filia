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
const swiper = new Swiper('.swiper', {
  loop: true,
  autoplay: {
    delay: 3000,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});
