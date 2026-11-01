/* V23 management QA closure. */
(function(){
  const state=window.v20bState;
  if(!state)return;
  function style(){
    if(document.getElementById('a23style'))return;
    document.head.insertAdjacentHTML('beforeend','<style id="a23style">.a23-state{display:flex;justify-content:space-between;align-items:center;gap:12px;background:#f4f9fa;border:1px solid #d5e5e7;border-radius:8px;padding:10px 13px;margin-bottom:14px}.a23-states{display:grid;gap:9px}.a23-states>div{border:1px solid #dfeaec;border-radius:8px;padding:11px}.a23-states b,.a23-states span{display:block}.a23-states span{color:#60777f;margin-top:4px}[aria-selected="true"]{box-shadow:0 0 0 3px rgba(8,127,136,.18)!important}.a22-work button:disabled{opacity:.52;cursor:not-allowed}.a22-work button.warn{color:#a84439;border-color:#e2aaa3;background:#fff6f5}</style>');
  }
  const button=(text,action,cls='')=>'<button class="btn '+cls+'" data-a23="'+action+'">'+text+'</button>';
  const section=(id,title,body)=>'<section id="'+id+'" class="a22-card"><div class="a22-head"><h2>'+title+'</h2></div>'+body+'</section>';
  function modal(title,body){openModal('<div class="modalhead"><h2>'+title+'</h2><button class="close" onclick="closeModal()">×</button></div>'+body+'<div class="modalactions"><button class="btn" onclick="closeModal()">关闭</button></div>')}
  function enhance(){
    if(state.role!=='admin')return;
    const page=document.getElementById('page');
    if(!page||!page.querySelector('.a22-work'))return;
    page.querySelectorAll('[data-a22^="period:"]').forEach(b=>{const selected=b.dataset.a22==='period:'+state.admin22?.period;b.setAttribute('aria-selected',String(selected));b.setAttribute('aria-pressed',String(selected))});
    if(!document.getElementById('a23DataState')){const role=page.querySelector('.a22-role');if(role)role.insertAdjacentHTML('afterend','<div id="a23DataState" class="a23-state"><span><b>数据状态：</b>正常；最近有效数据 2026-11-01 18:00（北京时间）</span>'+button('查看异常状态规范','state-matrix')+'</div>')}
    addReportChannels(page);
    addQualityEscalation(page);
    extendAuditResults(page);
    page.querySelectorAll('button').forEach(b=>{if(!b.getAttribute('aria-label')&&b.textContent.trim())b.setAttribute('aria-label',b.textContent.trim());if(b.textContent.includes('停用')||b.textContent.includes('关闭')||b.textContent.includes('转派'))b.classList.add('warn')});
  }
  function addReportChannels(page){
    if(state.route!=='admin-reports'||document.getElementById('a23Channels'))return;
    const grid=page.querySelector('.a22-grid');if(!grid)return;
    grid.insertAdjacentHTML('beforeend',section('a23Channels','通知渠道送达与补救','<div class="tablewrap"><table class="table"><thead><tr><th>渠道</th><th>发送</th><th>送达</th><th>失败</th><th>重试成功</th><th>主要原因</th><th>补救</th></tr></thead><tbody><tr><td>应用内</td><td>1,820</td><td>1,812</td><td>8</td><td>6</td><td>会话过期</td><td>'+button('查看原任务','channel:app')+'</td></tr><tr><td>短信</td><td>1,120</td><td>1,086</td><td>34</td><td>28</td><td>号码无效/网关超时</td><td>'+button('重试或转人工','channel:sms','primary')+'</td></tr><tr><td>院内呼叫</td><td>600</td><td>550</td><td>50</td><td>42</td><td>终端离线</td><td>'+button('创建人工联系','channel:call','warn')+'</td></tr></tbody></table></div><div class="message">按通知任务去重；多渠道任一送达计1次，失败保留原尝试与重试链。</div>'));
  }
  function addQualityEscalation(page){
    if(state.route!=='admin-quality'||document.getElementById('a23Escalation'))return;
    const first=page.querySelector('.a22-card');if(!first)return;
    first.insertAdjacentHTML('afterend',section('a23Escalation','逾期提醒与升级','<table class="table"><thead><tr><th>任务</th><th>截止</th><th>当前</th><th>升级规则</th><th>上级责任人</th><th>通知回执</th></tr></thead><tbody><tr><td>QI-288</td><td>2026-11-01 17:30</td><td><span class="tag bad">已逾期33分钟</span></td><td>15分钟通知负责人；30分钟升级科主任</td><td>陈主任</td><td>应用内已送达 18:01</td></tr></tbody></table><div class="actions">'+button('查看升级证据','escalation:QI-288')+button('转派责任人','reassign:QI-288','warn')+'</div>'));
  }
  function extendAuditResults(page){
    if(state.route!=='admin-audit')return;
    const result=[...page.querySelectorAll('select')].find(s=>s.textContent.includes('全部结果'));if(!result||result.dataset.a23)return;result.dataset.a23='1';['部分成功','超时','已撤销','审批拒绝','重试成功','系统异常'].forEach(x=>result.add(new Option(x,x)));
  }
  function handle(action){
    const parts=action.split(':'),cmd=parts[0],id=parts[1]||'';
    if(cmd==='state-matrix'){modal('数据五态与恢复路径','<div class="a23-states"><div><b>加载中</b><span>骨架屏、按钮禁用、防重复。</span></div><div><b>空数据</b><span>当前筛选无结果，可清除筛选。</span></div><div><b>无权限</b><span>不返回范围外对象摘要，可申请授权。</span></div><div><b>网络失败</b><span>保留最近有效数据及时间，支持重试。</span></div><div><b>部分失败</b><span>逐数据源标记成功/失败，只重试失败源。</span></div></div>');return}
    if(cmd==='channel'){modal('通知原任务与恢复','<div class="a22-kv"><div><label>原任务</label><strong>MSG-'+id+'-20261101</strong></div><div><label>当前状态</label><strong>部分失败</strong></div><div><label>失败原因</label><strong>目标终端不可用</strong></div><div><label>恢复方式</label><strong>查询原任务、原号重试、人工联系</strong></div></div><div class="actions">'+button('重试原任务','retry:'+id,'primary')+button('创建人工联系','manual:'+id)+'</div>');return}
    if(cmd==='escalation'||cmd==='reassign'){openInfo('升级处理已记录',id+'；操作人 admin01；时间 2026-11-01 18:13；审计编号 AUD-'+Date.now().toString().slice(-5));return}
    if(cmd==='retry'||cmd==='manual'){openInfo('恢复任务已创建',(cmd==='retry'?'原号重试':'人工联系')+'；任务 REC-'+Date.now().toString().slice(-5)+'；可返回证据链继续跟踪。')}
  }
  document.addEventListener('click',e=>{const b=e.target.closest('[data-a23]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();const old=b.textContent;b.disabled=true;b.textContent='处理中…';setTimeout(()=>{b.disabled=false;b.textContent=old;handle(b.dataset.a23)},250)},true);
  window.addEventListener('error',()=>{if(state.role!=='admin')return;const id='ADM-UI-'+Date.now().toString().slice(-6);window.openInfo?.('操作未完成','错误编号 '+id+'。已保留当前输入，可返回原页后重试；持续失败时请携带编号联系信息科。')});
  const observer=new MutationObserver(()=>requestAnimationFrame(()=>{style();enhance()}));
  observer.observe(document.body,{subtree:true,childList:true});
  setTimeout(()=>{style();enhance()},0);
})();
