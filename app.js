const KEY = "estoque_domestico_vfinal";

const baseItems = [
  {name:"Arroz",cat:"Alimentos",qty:16,goal:48},
  {name:"Feijão",cat:"Alimentos",qty:4,goal:24},
  {name:"Macarrão parafuso",cat:"Alimentos",qty:2,goal:24},
  {name:"Sal",cat:"Alimentos",qty:1,goal:2},
  {name:"Açúcar cristal",cat:"Alimentos",qty:4.5,goal:12},
  {name:"Óleo de soja",cat:"Alimentos",qty:3,goal:12},
  {name:"Óleo misto",cat:"Alimentos",qty:1,goal:12},
  {name:"Molho de tomate",cat:"Alimentos",qty:3,goal:24},
  {name:"Sardinha",cat:"Alimentos",qty:2,goal:24},
  {name:"Capuccino",cat:"Alimentos",qty:0.2,goal:1},
  {name:"Geleia de framboesa",cat:"Alimentos",qty:1,goal:4},
  {name:"Café descafeinado",cat:"Alimentos",qty:0.25,goal:2},
  {name:"Papel toalha",cat:"Limpeza",qty:1,goal:6},
  {name:"Bucha de cozinha",cat:"Limpeza",qty:8,goal:24},
  {name:"Sabão em barra",cat:"Limpeza",qty:10,goal:24},
  {name:"Sabonete antibacteriano",cat:"Higiene",qty:14,goal:48},
  {name:"Sabonete comum",cat:"Higiene",qty:7,goal:48},
  {name:"Desodorante antibacteriano",cat:"Higiene",qty:1,goal:12},
  {name:"Desodorante comum",cat:"Higiene",qty:1,goal:12},
  {name:"Pasta de dente sensível",cat:"Higiene",qty:2,goal:12},
  {name:"Pasta de dente comum",cat:"Higiene",qty:3,goal:12}
];

let items = JSON.parse(localStorage.getItem(KEY)) || baseItems.map(i => ({...i, id: Date.now() + Math.random()}));
items = items.map(i => ({...i, cat: i.cat.trim()}));

function save(){ localStorage.setItem(KEY, JSON.stringify(items)); }

window.add = function(){
  const nome = document.getElementById('n').value.trim();
  const categoriaInput = document.getElementById('c').value.trim() || "Outros";
  const catNormalizada = categoriaInput.toLowerCase();
  
  const catExistente = items.find(i => i.cat.toLowerCase() === catNormalizada);
  const catFinal = catExistente ? catExistente.cat : categoriaInput;

  if(nome){
    items.push({
      id: Date.now() + Math.random(),
      name: nome,
      cat: catFinal,
      qty: +document.getElementById('q').value || 0,
      goal: +document.getElementById('g').value || 0
    });
    save(); render();
    document.getElementById('n').value = document.getElementById('c').value = "";
    document.getElementById('q').value = document.getElementById('g').value = "";
  }
};

window.del = function(id){
  if(confirm("DELETAR ITEM DO SISTEMA?")){
    items = items.filter(i => i.id !== id);
    save(); render();
  }
};

window.upd = function(id, key, val){
  const item = items.find(i => i.id === id);
  if(item) {
    item[key] = parseFloat(val) || 0;
    save();
    const container = document.querySelector(`[data-id="${id}"]`);
    const p = item.goal ? Math.min(100, (item.qty / item.goal) * 100) : 0;
    if(container){
        container.querySelector('.bar').style.width = p + "%";
        container.querySelector('.pct').innerText = p.toFixed(0) + "%";
        container.querySelector('.progress').className = `progress ${p < 30 ? 'low' : p < 60 ? 'mid' : ''}`;
    }
  }
};

window.toggle = function(id){
  const el = document.getElementById(id);
  el.style.display = (el.style.display === "block") ? "none" : "block";
};

window.exportData = function() {
    const dataStr = JSON.stringify(items, null, 2);
    const blob = new Blob([dataStr], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vault_backup.json`;
    link.click();
};

window.importData = function(event) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            items = JSON.parse(e.target.result);
            save(); location.reload();
        } catch(err) { alert("ERRO NO ARQUIVO!"); }
    };
    reader.readAsText(event.target.files[0]);
};

function render(){
  const out = document.getElementById("estoque");
  if(!out) return;
  out.innerHTML = "";
  const uniqueCats = [...new Set(items.map(i => i.cat.trim()))];

  uniqueCats.forEach(cat => {
    const cid = "cat_" + cat.replace(/[^a-zA-Z0-9]/g, "");
    const catDiv = document.createElement("div");
    catDiv.className = "category";
    const catItems = items.filter(i => i.cat.trim() === cat);
    
    const itemsHtml = catItems.map(i => {
      const p = i.goal ? Math.min(100, (i.qty / i.goal) * 100) : 0;
      const cls = p < 30 ? "low" : p < 60 ? "mid" : "";
      return `
        <div class="item" data-id="${i.id}">
          <div class="item-info"><b>> ${i.name}</b><span class="pct">${p.toFixed(0)}%</span></div>
          <div class="controls">
            <div><label>QTD</label><input type="number" value="${i.qty}" onchange="upd(${i.id},'qty',this.value)"></div>
            <div><label>META</label><input type="number" value="${i.goal}" onchange="upd(${i.id},'goal',this.value)"></div>
          </div>
          <div class="progress ${cls}"><div class="bar" style="width:${p}%"></div></div>
          ${p < 30 ? '<div class="alert">ESTOQUE CRÍTICO</div>' : ''}
          <button class="danger" onclick="del(${i.id})">ELIMINAR</button>
        </div>`;
    }).join("");

    catDiv.innerHTML = `<div class="cat-header" onclick="toggle('${cid}')">${cat.toUpperCase()}</div>
                        <div class="cat-body" id="${cid}">${itemsHtml}</div>`;
    out.appendChild(catDiv);
  });
}

// Registro do Service Worker para PWA
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js');
}

render();
