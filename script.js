// JavaScript code for your portfolio website ha!

// Example function for handling form submission
function sendEmail() {
    let parms = {
        category : document.getElementById('category').value,
        name : document.getElementById("name").value,
        email : document.getElementById("email").value,
        message : document.getElementById("message").value,
    }
    

    // Check if all fields are filled
    if (!category || !name || !email || !message) {
        alert('Please fill in all fields.');
        return;
    }


    // Example of console logging form data
    //console.log(`Category: ${category}, Name: ${name}, Email: ${email}, Message: ${message}`);

    emailjs.send("service_category_message","template_7sw68o6", parms).then(alert("Email Sent!"))

    //emailjs.send("service_z1qo3s9", "template_7sw68o6", parms)
        //.then(function(response) {
        //    console.log('Email Sent!', response.status, response.text);
        //    alert('Your message has been sent successfully!');
        //    document.querySelector('form').reset(); // Reset form after successful submission
        //}, function(error) {
        //    console.error('Error sending email: ', error);
        //    alert('Oops! An error occurred while sending your message.');
        //});

    // Replace with your form submission logic or API call
    // For demonstration purposes, it logs the form data to the console
    //alert('Message sent! Check the console for form data.');
}

// Event listener for form submission
//document.querySelector('form').addEventListener('submit', handleFormSubmission);

// Initialize EmailJS
//(function() {
//    emailjs.init("EJ0BgB3ON9MWWu40s");
//})();