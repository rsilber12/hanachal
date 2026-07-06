AOS.init({
    duration: 2000,
    once: true
});

const pageFileName = window.location.pathname.split("/").pop() || "home.html";
const isHomePage = pageFileName === "home.html" || pageFileName === "index.html";

if (window.SmoothScroll && SmoothScroll.destroy) {
    SmoothScroll.destroy();
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
