// =========================================================
// HOSTEL SURVIVAL MANAGER
// MAIN FRONTEND JAVASCRIPT
// =========================================================

console.log("Hostel Survival Manager loaded successfully!");


// ---------------------------------------------------------
// Simple scroll animation
// ---------------------------------------------------------

const animatedElements = document.querySelectorAll(
    ".feature-card, .step, .section-heading"
);

const observer = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";

            }

        });

    },
    {
        threshold: 0.1
    }
);


animatedElements.forEach((element) => {

    element.style.opacity = "0";
    element.style.transform = "translateY(20px)";
    element.style.transition = "opacity 0.6s ease, transform 0.6s ease";

    observer.observe(element);

});