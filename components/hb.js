class HappyBirthday extends HTMLElement {
  constructor() {
    super();

    // Shadow DOM
    const shadow = this.attachShadow({ mode: "open" });

    // Načti externí CSS soubor
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "css/hb.css";

    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
           <div class="happy">
             <div class="balloon balloon1 balloon-anim1"></div>
             <div class="balloon balloon2 balloon-anim6"></div>
             <div class="balloon balloon3 balloon-anim3"></div>
             <div class="balloon balloon4 balloon-anim4"></div>
             <div class="balloon balloon5 balloon-anim5"></div>
           </div>
           <div class="birthday">
             <div class="balloon balloon3 balloon-anim6"></div>
             <div class="balloon balloon1 balloon-anim2"></div>
             <div class="balloon balloon4 balloon-anim1"></div>
             <div class="balloon balloon2 balloon-anim6"></div>
             <div class="balloon balloon1 balloon-anim4"></div>
             <div class="balloon balloon3 balloon-anim5"></div>
             <div class="balloon balloon2 balloon-anim1"></div>
             <div class="balloon balloon4 balloon-anim6"></div>
           </div>
        `;

    shadow.appendChild(link);
    shadow.appendChild(wrapper);
  }
}

customElements.define("happy-birthday", HappyBirthday);
