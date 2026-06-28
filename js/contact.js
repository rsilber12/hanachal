$(document).ready(function () {

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
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            $("#email_error").html("Enter valid email address");
            valid = false;
        }

        // if (msg == "") {
        //     $("#msg_error").html("Message is required");
        //     valid = false;
        // }

        if (!valid) {
            return false;
        }

        let loader = new bootstrap.Modal(document.getElementById('loaderModal'));
        loader.show();

        $.ajax({
            url: "contact.php",
            type: "POST",
            data: {
                first_name: first_name,
                last_name: last_name,
                phone: phone,
                email: email,
                msg: msg,
                news: news
            },
            dataType: "json",

            success: function (response) {

                loader.hide();

                if (response.status == "success") {

                    $("#responseMsg").html(
                        '<div class="alert alert-success">' +
                        response.message +
                        '</div>'
                    );

                    $("#contact_form")[0].reset();

                } else {

                    $("#responseMsg").html(
                        '<div class="alert alert-danger">' +
                        response.message +
                        '</div>'
                    );
                }
            },

            error: function () {

                loader.hide();

                $("#responseMsg").html(
                    '<div class="alert alert-danger">Something went wrong.</div>'
                );
            }
        });

    });

    $("#newsletterForm").submit(function(e){ e.preventDefault(); $.ajax({ url:"signup.php", type:"POST", data:{ email:$("#email_id").val() }, dataType:"json", success:function(res){ if(res.status=="success") { $("#newsletterForm")[0].reset(); alert("Thank you for your interest in Hanachal Residences. We’ve received your submission and our team will be in touch shortly."); } else { $("#result").html( "<span style='color:red; font-size: .875rem; font-weight: 100;'>"+res.message+"</span>" ); } } }); }); 

});