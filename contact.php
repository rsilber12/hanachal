<?php

header('Content-Type: application/json');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'phpmailer/src/Exception.php';
require 'phpmailer/src/PHPMailer.php';
require 'phpmailer/src/SMTP.php';

if($_SERVER['REQUEST_METHOD'] != 'POST')
{
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid request.'
    ]);
    exit;
}

$first_name = trim($_POST['first_name'] ?? '');
$last_name  = trim($_POST['last_name'] ?? '');
$phone      = trim($_POST['phone'] ?? '');
$email      = trim($_POST['email'] ?? '');
$msg        = trim($_POST['msg'] ?? '');
$news        = $_POST['news'];

if(empty($first_name))
{
    echo json_encode([
        'status'=>'error',
        'message'=>'First name required.'
    ]);
    exit;
}

if(empty($last_name))
{
    echo json_encode([
        'status'=>'error',
        'message'=>'Last name required.'
    ]);
    exit;
}

if(empty($phone) || !preg_match('/^[0-9]{10}$/', $phone))
{
    echo json_encode([
        'status'=>'error',
        'message'=>'Valid phone number required.'
    ]);
    exit;
}

if(empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL))
{
    echo json_encode([
        'status'=>'error',
        'message'=>'Valid email required.'
    ]);
    exit;
}

$messageSection = '';

if(!empty(trim($msg)))
{
    $messageSection = '

    <div style="
    margin-top:25px;
    background:#eff6ff;
    border-left:4px solid #2563eb;
    padding:20px;
    border-radius:8px;
    ">

        <h3 style="margin-top:0;color:#1e3a8a;">
            Customer Message
        </h3>

        <p style="
        margin:0;
        line-height:28px;
        color:#374151;
        white-space:pre-line;
        ">
            '.nl2br(htmlspecialchars($msg)).'
        </p>

    </div>';

}
$newsText = ($news == 'Yes')
    ? 'Subscribed to Updates'
    : 'Not Subscribed';

$mailBody = '
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Contact Enquiry</title>
</head>

<body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:30px 0;">

<tr>
<td align="center">

<table width="650" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 5px 20px rgba(0,0,0,0.08);">

<!-- HEADER -->
<tr>
<td style="background:#0f172a;padding:30px;text-align:center;">

<img src="https://dev-zilla.com/projects/hanachal/images/logo.png" alt="logo" style="max-height:70px;">

</td>
</tr>

<!-- BODY -->
<tr>
<td style="padding:40px;">

<h2 style="margin-top:0;color:#111827;">
Hello Admin,
</h2>

<p style="color:#6b7280;font-size:15px;line-height:26px;">
A new enquiry has been received from your website.
Please review the submitted details below.
</p>

<!-- USER INFO -->

<div style="
background:#f8fafc;
border:1px solid #e5e7eb;
border-radius:10px;
padding:20px;
margin-top:25px;
">

<p style="margin:0 0 15px;">
<strong>First Name:</strong><br>
'.$first_name.'
</p>

<p style="margin:0 0 15px;">
<strong>Last Name:</strong><br>
'.$last_name.'
</p>

<p style="margin:0 0 15px;">
<strong>Email Address:</strong><br>
'.$email.'
</p>

<p style="margin:0 0 15px;">
<strong>Phone Number:</strong><br>
'.$phone.'
</p>

<p style="margin:0 0 15px;">
<strong>Newsletter Preference:</strong><br>
'.$newsText.'
</p>

</div>

'.$messageSection.'

<!-- DATE -->

<p style="
margin-top:30px;
font-size:14px;
color:#9ca3af;
">
Received On: '.date("d M Y h:i A").'
</p>

</td>
</tr>

<!-- FOOTER -->

<tr>
<td style="
background:#111827;
padding:25px;
text-align:center;
">

<p style="
margin:0;
color:#d1d5db;
font-size:14px;
">
© '.date('Y').' Hanachal
</p>

<p style="
margin-top:8px;
color:#9ca3af;
font-size:12px;
">
This email was automatically generated from the website contact form.
</p>

</td>
</tr>

</table>

</td>
</tr>

</table>

</body>
</html>

';

try {

    $mail = new PHPMailer(true);

    $mail->isSMTP();
    $mail->Host = "smtp.gmail.com";
    $mail->SMTPAuth = true;

    $mail->Username = "primo.deepakpatel@gmail.com";
    $mail->Password = "lfod yqzo nxyf pxqh";

    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;

    $mail->setFrom("hanachalweb@gmail.com","Hanachal");

    $mail->addAddress("hanachalweb@gmail.com");

    $mail->isHTML(true);
    $mail->Subject = "New Contact Form Enquiry";
    $mail->Body = $mailBody;

    $mail->send();

    echo json_encode([
        'status'=>'success',
        'message'=>'Thank you for your interest in Hanachal Residences. We’ve received your submission and our team will be in touch shortly.'
    ]);

} catch (Exception $e) {

    echo json_encode([
        'status'=>'error',
        'message'=>'Mail sending failed. '.$mail->ErrorInfo
    ]);
}