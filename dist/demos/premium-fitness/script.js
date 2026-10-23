const menu = document.querySelector('.menu');
const nav = document.querySelector('.nav');
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', String(!open));
  menu.setAttribute('aria-label', open ? 'Открыть меню' : 'Закрыть меню');
  nav.classList.toggle('open', !open);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false');
}));

const zones = {
  strength: ['01','Силовая зона','Техника важнее веса','Свободные веса, продуманная биомеханика тренажёров и достаточно пространства для движения. Тренер рядом, когда он действительно нужен.',['Оборудование премиум-класса','Платформы для функционального тренинга','Зона мобильности и разминки'],'assets/zone-strength.jpg'],
  cardio: ['02','Кардио-зона','Ритм под контролем','Тренируйте выносливость с точными показателями нагрузки и видом на город. Оборудование помогает держать фокус на самочувствии.',['Дорожки с амортизацией','Гребные и лыжные эргометры','Контроль пульсовых зон'],'assets/zone-cardio.jpg'],
  recovery: ['03','Зона восстановления','Прогресс начинается с паузы','Тихое пространство для возвращения ресурса после нагрузки: от мобильности до мягких восстановительных практик.',['Миофасциальный релиз','Компрессионная терапия','Спокойная лаунж-зона'],'assets/zone-recovery.jpg'],
  studio: ['04','Студия движения','Сила в точности','Камерные классы, где тренер видит каждого. Работаем с мобильностью, координацией и качеством базовых движений.',['Группы до 10 человек','Функциональные классы','Йога и mobility'],'assets/zone-studio.jpg']
};
document.querySelectorAll('[role="tab"]').forEach(tab => tab.addEventListener('click', () => {
  document.querySelectorAll('[role="tab"]').forEach(t => t.setAttribute('aria-selected','false'));
  tab.setAttribute('aria-selected','true');
  const d = zones[tab.dataset.zone];
  const panel = document.querySelector('#zone-panel');
  panel.animate([{opacity:.25,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:350});
  panel.querySelector('.zone-visual>span').textContent=d[0]; panel.querySelector('.zone-label').textContent=d[1];
  panel.querySelector('.zone-visual').style.backgroundImage=`url('${d[5]}')`;
  panel.querySelector('h3').textContent=d[2]; panel.querySelector('.zone-copy>p:not(.zone-label)').textContent=d[3];
  panel.querySelector('ul').innerHTML=d[4].map(x=>`<li>${x}</li>`).join('');
}));
Object.values(zones).forEach(zone => { const image = new Image(); image.src = zone[5]; });

const screenshotMode = new URLSearchParams(location.search).has('screenshot');
if (screenshotMode || matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
} else {
  const observer = new IntersectionObserver(entries => entries.forEach(e => {
    if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}
  }),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

const form = document.querySelector('#lead-form');
const dialog = document.querySelector('#success-dialog');
document.querySelectorAll('.plan-open').forEach(btn => btn.addEventListener('click', () => {
  document.querySelector('[name="interest"]').value='Подбор абонемента';
  document.querySelector('#visit').scrollIntoView({behavior:'smooth'});
}));
function validateField(input, message){
  const holder=input.closest('label'); const err=holder.querySelector('.field-error');
  input.classList.toggle('invalid',!!message); if(err) err.textContent=message; return !message;
}
form.addEventListener('submit', e => {
  e.preventDefault(); const name=form.elements.name; const phone=form.elements.phone;
  const nameOk=validateField(name,name.value.trim().length<2?'Введите имя (минимум 2 символа)':'');
  const phoneOk=validateField(phone,phone.value.replace(/\D/g,'').length<10?'Введите корректный номер телефона':'');
  const consentOk=form.elements.consent.checked;
  form.querySelector('.consent').style.color=consentOk?'':'#c2442d';
  if(nameOk&&phoneOk&&consentOk){document.querySelector('#success-name').textContent=name.value.trim();dialog.showModal();form.reset()}
});
document.querySelectorAll('.dialog-close,.dialog-ok').forEach(btn=>btn.addEventListener('click',()=>dialog.close()));
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
