$(document).ready(function () {
    const CONTACT_FORM_ENDPOINT = "https://api.web3forms.com/submit";
    const WEB3FORMS_ACCESS_KEY = "e9455987-9a4c-43f9-b5f2-a526143b7227";
    const NEWSLETTER_ENDPOINT = "https://hook.eu2.make.com/y3rrgfgj8pwholbg2v8i3ldjdj3wg5e2";

    const successMessage = "Thank you for your interest in Hanachal Residences. We've received your submission and our team will be in touch shortly.";

    function ensureSuccessPopup() {
        if ($("#hanachalSuccessPopup").length) {
            return;
        }

        $("body").append(
            '<div id="hanachalSuccessPopup" class="hanachal-success-popup" role="dialog" aria-modal="true" aria-live="polite" style="position:fixed;inset:0;z-index:9999;display:none;align-items:center;justify-content:center;padding:24px;background:rgba(29,29,27,.78);">' +
                '<div class="hanachal-success-popup__panel" style="width:min(560px,100%);position:relative;padding:48px 38px 42px;text-align:center;color:#C7C3AC;background:#1d1d1b;border:1px solid #C7C3AC;border-radius:6px;">' +
                    '<button type="button" class="hanachal-success-popup__close" aria-label="Close success message" style="position:absolute;top:14px;right:18px;z-index:1;width:34px;height:34px;padding:0;border:0;border-radius:50%;color:#C7C3AC;background:transparent;font-size:2rem;line-height:1;cursor:pointer;">' +
                        '<svg class="hanachal-success-popup__close-icon" aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" focusable="false">' +
                            '<path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"></path>' +
                        '</svg>' +
                    '</button>' +
                    '<p class="hanachal-success-popup__eyebrow" style="margin:0 0 14px;color:#7D776F;font-size:.75rem;font-weight:300;text-transform:uppercase;letter-spacing:.09em;">Message received</p>' +
                    '<p class="hanachal-success-popup__message" style="max-width:430px;margin:0 auto;color:#C7C3AC;font-family:Chassi-M,serif;font-size:1.45rem;font-weight:300;line-height:1.35;"></p>' +
                '</div>' +
            '</div>'
        );

        $("#hanachalSuccessPopup").on("click", function (e) {
            if (e.target.id === "hanachalSuccessPopup") {
                hideSuccessPopup();
            }
        });

        $(".hanachal-success-popup__close").on("click", hideSuccessPopup);
    }

    function showSuccessPopup(message) {
        ensureSuccessPopup();
        $("#hanachalSuccessPopup .hanachal-success-popup__message").text(message);
        $("#hanachalSuccessPopup").addClass("is-visible").css("display", "flex");
    }

    function hideSuccessPopup() {
        $("#hanachalSuccessPopup").removeClass("is-visible").css("display", "none");
    }

    function isValidEmail(email) {
        return /^\S+@\S+\.\S+$/.test(email);
    }

    function showAlert(target, type, message) {
        $(target).html('<div class="alert alert-' + type + '">' + message + '</div>');
    }

    function showInlineError(target, message) {
        $(target).html('<span style="color:red; font-size: .875rem; font-weight: 100;">' + message + '</span>');
    }

    function getLoader() {
        const loaderEl = document.getElementById("loaderModal");

        if (!loaderEl || typeof bootstrap === "undefined") {
            return null;
        }

        return new bootstrap.Modal(loaderEl);
    }

    function submitToWeb3Forms(data) {
        return fetch(CONTACT_FORM_ENDPOINT, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(function (response) {
            if (!response.ok) {
                throw new Error("Form submission failed");
            }

            return response.json().catch(function () {
                return {
                    success: true
                };
            }).then(function (result) {
                if (result.success === false) {
                    throw new Error(result.message || "Form submission failed");
                }

                return result;
            });
        });
    }

    function submitToMake(data) {
        const payload = new URLSearchParams();

        Object.keys(data).forEach(function (key) {
            payload.append(key, data[key]);
        });

        return fetch(NEWSLETTER_ENDPOINT, {
            method: "POST",
            mode: "no-cors",
            body: payload
        });
    }

    $("#contact_form").submit(function (e) {
        e.preventDefault();

        $(".error").html("");
        $("#responseMsg").html("");

        let first_name = $("#first_name").val().trim();
        let last_name = $("#last_name").val().trim();
        let phone = $("#phone").val().trim();
        let email = $("#email").val().trim();
        let msg = $("#msg").val().trim();
        let news = $("#formCheckDefault").is(":checked") ? "Yes" : "No";
        let valid = true;

        if (first_name == "") {
            $("#first_name_error").html("First name is required");
            valid = false;
        }

        if (last_name == "") {
            $("#last_name_error").html("Last name is required");
            valid = false;
        }

        if (phone == "") {
            $("#phone_error").html("Phone number is required");
            valid = false;
        } else if (!/^[0-9]{10}$/.test(phone)) {
            $("#phone_error").html("Enter valid 10 digit mobile number");
            valid = false;
        }

        if (email == "") {
            $("#email_error").html("Email is required");
            valid = false;
        } else if (!isValidEmail(email)) {
            $("#email_error").html("Enter valid email address");
            valid = false;
        }

        if (!valid) {
            return false;
        }

        const loader = getLoader();

        if (loader) {
            loader.show();
        }

        const contactSubmittedAt = new Date().toISOString();

        submitToWeb3Forms({
            access_key: WEB3FORMS_ACCESS_KEY,
            subject: "New Contact Form Enquiry",
            from_name: "Hanachal Website",
            form_type: "Contact Form",
            first_name: first_name,
            last_name: last_name,
            phone: phone,
            email: email,
            message: msg,
            newsletter_preference: news,
            source_page: window.location.href,
            submitted_at: contactSubmittedAt
        }).then(function () {
            if (news == "Yes") {
                submitToMake({
                    form_type: "contact_newsletter_opt_in",
                    email: email,
                    first_name: first_name,
                    last_name: last_name,
                    phone: phone,
                    source_page: window.location.href,
                    submitted_at: contactSubmittedAt
                });
            }

            if (loader) {
                loader.hide();
            }

            showSuccessPopup(successMessage);
            $("#contact_form")[0].reset();
        }).catch(function () {
            if (loader) {
                loader.hide();
            }

            showAlert("#responseMsg", "danger", "Something went wrong. Please try again.");
        });
    });

    $("#newsletterForm").submit(function (e) {
        e.preventDefault();

        const email = $("#email_id").val().trim();
        $("#result").html("");

        if (email == "") {
            showInlineError("#result", "Email is required");
            return false;
        }

        if (!isValidEmail(email)) {
            showInlineError("#result", "Enter valid email address");
            return false;
        }

        submitToMake({
            form_type: "newsletter_signup",
            email: email,
            source_page: window.location.href,
            submitted_at: new Date().toISOString()
        }).then(function () {
            $("#newsletterForm")[0].reset();
            showSuccessPopup(successMessage);
        }).catch(function () {
                showInlineError("#result", "Something went wrong. Please try again.");
        });
    });
});
