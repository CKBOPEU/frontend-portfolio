const chat=document.querySelector('#chat');const actions=document.querySelector('#actions');
const add=(html,user=false)=>{const el=document.createElement('div');el.className='bubble'+(user?' user':'');el.innerHTML=html;chat.append(el);chat.scrollTop=chat.scrollHeight};
const menu=()=>{actions.innerHTML='';[['🍽 Меню','meal'],['🥗 Калории и БЖУ','nutrition'],['🏋️ Тренировка','workout'],['📈 Прогресс','progress']].forEach(([label,id],i)=>{const b=document.createElement('button');b.textContent=label;b.className=i===0?'primary':'';b.onclick=()=>show(id,label);actions.append(b)})};
const cards={
nutrition:`<strong>Ваш ориентир на день</strong><div class="metric-grid"><div class="metric"><b>2 140</b><small>ккал</small></div><div class="metric"><b>142 г</b><small>белок</small></div><div class="metric"><b>71 г</b><small>жиры</small></div><div class="metric"><b>234 г</b><small>углеводы</small></div></div><br><small>Расчёт учитывает цель, активность и безопасный диапазон.</small>`,
meal:`<strong>Меню на сегодня · 2 132 ккал</strong>🥣 Овсянка с ягодами — 510<br>🍗 Курица, гречка и овощи — 720<br>🥛 Йогурт и яблоко — 260<br>🐟 Рыба с картофелем — 642`,
workout:`<strong>День A · всё тело</strong>Приседания · 3 × 10<br>Жим гантелей · 3 × 10<br>Тяга в наклоне · 3 × 12<br>Планка · 3 × 40 сек<br><br><small>Нагрузка меняется по истории выполненных подходов.</small>`,
progress:`<strong>Обзор за 4 недели</strong><div class="metric-grid"><div class="metric"><b>−1,4 кг</b><small>масса</small></div><div class="metric"><b>+8%</b><small>рабочий объём</small></div></div><br>Темп находится в безопасном диапазоне. План можно продолжить без корректировки.`};
function show(id,label){add(label,true);setTimeout(()=>{add(cards[id]);menu()},180)}
add('<strong>Привет! Я FORMETR.</strong>Соберу исходные данные и подготовлю понятный план питания и тренировок. В этой демоверсии профиль уже заполнен.');
setTimeout(()=>{add('Профиль готов: цель — улучшить форму, 3 тренировки в неделю, домашнее оборудование. Выберите раздел.');menu()},260);
