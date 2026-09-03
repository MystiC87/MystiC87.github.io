const root = document.documentElement;
root.classList.add("js");
const themeToggle = document.querySelector(".theme-toggle");
const savedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
  root.dataset.theme = "dark";
}

themeToggle?.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = nextTheme;
  localStorage.setItem("theme", nextTheme);
});

document.querySelector("#year").textContent = new Date().getFullYear();

const profileImage = document.querySelector("[data-profile-image]");
if (profileImage) {
  const showProfileImage = () => profileImage.closest(".profile-photo")?.classList.add("has-image");
  profileImage.addEventListener("load", showProfileImage);
  if (profileImage.complete && profileImage.naturalWidth > 0) showProfileImage();
}

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.12 },
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

document.querySelectorAll("[data-comparison]").forEach((comparison) => {
  const range = comparison.querySelector(".comparison-range");
  const title = comparison.querySelector("[data-comparison-title]");
  const status = comparison.querySelector("[data-comparison-status]");
  const dx9Image = comparison.querySelector("[data-comparison-dx9]");
  const dx11Image = comparison.querySelector("[data-comparison-dx11]");
  const options = [...comparison.querySelectorAll(".comparison-option")];
  let loadToken = 0;

  const updateSplit = () => {
    const split = Number(range.value);
    comparison.style.setProperty("--split", `${split}%`);
    range.setAttribute("aria-valuetext", `Direct3D 11 ${split}%, Direct3D 9 ${100 - split}%`);
  };

  const selectScene = (option) => {
    const currentToken = ++loadToken;
    const sceneTitle = option.dataset.title;
    let loadedImages = 0;
    let hasError = false;

    options.forEach((item) => {
      const isSelected = item === option;
      item.classList.toggle("is-active", isSelected);
      item.setAttribute("aria-selected", String(isSelected));
      item.tabIndex = isSelected ? 0 : -1;
    });

    comparison.classList.remove("is-ready");
    title.textContent = sceneTitle;
    status.textContent = `${sceneTitle} 비교 이미지를 불러오는 중`;

    const finishLoad = () => {
      if (currentToken !== loadToken) return;
      loadedImages += 1;
      if (loadedImages < 2) return;

      if (hasError) {
        status.textContent = `${sceneTitle} 비교 이미지 준비 중`;
        return;
      }

      comparison.classList.add("is-ready");
      status.textContent = `${sceneTitle} · 가운데 핸들을 움직여 렌더러를 비교하세요.`;
    };

    [
      [dx9Image, option.dataset.dx9, `${sceneTitle} Direct3D 9 렌더링`],
      [dx11Image, option.dataset.dx11, `${sceneTitle} Direct3D 11 렌더링`],
    ].forEach(([image, source, alt]) => {
      image.onload = finishLoad;
      image.onerror = () => {
        hasError = true;
        finishLoad();
      };
      image.alt = alt;
      image.src = source;
    });
  };

  range?.addEventListener("input", updateSplit);
  updateSplit();

  options.forEach((option, index) => {
    option.addEventListener("click", () => selectScene(option));
    option.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const nextOption = options[(index + direction + options.length) % options.length];
      nextOption.focus();
      selectScene(nextOption);
    });
  });

  const initialOption = options.find((option) => option.classList.contains("is-active")) ?? options[0];
  if (initialOption) selectScene(initialOption);
});
