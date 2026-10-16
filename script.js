const root = document.documentElement;
const themeToggle = document.querySelector('.theme-toggle');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
let savedTheme;
try { savedTheme = localStorage.getItem('theme'); } catch { /* Storage can be disabled. */ }
const applyTheme = (theme) => {
  root.dataset.theme = theme;
  themeToggle?.setAttribute('aria-label', theme === 'dark' ? '밝은 테마로 전환' : '어두운 테마로 전환');
  themeToggle?.setAttribute('aria-pressed', String(theme === 'dark'));
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#171714' : '#f4f1ea');
};
applyTheme(savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : systemTheme.matches ? 'dark' : 'light');
themeToggle?.addEventListener('click', () => {
  savedTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(savedTheme);
  try { localStorage.setItem('theme', savedTheme); } catch { /* The current page still works. */ }
});
systemTheme.addEventListener('change', (event) => {
  if (!savedTheme) applyTheme(event.matches ? 'dark' : 'light');
});
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  root.classList.add('js');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
}

document.querySelectorAll('[data-comparison]').forEach((comparison) => {
  const range = comparison.querySelector('.comparison-range');
  const status = comparison.querySelector('.comparison-status');
  const before = comparison.querySelector('[data-dx9]');
  const after = comparison.querySelector('[data-dx11]');
  const buttons = [...comparison.querySelectorAll('[data-scene]')];
  let token = 0;
  const update = () => {
    comparison.style.setProperty('--split', `${range.value}%`);
    range.setAttribute('aria-valuetext', `DX11 ${range.value}%, DX9 ${100 - Number(range.value)}%`);
  };
  const load = source => new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(source);
    image.onerror = reject;
    image.src = source;
  });
  const select = async button => {
    const current = ++token;
    range.disabled = true;
    comparison.setAttribute('aria-busy', 'true');
    status.textContent = `${button.dataset.title} 이미지를 불러오는 중`;
    try {
      const sources = await Promise.all(['dx9', 'dx11'].map(engine => load(`${comparison.dataset.base}${engine}-${button.dataset.scene}.webp`)));
      if (current !== token) return;
      [before, after].forEach((image, i) => {
        image.src = sources[i];
        image.alt = `${button.dataset.title} · ${i ? 'Direct3D 11' : 'Direct3D 9'} 실제 실행 화면`;
      });
      buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      range.disabled = false;
      status.textContent = `${button.dataset.title} · 핸들을 끌거나 방향키로 비교하세요. 왼쪽 DX11 / 오른쪽 DX9`;
    } catch {
      if (current !== token) return;
      status.textContent = `${button.dataset.title} 이미지를 불러오지 못했습니다. 장면 버튼을 눌러 다시 시도하세요.`;
    } finally {
      if (current === token) comparison.setAttribute('aria-busy', 'false');
    }
  };
  range.addEventListener('input', update);
  update();
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => select(button));
    button.addEventListener('keydown', event => {
      const target = { ArrowLeft: (index + buttons.length - 1) % buttons.length, ArrowRight: (index + 1) % buttons.length, Home: 0, End: buttons.length - 1 }[event.key];
      if (target === undefined) return;
      event.preventDefault();
      buttons[target].focus();
      select(buttons[target]);
    });
  });
  if (buttons[0]) select(buttons[0]);
});
