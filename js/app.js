/**
 * Controlador Principal do App
 * Navegação entre telas, dicas e mensagens com humor brasileiro
 */

// ========== NAVEGAÇÃO ==========

function trocarTela(telaId) {
    document.querySelectorAll('.tela').forEach(t => t.classList.remove('ativa'));
    const tela = document.getElementById(telaId);
    if (tela) tela.classList.add('ativa');
}

function voltarInicio() {
    estadoJogo.jogoEmAndamento = false;
    document.getElementById('modal-fim').classList.add('escondido');
    trocarTela('tela-inicio');
}

function mostrarNiveis() {
    trocarTela('tela-niveis');
}

function mostrarRegras() {
    trocarTela('tela-regras');
}

function iniciarTutorial() {
    tutorialPassoAtual = 0;
    trocarTela('tela-tutorial');
    renderizarTutorial();
}

// ========== TABS DE REGRAS ==========

function trocarTab(tabId) {
    document.querySelectorAll('.tab-conteudo').forEach(t => t.classList.remove('ativa'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('ativa'));

    const tab = document.getElementById(`tab-${tabId}`);
    if (tab) tab.classList.add('ativa');

    // Encontra o botão correto
    const botoes = document.querySelectorAll('.tab-btn');
    botoes.forEach(btn => {
        if (btn.getAttribute('onclick')?.includes(tabId)) {
            btn.classList.add('ativa');
        }
    });
}

// ========== DICAS CONTEXTUAIS ==========

function getDicaMao(mao, vira) {
    const manilhas = mao.filter(c => c && ehManilha(c, vira));
    const temZap = manilhas.some(c => c.naipe === 'paus');
    const temCopeta = manilhas.some(c => c.naipe === 'copas');
    const cartas3 = mao.filter(c => c && c.valor === '3');
    const cartas2 = mao.filter(c => c && c.valor === '2');

    if (manilhas.length >= 2) {
        return '2 manilhas na mão! Pode pedir truco tranquilo!';
    }
    if (temZap) {
        return 'Você tem o Zap (♣)! A carta mais forte! Use com sabedoria.';
    }
    if (temCopeta) {
        return 'Copeta (♥) na mão! Só perde pro Zap!';
    }
    if (manilhas.length === 1) {
        return 'Uma manilha na mão. Guarde pra um momento importante!';
    }
    if (cartas3.length >= 2) {
        return 'Dois 3 na mão! São as cartas mais fortes (sem ser manilha).';
    }
    if (cartas3.length === 1 && cartas2.length >= 1) {
        return 'Um 3 e um 2 - mão razoável!';
    }
    if (mao.every(c => c && forcaCarta(c, vira) <= 4)) {
        return 'Cartas fracas... Considere blefar ou correr se trucarem!';
    }
    return 'Analise bem suas cartas antes de jogar!';
}

function getDicaTurno(maoJogador, cartaAdversario, vira) {
    const cartasVivas = maoJogador.filter(c => c !== null);
    if (cartasVivas.length === 0) return null;

    const forcaAdv = forcaCarta(cartaAdversario, vira);
    const cartasQueGanham = cartasVivas.filter(c => forcaCarta(c, vira) > forcaAdv);
    const cartaMinima = cartasQueGanham.sort((a, b) => forcaCarta(a, vira) - forcaCarta(b, vira))[0];

    if (cartasQueGanham.length === 0) {
        return 'Nenhuma carta sua ganha dessa... Jogue a mais fraca ou escondida!';
    }
    if (cartasQueGanham.length === cartasVivas.length) {
        return 'Todas suas cartas ganham! Jogue a mais fraca pra economizar.';
    }
    if (cartaMinima && ehManilha(cartaMinima, vira)) {
        return 'Só sua manilha ganha essa... Use se realmente precisa!';
    }
    return null;
}

// ========== MENSAGENS DE HUMOR ==========

const MENSAGENS_VITORIA = [
    'Você é o novo Rei do Boteco! 👑🍺',
    'Parabéns! Pode se aposentar do truco em alta! 🏆',
    'Isso aí, parceiro! O adversário nem viu de onde veio! 💪',
    'Manda esse currículo pro campeonato de truco! 📝',
    'Vitória! Agora vai lá contar vantagem no grupo do WhatsApp! 📱',
    'Trucou, venceu e ainda por cima com estilo! 😎',
    'O adversário vai precisar de terapia depois dessa! 🛋️',
    'CAMPEÃO! Pode pedir música no Fantástico! 🎵',
    'Você joga truco melhor que político faz promessa! 🃏',
    'Vitória! O pix do orgulho já caiu na sua conta! 💰'
];

const MENSAGENS_DERROTA = [
    'Não foi dessa vez... Mas o truco é assim: quem não arrisca, não petisca! 🤷',
    'Perdeu, mas perdeu de pé! Ninguém pode tirar isso de você! 💪',
    'O adversário teve sorte... MUITA sorte. Ano que vem a gente ganha! 📅',
    'Derrota é só a vitória tirando uma soneca. Bora de novo! 😤',
    'Calma, até Pelé perdeu jogo. Bora pra próxima! ⚽',
    'Perdeu no truco mas ganhou experiência! (isso ajuda? Não? Ok...) 😅',
    'O adversário tava com sorte demais... Suspeito! 🕵️',
    'Não se preocupa, a próxima rodada tá guardada pra você! 🍀',
    'Faz parte do aprendizado! O importante é não chorar na mesa! 😢',
    'Perdeu? Bota a culpa nas cartas, funciona toda vez! 🃏'
];

function getMensagemVitoria() {
    return MENSAGENS_VITORIA[Math.floor(Math.random() * MENSAGENS_VITORIA.length)];
}

function getMensagemDerrota() {
    return MENSAGENS_DERROTA[Math.floor(Math.random() * MENSAGENS_DERROTA.length)];
}

// ========== INICIALIZAÇÃO ==========

// Adiciona animação de entrada suave
document.addEventListener('DOMContentLoaded', () => {
    // Frases aleatórias para o menu
    const frases = [
        '"Quem não sabe blefar, não sabe viver!"',
        '"No truco, até o 4 pode ser campeão!"',
        '"Zap na mão, felicidade no coração!"',
        '"Correr é estratégia, não covardia!"',
        '"O melhor jogador é o que faz o outro correr!"',
        '"Truco: onde amizade e traição andam de mãos dadas!"',
        '"3 cartas, 1000 possibilidades!"',
        '"Se a vida te der cartas ruins, blefa!"',
        '"Quem tem Zap, tem tudo!"',
        '"No truco, a cara vale mais que a carta!"'
    ];

    const fraseEl = document.querySelector('.frase-efeito');
    if (fraseEl) {
        fraseEl.textContent = frases[Math.floor(Math.random() * frases.length)];
    }
});
