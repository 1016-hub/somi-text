/* V20c: close remaining management buttons without changing the V20b state model. */
(function () {
  const previous = window.v20Action;
  window.v20Action = function (action) {
    const [cmd, id] = action.split(':');
    const state = window.v20bState;
    const store = window.v20bStore;
    if (cmd === 'admin-drill') {
      state.route = id === 'critical' ? 'admin-reports' : id === 'quality' ? 'admin-quality' : 'admin-patients';
      window.renderV11();
      return;
    }
    if (cmd === 'account-new') {
      openModal('<div class="modalhead"><h2>新增账号</h2><button class="close" onclick="closeModal()">×</button></div><div class="fieldgrid"><div class="field"><label>姓名 *</label><input id="v20cName" placeholder="请输入姓名"></div><div class="field"><label>角色 *</label><select id="v20cRole"><option>护士</option><option>医生</option><option>医技</option><option>科室管理者</option></select></div><div class="field"><label>组织范围 *</label><input id="v20cOrg" value="8A 呼吸内科病区"></div></div><div class="modalactions"><button class="btn" onclick="closeModal()">取消</button><button class="btn primary" onclick="v20Action(\'account-create\')">创建账号</button></div>');
      return;
    }
    if (cmd === 'account-create') {
      const name = document.getElementById('v20cName')?.value.trim();
      const role = document.getElementById('v20cRole')?.value;
      const org = document.getElementById('v20cOrg')?.value.trim();
      if (!name || !org) { closeModal(); state.notice = '创建失败：姓名和组织范围为必填。'; window.renderV11(); return; }
      const account = { id: `ACC-${String(store.accounts.length + 1).padStart(3, '0')}`, name, role, org, scope: org, status: '启用' };
      store.accounts.push(account);
      store.audits.unshift({ at: '今日 10:48', actor: '管理端', action: '创建账号', entity: '账号', id: account.id, before: '不存在', after: '启用', note: org });
      closeModal();
      state.notice = `账号 ${name} 已创建，默认启用；角色和数据范围已记录审计。`;
      window.renderV11();
      return;
    }
    previous(action);
  };
})();
