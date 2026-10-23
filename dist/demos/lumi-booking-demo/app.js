const services=[
  {id:'hair',name:'Стрижка и укладка',meta:'60 минут · 2 200 ₽'},
  {id:'color',name:'Окрашивание',meta:'120 минут · от 4 500 ₽'},
  {id:'nails',name:'Маникюр',meta:'90 минут · 1 800 ₽'},
  {id:'brows',name:'Оформление бровей',meta:'45 минут · 1 300 ₽'}
];
const masters={
  hair:[{id:'anna',name:'Анна',meta:'стилист'},{id:'elena',name:'Елена',meta:'стилист'}],
  color:[{id:'anna',name:'Анна',meta:'колорист'},{id:'elena',name:'Елена',meta:'колорист'}],
  nails:[{id:'maria',name:'Мария',meta:'мастер ногтевого сервиса'},{id:'sofia',name:'София',meta:'мастер ногтевого сервиса'}],
  brows:[{id:'elena',name:'Елена',meta:'бровист'},{id:'anna',name:'Анна',meta:'бровист'}]
};
const fmt=new Intl.DateTimeFormat('ru-RU',{weekday:'long',day:'numeric',month:'long'});
const dates=Array.from({length:3},(_,index)=>{const value=new Date();value.setDate(value.getDate()+index+1);const label=fmt.format(value);return label.charAt(0).toUpperCase()+label.slice(1)});
const times=['10:00','12:30','15:00','18:30'];
const state={service:null,master:null,date:null,time:null,client:null};
const chat=document.querySelector('#chat'),actions=document.querySelector('#actions');
const wait=ms=>new Promise(r=>setTimeout(r,ms));
function message(text,who='bot',success=false){const el=document.createElement('div');el.className=`msg ${who}${success?' success':''}`;el.textContent=text;chat.append(el);chat.scrollTop=chat.scrollHeight}
function choices(items,handler){actions.innerHTML='';items.forEach(item=>{const b=document.createElement('button');b.className='choice';b.type='button';b.innerHTML=`${item.name||item}<small>${item.meta||''}</small>`;b.onclick=()=>handler(item);actions.append(b)})}
function update(){const map={service:state.service?.name,master:state.master?.name,date:state.date,time:state.time,client:state.client?.name};Object.entries(map).forEach(([k,v])=>document.querySelector(`#sum-${k}`).textContent=v||'—')}
async function bot(text){await wait(220);message(text)}
async function start(){Object.assign(state,{service:null,master:null,date:null,time:null,client:null});chat.innerHTML='';actions.innerHTML='';document.querySelector('#status').textContent='Черновик';document.querySelector('#status').className='status';document.querySelector('#admin-note p').textContent='Появится после подтверждения записи.';update();message('Здравствуйте! Я помогу записаться в салон LUMI. Выберите услугу 👇');choices(services,selectService)}
async function selectService(item){state.service=item;message(item.name,'user');update();actions.innerHTML='';await bot(`Отлично. ${item.name}: ${item.meta}.\nТеперь выберите мастера.`);choices([...masters[item.id],{id:'any',name:'Любой свободный мастер',meta:'быстрее найти время'}],selectMaster)}
async function selectMaster(item){state.master=item;message(item.name,'user');update();actions.innerHTML='';await bot('На какую дату вас записать?');choices(dates.map(x=>({name:x})),x=>selectDate(x.name))}
async function selectDate(value){state.date=value;message(value,'user');update();actions.innerHTML='';await bot('Есть несколько свободных окон. Выберите время:');choices(times.map(x=>({name:x})),x=>selectTime(x.name))}
async function selectTime(value){state.time=value;message(value,'user');update();actions.innerHTML='';await bot('Остался последний шаг. Укажите имя и телефон — они нужны для подтверждения записи.');actions.innerHTML=`<form class="form" id="client-form"><input name="name" placeholder="Имя" aria-label="Имя" autocomplete="name" required maxlength="40"><input name="phone" type="tel" placeholder="+7 999 000-00-00" aria-label="Телефон" autocomplete="tel" required maxlength="24"><small id="form-error" role="alert"></small><button>Продолжить</button></form>`;document.querySelector('#client-form').onsubmit=submitClient}
async function submitClient(e){e.preventDefault();const fd=new FormData(e.currentTarget),name=fd.get('name').trim(),phone=fd.get('phone').trim();if(!name||phone.replace(/\D/g,'').length<11){document.querySelector('#form-error').textContent='Проверьте имя и номер телефона.';return}state.client={name,phone};message(`${name}, ${phone}`,'user');update();actions.innerHTML='';await bot(`Проверьте запись:\n${state.service.name}\nМастер: ${state.master.name}\n${state.date} в ${state.time}\n${state.client.name}, ${state.client.phone}`);choices([{name:'Подтвердить запись',meta:'данные верны'},{name:'Начать заново',meta:'изменить выбор'}],x=>x.name.startsWith('Подтвердить')?confirm():start())}
async function confirm(){message('Подтвердить запись','user');actions.innerHTML='';await bot(`Готово! Запись подтверждена ✅\n${state.date}, ${state.time}\n${state.service.name}`,true);document.querySelector('#status').textContent='Подтверждено';document.querySelector('#status').className='status done';document.querySelector('#admin-note p').textContent=`Новая запись: ${state.client.name}, ${state.service.name}, ${state.date}, ${state.time}. Телефон: ${state.client.phone}`;choices([{name:'Мои записи',meta:'показать текущую запись'},{name:'Отменить запись',meta:'демонстрация отмены'}],x=>x.name==='Мои записи'?showBooking():cancel())}
async function showBooking(){message('Мои записи','user');actions.innerHTML='';await bot(`Активная запись:\n${state.service.name}\n${state.date}, ${state.time}\nМастер: ${state.master.name}`);choices([{name:'Вернуться',meta:'к действиям'}],()=>confirmActions())}
function confirmActions(){choices([{name:'Мои записи',meta:'показать текущую запись'},{name:'Отменить запись',meta:'демонстрация отмены'}],x=>x.name==='Мои записи'?showBooking():cancel())}
async function cancel(){message('Отменить запись','user');actions.innerHTML='';await bot('Запись отменена. Если планы изменятся, я помогу выбрать новое время.');document.querySelector('#status').textContent='Отменено';document.querySelector('#status').className='status';choices([{name:'Записаться снова'}],start)}
document.querySelectorAll('[data-restart]').forEach(b=>b.addEventListener('click',start));start();
