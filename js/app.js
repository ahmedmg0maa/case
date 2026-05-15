const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const state = {
  currentCaseId: localStorage.getItem('currentCaseId') || 'bike',
  currentTabIndex: 0,
  hintIndex: 0,
  board: JSON.parse(localStorage.getItem('evidenceBoard') || '{}')
};

function saveState(){
  localStorage.setItem('currentCaseId', state.currentCaseId);
  localStorage.setItem('evidenceBoard', JSON.stringify(state.board));
}

function getCase(){
  return CASES.find(c => c.id === state.currentCaseId) || CASES[0];
}

function renderCaseCards(){
  const wrap = $('#caseCards');
  if(!wrap) return;
  wrap.innerHTML = CASES.map(c => `
    <a class="card case-card" href="play.html?case=${c.id}" aria-label="افتح قضية ${c.title}">
      <div>
        <div class="case-icon">${c.icon}</div>
        <h3>${c.title}</h3>
        <p>${c.summary}</p>
      </div>
      <div class="tags">
        <span class="tag ${c.difficultyClass}">${c.difficulty}</span>
        <span class="tag family">${c.age}</span>
        <span class="tag family">${c.duration}</span>
      </div>
    </a>
  `).join('');
}

function initFromUrl(){
  const params = new URLSearchParams(location.search);
  const id = params.get('case');
  if(id && CASES.some(c => c.id === id)) {
    state.currentCaseId = id;
    state.currentTabIndex = 0;
    state.hintIndex = 0;
    saveState();
  }
}

function renderPlayPage(){
  if(!$('#caseMenu')) return;
  initFromUrl();
  renderMenu();
  renderCase();
  renderBoard();
}

function renderMenu(){
  const menu = $('#caseMenu');
  menu.innerHTML = CASES.map(c => `
    <button class="menu-btn ${c.id === state.currentCaseId ? 'active' : ''}" onclick="selectCase('${c.id}')">
      <b>${c.icon} ${c.title}</b>
      <small>${c.difficulty} • ${c.category}</small>
    </button>
  `).join('');
}

function selectCase(id){
  state.currentCaseId = id;
  state.currentTabIndex = 0;
  state.hintIndex = 0;
  saveState();
  renderMenu();
  renderCase();
  renderBoard();
  history.replaceState(null, '', `play.html?case=${id}`);
}

function renderCase(){
  const c = getCase();
  $('#caseTitle').textContent = `${c.icon} ${c.title}`;
  $('#caseSummary').textContent = c.summary;
  $('#caseBadge').textContent = `${c.difficulty} • ${c.age}`;
  $('#caseBadge').className = `tag ${c.difficultyClass}`;

  $('#tabs').innerHTML = c.sections.map((s,i)=>`<button class="tab ${i===state.currentTabIndex?'active':''}" onclick="openTab(${i})">${s.title}</button>`).join('');
  const section = c.sections[state.currentTabIndex];
  $('#readerContent').innerHTML = `<div class="reader-card"><h3>${section.title}</h3>${section.body}</div>`;
  $('#answerSelect').innerHTML = c.options.map(o => `<option value="${o.value}">${o.label}</option>`).join('');
  $('#result').className = 'result';
  $('#result').innerHTML = '';
}

function openTab(index){
  state.currentTabIndex = index;
  renderCase();
}

function addCurrentEvidence(){
  const c = getCase();
  const clue = c.sections[state.currentTabIndex].clue;
  if(!state.board[c.id]) state.board[c.id] = [];
  if(!state.board[c.id].includes(clue)) state.board[c.id].push(clue);
  saveState();
  renderBoard();
  toast('تمت إضافة الدليل للوحة التحقيق');
}

function renderBoard(){
  const board = $('#board');
  if(!board) return;
  const c = getCase();
  const clues = state.board[c.id] || [];
  board.innerHTML = clues.length ? clues.map((clue,i)=>`<div class="board-note"><b>دليل ${i+1}</b><br>${clue}</div>`).join('') : '<div class="board-note">لم تضف أدلة بعد. افتح أي تبويب واضغط “إضافة الدليل الحالي”.</div>';
}

function solveCase(){
  const c = getCase();
  const answer = $('#answerSelect').value;
  const result = $('#result');
  if(answer === c.answer){
    result.className = 'result good';
    result.innerHTML = `<b>إجابة صحيحة!</b><br>${c.finalExplanation}`;
  } else if(!answer){
    result.className = 'result bad';
    result.innerHTML = '<b>لم يتم اختيار إجابة.</b><br>اختر المسؤول أولًا، ثم أرسل التقرير.';
  } else {
    result.className = 'result bad';
    result.innerHTML = '<b>استنتاج غير دقيق.</b><br>راجع الأدلة مرة أخرى، خصوصًا التناقضات ومن كان يملك فرصة طبيعية للوصول.';
  }
}

function openHint(){
  const modal = $('#hintModal');
  if(!modal) return;
  state.hintIndex = 0;
  $('#hintText').textContent = getCase().hints[state.hintIndex];
  modal.classList.add('show');
}

function nextHint(event){
  if(event) event.stopPropagation();
  const c = getCase();
  state.hintIndex = Math.min(c.hints.length - 1, state.hintIndex + 1);
  $('#hintText').textContent = c.hints[state.hintIndex];
}

function closeHint(event){
  if(event && event.target.id !== 'hintModal') return;
  $('#hintModal')?.classList.remove('show');
}

function clearBoard(){
  const c = getCase();
  state.board[c.id] = [];
  saveState();
  renderBoard();
  toast('تم مسح أدلة هذه القضية');
}

function toast(message){
  const t = $('#toast');
  if(!t) return;
  t.textContent = message;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 2200);
}

renderCaseCards();
renderPlayPage();
