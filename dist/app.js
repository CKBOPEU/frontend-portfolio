const buttons = document.querySelectorAll('[data-lang]');
const contactCopy = document.querySelector('#contact p:last-of-type');
contactCopy.dataset.en = 'Written communication in English or Russian.';
contactCopy.dataset.ru = 'Письменное общение на английском или русском.';
const email = document.createElement('a');
email.className = 'contact-email';
email.href = 'mailto:Kopytovdv1999@gmail.com';
email.textContent = 'Kopytovdv1999@gmail.com';
Object.assign(email.style, { display: 'inline-block', color: '#d8f04b', font: '24px Georgia, serif', marginTop: '22px', overflowWrap: 'anywhere', textUnderlineOffset: '7px' });
document.querySelector('#contact').append(email);
function setLang(lang) {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-en]').forEach((element) => { element.innerHTML = element.dataset[lang]; });
  buttons.forEach((button) => button.classList.toggle('on', button.dataset.lang === lang));
  localStorage.setItem('portfolio.lang', lang);
}
buttons.forEach((button) => button.addEventListener('click', () => setLang(button.dataset.lang)));
setLang(localStorage.getItem('portfolio.lang') === 'ru' ? 'ru' : 'en');
