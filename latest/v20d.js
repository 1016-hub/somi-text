/* V20d: keep the closure layer active after the legacy login callback. */
(function () {
  const legacyLogin = window.v141Login;
  if (typeof legacyLogin !== 'function') return;
  window.v141Login = function () {
    const result = legacyLogin.apply(this, arguments);
    if (typeof window.v20Action === 'function') window.v20Action('nurse-home');
    return result;
  };
})();
