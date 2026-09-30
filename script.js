document.addEventListener('DOMContentLoaded', () => {
  // Elementos do DOM
  const inputPassword = document.getElementById('inputPassword');
  const methodSelect = document.getElementById('methodSelect');
  const saltInput = document.getElementById('saltInput');
  const btnProcess = document.getElementById('btnProcess');
  const btnRandom = document.getElementById('btnRandom');
  const btnClear = document.getElementById('btnClear');
  const btnCopy = document.getElementById('btnCopy');
  
  const resultCard = document.getElementById('resultCard');
  const stepsCard = document.getElementById('stepsCard');
  const finalOutput = document.getElementById('finalOutput');
  const stepsTimeline = document.getElementById('stepsTimeline');
  const stepCount = document.getElementById('stepCount');

  // Eventos
  btnProcess.addEventListener('click', processCode);
  btnRandom.addEventListener('click', generateRandomInput);
  btnClear.addEventListener('click', () => {
    inputPassword.value = '';
    resultCard.classList.add('hidden');
    stepsCard.classList.add('hidden');
  });

  btnCopy.addEventListener('click', () => {
    navigator.clipboard.writeText(finalOutput.innerText);
    const originalText = btnCopy.innerHTML;
    btnCopy.innerHTML = `<i data-lucide="check"></i> Copiado!`;
    lucide.createIcons();
    setTimeout(() => {
      btnCopy.innerHTML = originalText;
      lucide.createIcons();
    }, 2000);
  });

  // Função Principal
  function processCode() {
    const rawInput = inputPassword.value.trim();
    const method = methodSelect.value;
    const salt = saltInput.value.trim() || '@salt';

    if (!rawInput) {
      alert('Por favor, digite uma senha ou código primeiro!');
      return;
    }

    let steps = [];
    let finalCode = '';

    // Seleciona o algoritmo com base no método escolhido
    switch (method) {
      case 'cyber':
        ({ finalCode, steps } = algorithmCyberSafe(rawInput, salt));
        break;
      case 'caesar':
        ({ finalCode, steps } = algorithmCaesar(rawInput));
        break;
      case 'base64':
        ({ finalCode, steps } = algorithmBase64(rawInput, salt));
        break;
      case 'leetspeak':
        ({ finalCode, steps } = algorithmLeet(rawInput));
        break;
    }

    // Exibe resultados na tela
    finalOutput.innerText = finalCode;
    renderSteps(steps);

    resultCard.classList.remove('hidden');
    stepsCard.classList.remove('hidden');
  }

  // --- Algoritmo 1: Cyber Safe ---
  function algorithmCyberSafe(input, salt) {
    const steps = [];
    
    // Passo 1: Entrada
    steps.push({
      title: '1. Recebimento da Entrada',
      desc: 'Obtenção do texto original digitado pelo usuário.',
      code: input
    });

    // Passo 2: Aplicação do Salt
    const salted = `${salt}_${input}_${salt}`;
    steps.push({
      title: '2. Aplicação do Sal (Salt)',
      desc: 'Adição de caracteres de sal no início e fim para prevenir ataques de dicionário.',
      code: salted
    });

    // Passo 3: Substituição Leet
    const leetMap = { 'a': '@', 'e': '3', 'i': '1', 'o': '0', 's': '$', 't': '7' };
    const leetStr = salted.split('').map(c => leetMap[c.toLowerCase()] || c).join('');
    steps.push({
      title: '3. Substituição de Caracteres Especiais',
      desc: 'Conversão de vogais e letras comuns em caracteres especiais e números.',
      code: leetStr
    });

    // Passo 4: Inversão de Fragmentos
    const reversedStr = leetStr.split('').reverse().join('');
    steps.push({
      title: '4. Inversão do Texto',
      desc: 'Inversão completa da cadeia de caracteres para desfazer padrões lineares.',
      code: reversedStr
    });

    // Passo 5: Hash/Simulação de Digest em Hexadecimal
    let hash = 0;
    for (let i = 0; i < reversedStr.length; i++) {
      hash = (hash << 5) - hash + reversedStr.charCodeAt(i);
      hash |= 0;
    }
    const finalHex = Math.abs(hash).toString(16).padStart(8, '0');
    const finalResult = `SEC#${reversedStr.substring(0, 8)}_${finalHex}`;

    steps.push({
      title: '5. Geração de Hash & Assinatura Final',
      desc: 'Cálculo do valor Hash (checksum) e formatação final de alta segurança.',
      code: finalResult
    });

    return { finalCode: finalResult, steps };
  }

  // --- Algoritmo 2: Cifra de César ---
  function algorithmCaesar(input) {
    const steps = [];
    const shift = 3;

    steps.push({
      title: '1. Texto Original',
      desc: 'Entrada inicial recebida.',
      code: input
    });

    const shiftedChars = input.split('').map(char => {
      const code = char.charCodeAt(0);
      return String.fromCharCode(code + shift);
    });

    steps.push({
      title: '2. Deslocamento ASCII (+3)',
      desc: 'Cada caractere é movido 3 posições à frente na tabela ASCII.',
      code: shiftedChars.join('')
    });

    const base64Version = btoa(shiftedChars.join(''));
    steps.push({
      title: '3. Codificação da Cifra em Base64',
      desc: 'Representação final dos caracteres deslocados em codificação legível.',
      code: base64Version
    });

    return { finalCode: base64Version, steps };
  }

  // --- Algoritmo 3: Base64 Complexo ---
  function algorithmBase64(input, salt) {
    const steps = [];

    steps.push({ title: '1. Texto Original', desc: 'Entrada sem alterações.', code: input });

    const step1 = btoa(input);
    steps.push({ title: '2. Primeira Camada (Base64)', desc: 'Conversão primária em formato Base64.', code: step1 });

    const step2 = `${salt}:${step1}`;
    steps.push({ title: '3. Injeção de Prefixos (Salt)', desc: 'Junção da chave de sal com o Base64.', code: step2 });

    const step3 = btoa(step2);
    steps.push({ title: '4. Segunda Camada (Base64 Duplo)', desc: 'Re-codificação do conjunto completo.', code: step3 });

    return { finalCode: step3, steps };
  }

  // --- Algoritmo 4: Leet Speak ---
  function algorithmLeet(input) {
    const steps = [];

    steps.push({ title: '1. Texto Original', desc: 'Entrada inicial.', code: input });

    const map = { 'a':'4', 'b':'8', 'e':'3', 'g':'6', 'i':'1', 'o':'0', 's':'5', 't':'7' };
    const leet = input.toLowerCase().split('').map(c => map[c] || c).join('');
    steps.push({ title: '2. Conversão LeetSpeak', desc: 'Mapeamento de letras por números parecidos.', code: leet });

    const hex = leet.split('').map(c => c.charCodeAt(0).toString(16)).join('-');
    steps.push({ title: '3. Conversão Hexadecimal', desc: 'Representação de cada caractere em Bytes Hex.', code: hex });

    return { finalCode: hex, steps };
  }

  // Renderiza a Timeline
  function renderSteps(steps) {
    stepsTimeline.innerHTML = '';
    stepCount.innerText = `${steps.length} Etapas`;

    steps.forEach((step, index) => {
      const stepEl = document.createElement('div');
      stepEl.className = 'step-item';
      stepEl.setAttribute('data-step', index + 1);

      stepEl.innerHTML = `
        <div class="step-title">${step.title}</div>
        <div class="step-desc">${step.desc}</div>
        <div class="step-code">${escapeHtml(step.code)}</div>
      `;

      stepsTimeline.appendChild(stepEl);
    });

    lucide.createIcons();
  }

  function generateRandomInput() {
    const samplePasswords = ['SenhaSuperSegura123!', 'DevGitHub#2026', 'codigo_secreto_x', 'AdminPass@987'];
    const random = samplePasswords[Math.floor(Math.random() * samplePasswords.length)];
    inputPassword.value = random;
    processCode();
  }

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
});
