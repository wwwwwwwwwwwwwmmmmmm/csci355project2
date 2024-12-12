<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve form data
    $firstName = htmlspecialchars($_POST['firstName']);
    $lastName = htmlspecialchars($_POST['lastName']);
    $email = htmlspecialchars($_POST['email']);
    $message = htmlspecialchars($_POST['message']);

    // Email recipient
    $to = "bd017610@gmail.com";
    $subject = "New Contact Us Form Submission";

    // Compose the email body
    $body = "You have received a new message from the contact form:\n\n".
            "First Name: $firstName\n".
            "Last Name: $lastName\n".
            "Email: $email\n".
            "Message:\n$message";

    // Email headers
    $headers = "From: $email";

    // Send the email
    if (mail($to, $subject, $body, $headers)) {
        echo "Message sent successfully!";
    } else {
        echo "Message failed to send.";
    }
}
?>
