/**
 * Sistema de Tutorial Passo a Passo do Truco
 * Ensina todas as regras com humor brasileiro
 */

const PASSOS_TUTORIAL = [
    {
        titulo: '🎉 Bem-vindo ao Truco, Parceiro!',
        conteudo: `
            <p>Fala, meu consagrado! Preparado pra aprender o jogo de cartas mais <strong>raiz</strong> do Brasil?</p>
            <p>O Truco é mais que um jogo - é uma <strong>cultura</strong>! É aquele jogo que rola no churrasco, no bar, na família, e até na mesa do trabalho (quando o chefe não tá olhando 👀).</p>
            <div class="destaque">
                <strong>O que você vai aprender:</strong><br>
                • Como funciona o baralho<br>
                • Ordem de força das cartas<br>
                • O que são manilhas (as cartas mais fortes!)<br>
                • Como funciona uma rodada<br>
                • A arte de pedir TRUCO!<br>
                • Dicas pra virar um craque
            </div>
            <p class="humor">"No Brasil, quem não sabe jogar truco não pode se chamar de brasileiro completo!" 🇧🇷</p>
        `
    },
    {
        titulo: '🃏 O Baralho do Truco',
        conteudo: `
            <p>O Truco usa um <strong>baralho de 40 cartas</strong>. A gente tira fora as cartas 8, 9, 10 e os coringas. Ficam só as cartas "que importam"!</p>
            <p>As cartas que ficam são:</p>
            <div class="exemplo-cartas">
                <div class="mini-carta">4</div>
                <div class="mini-carta">5</div>
                <div class="mini-carta">6</div>
                <div class="mini-carta">7</div>
                <div class="mini-carta">Q</div>
                <div class="mini-carta">J</div>
                <div class="mini-carta">K</div>
                <div class="mini-carta">A</div>
                <div class="mini-carta">2</div>
                <div class="mini-carta">3</div>
            </div>
            <p>Cada uma dessas cartas existe nos <strong>4 naipes</strong>: ♦ Ouros, ♠ Espadas, ♥ Copas e ♣ Paus.</p>
            <p>Total: 10 valores × 4 naipes = <strong>40 cartas</strong></p>
            <div class="destaque">
                Cada jogador recebe <strong>3 cartas</strong> por rodada. Usa bem, porque é o que você tem pra trabalhar!
            </div>
            <p class="humor">"Com 3 cartas na mão e muita lábia, o brasileiro faz milagre!" 😂</p>
        `
    },
    {
        titulo: '📊 Ordem de Força das Cartas',
        conteudo: `
            <p>As cartas normais (sem contar as manilhas, que a gente já vai chegar lá) têm a seguinte ordem, da <strong>mais fraca</strong> pra <strong>mais forte</strong>:</p>
            <div class="exemplo-cartas">
                <div class="mini-carta" style="opacity:0.5">4</div>
                <div class="mini-carta" style="opacity:0.55">5</div>
                <div class="mini-carta" style="opacity:0.6">6</div>
                <div class="mini-carta" style="opacity:0.65">7</div>
                <div class="mini-carta" style="opacity:0.7">Q</div>
                <div class="mini-carta" style="opacity:0.75">J</div>
                <div class="mini-carta" style="opacity:0.8">K</div>
                <div class="mini-carta" style="opacity:0.85">A</div>
                <div class="mini-carta" style="opacity:0.9">2</div>
                <div class="mini-carta" style="font-weight:900">3</div>
            </div>
            <p>👆 Percebeu? O <strong>3 é a carta mais forte</strong> das cartas normais! Parece estranho, né? Mas é assim que funciona no Truco!</p>
            <div class="destaque">
                <strong>Macete:</strong> 4 é a mais fraca e 3 é a mais forte. O Ás (A) fica entre o K e o 2. Não confunda com outros jogos!
            </div>
            <p class="humor">"Se na vida o 4 é pouco e o 3 é demais, imagina no Truco!" 🤪</p>
        `
    },
    {
        titulo: '💪 Manilhas - As Cartas Mais Brabas!',
        conteudo: `
            <p>Agora vem a parte mais importante: as <strong>MANILHAS</strong>! São as 4 cartas mais fortes de cada rodada.</p>
            <p>No início de cada rodada, uma carta é virada na mesa - chamamos ela de <strong>"Vira"</strong>. As manilhas são as cartas com o <strong>valor seguinte</strong> ao da vira.</p>
            <div class="destaque">
                <strong>Exemplo:</strong> Se a vira é um <strong>7</strong>, as manilhas são todas as <strong>Damas (Q)</strong>!<br>
                Se a vira é um <strong>3</strong>, as manilhas são todos os <strong>4</strong>!<br>
                (É uma sequência cíclica: ...2 → 3 → 4 → 5...)
            </div>
            <div class="exemplo-cartas">
                <div class="mini-carta">7 ♥<br><small>Vira</small></div>
                <div class="mini-carta" style="margin-left: 1rem">→</div>
                <div class="mini-carta manilha">Q ♦</div>
                <div class="mini-carta manilha">Q ♠</div>
                <div class="mini-carta manilha">Q ♥</div>
                <div class="mini-carta manilha">Q ♣</div>
            </div>
            <p>As manilhas <strong>ganham de qualquer carta normal</strong>, mesmo do 3!</p>
            <p class="humor">"Manilha na mão é como saber o resultado do jogo antes de começar... quase!" 😏</p>
        `
    },
    {
        titulo: '👑 Ordem das Manilhas',
        conteudo: `
            <p>Entre as 4 manilhas, existe uma ordem de força baseada no <strong>naipe</strong>. Da mais fraca pra mais forte:</p>
            <div style="display: flex; flex-direction: column; gap: 0.6rem; margin: 1rem 0;">
                <div style="display: flex; align-items: center; gap: 0.8rem; padding: 0.5rem; background: rgba(255,255,255,0.05); border-radius: 8px;">
                    <span style="font-size: 1.8rem; color: #ff6b6b;">♦</span>
                    <div>
                        <strong>Ouros</strong> - Apelido: <em>"Pica-Fumo"</em><br>
                        <small>A mais fraquinha das manilhas</small>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 0.8rem; padding: 0.5rem; background: rgba(255,255,255,0.08); border-radius: 8px;">
                    <span style="font-size: 1.8rem; color: #74b9ff;">♠</span>
                    <div>
                        <strong>Espadas</strong> - Apelido: <em>"Espadilha"</em><br>
                        <small>A segunda mais forte</small>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 0.8rem; padding: 0.5rem; background: rgba(255,255,255,0.1); border-radius: 8px;">
                    <span style="font-size: 1.8rem; color: #ff6b6b;">♥</span>
                    <div>
                        <strong>Copas</strong> - Apelido: <em>"Copeta" ou "Sangue"</em><br>
                        <small>Quase lá!</small>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 0.8rem; padding: 0.5rem; background: rgba(245,197,24,0.15); border-radius: 8px; border: 1px solid rgba(245,197,24,0.3);">
                    <span style="font-size: 1.8rem;">♣</span>
                    <div>
                        <strong>Paus</strong> - Apelido: <em>"ZAP"</em> ⚡<br>
                        <small>A MAIS FORTE DE TODAS! Ninguém ganha do Zap!</small>
                    </div>
                </div>
            </div>
            <div class="destaque">
                <strong>Memorize:</strong> ♦ → ♠ → ♥ → ♣<br>
                Macete: "<strong>O</strong>uro, e<strong>S</strong>pada, <strong>C</strong>opa, <strong>P</strong>au" = tudo em ordem alfabética!
            </div>
            <p class="humor">"Ter o Zap na mão é como ser o Neymar em dia bom: imbatível!" ⚡</p>
        `
    },
    {
        titulo: '🏟️ Como Funciona uma Rodada',
        conteudo: `
            <p>Cada rodada do Truco tem <strong>até 3 turnos</strong>. Funciona assim:</p>
            <div style="display: flex; flex-direction: column; gap: 0.8rem; margin: 1rem 0;">
                <div style="padding: 0.6rem; background: rgba(255,255,255,0.08); border-radius: 8px; border-left: 3px solid #3498db;">
                    <strong>🔵 Turno 1:</strong> Cada jogador joga 1 carta. A carta mais forte vence o turno.
                </div>
                <div style="padding: 0.6rem; background: rgba(255,255,255,0.08); border-radius: 8px; border-left: 3px solid #e67e22;">
                    <strong>🟠 Turno 2:</strong> Cada jogador joga mais 1 carta. A carta mais forte vence.
                </div>
                <div style="padding: 0.6rem; background: rgba(255,255,255,0.08); border-radius: 8px; border-left: 3px solid #e74c3c;">
                    <strong>🔴 Turno 3:</strong> Última carta! Quem vencer, leva.
                </div>
            </div>
            <p>Quem vencer <strong>2 dos 3 turnos</strong> ganha a rodada!</p>
            <div class="destaque">
                <strong>Regra do empate:</strong><br>
                • Empate no 1º turno → quem ganhar o 2º turno leva a rodada<br>
                • Empate no 2º turno → quem ganhou o 1º turno leva a rodada<br>
                • Empate no 3º turno → quem ganhou o 1º turno leva a rodada<br>
                • Se todos os turnos empatarem → a rodada é do jogador que é "mão" (quem começou)
            </div>
            <p class="humor">"Rodada de Truco é que nem novela: tem reviravolta até o último capítulo!" 📺</p>
        `
    },
    {
        titulo: '📢 TRUCOOO! - A Alma do Jogo',
        conteudo: `
            <p>Agora vem a parte mais <strong>emocionante</strong>! A qualquer momento durante uma rodada, você pode gritar:</p>
            <p style="text-align: center; font-family: 'Bangers', cursive; font-size: 2.5rem; color: #f5c518; text-shadow: 2px 2px 0 #5d4037; margin: 0.8rem 0;">TRUCOOO!</p>
            <p>Quando você pede truco, o adversário tem <strong>3 opções</strong>:</p>
            <div style="display: flex; flex-direction: column; gap: 0.6rem; margin: 1rem 0;">
                <div style="padding: 0.6rem; background: rgba(39,174,96,0.2); border-radius: 8px;">
                    ✅ <strong>Aceitar:</strong> A rodada passa a valer <strong>3 pontos</strong>
                </div>
                <div style="padding: 0.6rem; background: rgba(231,76,60,0.2); border-radius: 8px;">
                    🏃 <strong>Correr (fugir):</strong> Desiste da rodada. Você ganha os pontos que estavam valendo antes
                </div>
                <div style="padding: 0.6rem; background: rgba(245,197,24,0.2); border-radius: 8px;">
                    📈 <strong>Aumentar:</strong> Pede <strong>SEIS!</strong> e a rodada passa a valer 6 pontos
                </div>
            </div>
            <div class="destaque">
                <strong>Escala de aumento:</strong><br>
                1 ponto (normal) → 3 (truco) → 6 (seis) → 9 (nove) → 12 (doze/ferro)
            </div>
            <p class="humor">"Pedir truco com carta ruim é a versão brasileira de jogar pôquer. Pura cara de pau!" 🎭</p>
        `
    },
    {
        titulo: '🎭 A Arte do Blefe',
        conteudo: `
            <p>O Truco não é só sobre cartas - é sobre <strong>psicologia</strong>! Blefar é uma das habilidades mais importantes.</p>
            <p><strong>O que é blefar?</strong> É pedir truco mesmo com cartas <strong>ruins</strong>, fazendo o adversário <strong>achar</strong> que suas cartas são boas e correr (desistir).</p>
            <div class="destaque">
                <strong>Quando blefar:</strong><br>
                • Quando o adversário parece inseguro<br>
                • Quando você precisa de poucos pontos pra ganhar<br>
                • No começo do jogo, pra estabelecer respeito<br>
                • Quando o adversário tem muitos pontos a perder<br><br>
                <strong>Quando NÃO blefar:</strong><br>
                • Quando o adversário é agressivo e sempre aceita<br>
                • Quando você já está perdendo de muito<br>
                • Contra jogadores experientes que leem blefes fácil
            </div>
            <p class="humor">"No truco, o jogador bom ganha com carta boa. O jogador MESTRE ganha com carta ruim!" 🧠</p>
        `
    },
    {
        titulo: '🙈 Jogando Carta Escondida',
        conteudo: `
            <p>Uma jogada especial do Truco é <strong>jogar a carta virada pra baixo</strong> (escondida). Isso significa que ninguém vê qual carta você jogou!</p>
            <div class="destaque">
                <strong>Como funciona:</strong><br>
                • A carta escondida <strong>sempre perde</strong> o turno (já que não mostra a força)<br>
                • É como dizer: "não me importo com esse turno"<br>
                • Pode ser uma estratégia pra guardar segredo sobre suas cartas
            </div>
            <p><strong>Quando usar:</strong></p>
            <ul style="padding-left: 1.5rem; margin: 0.5rem 0;">
                <li>Quando você já ganhou o 1º turno e quer esconder suas cartas</li>
                <li>Quando quer confundir o adversário sobre suas manilhas</li>
                <li>Quando a carta é fraca mesmo e tanto faz mostrá-la</li>
            </ul>
            <p class="humor">"Jogar carta escondida é a versão truco de 'sem spoiler, por favor!'" 🤫</p>
        `
    },
    {
        titulo: '🏆 Pontuação e Vitória',
        conteudo: `
            <p>O jogo vai até <strong>12 pontos</strong>. Quem chegar primeiro, é o campeão!</p>
            <div style="display: flex; flex-direction: column; gap: 0.5rem; margin: 1rem 0;">
                <div style="padding: 0.5rem 0.8rem; background: rgba(255,255,255,0.05); border-radius: 8px; display: flex; justify-content: space-between;">
                    <span>Rodada normal:</span><strong>1 ponto</strong>
                </div>
                <div style="padding: 0.5rem 0.8rem; background: rgba(255,255,255,0.08); border-radius: 8px; display: flex; justify-content: space-between;">
                    <span>Truco aceito:</span><strong>3 pontos</strong>
                </div>
                <div style="padding: 0.5rem 0.8rem; background: rgba(255,255,255,0.1); border-radius: 8px; display: flex; justify-content: space-between;">
                    <span>Seis aceito:</span><strong>6 pontos</strong>
                </div>
                <div style="padding: 0.5rem 0.8rem; background: rgba(255,255,255,0.13); border-radius: 8px; display: flex; justify-content: space-between;">
                    <span>Nove aceito:</span><strong>9 pontos</strong>
                </div>
                <div style="padding: 0.5rem 0.8rem; background: rgba(245,197,24,0.15); border-radius: 8px; display: flex; justify-content: space-between; border: 1px solid rgba(245,197,24,0.3);">
                    <span>Doze (ferro):</span><strong>12 pontos</strong>
                </div>
            </div>
            <div class="destaque">
                <strong>Dica final:</strong> O Truco é um jogo de <strong>leitura do adversário</strong>. Preste atenção nos padrões: quando ele pede truco, quando ele corre, quando ele blefa. Essa informação vale ouro!
            </div>
            <p class="humor">"12 pontos no Truco é como ganhar a Copa do Mundo: vem com grito, abraço e muita emoção!" 🏆🇧🇷</p>
        `
    },
    {
        titulo: '🚀 Pronto pra Jogar!',
        conteudo: `
            <p>Parabéns, parceiro! Você acabou de aprender as regras do <strong>Truco Brasileiro</strong>! 🎉</p>
            <p>Vamos recapitular o essencial:</p>
            <div style="display: flex; flex-direction: column; gap: 0.5rem; margin: 1rem 0;">
                <div style="padding: 0.5rem 0.8rem; background: rgba(255,255,255,0.05); border-radius: 8px;">
                    ✅ Baralho de 40 cartas, 3 cartas na mão
                </div>
                <div style="padding: 0.5rem 0.8rem; background: rgba(255,255,255,0.05); border-radius: 8px;">
                    ✅ Ordem: 4-5-6-7-Q-J-K-A-2-3 (3 é a mais forte)
                </div>
                <div style="padding: 0.5rem 0.8rem; background: rgba(255,255,255,0.05); border-radius: 8px;">
                    ✅ Manilhas são definidas pela vira (♦♠♥♣)
                </div>
                <div style="padding: 0.5rem 0.8rem; background: rgba(255,255,255,0.05); border-radius: 8px;">
                    ✅ Ganhar 2 de 3 turnos = ganhar a rodada
                </div>
                <div style="padding: 0.5rem 0.8rem; background: rgba(255,255,255,0.05); border-radius: 8px;">
                    ✅ TRUCO! aumenta os pontos (1→3→6→9→12)
                </div>
                <div style="padding: 0.5rem 0.8rem; background: rgba(255,255,255,0.05); border-radius: 8px;">
                    ✅ Primeiro a fazer 12 pontos vence!
                </div>
            </div>
            <p><strong>Minha recomendação:</strong> Comece no modo <strong>Iniciante</strong> (🐣 Pintinho na Mesa) para praticar. As dicas vão aparecer durante o jogo pra te ajudar!</p>
            <p style="text-align: center; font-size: 1.3rem; margin-top: 1rem;">Bora jogar? 🃏🔥</p>
            <p class="humor">"Agora é com você! Que o Zap esteja com você! ♣⚡"</p>
        `
    }
];

