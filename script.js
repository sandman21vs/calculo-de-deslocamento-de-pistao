const form = document.getElementById('calcForm');
const resultContainer = document.getElementById('resultado');
const shareButton = document.getElementById('shareButton');
const shareWhatsAppButton = document.getElementById('shareWhatsAppButton');

let shareMessage = '';

const formatNumber = (value, decimals = 2) =>
  new Intl.NumberFormat('pt-BR', { maximumFractionDigits: decimals }).format(
    value
  );

const setShareState = (message) => {
  shareMessage = message;
  const isDisabled = !message;
  shareButton.disabled = isDisabled;
  shareWhatsAppButton.disabled = isDisabled;
};

const showError = (message) => {
  resultContainer.innerHTML = `<p>${message}</p>`;
  setShareState('');
};

const calcular = () => {
  const data = new FormData(form);
  const tamanhoPistao = parseFloat(data.get('tamanhoPistao'));
  const cursoPercent = parseFloat(data.get('cursoPercent'));
  const repsSeg = parseFloat(data.get('repsSeg'));
  const tempoDiaMin = parseFloat(data.get('tempoDia'));
  const vezesSemana = parseFloat(data.get('vezesSemana'));
  const tempoValor = parseFloat(data.get('tempoValor'));
  const tempoUnidade = data.get('tempoUnidade');

  if (
    [
      tamanhoPistao,
      cursoPercent,
      repsSeg,
      tempoDiaMin,
      vezesSemana,
      tempoValor,
    ].some((value) => Number.isNaN(value) || value <= 0)
  ) {
    showError('Verifique se todos os campos estão preenchidos com valores válidos.');
    return;
  }

  const cursoCm = tamanhoPistao * (cursoPercent / 100);
  const distanciaPorRepeticaoCm = 2 * cursoCm;
  const tempoDiaSeg = tempoDiaMin * 60;
  const tempoSemanaSeg = tempoDiaSeg * vezesSemana;

  let semanasTotais = tempoValor * 52;
  if (tempoUnidade === 'meses') {
    semanasTotais = tempoValor * 4.345;
  }

  const tempoTotalSeg = tempoSemanaSeg * semanasTotais;
  const totalRepeticoes = repsSeg * tempoTotalSeg;
  const distanciaTotalCm = distanciaPorRepeticaoCm * totalRepeticoes;
  const distanciaTotalM = distanciaTotalCm / 100;
  const distanciaTotalKm = distanciaTotalM / 1000;

  const tempoValorFormatado = formatNumber(tempoValor);
  const tempoLabel =
    tempoUnidade === 'anos'
      ? `${tempoValorFormatado} ${tempoValor === 1 ? 'ano' : 'anos'}`
      : `${tempoValorFormatado} ${tempoValor === 1 ? 'mês' : 'meses'}`;

  resultContainer.innerHTML = `
    <div class="metrics-grid">
      <div class="metric">
        <p class="metric__label">Curso efetivo</p>
        <p class="metric__value">${formatNumber(cursoCm)} cm</p>
      </div>
      <div class="metric">
        <p class="metric__label">Distância por ciclo</p>
        <p class="metric__value">${formatNumber(distanciaPorRepeticaoCm)} cm</p>
      </div>
      <div class="metric">
        <p class="metric__label">Total de repetições</p>
        <p class="metric__value">${formatNumber(totalRepeticoes, 0)}</p>
      </div>
    </div>
    <p class="result-highlight">
      Distância total percorrida: <strong>${formatNumber(distanciaTotalKm)} km</strong>
    </p>
    <ul class="result-details">
      <li>Equivalente a ${formatNumber(distanciaTotalM)} metros.</li>
      <li>${formatNumber(distanciaTotalCm)} centímetros no total.</li>
      <li>Operação considerada durante ${tempoLabel}.</li>
    </ul>
  `;

  const jokeText = `Meu ultimo carro so encarou ${formatNumber(
    tempoDiaMin
  )} min por dia e ${formatNumber(
    vezesSemana
  )}x por semana, jurando que era corrida maluca. Esse pistao virou rato de academia e rodou ${formatNumber(
    distanciaTotalKm
  )} km em ${tempoLabel}. Tempo de funcionamento mais organizado que minha agenda haha`;
  const tweetText = `${jokeText} Venha ver como tá a sua lata velha: ${window.location.href}`;
  setShareState(tweetText);
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
  calcular();
});

form.addEventListener('input', () => setShareState(''));

shareButton.addEventListener('click', () => {
  if (!shareMessage) {
    return;
  }

  const shareUrl = new URL('https://twitter.com/intent/tweet');
  shareUrl.searchParams.set('text', shareMessage);
  window.open(shareUrl.toString(), '_blank', 'noopener,noreferrer');
});

shareWhatsAppButton.addEventListener('click', () => {
  if (!shareMessage) {
    return;
  }

  const shareUrl = new URL('https://api.whatsapp.com/send');
  shareUrl.searchParams.set('text', shareMessage);
  window.open(shareUrl.toString(), '_blank', 'noopener,noreferrer');
});

calcular();


