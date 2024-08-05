function getAllUTMParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  const params = {};
  
  urlParams.forEach((value, key) => {
    if (key.startsWith('utm_') || key === 'calculoimc') {
      params[key] = value;
    }
  });
  
  return params;
}

document.getElementById('emailForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const email = document.getElementById('emailInput').value;
  const whatsapp = document.getElementById('whatsappInput').value;
  const privacyChecked = document.getElementById('privacyPolicyCheckbox').checked;

  // Validar email
  if (!email.includes('@')) {
    alert('Por favor, insira um endereço de email válido.');
    return;
  }

  // Validar número do WhatsApp
  const whatsappDigits = whatsapp.replace(/\D/g, ''); // Remove caracteres não numéricos
  if (whatsappDigits.length < 10 || whatsappDigits.length > 11) {
    alert('Por favor, insira um número de WhatsApp válido com exatamente 10 ou 11 dígitos.');
    return;
  }

  // Verificar se o usuário concorda com a política de privacidade
  if (!privacyChecked) {
    alert('Você deve concordar com a política de privacidade para continuar.');
    return;
  }

  // Captura todos os parâmetros UTM
  const utmParameters = getAllUTMParameters();

  // Preparar dados para envio
  const requestData = {
    email: email,
    whatsapp: whatsapp,
    ...utmParameters // Adiciona todos os parâmetros UTM aos dados
  };

  // Enviar dados
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
    // Construir a URL de redirecionamento com todos os parâmetros UTM
    const queryParams = new URLSearchParams(utmParameters).toString();
    window.location.href = `https://www.google.com?${queryParams}`;
  })
  .catch((error) => {
    console.error('Error:', error);
  });
});

document.getElementById('whatsappInput').addEventListener('input', function(event) {
  let value = event.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
  if (value.length > 11) value = value.slice(0, 11); // Limite de 11 dígitos
  if (value.length > 2) {
    value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
  } else {
    value = `(${value}`;
  }
  event.target.value = value;
});
