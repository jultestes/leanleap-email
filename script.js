function getIMCParameter() {
    const urlParams = new URLSearchParams(window.location.search);
    const calculoimc = urlParams.get('calculoimc');
    return calculoimc;
}

document.getElementById('emailForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('emailInput').value;
    const whatsapp = document.getElementById('whatsappInput').value;
    const privacyChecked = document.getElementById('privacyPolicyCheckbox').checked;

    // Validate email
    if (!email.includes('@')) {
        alert('Please enter a valid email address.');
        return;
    }

    // Validate WhatsApp number
    const whatsappDigits = whatsapp.replace(/\D/g, ''); // Remove non-numeric characters
    if (whatsappDigits.length < 10 || whatsappDigits.length > 11) {
        alert('Please enter a valid WhatsApp number with exactly 10 or 11 digits.');
        return;
    }

    // Check privacy policy agreement
    if (!privacyChecked) {
        alert('You must agree to the privacy policy to continue.');
        return;
    }

    // Get IMC parameter
    const calculoimc = getIMCParameter();

    // Prepare data for submission
    const requestData = {
        email: email,
        whatsapp: whatsapp,
        calculoimc: calculoimc  // Add calculoimc parameter to the data
    };

    // Submit data
    fetch('https://webhook.empreendimentosonfire.win/webhook/leanleapleads', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            // Redirect to Google with calculoimc parameter
            window.location.href = `https://www.google.com?calculoimc=${calculoimc}`;
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});

document.getElementById('whatsappInput').addEventListener('input', function (event) {
    let value = event.target.value.replace(/\D/g, ''); // Remove non-numeric characters
    if (value.length > 11) value = value.slice(0, 11); // Limit to 11 digits
    if (value.length > 2) {
        value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else {
        value = `(${value}`;
    }
    event.target.value = value;
});
