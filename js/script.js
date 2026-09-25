/**
 * Nature Chaimaa Hanafi — script.js
 * - Aucune donnée sensible ici (pas de clé API, pas de secret).
 * - Les liens WhatsApp sont construits avec encodeURIComponent pour éviter
 *   toute injection dans l'URL (même si la source est fixe ici, c'est la
 *   bonne pratique si un jour le message devient dynamique).
 */

(function () {
  "use strict";

  // Numéro WhatsApp de la marque (format international, sans + ni espaces)
  const WHATSAPP_NUMBER = "212617650798";

  /**
   * Construit une URL wa.me sécurisée à partir d'un message.
   * @param {string} message
   * @returns {string}
   */
  function buildWhatsappUrl(message) {
    const safeMessage = encodeURIComponent(message || "");
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${safeMessage}`;
  }

  /**
   * Sélecteur de contenance (30ml / 50ml) sur la page produit.
   * Met à jour le prix affiché et le message WhatsApp envoyé.
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

      if (priceEl && price) {
        priceEl.textContent = price;
      }

      if (waBtn) {
        const productName = waBtn.dataset.product || "Huile Nature Chaimaa Hanafi";
        const message = `Bonjour, je souhaite commander : ${productName} (${size}). Merci de me confirmer la disponibilité.`;
        waBtn.setAttribute("href", buildWhatsappUrl(message));
      }
    }
  }

  /**
   * Prépare tous les boutons "Commander via WhatsApp" qui n'ont pas
   * de taille associée (ex : carte produit sur la page d'accueil).
   */
  function initSimpleWhatsappButtons() {
    document.querySelectorAll("[data-whatsapp-simple]").forEach((btn) => {
      const productName = btn.dataset.product || "un produit Nature Chaimaa Hanafi";
      const message = `Bonjour, je souhaite avoir des informations sur : ${productName}.`;
      btn.setAttribute("href", buildWhatsappUrl(message));
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initSizeSelector();
    initSimpleWhatsappButtons();

    // Année automatique dans le pied de page
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  });
})();
