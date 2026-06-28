<?php

header('Content-Type: application/json');

$email = trim($_POST['email'] ?? '');

if(empty($email))
{
    echo json_encode([
        "status"=>"error",
        "message"=>"Email Required"
    ]);
    exit;
}

$apiToken = "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjY3NDI2Mjg3NywiYWFpIjoxMSwidWlkIjoxMDY0NTI0NDQsImlhZCI6IjIwMjYtMDYtMjNUMTE6NTI6MDkuMDAwWiIsInBlciI6Im1lOndyaXRlIiwiYWN0aWQiOjM1NzE1MTY2LCJyZ24iOiJhcHNlMiJ9.ggPuOnkV1vAFgpULwNcWpnSFOvNzxzAzMeVfLrV89zA";
$boardId  = 5029432493;

$query = '
mutation {
  create_item(
    board_id: '.$boardId.',
    item_name: "'.$email.'",
    column_values: "{\\"text_mm4k2744\\":\\"'.$email.'\\"}"
  ) {
    id
  }
}
';

$ch = curl_init();

curl_setopt_array($ch, [
    CURLOPT_URL => "https://api.monday.com/v2",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        "Authorization: ".$apiToken,
        "Content-Type: application/json"
    ],
    CURLOPT_POSTFIELDS => json_encode([
        "query" => $query
    ])
]);

$response = curl_exec($ch);

curl_close($ch);

$result = json_decode($response,true);

if(isset($result['data']['create_item']['id']))
{
    echo json_encode([
        "status"=>"success"
    ]);
}
else
{
    echo json_encode([
        "status"=>"error",
        "message"=>$response
    ]);
}
?>
