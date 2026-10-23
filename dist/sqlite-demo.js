'use strict';
(async () => {
  const $ = s => document.querySelector(s);
  const slug = location.pathname.split('/').filter(Boolean).slice(-2)[0];
  const key = 'portfolio-sqlite-v1-' + slug;
  const words = {
    en: {intro:'Interactive browser edition of the demonstration SQLite database. All records are fictional. Changes stay in this browser; the full Flask application is a separate version. Download a copy to keep your work.',add:'Add record',download:'Download SQLite',reset:'Reset demo',edit:'Edit',remove:'Delete',save:'Save',cancel:'Cancel',confirm:'Delete this record?',resetConfirm:'Discard local changes and restore the demonstration data?',error:'Could not save. Check required fields, unique values and related record IDs. Details: ',local:'Saved in this browser.',storage:'Browser storage unavailable. Download the database to keep changes.',empty:'No records in this table.',loading:'Loading database…',failed:'Database could not load. Reload the page.',actions:'Actions',back:'Back to project'},
    ru: {intro:'Интерактивная браузерная версия демонстрационной базы SQLite. Все записи вымышленные. Изменения остаются в этом браузере; полное Flask-приложение — отдельная версия. Скачайте копию, чтобы сохранить работу.',add:'Добавить запись',download:'Скачать SQLite',reset:'Сбросить демо',edit:'Изменить',remove:'Удалить',save:'Сохранить',cancel:'Отмена',confirm:'Удалить эту запись?',resetConfirm:'Удалить локальные изменения и восстановить демонстрационные данные?',error:'Не удалось сохранить. Проверьте обязательные поля, уникальность значений и ID связанных записей. Подробности: ',local:'Сохранено в этом браузере.',storage:'Хранилище браузера недоступно. Скачайте базу, чтобы сохранить изменения.',empty:'В этой таблице пока нет записей.',loading:'Загрузка базы…',failed:'Не удалось загрузить базу. Обновите страницу.',actions:'Действия',back:'Вернуться к проекту'}
  };
  let lang = new URLSearchParams(location.search).get('lang') === 'ru' ? 'ru' : 'en';
  let db, table, columns = [], editId = null;
  const t = k => words[lang][k];
  const quote = s => '"' + s.replaceAll('"', '""') + '"';
  const rows = (sql, params = []) => {
    const stmt = db.prepare(sql); const result = [];
    try { stmt.bind(params); while (stmt.step()) result.push(stmt.getAsObject()); }
    finally { stmt.free(); } return result;
  };
  function labels() {
    document.documentElement.lang = lang;
    $('#intro').textContent = t('intro');
    for (const id of ['add','download','reset','save','cancel']) $('#' + id).textContent = t(id);
    $('#back').textContent = t('back');
    $('#back').href = '../../' + (lang === 'ru' ? 'ru/' : '') + 'projects/' + slug + '.html';
    $('#language').textContent = lang === 'en' ? 'Русский' : 'English';
  }
  function persist() {
    try { let binary = ''; for (const byte of db.export()) binary += String.fromCharCode(byte); localStorage.setItem(key, btoa(binary)); $('#message').textContent = t('local'); }
    catch { $('#message').textContent = t('storage'); }
  }
  function render() {
    columns = rows('PRAGMA table_info(' + quote(table) + ')');
    const head = document.createElement('tr');
    for (const title of [...columns.map(c => c.name), t('actions')]) { const cell = document.createElement('th'); cell.scope = 'col'; cell.textContent = title; head.append(cell); }
    $('thead').replaceChildren(head); $('tbody').replaceChildren();
    const data = rows('SELECT rowid AS __rowid__, * FROM ' + quote(table) + ' LIMIT 500');
    for (const row of data) {
      const tr = document.createElement('tr');
      for (const col of columns) { const td = document.createElement('td'); td.textContent = row[col.name] ?? '—'; td.title = td.textContent; tr.append(td); }
      const actions = document.createElement('td');
      for (const action of ['edit','remove']) {
        const button = document.createElement('button'); button.textContent = t(action);
        button.onclick = () => { if (action === 'edit') openForm(row); else if (confirm(t('confirm'))) { try { db.run('DELETE FROM ' + quote(table) + ' WHERE rowid=?',[row.__rowid__]); persist(); render(); } catch(e) { $('#message').textContent = t('error') + e.message; } } };
        actions.append(button);
      }
      tr.append(actions); $('tbody').append(tr);
    }
    if (!data.length) { const td = document.createElement('td'); td.colSpan = columns.length + 1; td.textContent = t('empty'); const tr = document.createElement('tr'); tr.append(td); $('tbody').append(tr); }
    for (const button of $('#tables').children) button.setAttribute('aria-current', String(button.dataset.table === table));
  }
  function openForm(row) {
    editId = row ? row.__rowid__ : null; $('#error').textContent = ''; $('#fields').replaceChildren();
    $('#form-title').textContent = t(row ? 'edit' : 'add') + ' · ' + table;
    for (const col of columns.filter(c => !c.pk)) {
      const label = document.createElement('label'); label.textContent = col.name + (col.notnull && col.dflt_value == null ? ' *' : '');
      const input = document.createElement('input'); input.name = col.name;
      input.type = /INT|REAL|NUM|DEC|FLOAT|DOUBLE/i.test(col.type) ? 'number' : 'text';
      if (input.type === 'number') input.step = 'any';
      input.required = !!col.notnull && col.dflt_value == null;
      input.value = row ? row[col.name] ?? '' : '';
      if (col.dflt_value != null) input.placeholder = String(col.dflt_value);
      label.append(input); $('#fields').append(label);
    }
    $('dialog').showModal();
  }
  $('form').onsubmit = event => {
    event.preventDefault();
    try {
      const fields = columns.filter(c => !c.pk).filter(c => !(editId === null && $('[name="' + c.name + '"]').value === '' && c.dflt_value != null));
      const values = fields.map(c => { const input = $('[name="' + c.name + '"]'); return input.value === '' && !c.notnull ? null : input.type === 'number' ? Number(input.value) : input.value; });
      if (editId !== null) db.run('UPDATE ' + quote(table) + ' SET ' + fields.map(c => quote(c.name) + '=?').join(',') + ' WHERE rowid=?', [...values,editId]);
      else if (fields.length) db.run('INSERT INTO ' + quote(table) + ' (' + fields.map(c => quote(c.name)).join(',') + ') VALUES (' + fields.map(() => '?').join(',') + ')', values);
      else db.run('INSERT INTO ' + quote(table) + ' DEFAULT VALUES');
      persist(); render(); $('dialog').close();
    } catch(e) { $('#error').textContent = t('error') + e.message; }
  };
  $('#cancel').onclick = () => $('dialog').close();
  $('#add').onclick = () => openForm(null);
  $('#language').onclick = () => { lang = lang === 'en' ? 'ru' : 'en'; const url = new URL(location.href); url.searchParams.set('lang',lang); history.replaceState(null,'',url); labels(); if (db) render(); };
  $('#download').onclick = () => { if (!db) return; const url = URL.createObjectURL(new Blob([db.export()],{type:'application/vnd.sqlite3'})); const a = document.createElement('a'); a.href = url; a.download = slug + '-demo.sqlite'; a.click(); setTimeout(() => URL.revokeObjectURL(url),1000); };
  $('#reset').onclick = async () => { if (!confirm(t('resetConfirm'))) return; try { localStorage.removeItem(key); } catch {} await load(false); };
  labels(); for (const id of ['add','download','reset']) $('#' + id).disabled = true;
  let SQL;
  async function load(saved = true) {
    $('#message').textContent = t('loading');
    try {
      if (!SQL) SQL = await initSqlJs({locateFile:file => '../../vendor/sqljs/' + file});
      let bytes;
      try { const stored = saved && localStorage.getItem(key); if (stored) bytes = Uint8Array.from(atob(stored), c => c.charCodeAt(0)); } catch {}
      if (!bytes) { const response = await fetch('data.sqlite'); if (!response.ok) throw Error('HTTP ' + response.status); bytes = new Uint8Array(await response.arrayBuffer()); }
      if (db) db.close(); db = new SQL.Database(bytes); db.run('PRAGMA foreign_keys=ON');
      const tables = rows("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name");
      $('#tables').replaceChildren();
      for (const item of tables) { const button = document.createElement('button'); button.textContent = item.name; button.dataset.table = item.name; button.onclick = () => { table = item.name; render(); }; $('#tables').append(button); }
      table = tables.find(item => item.name === 'clients')?.name || tables[0].name;
      render(); $('#message').textContent = ''; for (const id of ['add','download','reset']) $('#' + id).disabled = false;
    } catch(e) { $('#message').textContent = t('failed') + ' ' + e.message; }
  }
  await load();
})();
