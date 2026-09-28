/**
 * Nature Chaimaa Hanafi — script.js
 * - Aucune donnée sensible ici (pas de clé API, pas de secret).
 * - Les liens WhatsApp sont construits avec encodeURIComponent pour éviter
 *   toute injection dans l'URL.
 */
(function () {
  "use strict";
  // Numéro WhatsApp de la marque (format international, sans + ni espaces)
  const WHATSAPP_NUMBER = "212617650798";
  function buildWhatsappUrl(message) {
    const safeMessage = encodeURIComponent(message || "");
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${safeMessage}`;
  }
  /**
   * Sélecteur de contenance (30ml / 50ml) sur la page produit.
   * Nécessite : .size-option[data-size][data-price], #pd-price-value (optionnel),
   * #btn-order-whatsapp[data-product] (optionnel).
   */
  function initSizeSelector() {
    const options = document.querySelectorAll(".size-option");
    const priceEl = document.getElementById("pd-price-value");
    const waBtn = document.getElementById("btn-order-whatsapp");
    if (!options.length) return;
    options.forEach((option) => {
      option.addEventListener("click", () => selectSize(option));
      option.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          selectSize(option);
        }
      });
    });
    function selectSize(option) {
      options.forEach((o) => {
        o.classList.remove("active");
        o.setAttribute("aria-pressed", "false");
      });
      option.classList.add("active");
      option.setAttribute("aria-pressed", "true");
      const size = option.dataset.size || "";
      const price = option.dataset.price || "";
      if (priceEl && price) priceEl.textContent = price;
      if (waBtn) {
        waBtn.dataset.size = size;
        if (price) waBtn.dataset.price = price;
        else delete waBtn.dataset.price;
        const productName = waBtn.dataset.product || "Nature Chaimaa Hanafi";
        const message = `Bonjour, je souhaite commander : ${productName} (${size}). Merci de me confirmer la disponibilité.`;
        waBtn.setAttribute("href", buildWhatsappUrl(message));
      }
    }
    const activeOption = Array.from(options).find((option) => option.classList.contains("active"));
    if (activeOption) selectSize(activeOption);
  }
  /**
   * Boutons "Commander via WhatsApp" sans taille associée
   * (ex : carte produit ou section contact sur la page d'accueil).
   */
  function initSimpleWhatsappButtons() {
    document.querySelectorAll("[data-whatsapp-simple]").forEach((btn) => {
      if (btn.hasAttribute("data-order-flow")) return;
      const productName = btn.dataset.product || "un produit Nature Chaimaa Hanafi";
      const message = `Bonjour, je souhaite avoir des informations sur : ${productName}.`;
      btn.setAttribute("href", buildWhatsappUrl(message));
    });
  }
  function initOrderFlow() {
    const orderButtons = document.querySelectorAll("[data-order-flow]");
    if (!orderButtons.length) return;
    const dialog = document.createElement("dialog");
    dialog.className = "order-dialog";
    dialog.setAttribute("aria-labelledby", "order-dialog-title");
    dialog.innerHTML = `
      <form class="order-form" id="orderForm">
        <div class="order-dialog-head">
          <div><span class="section-kicker">الخطوة الأخيرة</span><h2 id="order-dialog-title">راجعي طلبك</h2></div>
          <button class="order-close" type="button" aria-label="إغلاق">&times;</button>
        </div>
        <p class="order-intro">راجعي المعلومات قبل إرسال الطلب عبر واتساب. سنؤكد الثمن والتوفر معك.</p>
        <div class="order-summary" aria-live="polite">
          <div><span>المنتج</span><strong id="orderProductSummary"></strong></div>
          <div><span>الكمية</span><strong id="orderQuantitySummary"></strong></div>
          <div><span>الثمن</span><strong id="orderPriceSummary"></strong></div>
        </div>
        <label for="orderQuantity">الكمية</label>
        <input id="orderQuantity" name="quantity" type="number" min="1" max="20" value="1" required inputmode="numeric">
        <label for="orderCity">المدينة</label>
        <select id="orderCity" name="city" required>
          <option value="">اختاري المدينة</option>
          <option value="كلميم">كلميم</option>
          <option value="آسفي">آسفي</option>
          <option value="other">مدينة أخرى</option>
        </select>
        <div id="otherCityWrap" hidden>
          <label for="otherCity">اسم المدينة</label>
          <input id="otherCity" name="otherCity" type="text" maxlength="60" autocomplete="address-level2">
        </div>
        <label for="orderAddress">العنوان أو الحي</label>
        <input id="orderAddress" name="address" type="text" maxlength="120" autocomplete="street-address" required>
        <p class="order-shipping" id="orderShipping" aria-live="polite">اختاري المدينة لمعرفة التوصيل.</p>
        <button class="btn btn-whatsapp order-submit" type="submit"><i class="fa-brands fa-whatsapp"></i> تأكيد الطلب عبر واتساب</button>
      </form>`;
    document.body.append(dialog);
    const form = dialog.querySelector("#orderForm");
    const quantityInput = dialog.querySelector("#orderQuantity");
    const citySelect = dialog.querySelector("#orderCity");
    const otherCityWrap = dialog.querySelector("#otherCityWrap");
    const otherCityInput = dialog.querySelector("#otherCity");
    const addressInput = dialog.querySelector("#orderAddress");
    const closeButton = dialog.querySelector(".order-close");
    const productSummary = dialog.querySelector("#orderProductSummary");
    const quantitySummary = dialog.querySelector("#orderQuantitySummary");
    const priceSummary = dialog.querySelector("#orderPriceSummary");
    const shippingSummary = dialog.querySelector("#orderShipping");
    let currentButton = null;
    const getOrderCity = () => citySelect.value === "other" ? otherCityInput.value.trim() : citySelect.value;
    const updateOrderSummary = () => {
      if (!currentButton) return;
      const quantity = Math.max(1, Number.parseInt(quantityInput.value, 10) || 1);
      const size = currentButton.dataset.size || "";
      const price = currentButton.dataset.price || "";
      productSummary.textContent = [currentButton.dataset.product || "Nature Chaimaa Hanafi", size].filter(Boolean).join(" — ");
      quantitySummary.textContent = String(quantity);
      const priceNumber = Number((price.match(/[0-9]+(?:[.,][0-9]+)?/) || [])[0]?.replace(",", "."));
      priceSummary.textContent = priceNumber > 0 ? `${priceNumber * quantity} درهم` : "يتم التأكيد عبر واتساب";
      if (citySelect.value === "كلميم" || citySelect.value === "آسفي") {
        shippingSummary.textContent = `التوصيل إلى ${citySelect.value} مجاني.`;
      } else if (citySelect.value === "other") {
        shippingSummary.textContent = "سنتأكد من تكلفة التوصيل إلى مدينتك عبر واتساب.";
      } else {
        shippingSummary.textContent = "اختاري المدينة لمعرفة التوصيل.";
      }
      otherCityWrap.hidden = citySelect.value !== "other";
      otherCityInput.required = citySelect.value === "other";
    };
    orderButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        currentButton = button;
        form.reset();
        updateOrderSummary();
        if (typeof dialog.showModal === "function") dialog.showModal();
        else dialog.setAttribute("open", "");
        quantityInput.focus();
      });
    });
    [quantityInput, citySelect, otherCityInput].forEach((input) => input.addEventListener("input", updateOrderSummary));
    citySelect.addEventListener("change", updateOrderSummary);
    closeButton.addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity() || !currentButton) return;
      const quantity = Math.max(1, Number.parseInt(quantityInput.value, 10) || 1);
      const city = getOrderCity();
      const size = currentButton.dataset.size || "";
      const price = currentButton.dataset.price || "الثمن عند التأكيد";
      const product = currentButton.dataset.product || "Nature Chaimaa Hanafi";
      const freeDelivery = city === "كلميم" || city === "آسفي";
      const message = [
        "السلام عليكم، أريد تأكيد هذا الطلب:",
        `المنتج: ${product}${size ? ` (${size})` : ""}`,
        `الكمية: ${quantity}`,
        `الثمن المشار إليه: ${price}`,
        `المدينة: ${city}`,
        `العنوان أو الحي: ${addressInput.value.trim()}`,
        `التوصيل: ${freeDelivery ? "مجاني" : "يرجى تأكيد التكلفة"}`,
        "يرجى تأكيد التوفر والثمن النهائي. شكراً."
      ].join("\n");
      const whatsappUrl = buildWhatsappUrl(message);
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      dialog.close();
    });
  }
  /**
   * Menu mobile : bascule l'affichage de #mainNav via le bouton #mobileMenuBtn.
   * Ferme automatiquement le menu quand on clique sur un lien.
   */
  function initMobileMenu() {
    const btn = document.getElementById("mobileMenuBtn");
    const nav = document.getElementById("mainNav");
    if (!btn || !nav) return;
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", "فتح القائمة");
    const setOpen = (open) => {
      nav.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", String(open));
      btn.setAttribute("aria-label", open ? "إغلاق القائمة" : "فتح القائمة");
      btn.innerHTML = open
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
    };
    btn.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setOpen(false));
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        btn.focus();
      }
    });
    document.addEventListener("click", (event) => {
      if (
        nav.classList.contains("is-open") &&
        !nav.contains(event.target) &&
        !btn.contains(event.target)
      ) {
        setOpen(false);
      }
    });
    // Ferme le menu si on repasse en largeur desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth > 650) setOpen(false);
    });
  }
  const initializeSite = () => {
    initSizeSelector();
    initSimpleWhatsappButtons();
    initOrderFlow();
    initMobileMenu();
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeSite, { once: true });
  } else {
    initializeSite();
  }
})();
