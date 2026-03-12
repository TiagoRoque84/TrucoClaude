/**
 * Sistema de Cartas do Truco Brasileiro
 * Baralho de 40 cartas (sem 8, 9, 10 e coringas)
 */

const NAIPES = {
    ouros: { simbolo: '♦', nome: 'Ouros', apelido: 'Pica-Fumo', cor: 'vermelha', forca: 1 },
    espadas: { simbolo: '♠', nome: 'Espadas', apelido: 'Espadilha', cor: 'preta', forca: 2 },
    copas: { simbolo: '♥', nome: 'Copas', apelido: 'Copeta', cor: 'vermelha', forca: 3 },
    paus: { simbolo: '♣', nome: 'Paus', apelido: 'Zap', cor: 'preta', forca: 4 }
};

const VALORES = {
    '4': { display: '4', forca: 1 },
    '5': { display: '5', forca: 2 },
    '6': { display: '6', forca: 3 },
    '7': { display: '7', forca: 4 },
    'Q': { display: 'Q', forca: 5 },
    'J': { display: 'J', forca: 6 },
    'K': { display: 'K', forca: 7 },
    'A': { display: 'A', forca: 8 },
    '2': { display: '2', forca: 9 },
    '3': { display: '3', forca: 10 }
};

// Ordem cíclica para determinar manilhas: a carta seguinte ao vira
const ORDEM_CICLICA = ['4', '5', '6', '7', 'Q', 'J', 'K', 'A', '2', '3'];

/**
 * Cria o baralho completo de 40 cartas
 */
function criarBaralho() {
    const baralho = [];
    for (const valorKey of Object.keys(VALORES)) {
        for (const naipeKey of Object.keys(NAIPES)) {
            baralho.push({
                valor: valorKey,
                naipe: naipeKey,
                id: `${valorKey}_${naipeKey}`
            });
        }
    }
    return baralho;
}

/**
 * Embaralha o baralho (Fisher-Yates)
 */
function embaralhar(baralho) {
    const copia = [...baralho];
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}

/**
 * Determina qual valor é a manilha baseado na carta virada (vira)
 */
function getValorManilha(vira) {
    const idx = ORDEM_CICLICA.indexOf(vira.valor);
    const proxIdx = (idx + 1) % ORDEM_CICLICA.length;
    return ORDEM_CICLICA[proxIdx];
}

/**
 * Verifica se uma carta é manilha
 */
function ehManilha(carta, vira) {
    return carta.valor === getValorManilha(vira);
}

/**
 * Calcula a força de uma carta considerando manilhas
 * Cartas normais: força do valor (1-10)
 * Manilhas: 11 + força do naipe (11-14, sendo paus=14 a mais forte)
 */
function forcaCarta(carta, vira) {
    if (ehManilha(carta, vira)) {
        return 10 + NAIPES[carta.naipe].forca; // 11, 12, 13, 14
    }
    return VALORES[carta.valor].forca;
}

/**
 * Compara duas cartas e retorna:
 * 1 se carta1 vence, -1 se carta2 vence, 0 se empate
 */
function compararCartas(carta1, carta2, vira) {
    const forca1 = forcaCarta(carta1, vira);
    const forca2 = forcaCarta(carta2, vira);

    if (forca1 > forca2) return 1;
    if (forca2 > forca1) return -1;
    return 0;
}

/**
 * Distribui as cartas para uma rodada
 * Retorna { maoJogador, maoAdversario, vira }
 */
function distribuirCartas() {
    let baralho = embaralhar(criarBaralho());
    const maoJogador = [baralho.pop(), baralho.pop(), baralho.pop()];
    const maoAdversario = [baralho.pop(), baralho.pop(), baralho.pop()];
    const vira = baralho.pop();

    return { maoJogador, maoAdversario, vira };
}

/**
 * Renderiza uma carta como HTML (frente)
 */
function renderizarCartaFrente(carta, vira, clicavel = false, indice = -1) {
    const naipeInfo = NAIPES[carta.naipe];
    const valorInfo = VALORES[carta.valor];
    const isManilha = ehManilha(carta, vira);
    const corClass = naipeInfo.cor === 'vermelha' ? 'carta-vermelha' : 'carta-preta';
    const manilhaClass = isManilha ? 'carta-manilha' : '';
    const clickAttr = clicavel ? `onclick="jogarCarta(${indice})"` : '';

    return `<div class="carta carta-frente ${corClass} ${manilhaClass}" ${clickAttr} data-indice="${indice}">
        <span class="carta-valor">${valorInfo.display}</span>
        <span class="carta-naipe">${naipeInfo.simbolo}</span>
    </div>`;
}

/**
 * Renderiza uma carta como HTML (costas)
 */
function renderizarCartaCostas() {
    return `<div class="carta carta-costas"></div>`;
}

/**
 * Renderiza uma carta escondida (jogada virada)
 */
function renderizarCartaEscondida() {
    return `<div class="carta carta-costas" style="opacity: 0.7;"></div>`;
}

/**
 * Retorna texto descritivo de uma carta
 */
function descreverCarta(carta) {
    return `${VALORES[carta.valor].display} de ${NAIPES[carta.naipe].nome}`;
}

/**
 * Avalia a qualidade de uma mão (usada pela IA e dicas)
 * Retorna um score de 0 a 100
 */
function avaliarMao(mao, vira) {
    let score = 0;
    let manilhas = 0;

    for (const carta of mao) {
        const forca = forcaCarta(carta, vira);
        if (ehManilha(carta, vira)) {
            manilhas++;
            score += 25; // Cada manilha vale 25
            if (carta.naipe === 'paus') score += 10; // Zap bonus
            if (carta.naipe === 'copas') score += 5; // Copeta bonus
        } else {
            // Cartas normais, escala de 1-10
            score += forca * 2;
        }
    }

    // Bonus por ter manilhas
    if (manilhas >= 2) score += 15;
    if (manilhas >= 3) score += 20;

    return Math.min(100, score);
}

/**
 * Classifica a qualidade de uma mão
 */
function classificarMao(mao, vira) {
    const score = avaliarMao(mao, vira);
    if (score >= 70) return { nivel: 'excelente', texto: 'Mão EXCELENTE! 🔥', cor: '#27ae60' };
    if (score >= 50) return { nivel: 'boa', texto: 'Mão boa! 👍', cor: '#f39c12' };
    if (score >= 30) return { nivel: 'media', texto: 'Mão mais ou menos... 😐', cor: '#e67e22' };
    return { nivel: 'ruim', texto: 'Mão fraca... 😬', cor: '#e74c3c' };
}
