AOS.init({
    duration: 2000,
    once: true
});

if (window.innerWidth >= 992) {

    const sections =
        document.querySelectorAll(".snap-section");

    let currentSection = 0;
    let isAnimating = false;

    /* Detect Current Section */
    function updateCurrentSection() {

        const scrollY = window.pageYOffset;

        sections.forEach((section, index) => {

            const top = section.offsetTop;
            const bottom =
                top + section.offsetHeight;

            if (
                scrollY >= top - 100 &&
                scrollY < bottom - 100
            ) {

                currentSection = index;

            }

        });

    }

    /* Premium Smooth Scroll */
    function smoothScrollTo(
        target,
        duration = 700
    ) {

        const start =
            window.pageYOffset;

        const distance =
            target - start;

        let startTime = null;

        function easeInOutCubic(x) {
            return x < 0.5
                ? 4 * x * x * x
                : 1 - Math.pow(-2 * x + 2, 3) / 2;
        }

        function animation(currentTime) {

            if (!startTime)
                startTime = currentTime;

            const timeElapsed =
                currentTime - startTime;

            const progress = Math.min(
                timeElapsed / duration,
                1
            );

            const ease =
                easeInOutCubic(progress);

            window.scrollTo(
                0,
                start + distance * ease
            );

            if (progress < 1) {

                requestAnimationFrame(
                    animation
                );

            } else {

                isAnimating = false;

            }

        }

        requestAnimationFrame(animation);

    }

    /* Scroll To Section */
    function scrollToSection(index) {

        if (
            index < 0 ||
            index >= sections.length
        ) return;

        isAnimating = true;

        currentSection = index;

        const NAV_HEIGHT = 82;
        
        const targetPosition =
            sections[index].offsetTop - NAV_HEIGHT;

        smoothScrollTo(
            targetPosition,
            100
        );

    }

    /* Desktop Wheel */
    window.addEventListener(
        "wheel",
        (e) => {

            if (isAnimating) {

                e.preventDefault();
                return;

            }

            updateCurrentSection();

            /* Scroll Down */
            if (e.deltaY > 60) {

                if (
                    currentSection <
                    sections.length - 1
                ) {

                    e.preventDefault();

                    scrollToSection(
                        currentSection + 1
                    );

                }

            }

            /* Scroll Up */
            else if (e.deltaY < -60) {

                if (currentSection > 0) {

                    e.preventDefault();

                    scrollToSection(
                        currentSection - 1
                    );

                }

            }

        },
        { passive: false }
    );

    /* Keyboard Scroll */
    window.addEventListener("keydown", (e) => {

        if (isAnimating) return;

        updateCurrentSection();

        /* Arrow Down */
        if (
            e.key === "ArrowDown"
        ) {

            if (
                currentSection <
                sections.length - 1
            ) {

                e.preventDefault();

                scrollToSection(
                    currentSection + 1
                );

            }

        }

        /* Arrow Up */
        else if (
            e.key === "ArrowUp"
        ) {

            if (currentSection > 0) {

                e.preventDefault();

                scrollToSection(
                    currentSection - 1
                );

            }

        }

    });

}

/* Mobile Touch Start */
/*

window.addEventListener("touchstart", (e) => {

    touchStartY =
        e.touches[0].clientY;

}, { passive: true });

window.addEventListener("touchend", (e) => {

    if (isAnimating) return;

    updateCurrentSection();

    const touchEndY =
        e.changedTouches[0].clientY;

    if (
        touchStartY - touchEndY > 50
    ) {

        if (
            currentSection <
            sections.length - 1
        ) {

            scrollToSection(
                currentSection + 1
            );

        }

    }

    else if (
        touchEndY - touchStartY > 50
    ) {

        if (currentSection > 0) {

            scrollToSection(
                currentSection - 1
            );

        }

    }

}, { passive: true });

*/

document.addEventListener("DOMContentLoaded", () => {

    const video =
        document.querySelector(".video1");

    video.play();

});

const scrollTopBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
        scrollTopBtn.classList.add("show");
    } else {
        scrollTopBtn.classList.remove("show");
    }
});

scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});