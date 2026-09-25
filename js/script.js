/**
 * Nature Chaimaa Hanafi — script.js
 */

(function () {
    "use strict";

    /* =========================================
       CONFIGURATION
    ========================================= */

    const WHATSAPP_NUMBER = "212617650798";


    /* =========================================
       WHATSAPP
    ========================================= */

    function buildWhatsappUrl(message) {
        return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    }


    /* =========================================
       OFFERS
    ========================================= */

    const offers = {

        "30ml": {

            html: `
                <div class="offer-row">

                    <span class="bottle-icons">
                        <i class="fa-solid fa-bottle-droplet"></i>
                    </span>

                    <strong>
                        30 مل بـ 55 درهم
                    </strong>

                </div>

                <div class="offer-row">

                    <span class="bottle-icons">
                        <i class="fa-solid fa-bottle-droplet"></i>
                        <i class="fa-solid fa-bottle-droplet"></i>
                    </span>

                    <strong>
                        جوج 30 مل بـ 100 درهم
                    </strong>

                </div>
            `,

            whatsappMessage:
                "السلام عليكم، بغيت نطلب زيت الشعر الطبيعي بحجم 30 مل. واش متوفر؟"

        },


        "50ml": {

            html: `
                <div class="offer-row">

                    <span class="bottle-icons">
                        <i class="fa-solid fa-bottle-droplet"></i>
                    </span>

                    <strong>
                        50 مل بـ 95 درهم
                    </strong>

                </div>

                <div class="offer-row">

                    <span class="bottle-icons">
                        <i class="fa-solid fa-bottle-droplet"></i>
                        <i class="fa-solid fa-bottle-droplet"></i>
                    </span>

                    <strong>
                        جوج 50 مل بـ 180 درهم
                    </strong>

                    <del>
                        بدل 190 درهم
                    </del>

                    <span class="discount">
                        🔥
                    </span>

                </div>
            `,

            whatsappMessage:
                "السلام عليكم، بغيت نطلب زيت الشعر الطبيعي بحجم 50 مل. واش متوفر؟"

        }

    };


    /* =========================================
       UPDATE SIZE
    ========================================= */

    function updateSize(size) {

        if (!offers[size]) {
            return;
        }

        const sizeButtons =
            document.querySelectorAll(".size-option");

        const offer =
            document.getElementById("pd-offer");

        const whatsappButton =
            document.getElementById("btn-order-whatsapp");


        /* Update offer */

        if (offer) {

            offer.innerHTML = offers[size].html;

            offer.classList.remove("offer-animation");

            void offer.offsetWidth;

            offer.classList.add("offer-animation");
        }


        /* Update active button */

        sizeButtons.forEach(button => {

            const isActive =
                button.dataset.size === size;

            button.classList.toggle(
                "active",
                isActive
            );

            button.setAttribute(
                "aria-pressed",
                isActive ? "true" : "false"
            );

        });


        /* Update WhatsApp */

        if (whatsappButton) {

            whatsappButton.href =
                buildWhatsappUrl(
                    offers[size].whatsappMessage
                );

        }

    }


    /* =========================================
       DOM READY
    ========================================= */

    document.addEventListener(
        "DOMContentLoaded",
        () => {

            const sizeButtons =
                document.querySelectorAll(".size-option");

            /* Size buttons */

            sizeButtons.forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        updateSize(
                            button.dataset.size
                        );

                    }
                );

            });


            /* Initial size */

            updateSize("30ml");


            /* Footer year */

            const year =
                document.getElementById("year");

            if (year) {

                year.textContent =
                    new Date().getFullYear();

            }

        }
    );

})();
const homeWhatsapp =
    document.getElementById("btn-order-whatsapp-home");

if (homeWhatsapp) {

    const phone = "212600000000";

    const message = encodeURIComponent(
        "السلام عليكم، بغيت نستفسر على زيت Nature Chaimaa Hanafi."
    );

    homeWhatsapp.href =
        `https://wa.me/${phone}?text=${message}`;
}