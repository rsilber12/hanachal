$(document).ready(function () {
    const CONTACT_FORM_ENDPOINT = "https://api.web3forms.com/submit";
    const WEB3FORMS_ACCESS_KEY = "e9455987-9a4c-43f9-b5f2-a526143b7227";

    const successMessage = "Thank you for your interest in Hanachal Residences. We've received your submission and our team will be in touch shortly.";

    function ensureSuccessPopup() {
        if ($("#hanachalSuccessPopup").length) {
            return;
        }

        $("body").append(
            '<div id="hanachalSuccessPopup" class="hanachal-success-popup" role="dialog" aria-modal="true" aria-live="polite">' +
                '<div class="hanachal-success-popup__panel">' +
                    '<button type="button" class="hanachal-success-popup__close" aria-label="Close success message">' +
                        '<span aria-hidden="true">&times;</span>' +
                    '</button>' +
                    '<p class="hanachal-success-popup__eyebrow">Message received</p>' +
                    '<p class="hanachal-success-popup__message"></p>' +
                    '<button type="button" class="btn btn1 hanachal-success-popup__button">Close</button>' +
                '</div>' +
            '</div>'
        );

        $("#hanachalSuccessPopup").on("click", function (e) {
            if (e.target.id === "hanachalSuccessPopup") {
                hideSuccessPopup();
            }
        });

        $(".hanachal-success-popup__close").on("click", hideSuccessPopup);
        $(".hanachal-success-popup__button").on("click", hideSuccessPopup);
    }

    function showSuccessPopup(message) {
        ensureSuccessPopup();
        $("#hanachalSuccessPopup .hanachal-success-popup__message").text(message);
        $("#hanachalSuccessPopup").addClass("is-visible");
    }

    function hideSuccessPopup() {
        $("#hanachalSuccessPopup").removeClass("is-visible");
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
                return {};
            }).then(function (result) {
                if (result.success === false) {
                    throw new Error(result.message || "Form submission failed");
                }

                return result;
            });
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
            submitted_at: new Date().toISOString()
        }).then(function () {
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

        $.ajax({
            url: "signup.php",
            type: "POST",
            data: {
                email: email
            },
            dataType: "json",
            success: function (res) {
                if (res.status == "success") {
                    $("#newsletterForm")[0].reset();
                    showSuccessPopup(successMessage);
                } else {
                    showInlineError("#result", res.message);
                }
            },
            error: function () {
                showInlineError("#result", "Something went wrong. Please try again.");
            }
        });
    });
});
