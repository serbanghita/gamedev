window.addEventListener('DOMContentLoaded', () => {
  const resize = debounce(onResize, 300);
  window.addEventListener('resize', (e) => {
    console.log('resize');
    resize(e);
  });
});

function onResize(e) {
  console.log('onResize', e.target.innerWidth, e.target.innerHeight);
}

function debounce(fn, wait) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), wait);
  }

}
