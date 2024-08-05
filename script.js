function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + (days*24*60*60*1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function getIMCParameter() {
  const urlParams = new URLSearchParams(window.location.search);
  const calculoimc = urlParams.get('calculoimc');
  
  if (calculoimc) {
    setCookie('calculoimc', calculoimc, 1);
  }
  
  return calculoimc || getCookie('calculoimc');
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

  // Captura o parâmetro calculoimc
  const calculoimc = getIMCParameter();

  // Preparar dados para envio
  const requestData = {
    email: email,
    whatsapp: whatsapp,
    calculoimc: calculoimc // Adiciona o parâmetro calculoimc aos dados
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
    // Redirecionar para a próxima página com o parâmetro calculoimc
    window.location.href = `https://www.google.com?calculoimc=${encodeURIComponent(calculoimc)}`;
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
