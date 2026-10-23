document.querySelectorAll('.filters button').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.filters button').forEach(item=>item.classList.remove('on'));button.classList.add('on');document.querySelectorAll('.cards article').forEach(card=>card.classList.toggle('hide',button.dataset.filter!=='all'&&card.dataset.type!==button.dataset.filter))}));

document.querySelectorAll('.choices button').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.choices button').forEach(item=>item.classList.remove('chosen'));button.classList.add('chosen')}));

const requestDialog=document.querySelector('.request-dialog');
document.querySelector('form').addEventListener('submit',event=>{event.preventDefault();if(event.currentTarget.reportValidity())requestDialog.showModal()});
requestDialog.querySelector('button').addEventListener('click',()=>requestDialog.close());

const imageDialog=document.querySelector('.image-dialog');
const imageDialogPhoto=imageDialog.querySelector('img');
const imageDialogCaption=imageDialog.querySelector('p');
const propertyImages=['assets/hero.png','assets/house-v2.png','assets/loft-v2.png'];

document.querySelectorAll('.cards article').forEach((card,index)=>{
  const visual=card.querySelector('.visual');
  visual.setAttribute('role','button');
  visual.setAttribute('tabindex','0');
  visual.setAttribute('aria-label',`Увеличить изображение: ${card.querySelector('h3').textContent}`);
  const openImage=()=>{
    imageDialogPhoto.src=propertyImages[index];
    imageDialogPhoto.alt=card.querySelector('h3').textContent;
    imageDialogCaption.textContent=card.querySelector('h3').textContent;
    imageDialog.showModal();
  };
  visual.addEventListener('click',openImage);
  visual.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();openImage()}});
});

imageDialog.querySelector('.image-close').addEventListener('click',()=>imageDialog.close());
imageDialog.addEventListener('click',event=>{if(event.target===imageDialog)imageDialog.close()});
