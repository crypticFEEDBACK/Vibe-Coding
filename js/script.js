"use strict";

const menuToggle = document.querySelector(".menu-toggle");
const primaryNavigation = document.querySelector("#primary-navigation");
const navigationLinks = [...document.querySelectorAll(".primary-navigation a[href^='#']")];
const currentYear = document.querySelector("#current-year");
const contactForm = document.querySelector("#contact-form");
const formFeedback = document.querySelector("#form-feedback");

if (currentYear) {
    currentYear.textContent = String(new Date().getFullYear());
}

if (menuToggle instanceof HTMLButtonElement && primaryNavigation instanceof HTMLElement) {
    const setMenuOpen = (isOpen) => {
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );
        primaryNavigation.classList.toggle("is-open", isOpen);
        document.body.classList.toggle("menu-open", isOpen);
    };

    menuToggle.addEventListener("click", () => {
        setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
    });

    primaryNavigation.addEventListener("click", (event) => {
        if (event.target instanceof Element && event.target.closest("a")) {
            setMenuOpen(false);
        }
    });

    document.addEventListener("click", (event) => {
        if (
            menuToggle.getAttribute("aria-expanded") === "true" &&
            event.target instanceof Node &&
            !primaryNavigation.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            setMenuOpen(false);
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
            setMenuOpen(false);
            menuToggle.focus();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 760 && menuToggle.getAttribute("aria-expanded") === "true") {
            setMenuOpen(false);
        }
    });
}

const revealElements = document.querySelectorAll("[data-reveal]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });

    revealElements.forEach((element) => {
        const delay = element.dataset.revealDelay;
        if (delay) {
            element.style.setProperty("--reveal-delay", `${delay}ms`);
        }
        revealObserver.observe(element);
    });
} else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
}

if ("IntersectionObserver" in window && navigationLinks.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            const activeLink = navigationLinks.find(
                (link) => link.hash === `#${entry.target.id}`
            );
            navigationLinks.forEach((link) => {
                if (link === activeLink) {
                    link.classList.add("is-active");
                    link.setAttribute("aria-current", "location");
                } else {
                    link.classList.remove("is-active");
                    link.removeAttribute("aria-current");
                }
            });
        });
    }, { rootMargin: "-25% 0px -65% 0px" });

    navigationLinks.forEach((link) => {
        const section = document.querySelector(link.hash);
        if (section) {
            sectionObserver.observe(section);
        }
    });
}

let lastProjectTrigger = null;
document.querySelectorAll("[data-project-open]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
        const dialogId = trigger.getAttribute("data-project-open");
        const dialog = dialogId ? document.getElementById(dialogId) : null;

        if (!(dialog instanceof HTMLDialogElement)) {
            return;
        }

        event.preventDefault();
        lastProjectTrigger = trigger;
        dialog.showModal();
        dialog.querySelector(".dialog-close")?.focus();
    });
});

document.querySelectorAll(".project-dialog").forEach((dialog) => {
    if (!(dialog instanceof HTMLDialogElement)) {
        return;
    }

    dialog.querySelector(".dialog-close")?.addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) {
            dialog.close();
        }
    });
    dialog.addEventListener("close", () => {
        if (lastProjectTrigger instanceof HTMLElement) {
            lastProjectTrigger.focus();
        }
    });
});

if (contactForm instanceof HTMLFormElement && formFeedback instanceof HTMLElement) {
    const nameField = contactForm.elements.namedItem("name");
    const emailField = contactForm.elements.namedItem("email");
    const subjectField = contactForm.elements.namedItem("subject");
    const messageField = contactForm.elements.namedItem("message");

    if (
        nameField instanceof HTMLInputElement &&
        emailField instanceof HTMLInputElement &&
        subjectField instanceof HTMLInputElement &&
        messageField instanceof HTMLTextAreaElement
    ) {
        const requiredTextFields = [
            [nameField, "Please enter your name."],
            [messageField, "Please enter a message."]
        ];
        const fields = [nameField, emailField, subjectField, messageField];

        fields.forEach((field) => {
            field.addEventListener("input", () => {
                field.setCustomValidity("");
                field.removeAttribute("aria-invalid");
                formFeedback.textContent = "";
                formFeedback.classList.remove("is-error");
            });
        });

        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();

            requiredTextFields.forEach(([field, message]) => {
                field.value = field.value.trim();
                field.setCustomValidity(field.value ? "" : message);
            });
            emailField.value = emailField.value.trim();
            subjectField.value = subjectField.value.trim();

            const invalidFields = fields.filter((field) => !field.checkValidity());
            fields.forEach((field) => {
                if (field.checkValidity()) {
                    field.removeAttribute("aria-invalid");
                } else {
                    field.setAttribute("aria-invalid", "true");
                }
            });

            if (invalidFields.length) {
                formFeedback.textContent = "Please check the highlighted fields and try again.";
                formFeedback.classList.add("is-error");
                invalidFields[0].focus();
                invalidFields[0].reportValidity();
                return;
            }

            formFeedback.textContent =
                "Your details are valid, but this form is not connected to an email service. Your message has not been sent.";
            formFeedback.classList.remove("is-error");
        });
    }
}
