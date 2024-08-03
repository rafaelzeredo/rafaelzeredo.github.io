// JavaScript code for your portfolio website

// Example function for handling form submission
function handleFormSubmission(event) {
    event.preventDefault();
    const category = document.getElementById('category').value;
    const name = document.querySelector('input[name="name"]').value;
    const email = document.querySelector('input[name="email"]').value;
    const message = document.querySelector('textarea[name="message"]').value;

    //check if all forms are filled
    if (!categoory || !name || !email || !message) {
        alert('Please fill in all fields.');
        return;
    }

    const emailParams = {
        category: category,
        name: name,
        email: email,
        message: message
    };

    // Example of console logging form data
    console.log(`Category: ${category}, Name: ${name}, Email: ${email}, Message: ${message}`);

    emailjs.send("service_category_message", "template_8agfk2i", emailParams)
        .then(function(response) {
            console.log('Email Sent!', response.status, response.text);
            alert('Your message has been sent sucessfully!');
    document.querySelector('form').reset(); // Reset form after successfull submission
        }, function(error) {
            console.error('Error sending email: ', error);
            alert('Oops! An error occurred while sending your message.');
        });

    // Replace with your form submission logic or API call
    // For demonstration purposes, it logs the form data to the console
    //alert('Message sent! Check the console for form data.');
}

// Event listener for form submission
document.querySelector('form').addEventListener('submit', handleFormSubmission);