/* V20e: initialize critical event context before opening detail. */
(function () {
  const previous = window.v20Action;
  window.v20Action = function (action) {
    const [cmd, id] = action.split(':');
    if (cmd === 'critical' && window.v20bStore && window.v20bState) {
      const p = window.v20bStore.patients.find((item) => item.id === id);
      if (p) p.critical ||= { status: '危急值产生', nurseStatus: '待确认', doctorStatus: '待确认' };
      window.v20bState.selected = id;
      window.v20bState.route = window.v20bState.role === 'doctor' ? 'doctor-critical' : 'nurse-critical';
      window.renderV11();
      return;
    }
    previous(action);
  };
})();
