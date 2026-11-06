// Связи по типу работы. Не подтверждают техническую совместимость моделей.
const accessoryRelations = {
  'BT-D18':['BT-B06','BT-M05'],
  'BT-D20':['BT-B06','BT-M05'],
  'BT-S12':['BT-B06','BT-M05'],
  'BT-E750':['BT-M05'],
  'BT-H800':['BT-SDS03'],
  'BT-H18':['BT-SDS03'],
  'BT-G18':['BT-CUT125'],
  'BT-G900':['BT-CUT125'],
  'BT-V240':['BT-SH90'],
  'BT-O300':['BT-SD125'],
  'BT-J18':['BT-JB03'],
  'BT-J650':['BT-JB03'],
  'BT-C18':['BT-CS165']
};
function relatedEquipment(p){
  const ids=p.accessory
    ?Object.keys(accessoryRelations).filter(id=>accessoryRelations[id].includes(p.id))
    :accessoryRelations[p.id]||[];
  const items=ids.map(id=>catalogProducts.find(x=>x.id===id)).filter(Boolean);
  if(!items.length)return '';
  return `<section class="related equipment" aria-labelledby="equipment-title"><p class="eyebrow">ИНСТРУМЕНТ И ОСНАСТКА</p><h2 id="equipment-title">${p.accessory?'Инструменты для этой оснастки':'С этим товаром также берут'}</h2><p class="equipment-note">Демонстрационная подборка по назначению. Не подтверждает совместимость. Перед использованием проверяют размеры, крепление, допустимые режимы и требования производителя инструмента.</p><div class="grid">${items.map(card).join('')}</div></section>`;
}

