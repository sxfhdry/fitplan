/* 减脂 · 备考 计划表 —— 本地单页应用（无依赖，数据存 localStorage） */
(function () {
  'use strict';

  /* ==================== 固定时间骨架 ==================== */
  var SLOTS = [
    { id: 'wake',   start: '07:00', end: '07:20', title: '起床、喝水、洗漱', type: 'routine' },
    { id: 'walk',   start: '07:20', end: '07:50', title: '空腹快走 / 原地踏步', note: '轻活动', type: 'move' },
    { id: 'break',  start: '07:50', end: '08:20', title: '早餐', type: 'meal' },
    { id: 'study1', start: '08:30', end: '11:30', title: '学习块 1 · 3 小时', note: '50 分钟学 + 10 分钟休', type: 'study', block: 's1' },
    { id: 'relax',  start: '11:30', end: '12:00', title: '放松', type: 'routine' },
    { id: 'lunch',  start: '12:00', end: '12:30', title: '午餐', type: 'meal' },
    { id: 'nap',    start: '12:30', end: '13:30', title: '午休 20–30 分钟', type: 'rest' },
    { id: 'study2', start: '13:30', end: '15:30', title: '学习块 2 · 2 小时', note: '番茄钟', type: 'study', block: 's2' },
    { id: 'snack',  start: '15:30', end: '16:00', title: '加餐 + 准备训练', type: 'meal' },
    { id: 'train',  start: '16:00', end: '17:00', title: '健身 / 快走', type: 'move' },
    { id: 'dinner', start: '17:00', end: '18:00', title: '洗澡、晚餐', type: 'meal' },
    { id: 'study3', start: '18:30', end: '19:30', title: '学习块 3 · 1 小时', note: '做题 + 错题', type: 'study', block: 's3' },
    { id: 'free',   start: '19:30', end: '22:00', title: '自由时间，散步凑步数', type: 'routine' },
    { id: 'review', start: '22:00', end: '22:30', title: '复盘三行', type: 'routine' },
    { id: 'sleep',  start: '22:30', end: '23:00', title: '洗漱、睡觉', type: 'rest' }
  ];

  /* ==================== 一周内容 ==================== */
  var DAYS = [
    {
      name: '周一', focus: '基础护理学',
      s1: '基础护理学——铺床、无菌、隔离、生命体征',
      s2: '基护操作流程 + 注意事项',
      s3: '基护选择题 20–30 道 + 错题',
      meals: { b: '水煮蛋 2 个 + 牛奶 1 盒 + 玉米半根', l: '米饭一拳头 + 清炒鸡胸肉 + 炒青菜', s: '黄瓜 1 根', d: '凉拌菠菜 + 煎豆腐 + 红薯半个' },
      workout: { kind: 'circuit', text: '循环训练 3 轮 + 有氧 10 分钟 + 拉伸' },
      steps: 8000
    },
    {
      name: '周二', focus: '内科护理 · 呼吸系统',
      s1: '内科护理——呼吸系统（肺炎、COPD、哮喘）',
      s2: '呼吸系统护理措施 + 病例分析',
      s3: '呼吸系统题 + 错题',
      meals: { b: '牛奶泡燕麦片 + 水煮蛋 1 个', l: '米饭一拳头 + 清蒸鱼 + 炒西兰花', s: '无糖酸奶 1 杯', d: '鸡胸肉拌生菜番茄 + 玉米半根' },
      workout: { kind: 'cardio', text: '快走 40 分钟 + 拉伸' },
      steps: 8000
    },
    {
      name: '周三', focus: '内科护理 · 循环系统',
      s1: '内科护理——循环系统（心衰、心梗、高血压）',
      s2: '循环系统护理 + 用药观察',
      s3: '循环系统题 + 错题',
      meals: { b: '全麦面包 2 片 + 煎蛋 1 个 + 豆浆 1 杯', l: '米饭一拳头 + 青椒炒瘦肉 + 炒白菜', s: '苹果 1 个', d: '清炒虾仁 + 凉拌黄瓜 + 红薯半个' },
      workout: { kind: 'circuit', text: '循环训练 3 轮 + 有氧 10 分钟 + 拉伸' },
      steps: 8000
    },
    {
      name: '周四', focus: '外科护理 · 围手术期',
      s1: '外科护理——围手术期护理、麻醉、术后并发症',
      s2: '术前术后护理流程',
      s3: '外科题 + 错题',
      meals: { b: '水煮蛋 2 个 + 牛奶 1 盒 + 红薯半个', l: '米饭一拳头 + 番茄炒蛋 + 炒油麦菜', s: '番茄 1 个', d: '白菜炒豆腐 + 清炒豆芽 + 玉米半根' },
      workout: { kind: 'light', text: '拉伸 + 散步（轻活动日）' },
      steps: 8000
    },
    {
      name: '周五', focus: '外科护理 · 普外 + 骨科',
      s1: '外科护理——普外（阑尾、疝、胆道）+ 骨科基础',
      s2: '引流管、伤口护理专题',
      s3: '外科题 + 错题',
      meals: { b: '燕麦粥 + 水煮蛋 1 个 + 香蕉半根', l: '米饭一拳头 + 清炒鸡胸肉 + 炒西兰花', s: '无糖酸奶 1 杯', d: '凉拌木耳 + 煎蛋 2 个 + 红薯半个' },
      workout: { kind: 'circuit', text: '循环训练 3 轮 + 有氧 10 分钟 + 拉伸' },
      steps: 8000
    },
    {
      name: '周六', focus: '妇产科护理',
      s1: '妇产科护理——妊娠期、分娩期、产褥期',
      s2: '产科护理常规 + 新生儿护理',
      s3: '妇产题 + 错题',
      meals: { b: '全麦面包 2 片 + 水煮蛋 1 个 + 牛奶 1 盒', l: '米饭一拳头 + 清蒸鱼 + 炒青菜', s: '黄瓜 1 根', d: '鸡胸肉炒菠菜 + 玉米半根' },
      workout: { kind: 'circuit', text: '循环训练 3 轮 + 快走 20 分钟' },
      steps: 8000
    },
    {
      name: '周日', focus: '本周错题总复习',
      s1: '本周错题总复习 + 薄弱点回看',
      s2: '自测一套小卷',
      s3: '制定下周计划 + 顽固错题抄录',
      meals: { b: '水煮蛋 2 个 + 豆浆 1 杯 + 玉米半根', l: '米饭一拳头 + 瘦肉炒木耳 + 炒白菜', s: '苹果 1 个', d: '凉拌黄瓜 + 煎豆腐 + 红薯半个' },
      workout: { kind: 'rest', text: '完全休息（散步随意）' },
      steps: 0,
      extra: '加做：周一早晨空腹称重 + 量腰围，记录'
    }
  ];

  /* ==================== 循环训练动作 ==================== */
  var CIRCUIT = [
    { id: 'squat',   name: '深蹲',       reps: '15 次' },
    { id: 'pushup',  name: '跪姿俯卧撑', reps: '10–12 次' },
    { id: 'lunge',   name: '箭步蹲',     reps: '左右各 10 次' },
    { id: 'climb',   name: '登山跑',     reps: '30 秒' },
    { id: 'bridge',  name: '臀桥',       reps: '15 次' },
    { id: 'jack',    name: '开合跳',     reps: '30 秒' },
    { id: 'plank',   name: '平板支撑',   reps: '30–40 秒' },
    { id: 'knee',    name: '高抬腿',     reps: '30 秒' }
  ];
  var ROUNDS = [1, 2, 3, 4];
  var PHASES = [
    { id: 'warm',  label: '热身 8 分钟' },
    { id: 'circ',  label: '循环 3–4 轮' },
    { id: 'cardio', label: '有氧 10 分钟' },
    { id: 'stretch', label: '拉伸 7 分钟' }
  ];
  var TYPE_LABEL = { routine: '日常', move: '活动', meal: '饮食', study: '学习', rest: '休息' };

  /* ==================== 小工具 ==================== */
  var LS_KEY = 'fitplan.v1';
  var WEEKDAY = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function dateKey(d) { return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); }
  function parseKey(k) {
    var p = String(k).split('-');
    return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
  }
  function addDays(d, n) { var x = new Date(d.getTime()); x.setDate(x.getDate() + n); return x; }
  function planIndex(d) { return (d.getDay() + 6) % 7; }                                    // 0 = 周一
  function planFor(key) { return DAYS[planIndex(parseKey(key))]; }
  function toMin(hhmm) { var p = hhmm.split(':'); return Number(p[0]) * 60 + Number(p[1]); }
  function nowMin() { var d = new Date(); return d.getHours() * 60 + d.getMinutes() + d.getSeconds() / 60; }
  function fmtClock(sec) {
    sec = Math.max(0, Math.round(sec));
    var m = Math.floor(sec / 60), s = sec % 60;
    return pad2(m) + ':' + pad2(s);
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function mondayOf(d) { return addDays(d, -planIndex(d)); }
  function fmtMD(d) { return (d.getMonth() + 1) + ' 月 ' + d.getDate() + ' 日'; }

  /* ==================== 状态 ==================== */
  function blankDay() {
    return { done: {}, steps: null, weight: null, waist: null, pomodoros: 0, circuit: {}, review: { good: '', better: '', next: '' } };
  }
  var state = loadState();
  function loadState() {
    try {
      var raw = localStorage.getItem(LS_KEY);
      if (raw) {
        var p = JSON.parse(raw);
        if (p && p.version === 1 && p.days) return p;
      }
    } catch (e) { console.warn('读取本地数据失败', e); }
    return { version: 1, days: {}, created: dateKey(new Date()) };
  }
  function saveState() {
    try { localStorage.setItem(LS_KEY, JSON.stringify(state)); }
    catch (e) { console.warn('保存失败', e); }
  }
  function dayData(key) {
    if (!state.days[key]) state.days[key] = blankDay();
    var day = state.days[key];
    // 兼容旧数据
    if (!day.done) day.done = {};
    if (!day.circuit) day.circuit = {};
    if (!day.review) day.review = { good: '', better: '', next: '' };
    if (typeof day.pomodoros !== 'number') day.pomodoros = 0;
    return day;
  }
  function doneCount(key) {
    var d = state.days[key];
    if (!d) return 0;
    var n = 0;
    for (var i = 0; i < SLOTS.length; i++) if (d.done && d.done[SLOTS[i].id]) n++;
    return n;
  }
  function stepGoal(key) {
    var p = planFor(key);
    return p.steps || 0;
  }

  var tab = 'today';
  var viewKey = dateKey(new Date());
  (function () {
    var h = (location.hash || '').replace('#', '');
    if (h && ['today', 'week', 'train', 'timer', 'records', 'review', 'reminder'].indexOf(h) >= 0) tab = h;
  })();

  function setTab(next) {
    tab = next;
    try { history.replaceState(null, '', '#' + next); } catch (e) { location.hash = next; }
  }

  /* ==================== 今日视图 ==================== */
  function heroRing(pct) {
    var R = 50, C = 2 * Math.PI * R;
    var off = C * (1 - pct / 100);
    return '' +
      '<div class="ring">' +
        '<svg width="112" height="112" viewBox="0 0 112 112">' +
          '<circle cx="56" cy="56" r="' + R + '" fill="none" stroke="#eef1f5" stroke-width="10"></circle>' +
          '<circle cx="56" cy="56" r="' + R + '" fill="none" stroke="#2ea36a" stroke-width="10" stroke-linecap="round" ' +
            'stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '"></circle>' +
        '</svg>' +
        '<div class="val"><b>' + pct + '%</b><span>今日进度</span></div>' +
      '</div>';
  }

  function nowLine(key) {
    if (key !== dateKey(new Date())) return '查看的日期不是今天，勾选依然会记录到这一天';
    var m = nowMin();
    var first = toMin(SLOTS[0].start);
    if (m < first) return '还没到起床时间 · 距 07:00 还有 ' + fmtClock((first - m) * 60);
    var cur = null;
    for (var i = 0; i < SLOTS.length; i++) {
      if (m >= toMin(SLOTS[i].start) && m < toMin(SLOTS[i].end)) { cur = SLOTS[i]; break; }
    }
    if (cur) return '当前：<b>' + esc(cur.title) + '</b> · 还剩 ' + fmtClock((toMin(cur.end) - m) * 60);
    for (var j = 0; j < SLOTS.length; j++) {
      if (m < toMin(SLOTS[j].start)) return '间隙 · 下一项「' + esc(SLOTS[j].title) + '」' + SLOTS[j].start + ' 开始';
    }
    return '今天的流程结束了，早点休息。';
  }

  function viewToday() {
    var key = viewKey;
    var plan = planFor(key);
    var data = dayData(key);
    var isToday = key === dateKey(new Date());
    var done = doneCount(key);
    var pct = Math.round(done / SLOTS.length * 100);
    var studyDone = ['study1', 'study2', 'study3'].filter(function (id) { return data.done[id]; }).length;
    var goal = plan.steps;
    var stepTxt = goal ? ((data.steps == null ? '—' : data.steps) + ' / ' + goal) : '不限';
    var d = parseKey(key);

    var html = '';

    /* 顶部卡片 */
    html += '<section class="card hero">' + heroRing(pct) +
      '<div class="hero-info">' +
        '<div class="day-title">' + plan.name + ' · <em>' + esc(plan.focus) + '</em></div>' +
        '<div class="nowline" id="nowtext">' + nowLine(key) + '</div>' +
        '<div class="hero-sub">' +
          '<i>日期 ' + fmtMD(d) + ' ' + WEEKDAY[d.getDay()] + '</i>' +
          '<i>清单 ' + done + '/' + SLOTS.length + ' 项</i>' +
          '<i>学习块 ' + studyDone + '/3</i>' +
          '<i>步数 ' + stepTxt + '</i>' +
          '<i>番茄 ' + data.pomodoros + ' 个</i>' +
        '</div>' +
        '<div class="daynav">' +
          '<button class="btn sm ghost" data-action="prev-day">‹ 前一天</button>' +
          (isToday ? '' : '<button class="btn sm ghost" data-action="today-day">回今天</button>') +
          '<button class="btn sm ghost" data-action="next-day">后一天 ›</button>' +
        '</div>' +
      '</div></section>';

    /* 学习 + 饮食 */
    html += '<div class="cols">';
    html += '<section class="card"><h2>学习主题 <small>' + esc(plan.focus) + '</small></h2>';
    html += '<div class="item"><div class="k">学习 1<br>3 小时</div><div class="v"><b>' + esc(plan.s1) + '</b>' +
      '<span>08:30–11:30 · 50 分钟学 + 10 分钟休</span></div>' +
      '<button class="check' + (data.done.study1 ? ' on' : '') + '" data-action="toggle" data-id="study1" title="标记完成">✓</button></div>';
    html += '<div class="item"><div class="k">学习 2<br>2 小时</div><div class="v"><b>' + esc(plan.s2) + '</b>' +
      '<span>13:30–15:30 · 番茄钟</span></div>' +
      '<button class="check' + (data.done.study2 ? ' on' : '') + '" data-action="toggle" data-id="study2" title="标记完成">✓</button></div>';
    html += '<div class="item"><div class="k">学习 3<br>1 小时</div><div class="v"><b>' + esc(plan.s3) + '</b>' +
      '<span>18:30–19:30 · 做题 + 错题</span></div>' +
      '<button class="check' + (data.done.study3 ? ' on' : '') + '" data-action="toggle" data-id="study3" title="标记完成">✓</button></div>';
    if (plan.extra) html += '<p class="muted" style="font-size:12.5px;margin:10px 0 0">' + esc(plan.extra) + '</p>';
    html += '</section>';

    html += '<section class="card"><h2>今日饮食 <small>减脂版</small></h2>';
    ['b', 'l', 's', 'd'].forEach(function (k) {
      var label = { b: '早餐', l: '午餐', s: '加餐', d: '晚餐' }[k];
      var time = { b: '07:50', l: '12:00', s: '15:30', d: '17:00' }[k];
      html += '<div class="item"><div class="k">' + label + '<br>' + time + '</div><div class="v">' + esc(plan.meals[k]) + '</div></div>';
    });
    html += '</section></div>';

    /* 时间表 */
    html += '<section class="card"><h2>时间表 <small>点方格打卡</small></h2><ul class="timeline">';
    var curId = null;
    if (isToday) {
      var m = nowMin();
      for (var i = 0; i < SLOTS.length; i++) {
        if (m >= toMin(SLOTS[i].start) && m < toMin(SLOTS[i].end)) { curId = SLOTS[i].id; break; }
      }
    }
    SLOTS.forEach(function (s) {
      var isDone = !!data.done[s.id];
      var cls = 'slot' + (isDone ? ' done' : '') + (s.id === curId ? ' current' : '');
      var extraBtn = s.type === 'study' || s.id === 'train'
        ? '<button class="btn sm ghost" data-action="go-timer" data-id="' + s.id + '">计时</button>' : '';
      html += '<li class="' + cls + '">' +
        '<span class="time">' + s.start + '–' + s.end + '</span>' +
        '<button class="check' + (isDone ? ' on' : '') + '" data-action="toggle" data-id="' + s.id + '" aria-label="标记 ' + esc(s.title) + '">✓</button>' +
        '<div class="s-main"><strong>' + esc(s.title) + '</strong>' + (s.note ? '<em>' + esc(s.note) + '</em>' : '') + '</div>' +
        '<span class="chip ' + s.type + '">' + TYPE_LABEL[s.type] + '</span>' +
        extraBtn + '</li>';
    });
    html += '</ul></section>';

    /* 今日数据 */
    html += '<section class="card"><h2>今日数据 <small>自动保存在本机</small></h2><div class="row">' +
      '<div class="field"><label>步数</label><input class="num" type="number" min="0" step="100" inputmode="numeric" data-field="steps" value="' + (data.steps == null ? '' : data.steps) + '" placeholder="' + (goal || '随意') + '"></div>' +
      '<div class="field"><label>体重 kg</label><input class="num" type="number" min="0" step="0.1" inputmode="decimal" data-field="weight" value="' + (data.weight == null ? '' : data.weight) + '" placeholder="周一空腹"></div>' +
      '<div class="field"><label>腰围 cm</label><input class="num" type="number" min="0" step="0.5" inputmode="decimal" data-field="waist" value="' + (data.waist == null ? '' : data.waist) + '"></div>' +
      '<div class="field"><label>番茄（学习块）</label><div class="statline"><b>' + data.pomodoros + '</b><span class="muted" style="font-size:12px">个</span></div></div>' +
      '</div>' +
      '<div class="row" style="margin-top:14px">' +
        '<div class="field"><label>查看日期</label><input type="date" id="datepick" value="' + key + '"></div>' +
        '<span class="spacer"></span>' +
        '<button class="btn" data-action="go-tab" data-tab="review">写复盘 →</button>' +
      '</div>' +
      '</section>';

    return html;
  }

  /* ==================== 周计划 ==================== */
  function viewWeek() {
    var anchor = parseKey(viewKey);
    var mon = mondayOf(anchor);
    var sun = addDays(mon, 6);
    var todayKey = dateKey(new Date());
    var html = '<section class="card"><h2>本周安排 <small>' + fmtMD(mon) + ' – ' + fmtMD(sun) + '</small></h2>' +
      '<div class="row">' +
      '<button class="btn sm" data-action="week-shift" data-n="-7">‹ 上一周</button>' +
      '<button class="btn sm" data-action="today-day">回到本周</button>' +
      '<button class="btn sm" data-action="week-shift" data-n="7">下一周 ›</button>' +
      '<span class="spacer"></span><span class="muted" style="font-size:12px">总完成率见每张卡片</span></div></section>';

    html += '<div class="weekgrid">';
    for (var i = 0; i < 7; i++) {
      var d = addDays(mon, i);
      var key = dateKey(d);
      var plan = planFor(key);
      var dc = doneCount(key);
      var pct = Math.round(dc / SLOTS.length * 100);
      var badgeCls = plan.workout.kind === 'rest' ? 'badge rest' : 'badge';
      html += '<article class="daycard' + (key === todayKey ? ' is-today' : '') + '">' +
        '<header><h3>' + plan.name + (key === todayKey ? '<span class="today-tag">今天</span>' : '') + '</h3>' +
        '<span class="muted" style="font-size:12px">' + (d.getMonth() + 1) + '/' + d.getDate() + '</span></header>' +
        '<div class="focus">' + esc(plan.focus) + '</div>' +
        '<dl>' +
          '<div><dt>学习1</dt><dd>' + esc(plan.s1) + '</dd></div>' +
          '<div><dt>学习2</dt><dd>' + esc(plan.s2) + '</dd></div>' +
          '<div><dt>学习3</dt><dd>' + esc(plan.s3) + '</dd></div>' +
          '<div><dt>三餐</dt><dd>' + esc(plan.meals.b) + '｜' + esc(plan.meals.l) + '｜' + esc(plan.meals.d) + '</dd></div>' +
        '</dl>' +
        '<footer><span class="' + badgeCls + '">' + esc(plan.workout.text) + '</span>' +
          '<span>步数 ' + (plan.steps ? plan.steps : '随意') + '</span>' +
          '<span class="spacer"></span><span>完成 ' + dc + '/' + SLOTS.length + '（' + pct + '%）</span></footer>' +
        '<div class="row"><button class="btn sm" data-action="go-day" data-key="' + key + '">打开这一天</button></div>' +
        '</article>';
    }
    html += '</div>';
    return html;
  }

  /* ==================== 训练 ==================== */
  function viewTrain() {
    var key = viewKey;
    var plan = planFor(key);
    var data = dayData(key);
    var w = plan.workout;
    var html = '';

    html += '<section class="card"><h2>今日训练 <small>' + esc(plan.name) + '</small></h2>' +
      '<div class="statline"><b>' + esc(w.text) + '</b></div>' +
      '<p class="muted" style="font-size:12.5px;margin:8px 0 0">结构：热身 8 分钟 → 8 个动作 × 3–4 轮（动作间不休息，轮间休 60–90 秒）→ 有氧 10 分钟 → 拉伸 7 分钟</p></section>';

    if (w.kind === 'rest') {
      html += '<section class="card"><div class="empty">今天是完全休息日 🛌<br>散步随意，把睡眠补好，明天再练。</div></section>';
      return html;
    }
    if (w.kind === 'cardio' || w.kind === 'light') {
      html += '<section class="card"><h2>今天这样练</h2>' +
        '<div class="item"><div class="k">内容</div><div class="v"><b>' + esc(w.text) + '</b><span>' +
        (w.kind === 'cardio' ? '保持能说话的强度，心率别飙太高' : '轻活动日，重点是恢复和步数') + '</span></div></div>' +
        '<div class="item"><div class="k">拉伸</div><div class="v"><b>7 分钟</b><span>腿后侧、臀、胸肩、颈</span></div></div></section>';
      return html;
    }

    /* 循环训练日 */
    var total = CIRCUIT.length * ROUNDS.length;
    var on = 0;
    CIRCUIT.forEach(function (m) { ROUNDS.forEach(function (r) { if (data.circuit['r' + r + '.' + m.id]) on++; }); });
    var pct = Math.round(on / total * 100);

    html += '<section class="card"><h2>环节打卡 <small>已完成 ' + on + '/' + total + ' 组（' + pct + '%）</small></h2>';
    html += '<div class="phase">';
    PHASES.forEach(function (p) {
      var k = 'phase.' + p.id;
      html += '<button class="pill' + (data.circuit[k] ? ' on' : '') + '" data-action="toggle-circuit" data-key="' + k + '">' + p.label + '</button>';
    });
    html += '</div></section>';

    html += '<section class="card"><h2>循环动作 <small>每格 = 一轮</small></h2>' +
      '<table class="circuit"><thead><tr><th>动作</th><th>次数</th><th>R1</th><th>R2</th><th>R3</th><th>R4</th></tr></thead><tbody>';
    CIRCUIT.forEach(function (m) {
      html += '<tr><td><b>' + esc(m.name) + '</b></td><td class="reps">' + esc(m.reps) + '</td>';
      ROUNDS.forEach(function (r) {
        var k = 'r' + r + '.' + m.id;
        html += '<td><button class="roundbox' + (data.circuit[k] ? ' on' : '') + '" data-action="toggle-circuit" data-key="' + k + '" aria-label="第' + r + '轮 ' + esc(m.name) + '">✓</button></td>';
      });
      html += '</tr>';
    });
    html += '</tbody></table><p class="muted" style="font-size:12px;margin:10px 0 0">R1–R4 是轮次：通常做 3 轮，状态好再补第 4 轮。</p></section>';

    html += '<section class="card"><h2>组间休息计时</h2><div class="row">' +
      '<button class="btn primary" data-action="rest-timer" data-sec="60">休息 60 秒</button>' +
      '<button class="btn primary" data-action="rest-timer" data-sec="90">休息 90 秒</button>' +
      '<span class="muted" id="restinfo" style="font-size:12.5px">点一下就开始，时间到会响一声</span></div></section>';
    return html;
  }

  /* ==================== 计时器 ==================== */
  var MODES = [
    { label: '学习 50 / 休 10', work: 50 * 60, rest: 10 * 60, name: '学习' },
    { label: '番茄 25 / 5', work: 25 * 60, rest: 5 * 60, name: '专注' },
    { label: '小块 15 / 5', work: 15 * 60, rest: 5 * 60, name: '小块' }
  ];
  var timer = { mode: 0, phase: 'work', remain: 50 * 60, total: 50 * 60, running: false, handle: null };
  var restTimer = { remain: 0, handle: null };

  function timerRingC() { return 2 * Math.PI * 96; }

  function viewTimer() {
    var key = viewKey;
    var data = dayData(key);
    var C = timerRingC().toFixed(1);
    var html = '<section class="card"><h2>计时器 <small>时间到会自动响</small></h2>' +
      '<div class="timerbox">' +
        '<div class="timerring">' +
          '<svg width="220" height="220" viewBox="0 0 220 220">' +
            '<circle cx="110" cy="110" r="96" fill="none" stroke="#eef1f5" stroke-width="12"></circle>' +
            '<circle id="tring" cx="110" cy="110" r="96" fill="none" stroke="#3b74d8" stroke-width="12" stroke-linecap="round" ' +
              'stroke-dasharray="' + C + '" stroke-dashoffset="0"></circle>' +
          '</svg>' +
          '<div class="tval"><b id="tTime">50:00</b><span id="tPhase">学习</span></div>' +
        '</div>' +
        '<div class="modes" id="modes">' +
          MODES.map(function (m, i) {
            return '<button data-action="timer-mode" data-i="' + i + '"' + (i === timer.mode ? ' class="on"' : '') + '>' + m.label + '</button>';
          }).join('') +
        '</div>' +
        '<div class="row" style="justify-content:center">' +
          '<button class="btn primary" id="tStart" data-action="timer-toggle">开始</button>' +
          '<button class="btn" data-action="timer-reset">重置</button>' +
          '<button class="btn" data-action="timer-skip">跳过本段</button>' +
        '</div>' +
        '<div class="muted" style="font-size:12.5px">今天已完成番茄：<b id="pomoCount">' + data.pomodoros + '</b> 个</div>' +
      '</div></section>' +
      '<section class="card"><h2>怎么用</h2><div class="item"><div class="k">学习块1</div><div class="v">08:30 开始，用「学习 50 / 休 10」，循环 3 次正好到 11:30</div></div>' +
      '<div class="item"><div class="k">学习块2</div><div class="v">13:30–15:30，用「番茄 25 / 5」做 4 个番茄</div></div>' +
      '<div class="item"><div class="k">学习块3</div><div class="v">18:30–19:30，用「小块 15 / 5」做 20–30 道题</div></div></section>';
    return html;
  }

  function syncTimerUI() {
    var tTime = document.getElementById('tTime');
    if (!tTime) return;
    var ring = document.getElementById('tring');
    var C = timerRingC();
    var frac = timer.total ? timer.remain / timer.total : 0;
    tTime.textContent = fmtClock(timer.remain);
    document.getElementById('tPhase').textContent = timer.phase === 'work' ? MODES[timer.mode].name : '休息';
    ring.setAttribute('stroke', timer.phase === 'work' ? '#3b74d8' : '#2ea36a');
    ring.setAttribute('stroke-dashoffset', (C * (1 - frac)).toFixed(1));
    var btn = document.getElementById('tStart');
    if (btn) btn.textContent = timer.running ? '暂停' : (timer.remain < timer.total ? '继续' : '开始');
    var pc = document.getElementById('pomoCount');
    if (pc) pc.textContent = dayData(viewKey).pomodoros;
  }

  function beep(times) {
    try {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      var ctx = new Ctx();
      for (var i = 0; i < (times || 1); i++) {
        (function (i) {
          var o = ctx.createOscillator(), g = ctx.createGain();
          o.type = 'sine';
          o.frequency.value = i % 2 ? 660 : 880;
          g.gain.value = 0.0001;
          o.connect(g); g.connect(ctx.destination);
          var t0 = ctx.currentTime + i * 0.55;
          g.gain.exponentialRampToValueAtTime(0.25, t0 + 0.02);
          g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.45);
          o.start(t0); o.stop(t0 + 0.5);
        })(i);
      }
      setTimeout(function () { ctx.close && ctx.close(); }, 2200);
    } catch (e) { /* 静音环境忽略 */ }
  }

  function timerTick() {
    if (timer.remain > 0) {
      timer.remain--;
      syncTimerUI();
      document.title = fmtClock(timer.remain) + ' · ' + (timer.phase === 'work' ? MODES[timer.mode].name : '休息');
      if (timer.remain === 0) phaseDone();
      return;
    }
    phaseDone();
  }

  function phaseDone() {
    beep(3);
    if (timer.phase === 'work') {
      dayData(viewKey).pomodoros += 1;
      saveState();
      timer.phase = 'rest';
      timer.total = MODES[timer.mode].rest;
      timer.remain = timer.total;
      syncTimerUI();
    } else {
      timer.phase = 'work';
      timer.total = MODES[timer.mode].work;
      timer.remain = timer.total;
      timerStop();
      syncTimerUI();
      document.title = '减脂 · 备考 计划表';
    }
    if (tab === 'today' || tab === 'timer') render();
  }

  function timerStop() {
    timer.running = false;
    if (timer.handle) { clearInterval(timer.handle); timer.handle = null; }
  }
  function timerStart() {
    if (timer.running) return;
    timer.running = true;
    timer.handle = setInterval(timerTick, 1000);
    syncTimerUI();
  }
  function timerToggle() {
    if (timer.running) { timerStop(); document.title = '减脂 · 备考 计划表'; }
    else timerStart();
    syncTimerUI();
  }
  function timerReset() {
    timerStop();
    timer.phase = 'work';
    timer.total = MODES[timer.mode].work;
    timer.remain = timer.total;
    document.title = '减脂 · 备考 计划表';
    syncTimerUI();
  }
  function startRestTimer(sec) {
    if (restTimer.handle) clearInterval(restTimer.handle);
    restTimer.remain = sec;
    var info = document.getElementById('restinfo');
    if (info) info.textContent = '休息中… ' + sec + ' 秒';
    restTimer.handle = setInterval(function () {
      restTimer.remain--;
      var el = document.getElementById('restinfo');
      if (el && restTimer.remain > 0) el.textContent = '休息中… ' + restTimer.remain + ' 秒';
      if (restTimer.remain <= 0) {
        clearInterval(restTimer.handle);
        restTimer.handle = null;
        beep(2);
        if (el) el.textContent = '休息结束，下一轮开始 💪';
      }
    }, 1000);
  }

  /* ==================== 记录 ==================== */
  function recordRows() {
    var keys = Object.keys(state.days).filter(function (k) {
      var d = state.days[k];
      if (!d) return false;
      return d.weight != null || d.waist != null || d.steps != null || doneCount(k) > 0;
    });
    keys.sort(function (a, b) { return a < b ? 1 : -1; });
    return keys.slice(0, 30);
  }

  function weightChart() {
    var pts = Object.keys(state.days)
      .filter(function (k) { return state.days[k] && state.days[k].weight != null; })
      .sort();
    var entries = pts.map(function (k) { return { key: k, w: Number(state.days[k].weight) }; });
    if (entries.length < 2) {
      return '<p class="muted" style="font-size:12.5px">记录 2 次以上体重就能看到趋势线（建议每周一空腹称）。</p>';
    }
    var W = 700, H = 210, PL = 46, PR = 16, PT = 18, PB = 34;
    var ws = entries.map(function (e) { return e.w; });
    var min = Math.min.apply(null, ws), max = Math.max.apply(null, ws);
    var lo = min - 0.6, hi = max + 0.6;
    if (hi - lo < 1) { hi = lo + 1; }
    function x(i) { return PL + i * (W - PL - PR) / (entries.length - 1); }
    function y(v) { return H - PB - (v - lo) / (hi - lo) * (H - PB - PT); }
    var line = entries.map(function (e, i) { return x(i).toFixed(1) + ',' + y(e.w).toFixed(1); }).join(' ');
    var area = 'M' + x(0).toFixed(1) + ',' + (H - PB) + ' L' + line.replace(/ /g, ' L') + ' L' + x(entries.length - 1).toFixed(1) + ',' + (H - PB) + ' Z';
    var dots = entries.map(function (e, i) {
      return '<circle class="pt" cx="' + x(i).toFixed(1) + '" cy="' + y(e.w).toFixed(1) + '" r="3"></circle>';
    }).join('');
    var first = entries[0], last = entries[entries.length - 1];
    var diff = (last.w - first.w).toFixed(1);
    var diffTxt = diff > 0 ? '+' + diff : diff;
    function short(k) { var p = k.split('-'); return Number(p[1]) + '/' + Number(p[2]); }
    var vlines = [0.5, 1].map(function (t) {
      var v = lo + (hi - lo) * t;
      var yy = y(v);
      return '<line class="axis" x1="' + PL + '" y1="' + yy.toFixed(1) + '" x2="' + (W - PR) + '" y2="' + yy.toFixed(1) + '" stroke-dasharray="3 5"></line>';
    }).join('');
    return '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '">' +
      '<line class="axis" x1="' + PL + '" y1="' + (H - PB) + '" x2="' + (W - PR) + '" y2="' + (H - PB) + '"></line>' + vlines +
      '<path class="area" d="' + area + '"></path>' +
      '<polyline class="line" points="' + line + '"></polyline>' + dots +
      '<text x="4" y="' + (PT + 4) + '">' + hi.toFixed(1) + '</text>' +
      '<text x="4" y="' + (H - PB) + '">' + lo.toFixed(1) + '</text>' +
      '<text x="' + PL + '" y="' + (H - 10) + '">' + short(first.key) + '</text>' +
      '<text x="' + (W - PR) + '" y="' + (H - 10) + '" text-anchor="end">' + short(last.key) + '</text>' +
      '</svg>' +
      '<p class="muted" style="font-size:12.5px;margin:6px 0 0">' + entries.length + ' 次记录 · 变化 <b>' + diffTxt + ' kg</b> · 最近 ' + last.w + ' kg</p>';
  }

  function viewRecords() {
    var rows = recordRows();
    var html = '<section class="card"><h2>体重趋势 <small>建议每周一空腹称</small></h2>' + weightChart() + '</section>';

    html += '<section class="card"><h2>打卡记录 <small>最近 30 天</small></h2>';
    if (!rows.length) {
      html += '<div class="empty">还没有记录，先去「今日」勾几项。</div>';
    } else {
      html += '<table class="log"><thead><tr><th>日期</th><th>清单</th><th>步数</th><th>体重</th><th>腰围</th><th>番茄</th></tr></thead><tbody>';
      rows.forEach(function (k) {
        var d = state.days[k], dd = parseKey(k);
        var steps = d.steps == null ? '—' : d.steps;
        html += '<tr' + (k === dateKey(new Date()) ? ' class="today"' : '') + '>' +
          '<td>' + (dd.getMonth() + 1) + '/' + dd.getDate() + ' ' + WEEKDAY[dd.getDay()] + '</td>' +
          '<td>' + doneCount(k) + '/' + SLOTS.length + '</td>' +
          '<td>' + steps + '</td><td>' + (d.weight == null ? '—' : d.weight) + '</td>' +
          '<td>' + (d.waist == null ? '—' : d.waist) + '</td><td>' + (d.pomodoros || 0) + '</td></tr>';
      });
      html += '</tbody></table>';
    }
    html += '</section>';

    var totalDone = 0, days = 0;
    Object.keys(state.days).forEach(function (k) { totalDone += doneCount(k); days++; });
    html += '<section class="card"><h2>累计</h2><div class="statline">' +
      '<span>坚持记录 <b>' + days + '</b> 天</span>' +
      '<span>累计完成 <b>' + totalDone + '</b> 项</span>' +
      '<span>平均每天 <b>' + (days ? (totalDone / days).toFixed(1) : '0') + '</b> 项</span></div></section>';
    return html;
  }

  /* ==================== 复盘 ==================== */
  function viewReview() {
    var key = viewKey;
    var data = dayData(key);
    var d = parseKey(key);
    var html = '<section class="card"><h2>三行复盘 <small>' + fmtMD(d) + ' ' + WEEKDAY[d.getDay()] + '</small></h2>' +
      '<div class="row" style="margin-bottom:10px">' +
        '<button class="btn sm" data-action="prev-day">‹ 前一天</button>' +
        '<button class="btn sm" data-action="today-day">回今天</button>' +
        '<button class="btn sm" data-action="next-day">后一天 ›</button>' +
      '</div>' +
      '<div class="field" style="margin-bottom:10px"><label>1. 今天做到了什么</label>' +
        '<textarea data-review="good" placeholder="例：学习块 1 完整跟下来，番茄 3 个">' + esc(data.review.good) + '</textarea></div>' +
      '<div class="field" style="margin-bottom:10px"><label>2. 哪里没做好 / 为什么</label>' +
        '<textarea data-review="better" placeholder="例：下午困，学习块 2 只坐了 40 分钟">' + esc(data.review.better) + '</textarea></div>' +
      '<div class="field"><label>3. 明天最重要的一件事</label>' +
        '<textarea data-review="next" placeholder="例：先把循环系统错题过一遍">' + esc(data.review.next) + '</textarea></div>' +
      '<p class="muted" style="font-size:12px;margin:10px 0 0">输入会自动保存。</p></section>';

    html += '<section class="card"><h2>最近 7 天</h2>';
    var todayK = dateKey(new Date());
    for (var i = 0; i < 7; i++) {
      var k = dateKey(addDays(parseKey(todayK), -i));
      var dc = doneCount(k);
      var pct = Math.round(dc / SLOTS.length * 100);
      var dd = parseKey(k);
      html += '<div class="item"><div class="k">' + (dd.getMonth() + 1) + '/' + dd.getDate() + '<br>' + WEEKDAY[dd.getDay()] + '</div>' +
        '<div class="v"><b>' + dc + ' / ' + SLOTS.length + ' 项（' + pct + '%）</b><span>' +
        (state.days[k] && state.days[k].review && state.days[k].review.next ? '明天重点：' + esc(state.days[k].review.next) : '未写复盘') +
        '</span></div></div>';
    }
    html += '</section>';
    return html;
  }

  /* ==================== 提醒 ==================== */
  function ensureSettings() {
    if (!state.settings) state.settings = {};
    if (!state.settings.list) state.settings.list = {};
    if (!state.settings.fired) state.settings.fired = {};
    return state.settings;
  }
  function reminderOn(id) {
    var s = ensureSettings();
    return s.list[id] !== false;
  }
  function notifState() {
    if (!('Notification' in window)) return 'unsupported';
    return Notification.permission;
  }
  function isSecureCtx() {
    return location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  }

  function reminderBody(slot, plan) {
    var t = slot.type;
    if (t === 'study') return (slot.block === 's1' ? plan.s1 : slot.block === 's2' ? plan.s2 : plan.s3);
    if (t === 'meal') {
      var k = slot.id === 'break' ? 'b' : slot.id === 'lunch' ? 'l' : slot.id === 'snack' ? 's' : 'd';
      return plan.meals[k];
    }
    if (slot.id === 'train') return plan.workout.text;
    return slot.note || '';
  }

  function notifySlot(slot) {
    var title = slot.start + ' · ' + slot.title;
    var body = reminderBody(slot, planFor(dateKey(new Date())));
    var opts = {
      body: body || '',
      icon: 'icon-192.png',
      badge: 'icon-192.png',
      tag: 'fitplan-' + slot.id,
      renotify: true,
      lang: 'zh-CN'
    };
    try {
      if (navigator.serviceWorker && navigator.serviceWorker.ready) {
        navigator.serviceWorker.ready.then(function (reg) {
          reg.showNotification(title, opts);
        }).catch(function () {});
      } else if (window.Notification) {
        new Notification(title, opts);
      }
    } catch (e) { console.warn('通知失败', e); }
  }

  function checkReminders() {
    if (notifState() !== 'granted') return;
    var now = new Date();
    var k = dateKey(now);
    var s = ensureSettings();
    if (!s.fired[k]) s.fired[k] = {};
    var fired = s.fired[k];
    var cur = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
    var changed = false;
    SLOTS.forEach(function (slot) {
      if (!reminderOn(slot.id) || fired[slot.id]) return;
      var delta = cur - toMin(slot.start);
      if (delta >= 0 && delta < 2) {
        fired[slot.id] = true;
        changed = true;
        notifySlot(slot);
      }
    });
    if (changed) saveState();
  }

  function icsEsc(s) {
    return String(s == null ? '' : s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
  }
  function icsStamp(d) {
    return d.getUTCFullYear() + pad2(d.getUTCMonth() + 1) + pad2(d.getUTCDate()) + 'T' +
      pad2(d.getUTCHours()) + pad2(d.getUTCMinutes()) + pad2(d.getUTCSeconds()) + 'Z';
  }
  function buildICS() {
    var now = new Date();
    var ymd = dateKey(now).replace(/-/g, '');
    var lines = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//fitplan//FitPlan CN//CN',
      'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'X-WR-CALNAME:减脂·备考提醒', 'X-WR-TIMEZONE:Asia/Shanghai'
    ];
    SLOTS.forEach(function (slot) {
      if (!reminderOn(slot.id)) return;
      var desc = [];
      DAYS.forEach(function (day) {
        var body = reminderBody(slot, day);
        if (body) desc.push(day.name + '：' + body);
      });
      lines.push('BEGIN:VEVENT');
      lines.push('UID:fitplan-' + slot.id + '@local');
      lines.push('DTSTAMP:' + icsStamp(now));
      lines.push('DTSTART:' + ymd + 'T' + slot.start.replace(':', '') + '00');
      lines.push('DTEND:' + ymd + 'T' + slot.end.replace(':', '') + '00');
      lines.push('SUMMARY:' + icsEsc(slot.title));
      lines.push('DESCRIPTION:' + icsEsc(desc.join('\n')));
      lines.push('RRULE:FREQ=DAILY');
      lines.push('BEGIN:VALARM');
      lines.push('TRIGGER:-PT0M');
      lines.push('ACTION:DISPLAY');
      lines.push('DESCRIPTION:' + icsEsc(slot.title));
      lines.push('END:VALARM');
      lines.push('END:VEVENT');
    });
    lines.push('END:VCALENDAR');
    return lines.join('\r\n');
  }

  function viewReminders() {
    var st = notifState();
    var secure = isSecureCtx();
    var statusTxt = { granted: '已允许通知', denied: '被浏览器拒绝', 'default': '还没开启', unsupported: '浏览器不支持' }[st];
    var html = '';

    html += '<section class="card"><h2>浏览器通知 <small>' + statusTxt + '</small></h2>';
    if (st === 'unsupported') {
      html += '<div class="empty">这个浏览器没有通知能力，请用下面的日历提醒。</div>';
    } else {
      html += '<div class="row">' +
        '<button class="btn primary" data-action="ask-permission"' + (st === 'granted' ? ' disabled' : '') + '>' +
          (st === 'granted' ? '通知已开启' : '开启通知') + '</button>' +
        '<button class="btn" data-action="test-notify">发送测试提醒</button>' +
        '</div>';
      if (st === 'denied') {
        html += '<p class="warn">你之前拒绝了通知权限：点地址栏左侧的图标（或 站点设置 → 通知）改回「允许」，再刷新页面。</p>';
      }
      if (!secure) {
        html += '<p class="warn">现在是通过局域网 http 打开的，浏览器不允许网页发通知。想在手机上收到通知，需要 HTTPS 部署（如 GitHub Pages），否则用下面的日历提醒。</p>';
      }
      html += '<p class="muted" style="font-size:12.5px;margin:10px 0 0">通知在页面打开或刚切到后台时触发；手机锁屏、浏览器被彻底关闭后不会响 —— 那种情况请用日历提醒。</p>';
    }
    html += '</section>';

    html += '<section class="card"><h2>提醒时间 <small>关掉不想被打扰的项</small></h2>';
    var onCount = 0;
    SLOTS.forEach(function (slot) {
      var on = reminderOn(slot.id);
      if (on) onCount++;
      html += '<div class="item"><div class="k">' + slot.start + '</div>' +
        '<div class="v"><b>' + esc(slot.title) + '</b>' + (slot.note ? '<span>' + esc(slot.note) + '</span>' : '') + '</div>' +
        '<label class="switch"><input type="checkbox" data-reminder="' + slot.id + '"' + (on ? ' checked' : '') + '><span></span></label></div>';
    });
    html += '<p class="muted" id="remCount" style="font-size:12px;margin:10px 0 0">已开启 ' + onCount + ' / ' + SLOTS.length + ' 个提醒</p></section>';

    html += '<section class="card"><h2>日历提醒 <small>锁屏也能响，推荐</small></h2>' +
      '<p class="muted" style="font-size:12.5px;margin:0 0 12px">把每天的固定安排导出成带闹钟的日历事件，交给手机自带日历负责响铃 —— 不打开这个页面也会提醒。</p>' +
      '<div class="row"><button class="btn primary" data-action="export-ics">导出 .ics 文件</button></div>' +
      '<div class="item"><div class="k">iPhone</div><div class="v">用 Safari 打开本页 → 导出 → 点「加入日历」</div></div>' +
      '<div class="item"><div class="k">安卓</div><div class="v">导出后点通知，用「日历」应用导入</div></div>' +
      '<div class="item"><div class="k">电脑</div><div class="v">双击 .ics，导入 Outlook 或系统日历</div></div>' +
      '<p class="muted" style="font-size:12px;margin:10px 0 0">事件是每天重复的固定时间；内容按上面开启的提醒项生成。</p></section>';

    html += '<section class="card"><h2>装到手机主屏幕 <small>像 App 一样全屏打开</small></h2>' +
      '<div class="row"><button class="btn" data-action="install-app">立即安装</button></div>' +
      '<div class="item"><div class="k">安卓</div><div class="v">Chrome 右上角菜单 →「安装应用」或「添加到主屏幕」</div></div>' +
      '<div class="item"><div class="k">iPhone</div><div class="v">Safari 底部「分享」→「添加到主屏幕」</div></div>' +
      '<p class="warn">提示：手机通过局域网 http 打开时能安装、能打卡，但通知要 HTTPS；急着用提醒就先导日历。</p></section>';

    return html;
  }

  function askPermission() {
    if (!('Notification' in window)) { alert('这个浏览器不支持通知，请用下面的日历提醒。'); return; }
    if (!isSecureCtx()) { alert('浏览器只允许 HTTPS（或 localhost）页面发通知，局域网 http 打开时请用日历提醒。'); return; }
    Notification.requestPermission().then(function (p) {
      if (p === 'granted') { checkReminders(); testNotify(); }
      render(true);
    }).catch(function (e) { alert('开启失败：' + (e && e.message ? e.message : e)); });
  }

  function testNotify() {
    if (notifState() !== 'granted') { alert('请先点「开启通知」。'); return; }
    notifySlot({ id: 'test', start: '现在', title: '测试提醒', type: 'routine', note: '看到这条就说明通知正常' });
  }

  var installPrompt = null;
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    installPrompt = e;
  });

  function installApp() {
    if (installPrompt) {
      installPrompt.prompt();
      installPrompt.userChoice.then(function () { installPrompt = null; });
      return;
    }
    alert('浏览器没有提供一键安装。\n安卓 Chrome：右上角菜单 →「安装应用 / 添加到主屏幕」。\niPhone Safari：底部「分享」→「添加到主屏幕」。');
  }

  /* ==================== 渲染 ==================== */
  var VIEWS = { today: viewToday, week: viewWeek, train: viewTrain, timer: viewTimer, records: viewRecords, review: viewReview, reminder: viewReminders };

  function render(keepScroll) {
    var y = keepScroll ? window.scrollY : 0;
    var d = new Date();
    document.getElementById('topdate').textContent = fmtMD(d) + ' ' + WEEKDAY[d.getDay()] + ' · ' + pad2(d.getHours()) + ':' + pad2(d.getMinutes());
    Array.prototype.forEach.call(document.querySelectorAll('#tabs button'), function (b) {
      b.classList.toggle('active', b.dataset.tab === tab);
    });
    var view = document.getElementById('view');
    view.innerHTML = VIEWS[tab]();
    if (tab === 'timer') syncTimerUI();
    window.scrollTo(0, y);
  }

  /* ==================== 交互 ==================== */
  document.addEventListener('click', function (e) {
    var tabBtn = e.target.closest('[data-tab]');
    if (tabBtn && !tabBtn.closest('[data-action]')) {
      setTab(tabBtn.dataset.tab); render(); return;
    }
    var el = e.target.closest('[data-action]');
    if (!el) return;
    var action = el.dataset.action;
    var key = viewKey;
    var data = dayData(key);

    switch (action) {
      case 'toggle':
        if (data.done[el.dataset.id]) delete data.done[el.dataset.id];
        else data.done[el.dataset.id] = true;
        saveState(); render(true); break;

      case 'toggle-circuit':
        if (data.circuit[el.dataset.key]) delete data.circuit[el.dataset.key];
        else data.circuit[el.dataset.key] = true;
        saveState(); render(true); break;

      case 'prev-day': viewKey = dateKey(addDays(parseKey(key), -1)); render(); break;
      case 'next-day': viewKey = dateKey(addDays(parseKey(key), 1)); render(); break;
      case 'today-day': viewKey = dateKey(new Date()); render(); break;
      case 'week-shift':
        viewKey = dateKey(addDays(parseKey(key), Number(el.dataset.n))); render(); break;
      case 'go-day': viewKey = el.dataset.key; setTab('today'); render(); break;
      case 'go-tab': setTab(el.dataset.tab); render(); break;
      case 'go-timer': setTab('timer'); render(); break;

      case 'timer-mode':
        timer.mode = Number(el.dataset.i);
        timerReset(); render(); break;
      case 'timer-toggle': timerToggle(); syncTimerUI(); break;
      case 'timer-reset': timerReset(); break;
      case 'timer-skip':
        // 跳过本段：不把没做完的专注算成番茄
        timerStop();
        if (timer.phase === 'work') {
          timer.phase = 'rest';
          timer.total = MODES[timer.mode].rest;
          timer.remain = timer.total;
        } else {
          timer.phase = 'work';
          timer.total = MODES[timer.mode].work;
          timer.remain = timer.total;
        }
        document.title = '减脂 · 备考 计划表';
        syncTimerUI();
        if (tab === 'timer') render();
        break;
      case 'rest-timer': startRestTimer(Number(el.dataset.sec)); break;

      case 'ask-permission': askPermission(); break;
      case 'test-notify': testNotify(); break;
      case 'install-app': installApp(); break;
      case 'export-ics':
        download('fitplan-reminders.ics', buildICS(), 'text/calendar;charset=utf-8');
        break;

      case 'print': window.print(); break;
      case 'export-json': exportJSON(); break;
      case 'import-json': document.getElementById('fileinput').click(); break;
      case 'export-csv': exportCSV(); break;
    }
  });

  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.dataset.reminder) {
      ensureSettings().list[t.dataset.reminder] = t.checked;
      saveState();
      var cnt = document.getElementById('remCount');
      if (cnt) {
        var n = SLOTS.filter(function (s) { return reminderOn(s.id); }).length;
        cnt.textContent = '已开启 ' + n + ' / ' + SLOTS.length + ' 个提醒';
      }
      return;
    }
    if (t.id === 'datepick') { if (t.value) { viewKey = t.value; render(); } return; }
    var field = t.dataset.field;
    if (!field) return;
    var data = dayData(viewKey);
    var v = t.value === '' ? null : Number(t.value);
    if (v !== null && (isNaN(v) || v < 0)) v = null;
    data[field] = v;
    saveState(); render(true);
  });

  document.addEventListener('input', function (e) {
    var f = e.target.dataset.review;
    if (!f) return;
    dayData(viewKey).review[f] = e.target.value;
    saveState();
  });

  document.getElementById('fileinput').addEventListener('change', function (e) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var obj = JSON.parse(String(reader.result));
        if (!obj || obj.version !== 1 || !obj.days) throw new Error('格式不对');
        state = obj;
        saveState(); render();
        alert('导入成功，共 ' + Object.keys(state.days).length + ' 天记录。');
      } catch (err) {
        alert('导入失败：' + err.message);
      }
      e.target.value = '';
    };
    reader.readAsText(file);
  });

  /* ==================== 导入导出 ==================== */
  function download(name, text, mime) {
    var blob = new Blob([text], { type: mime || 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
  }

  function exportJSON() {
    download('fitplan-backup-' + dateKey(new Date()) + '.json', JSON.stringify(state, null, 2), 'application/json');
  }

  function exportCSV() {
    var keys = Object.keys(state.days).sort();
    var lines = ['日期,完成项,完成率,步数,体重kg,腰围cm,番茄,做到什么,待改进,明天重点'];
    keys.forEach(function (k) {
      var d = state.days[k] || {};
      var dc = doneCount(k);
      var r = d.review || {};
      var cells = [k, dc, Math.round(dc / SLOTS.length * 100) + '%', d.steps == null ? '' : d.steps,
        d.weight == null ? '' : d.weight, d.waist == null ? '' : d.waist, d.pomodoros || 0,
        r.good || '', r.better || '', r.next || ''];
      lines.push(cells.map(function (c) {
        var s = String(c == null ? '' : c).replace(/"/g, '""');
        return '"' + s + '"';
      }).join(','));
    });
    download('fitplan-records-' + dateKey(new Date()) + '.csv', '\ufeff' + lines.join('\r\n'), 'text/csv;charset=utf-8');
  }

  /* ==================== 秒级刷新 ==================== */
  setInterval(function () {
    var top = document.getElementById('topdate');
    if (top) {
      var d = new Date();
      top.textContent = fmtMD(d) + ' ' + WEEKDAY[d.getDay()] + ' · ' + pad2(d.getHours()) + ':' + pad2(d.getMinutes());
    }
    var nowEl = document.getElementById('nowtext');
    if (nowEl) nowEl.innerHTML = nowLine(viewKey);
  }, 1000);

  /* PWA：离线缓存 + 主屏幕安装 */
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('sw.js').catch(function (e) {
      console.warn('离线缓存未启用：', e && e.message);
    });
  }

  /* 提醒轮询：每 20 秒检查一次固定时间点，命中就发通知 */
  setInterval(checkReminders, 20000);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) checkReminders(); });
  checkReminders();

  /* 启动 */
  render();
})();
