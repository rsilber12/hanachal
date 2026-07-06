AOS.init({
    duration: 2000,
    once: true
});

const pageFileName = window.location.pathname.split("/").pop() || "home.html";
const isHomePage = pageFileName === "home.html" || pageFileName === "index.html";

if (!isHomePage && window.SmoothScroll) {
    SmoothScroll({
        animationTime: 1150,
        stepSize: 72,
        pulseScale: 5,
        accelerationDelta: 90,
        accelerationMax: 1.35,
        arrowScroll: 38
    });
}

if (isHomePage && window.innerWidth >= 992) {

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
            50
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

    const currentPage = window.location.pathname.split("/").pop() || "home.html";
    const navLinks = document.querySelectorAll(
        ".navbar.navbar1 .nav-link[href], .navbar.navbar1 .btn[href]"
    );

    navLinks.forEach((link) => {
        const href = link.getAttribute("href");

        if (!href || href.startsWith("#")) return;

        const linkPage = href.split("/").pop().split("#")[0];
        const isCurrentPage = linkPage === currentPage;
        const isHomePage = currentPage === "index.html" && linkPage === "home.html";

        link.classList.toggle("active", isCurrentPage || isHomePage);
    });

});

document.addEventListener("DOMContentLoaded", () => {

    const video =
        document.querySelector(".video1");

    if (video) {
        video.play();
    }

});

document.addEventListener("DOMContentLoaded", () => {

    if (isHomePage) return;

    const targets = document.querySelectorAll(
        ".snap-section h1, .snap-section h2, .snap-section h5, .reserve-gallery-section h1, .form-box h1"
    );

    let wordIndex = 0;

    function wrapTextNode(textNode) {
        const fragment = document.createDocumentFragment();
        const parts = textNode.textContent.split(/(\s+)/);

        parts.forEach((part) => {
            if (!part) return;

            if (/^\s+$/.test(part)) {
                fragment.appendChild(document.createTextNode(part));
                return;
            }

            const span = document.createElement("span");
            span.className = "scroll-float-word";
            span.style.setProperty("--scroll-float-index", wordIndex);
            span.textContent = part;
            wordIndex += 1;
            fragment.appendChild(span);
        });

        textNode.parentNode.replaceChild(fragment, textNode);
    }

    function wrapElementText(element) {
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode(node) {
                    return node.textContent.trim()
                        ? NodeFilter.FILTER_ACCEPT
                        : NodeFilter.FILTER_REJECT;
                }
            }
        );

        const textNodes = [];
        while (walker.nextNode()) {
            textNodes.push(walker.currentNode);
        }

        wordIndex = 0;
        textNodes.forEach(wrapTextNode);
        element.classList.add("scroll-float-text");
    }

    targets.forEach((target) => {
        if (!target.classList.contains("scroll-float-text")) {
            wrapElementText(target);
        }
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                entry.target.classList.toggle(
                    "is-visible",
                    entry.isIntersecting
                );
            });
        },
        {
            threshold: .28,
            rootMargin: "0px 0px -12% 0px"
        }
    );

    targets.forEach((target) => observer.observe(target));

    if (window.AOS) {
        AOS.refresh();
    }

});

const scrollTopBtn = document.getElementById("scrollTopBtn");

if (scrollTopBtn) {
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
}

const video = document.getElementById("myVideo");
const playBtn = document.getElementById("playBtn");

if (video && playBtn) {
    playBtn.addEventListener("click", function () {
        if (video.paused) {
            video.play();
            playBtn.style.display = "none";
        } else {
            video.pause();
            playBtn.style.display = "block";
        }
    });

    video.addEventListener("pause", () => {
        playBtn.style.display = "block";
    });

    video.addEventListener("ended", () => {
        playBtn.style.display = "block";
    });
}