let tutorialPassoAtual = 0;

/**
 * Renderiza o passo atual do tutorial
 */
function renderizarTutorial() {
    const passo = PASSOS_TUTORIAL[tutorialPassoAtual];
    const conteudo = document.getElementById('tutorial-conteudo');
    const progresso = document.getElementById('progresso-fill');
    const progressoTexto = document.getElementById('progresso-texto');
    const btnAnterior = document.getElementById('btn-tutorial-anterior');
    const btnProximo = document.getElementById('btn-tutorial-proximo');

    conteudo.innerHTML = `<h3>${passo.titulo}</h3>${passo.conteudo}`;

    const porcentagem = ((tutorialPassoAtual + 1) / PASSOS_TUTORIAL.length) * 100;
    progresso.style.width = `${porcentagem}%`;
    progressoTexto.textContent = `Passo ${tutorialPassoAtual + 1} de ${PASSOS_TUTORIAL.length}`;

    btnAnterior.style.visibility = tutorialPassoAtual === 0 ? 'hidden' : 'visible';

    if (tutorialPassoAtual === PASSOS_TUTORIAL.length - 1) {
        btnProximo.textContent = '🎮 Bora Jogar!';
        btnProximo.onclick = () => {
            mostrarNiveis();
        };
    } else {
        btnProximo.textContent = 'Próximo →';
        btnProximo.onclick = tutorialProximo;
    }
}

function tutorialProximo() {
    if (tutorialPassoAtual < PASSOS_TUTORIAL.length - 1) {
        tutorialPassoAtual++;
        renderizarTutorial();
    }
}

function tutorialAnterior() {
    if (tutorialPassoAtual > 0) {
        tutorialPassoAtual--;
        renderizarTutorial();
    }
}
