const menuToggle = document.querySelector(".menu-toggle");
const primaryNavigation = document.querySelector("#primary-navigation");
const contactForm = document.querySelector("#contact-form");
const formFeedback = document.querySelector("#form-feedback");
const currentYear = document.querySelector("#current-year");

if (menuToggle && primaryNavigation) {
    const setNavigationOpen = (isOpen) => {
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );
        primaryNavigation.classList.toggle("is-open", isOpen);
    };

    menuToggle.addEventListener("click", () => {
        const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
        setNavigationOpen(!isOpen);
    });

    primaryNavigation.addEventListener("click", (event) => {
        if (event.target instanceof Element && event.target.closest("a")) {
            setNavigationOpen(false);
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
            setNavigationOpen(false);
            menuToggle.focus();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 640) {
            setNavigationOpen(false);
        }
    });
}

if (currentYear) {
    currentYear.textContent = String(new Date().getFullYear());
}

if (contactForm instanceof HTMLFormElement && formFeedback) {
    const nameField = contactForm.elements.namedItem("name");
    const emailField = contactForm.elements.namedItem("email");
    const messageField = contactForm.elements.namedItem("message");

    if (
        nameField instanceof HTMLInputElement &&
        emailField instanceof HTMLInputElement &&
        messageField instanceof HTMLTextAreaElement
    ) {
        const updateTextFieldValidity = (field, label) => {
            field.setCustomValidity(
                field.value.trim() ? "" : `Please enter your ${label}.`
            );
        };

        const textFields = [
            [nameField, "name"],
            [messageField, "message"]
        ];

        textFields.forEach(([field, label]) => {
            field.addEventListener("input", () => {
                updateTextFieldValidity(field, label);
                formFeedback.textContent = "";
            });
        });

        emailField.addEventListener("input", () => {
            formFeedback.textContent = "";
        });

        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();

            textFields.forEach(([field, label]) => {
                updateTextFieldValidity(field, label);
                field.value = field.value.trim();
            });
            emailField.value = emailField.value.trim();

            if (!contactForm.reportValidity()) {
                formFeedback.textContent = "Please correct the highlighted fields.";
                return;
            }

            formFeedback.textContent =
                "Your details are valid, but this form is not connected to a message service. Your message has not been sent.";
        });
    }
}
