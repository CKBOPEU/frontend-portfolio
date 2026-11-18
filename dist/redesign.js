const isEnglish=document.documentElement.lang==='en';
const menu=document.querySelector('.menu-toggle'),navigation=document.querySelector('#navigation');
function closeMenu(){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label',(isEnglish?'Open menu':'Открыть меню'));navigation.classList.remove('open');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?(isEnglish?'Close menu':'Закрыть меню'):(isEnglish?'Open menu':'Открыть меню'));navigation.classList.toggle('open',open);});
navigation.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}});
window.matchMedia('(min-width:601px)').addEventListener('change',e=>{if(e.matches)closeMenu();});
const reduced=window.matchMedia('(prefers-reduced-motion:reduce)');
if('IntersectionObserver' in window&&!reduced.matches){const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}},{threshold:.07});document.documentElement.classList.add('motion-ready');document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));reduced.addEventListener('change',e=>{if(e.matches){document.documentElement.classList.remove('motion-ready');observer.disconnect();}});}

document.querySelectorAll('.lang-switch a').forEach(a=>a.addEventListener('click',()=>{try{localStorage.setItem('portfolio.lang',a.textContent.toLowerCase())}catch{}}));
