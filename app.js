let itens = JSON.parse(localStorage.getItem("estoque")) || [
  { nome: "Arroz", categoria: "Alimentos", meta: 48, atual: 16 },
  { nome: "Feijão", categoria: "Alimentos", meta: 12, atual: 4 },
  { nome: "Sabão em barra", categoria: "Limpeza", meta: 24, atual: 10 }
];


function salvar() {
  localStorage.setItem("estoque", JSON.stringify(itens));
}


function render() {
  const div = document.getElementById("estoque");
  div.innerHTML = "";


  const categorias = [...new Set(itens.map(i => i.categoria))];


  categorias.forEach(cat => {
    const h = document.createElement("h2");
    h.textContent = cat;
    div.appendChild(h);


    itens.filter(i => i.categoria === cat).forEach((item, i) => {
      const box = document.createElement("div");
      box.className = "item";
      box.innerHTML = `
        <strong>${item.nome}</strong><br>
        <span class="categoria">${item.categoria}</span><br>
        Tenho: <input type="number" value="${item.atual}"
          onchange="atualizar(${i}, this.value)">
        Meta: ${item.meta}
      `;
      div.appendChild(box);
    });
  });
}


function atualizar(i, valor) {
  itens[i].atual = Number(valor);
  salvar();
  render();
}


function adicionarItem() {
  const nome = document.getElementById("nome").value;
  const categoria = document.getElementById("categoria").value;
  const meta = Number(document.getElementById("meta").value);


  if (!nome || !categoria || !meta) return;


  itens.push({ nome, categoria, meta, atual: 0 });
  salvar();
  render();
}


function gerarPlano() {
  const plano = itens
    .filter(i => i.atual < i.meta)
    .sort((a, b) => (a.meta - a.atual) - (b.meta - b.atual))
    .slice(0, 2);


  document.getElementById("plano").innerHTML =
    "<h2>Este mês:</h2>" +
    plano.map(p => `<p>• ${p.nome}</p>`).join("");
}


render();