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
      const productName = btn.dataset.product || "un produit Nature Chaimaa Hanafi";
      const message = `Bonjour, je souhaite avoir des informations sur : ${productName}.`;
      btn.setAttribute("href", buildWhatsappUrl(message));
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
