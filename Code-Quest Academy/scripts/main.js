// ---------------------------------------------
// DASHBOARD → MODULE NAVIGATION
// ---------------------------------------------
document.querySelectorAll(".module-btn")?.forEach(btn => {
  btn.addEventListener("click", () => {
    const module = btn.dataset.module;

    // glitchy transition effect
    document.body.style.filter = "blur(4px) brightness(0.6)";
    setTimeout(() => {
      window.location.href = `modules/${module}.html`;
    }, 400);
  });
});

// ---------------------------------------------
// LESSON VIEWER LOGIC
// ---------------------------------------------
let currentLesson = 0;

// Render lesson content
function renderLesson() {
  if (typeof lessons === "undefined") return;

  const lesson = lessons[currentLesson];

  document.querySelector(".lesson-subtitle").textContent = lesson.title;
  document.querySelector(".lesson-text p").textContent = lesson.text;
  document.querySelector(".code-block").textContent = lesson.code;
  document.querySelector(".terminal-body p").textContent = lesson.output;
}

// ---------------------------------------------
// GLITCH TRANSITION
// ---------------------------------------------
const glitchLayer = document.querySelector(".glitch-transition");

function triggerGlitch(callback) {
  if (!glitchLayer) return callback();

  glitchLayer.classList.add("glitch-active");

  setTimeout(() => {
    glitchLayer.classList.remove("glitch-active");
    callback();
  }, 350);
}

// ---------------------------------------------
// LESSON NAVIGATION
// ---------------------------------------------
document.getElementById("nextLesson")?.addEventListener("click", () => {
  if (currentLesson < lessons.length - 1) {
    triggerGlitch(() => {
      currentLesson++;
      renderLesson();
    });
  }
});

document.getElementById("prevLesson")?.addEventListener("click", () => {
  if (currentLesson > 0) {
    triggerGlitch(() => {
      currentLesson--;
      renderLesson();
    });
  }
});

// ---------------------------------------------
// INITIALIZE LESSON VIEWER
// ---------------------------------------------
if (typeof lessons !== "undefined") {
  renderLesson();
}
