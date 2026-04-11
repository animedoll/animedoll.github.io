(function () {
  try {
    var t = localStorage.getItem('animeDollTheme');
    document.documentElement.setAttribute('data-theme', t === 'cyber' ? 'cyber' : 'verdant');
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'verdant');
  }
})();
