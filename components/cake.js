class Cake extends HTMLElement {
  constructor() {
    super();

    // Shadow DOM
    const shadow = this.attachShadow({ mode: "open" });

    // Načti externí CSS soubor
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "css/cake.css"; // Cesta k tvému CSS souboru

    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
           <div class="cake">
             <div class="plate"></div>
             <div class="layer layer-1"></div>
             <div class="layer layer-2"></div>
             <div class="layer layer-3"></div>
             <div class="layer layer-4"></div>
             <div class="layer layer-top"></div>
             <div class="layer layer-top-cream1"></div>
             <div class="layer layer-top-cream2"></div>
             <div class="layer candle"></div>
           </div>`;

    shadow.appendChild(link);
    shadow.appendChild(wrapper);
  }
}

customElements.define("m-cake", Cake);
