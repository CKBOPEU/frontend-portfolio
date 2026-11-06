const isEnglish=document.documentElement.lang==='en';
const menu=document.querySelector('.menu-toggle'),navigation=document.querySelector('#navigation');
function closeMenu(){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label',(isEnglish?'Open menu':'Открыть меню'));navigation.classList.remove('open');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?(isEnglish?'Close menu':'Закрыть меню'):(isEnglish?'Open menu':'Открыть меню'));navigation.classList.toggle('open',open);});
navigation.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}});
window.matchMedia('(min-width:601px)').addEventListener('change',e=>{if(e.matches)closeMenu();});
const track=document.querySelector('#project-track'),slides=[...track.querySelectorAll('.project-slide')],dots=[...document.querySelectorAll('[data-slide]')],prev=document.querySelector('#prev'),next=document.querySelector('#next'),status=document.querySelector('#slide-status');
const names=['BOLTERRA',isEnglish?'Archive services website':'Сайт архивных услуг','GreenDent','Below Protocol'];
const reduced=window.matchMedia('(prefers-reduced-motion:reduce)');
let index=0,frame=0;
function closestIndex(){const inset=parseFloat(getComputedStyle(track).paddingLeft);let result=0,distance=Infinity;slides.forEach((s,i)=>{const d=Math.abs(s.offsetLeft-track.offsetLeft-track.scrollLeft-inset);if(d<distance){distance=d;result=i;}});return result;}
function update(){index=closestIndex();dots.forEach((d,i)=>d.setAttribute('aria-pressed',String(i===index)));prev.disabled=index===0;next.disabled=index===slides.length-1;const text=`${String(index+1).padStart(2,'0')} / 04 — ${names[index]}`;if(status.textContent!==text)status.textContent=text;}
function go(i){const target=Math.max(0,Math.min(slides.length-1,i));const inset=parseFloat(getComputedStyle(track).paddingLeft);track.scrollTo({left:slides[target].offsetLeft-track.offsetLeft-inset,behavior:reduced.matches?'instant':'smooth'});}
prev.addEventListener('click',()=>go(index-1));next.addEventListener('click',()=>go(index+1));dots.forEach(d=>d.addEventListener('click',()=>go(+d.dataset.slide)));
track.addEventListener('keydown',e=>{if(e.target!==track)return;if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();go(e.key==='Home'?0:e.key==='End'?slides.length-1:index+(e.key==='ArrowRight'?1:-1));}});
track.addEventListener('scroll',()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(update);},{passive:true});
let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>go(index),100);});update();
if('IntersectionObserver' in window&&!reduced.matches){const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}},{threshold:.07});document.documentElement.classList.add('motion-ready');document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));reduced.addEventListener('change',e=>{if(e.matches){document.documentElement.classList.remove('motion-ready');observer.disconnect();}});}

document.querySelectorAll('.lang-switch a').forEach(a=>a.addEventListener('click',()=>{try{localStorage.setItem('portfolio.lang',a.textContent.toLowerCase())}catch{}}));
