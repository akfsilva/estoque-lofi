const estoquePadrao = [
  { nome: "Arroz (kg)", categoria: "Alimentos", atual: 16, meta: 48 },
  { nome: "Feijão (kg)", categoria: "Alimentos", atual: 4, meta: 12 },
  { nome: "Macarrão (kg)", categoria: "Alimentos", atual: 2, meta: 12 },
  { nome: "Sal (kg)", categoria: "Alimentos", atual: 1, meta: 1 },
  { nome: "Açúcar (kg)", categoria: "Alimentos", atual: 4.5, meta: 6 },

  { nome: "Sabonete", categoria: "Higiene", atual: 21, meta: 48 },
  { nome: "Pasta de dente", categoria: "Higiene", atual: 5, meta: 12 },

  { nome: "Sabão em barra", categoria: "Limpeza", atual: 10, meta: 24 }
];

let itens = JSON.parse(localStorage.getItem("estoque")) || estoquePadrao;

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

    itens
      .filter(i => i.categoria === cat)
      .forEach((item, index) => {
        const box = document.createElement("div");
        box.className = "item";
        box.innerHTML = `
          <span class="excluir" onclick="excluirItem(${index})">[ X ]</span>
          <strong>${item.nome}</strong><br>
          Atual:
          <input type="number" value="${item.atual}"
            onchange="itemAtual(${index}, this.value)">
          Meta:
          <input type="number" value="${item.meta}"
            onchange="itemMeta(${index}, this.value)">
        `;
        div.appendChild(box);
      });
  });
}

function itemAtual(i, valor) {
  itens[i].atual = Number(valor);
  salvar();
}

function itemMeta(i, valor) {
  itens[i].meta = Number(valor);
  salvar();
}

function excluirItem(i) {
  itens.splice(i, 1);
  salvar();
  render();
}

function adicionarItem() {
  const nome = nomeEl.value;
  const categoria = categoriaEl.value;
  const atual = Number(atualEl.value);
  const meta = Number(metaEl.value);

  if (!nome || !categoria) return;

  itens.push({ nome, categoria, atual, meta });
  salvar();
  render();

  nomeEl.value = "";
  categoriaEl.value = "";
  atualEl.value = "";
  metaEl.value = "";
}

function gerarPlano() {
  const plano = itens
    .filter(i => i.atual < i.meta)
    .sort((a, b) => (a.meta - a.atual) - (b.meta - b.atual))
    .slice(0, 2);

  document.getElementById("plano").innerHTML =
    "<h2>PLANO DO MÊS</h2>" +
    plano.map(p => `<p>▸ ${p.nome}</p>`).join("");
}

const nomeEl = document.getElementById("nome");
const categoriaEl = document.getElementById("categoria");
const atualEl = document.getElementById("atual");
const metaEl = document.getElementById("meta");

render();
salvar();
