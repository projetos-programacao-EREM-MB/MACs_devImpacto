(() => {
  const menu = document.getElementById("menu-lateral");
  const iframe = document.querySelector(".conteudo-centro");
  const input = document.getElementById("input-busca");
  const caixa = document.getElementById("caixa-sugestoes");
  const livros = [
    "Capitães de areia",
    "A volta ao mundo em 80 dias",
    "A cabeça do santo",
    "Olga",
    "Dom Casmurro",
    "A Era das Revoluções",
    "1984 George Orwell",
    "Vinte mil léguas submarinas",
    "O pior dia de todos",
    "O médico e o monstro",
    "O bom de briga",
    "O azarão",
  ];
  document.getElementById("btn-menu").addEventListener("click", () => {
    const open = menu.classList.toggle("expandir");
    document
      .getElementById("btn-menu")
      .setAttribute("aria-expanded", String(open));
  });
  document.getElementById("btn-menu-mobile").addEventListener("click", () => {
    const open = menu.classList.toggle("expandir");
    document
      .getElementById("btn-menu-mobile")
      .setAttribute("aria-expanded", String(open));
  });
  document.querySelectorAll("[data-modo]").forEach((btn) =>
    btn.addEventListener("click", () => {
      definirModo(btn.dataset.modo);
    }),
  );
  function definirModo(modo) {
    try {
      localStorage.setItem("projeto_mac_modo", modo);
    } catch (e) {}
    iframe.src = "mochilaprof.html";
    if (innerWidth <= 700) menu.classList.remove("expandir");
  }
  function filtrarNoIframe(termo) {
    try {
      const doc = iframe.contentDocument;
      if (!doc) return;
      const cards = doc.querySelectorAll(".card-livro,.card-item");
      let count = 0;
      cards.forEach((card) => {
        const match = card.innerText.toLocaleLowerCase("pt-BR").includes(termo);
        card.style.display = match ? "" : "none";
        if (match) count++;
      });
      const aviso = doc.getElementById("aviso-busca-vazia");
      if (aviso) {
        aviso.hidden = !termo || count > 0;
        aviso.textContent = count
          ? ""
          : "Nenhum resultado encontrado nesta página.";
      }
    } catch (e) {
      /* páginas locais devem ser servidas pela mesma origem */
    }
  }
  function sugestoes(termo) {
    const q = termo.toLocaleLowerCase("pt-BR");
    const items = [...livros];
    try {
      JSON.parse(localStorage.getItem("banco_mochila") || "[]").forEach((x) =>
        items.push(x.titulo),
      );
    } catch (e) {}
    return [...new Set(items)]
      .filter((x) => x.toLocaleLowerCase("pt-BR").includes(q))
      .slice(0, 8);
  }
  input.addEventListener("input", () => {
    const termo = input.value.trim();
    caixa.replaceChildren();
    if (!termo) {
      caixa.style.display = "none";
      filtrarNoIframe("");
      return;
    }
    const found = sugestoes(termo);
    found.forEach((nome) => {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("role", "option");
      b.textContent = nome;
      b.addEventListener("click", () => {
        input.value = nome;
        caixa.style.display = "none";
        iframe.src = livros.some(
          (x) =>
            x.toLocaleLowerCase("pt-BR") === nome.toLocaleLowerCase("pt-BR"),
        )
          ? "biblioteca.html"
          : "mochilaprof.html";
        iframe.addEventListener(
          "load",
          () => filtrarNoIframe(nome.toLocaleLowerCase("pt-BR")),
          { once: true },
        );
      });
      caixa.appendChild(b);
    });
    if (!found.length) {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent =
        "Nenhum título encontrado. Pressione Enter para filtrar a página atual.";
      b.addEventListener("click", () => {
        caixa.style.display = "none";
        filtrarNoIframe(termo.toLocaleLowerCase("pt-BR"));
      });
      caixa.appendChild(b);
    }
    caixa.style.display = "block";
    filtrarNoIframe(termo.toLocaleLowerCase("pt-BR"));
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      caixa.style.display = "none";
      input.blur();
    }
    if (e.key === "Enter") {
      caixa.style.display = "none";
      filtrarNoIframe(input.value.trim().toLocaleLowerCase("pt-BR"));
    }
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-container")) caixa.style.display = "none";
  });
  iframe.addEventListener("load", () => {
    if (input.value.trim())
      filtrarNoIframe(input.value.trim().toLocaleLowerCase("pt-BR"));
  });
  window.definirModo = definirModo;
})();
