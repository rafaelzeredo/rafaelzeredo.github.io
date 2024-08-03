// JavaScript code for your portfolio website

// Example function for handling form submission
function handleFormSubmission(event) {
    event.preventDefault();
    const category = document.getElementById('category').value;
    const name = document.querySelector('input[name="name"]').value;
    const email = document.querySelector('input[name="email"]').value;
    const message = document.querySelector('textarea[name="message"]').value;

    // Example of console logging form data
    console.log(`Category: ${category}, Name: ${name}, Email: ${email}, Message: ${message}`);

    // Replace with your form submission logic or API call
    // For demonstration purposes, it logs the form data to the console
    alert('Message sent! Check the console for form data.');
}

// Event listener for form submission
document.querySelector('form').addEventListener('submit', handleFormSubmission);