/**
 * Engine principal do Jogo de Truco
 * Gerencia rodadas, turnos, pontuação e fluxo do jogo
 */

// Estado do jogo
let estadoJogo = {
    nivel: 'iniciante',
    ia: null,
    pontosJogador: 0,
    pontosAdversario: 0,
    maoJogador: [],
    maoAdversario: [],
    vira: null,
    turnoAtual: 0,
    turnosGanhosJogador: 0,
    turnosGanhosAdversario: 0,
    valorRodada: 1,
    quemPediuTruco: null, // 'jogador' ou 'adversario'
    jogadorEhMao: true, // quem começa jogando
    aguardandoJogada: false,
    cartaJogadorNaMesa: null,
    cartaAdversarioNaMesa: null,
    jogoEmAndamento: false,
    podeJogar: false,
    podePedirTruco: true,
    resultadosTurnos: [], // [{vencedor: 'jogador'|'adversario'|'empate'}]
    ultimoTrucoFoi: null // controle de quem trucou por último
};

const ESCALA_TRUCO = [1, 3, 6, 9, 12];

function proximoValorTruco(valorAtual) {
    const idx = ESCALA_TRUCO.indexOf(valorAtual);
    if (idx < ESCALA_TRUCO.length - 1) return ESCALA_TRUCO[idx + 1];
    return null;
}

/**
 * Inicia uma nova partida
 */
function iniciarJogo(nivel) {
    estadoJogo.nivel = nivel;
    estadoJogo.ia = new TrucoIA(nivel);
    estadoJogo.pontosJogador = 0;
    estadoJogo.pontosAdversario = 0;
    estadoJogo.jogadorEhMao = Math.random() < 0.5;
    estadoJogo.jogoEmAndamento = true;

    document.getElementById('nome-adversario').textContent = estadoJogo.ia.nome;

    trocarTela('tela-jogo');
    atualizarPlacar();
    iniciarRodada();
}

/**
 * Inicia uma nova rodada
 */
function iniciarRodada() {
    const distribuicao = distribuirCartas();
    estadoJogo.maoJogador = distribuicao.maoJogador;
    estadoJogo.maoAdversario = distribuicao.maoAdversario;
    estadoJogo.vira = distribuicao.vira;
    estadoJogo.turnoAtual = 0;
    estadoJogo.turnosGanhosJogador = 0;
    estadoJogo.turnosGanhosAdversario = 0;
    estadoJogo.valorRodada = 1;
    estadoJogo.quemPediuTruco = null;
    estadoJogo.ultimoTrucoFoi = null;
    estadoJogo.cartaJogadorNaMesa = null;
    estadoJogo.cartaAdversarioNaMesa = null;
    estadoJogo.podeJogar = false;
    estadoJogo.podePedirTruco = true;
    estadoJogo.resultadosTurnos = [];

    // Alterna quem é mão
    estadoJogo.jogadorEhMao = !estadoJogo.jogadorEhMao;

    renderizarMesa();
    atualizarPlacar();
    atualizarTurnos();

    // Dica para iniciante
    if (estadoJogo.nivel === 'iniciante') {
        const classificacao = classificarMao(estadoJogo.maoJogador, estadoJogo.vira);
        setTimeout(() => {
            mostrarDica(`${classificacao.texto} ${getDicaMao(estadoJogo.maoJogador, estadoJogo.vira)}`);
        }, 800);
    }

    // Se o adversário é mão, ele joga primeiro
    if (!estadoJogo.jogadorEhMao) {
        estadoJogo.podeJogar = false;
        setTimeout(() => adversarioJoga(), 1200);
    } else {
        estadoJogo.podeJogar = true;
    }

    // Mostrar fala da IA no início
    mostrarFalaIA(estadoJogo.ia.falar('inicio'));
}

/**
 * Renderiza toda a mesa
 */
function renderizarMesa() {
    const vira = estadoJogo.vira;

    // Carta Vira
    const viraEl = document.getElementById('carta-vira');
    const naipeInfo = NAIPES[vira.naipe];
    const corClass = naipeInfo.cor === 'vermelha' ? 'carta-vermelha' : 'carta-preta';
    viraEl.className = `carta carta-frente carta-vira ${corClass}`;
    viraEl.innerHTML = `<span class="carta-valor">${VALORES[vira.valor].display}</span><span class="carta-naipe">${naipeInfo.simbolo}</span>`;

    const valorManilha = getValorManilha(vira);
    document.getElementById('manilha-info').textContent = `Manilha: ${VALORES[valorManilha].display}`;

    // Cartas do jogador
    renderizarMaoJogador();

    // Cartas do adversário (costas)
    renderizarMaoAdversario();

    // Limpar mesa
    document.getElementById('carta-mesa-jogador').innerHTML = '';
    document.getElementById('carta-mesa-adversario').innerHTML = '';

    // Botões
    atualizarBotoes();
}

function renderizarMaoJogador() {
    const container = document.getElementById('cartas-jogador');
    container.innerHTML = '';
    estadoJogo.maoJogador.forEach((carta, idx) => {
        if (carta) {
            container.innerHTML += renderizarCartaFrente(carta, estadoJogo.vira, estadoJogo.podeJogar, idx);
        }
    });
}

function renderizarMaoAdversario() {
    const container = document.getElementById('cartas-adversario');
    container.innerHTML = '';
    estadoJogo.maoAdversario.forEach((carta) => {
        if (carta) {
            container.innerHTML += renderizarCartaCostas();
        }
    });
}

function atualizarBotoes() {
    const btnTruco = document.getElementById('btn-truco');
    const btnEsconder = document.getElementById('btn-esconder');
    const proximoValor = proximoValorTruco(estadoJogo.valorRodada);

    if (proximoValor && estadoJogo.podePedirTruco && estadoJogo.ultimoTrucoFoi !== 'jogador') {
        btnTruco.disabled = false;
        if (proximoValor === 3) btnTruco.textContent = '📢 TRUCO!';
        else if (proximoValor === 6) btnTruco.textContent = '📢 SEIS!';
        else if (proximoValor === 9) btnTruco.textContent = '📢 NOVE!';
        else if (proximoValor === 12) btnTruco.textContent = '📢 DOZE!';
    } else {
        btnTruco.disabled = true;
    }

    btnEsconder.style.display = estadoJogo.podeJogar ? 'inline-block' : 'none';
}

/**
 * Jogador joga uma carta
 */
function jogarCarta(indice) {
    if (!estadoJogo.podeJogar || !estadoJogo.jogoEmAndamento) return;
    if (estadoJogo.maoJogador[indice] === null) return;

    estadoJogo.podeJogar = false;
    const carta = estadoJogo.maoJogador[indice];
    estadoJogo.maoJogador[indice] = null;
    estadoJogo.cartaJogadorNaMesa = carta;

    // Renderizar carta na mesa
    document.getElementById('carta-mesa-jogador').innerHTML =
        renderizarCartaFrente(carta, estadoJogo.vira);
    renderizarMaoJogador();

    // Se o adversário já jogou, resolver turno
    if (estadoJogo.cartaAdversarioNaMesa !== null) {
        setTimeout(() => resolverTurno(), 800);
    } else {
        // Adversário joga depois
        setTimeout(() => {
            // IA pode decidir pedir truco antes de jogar
            if (iaDevePedirTruco()) {
                iaPedeTruco();
            } else {
                adversarioJoga();
            }
        }, 1000);
    }
}

/**
 * Jogador joga carta escondida (virada)
 */
function jogarEscondida() {
    if (!estadoJogo.podeJogar || !estadoJogo.jogoEmAndamento) return;

    // Encontrar primeira carta disponível
    const indice = estadoJogo.maoJogador.findIndex(c => c !== null);
    if (indice === -1) return;

    estadoJogo.podeJogar = false;
    const carta = estadoJogo.maoJogador[indice];
    estadoJogo.maoJogador[indice] = null;
    // Carta escondida perde automaticamente (força 0)
    estadoJogo.cartaJogadorNaMesa = { ...carta, escondida: true };

    document.getElementById('carta-mesa-jogador').innerHTML = renderizarCartaEscondida();
    renderizarMaoJogador();

    if (estadoJogo.cartaAdversarioNaMesa !== null) {
        setTimeout(() => resolverTurno(), 800);
    } else {
        setTimeout(() => {
            if (iaDevePedirTruco()) {
                iaPedeTruco();
            } else {
                adversarioJoga();
            }
        }, 1000);
    }
}

/**
 * Adversário (IA) joga uma carta
 */
function adversarioJoga() {
    if (!estadoJogo.jogoEmAndamento) return;

    const cartasDisponiveis = estadoJogo.maoAdversario.filter(c => c !== null);
    if (cartasDisponiveis.length === 0) return;

    const jogada = estadoJogo.ia.escolherCarta(
        cartasDisponiveis,
        estadoJogo.vira,
        estadoJogo.turnoAtual,
        estadoJogo.turnosGanhosAdversario,
        estadoJogo.turnosGanhosJogador,
        estadoJogo.cartaJogadorNaMesa
    );

    // Encontra o índice real na mão
    let contadorCartasVivas = 0;
    let indiceReal = -1;
    for (let i = 0; i < estadoJogo.maoAdversario.length; i++) {
        if (estadoJogo.maoAdversario[i] !== null) {
            if (contadorCartasVivas === jogada.indice) {
                indiceReal = i;
                break;
            }
            contadorCartasVivas++;
        }
    }

    if (indiceReal === -1) {
        // Fallback: joga a primeira carta disponível
        indiceReal = estadoJogo.maoAdversario.findIndex(c => c !== null);
    }

    const carta = estadoJogo.maoAdversario[indiceReal];
    estadoJogo.maoAdversario[indiceReal] = null;
    estadoJogo.cartaAdversarioNaMesa = carta;

    // Renderizar
    document.getElementById('carta-mesa-adversario').innerHTML =
        renderizarCartaFrente(carta, estadoJogo.vira);
    renderizarMaoAdversario();

    // Se o jogador já jogou, resolver turno
    if (estadoJogo.cartaJogadorNaMesa !== null) {
        setTimeout(() => resolverTurno(), 800);
    } else {
        // Jogador joga
        estadoJogo.podeJogar = true;
        renderizarMaoJogador();
        atualizarBotoes();

        // Dica para nível iniciante
        if (estadoJogo.nivel === 'iniciante' && estadoJogo.turnoAtual === 0) {
            const dicaTurno = getDicaTurno(estadoJogo.maoJogador, carta, estadoJogo.vira);
            if (dicaTurno) mostrarDica(dicaTurno);
        }
    }
}

/**
 * Resolver o turno (ambas as cartas estão na mesa)
 */
function resolverTurno() {
    const cartaJ = estadoJogo.cartaJogadorNaMesa;
    const cartaA = estadoJogo.cartaAdversarioNaMesa;

    let resultado;
    if (cartaJ.escondida) {
        resultado = -1; // Escondida sempre perde
    } else {
        resultado = compararCartas(cartaJ, cartaA, estadoJogo.vira);
    }

    let textoResultado;
    let tipoResultado;

    if (resultado > 0) {
        estadoJogo.turnosGanhosJogador++;
        textoResultado = '✅ Você ganhou o turno!';
        tipoResultado = 'jogador';
        mostrarFalaIA(estadoJogo.ia.falar('perdeuTurno'));
    } else if (resultado < 0) {
        estadoJogo.turnosGanhosAdversario++;
        textoResultado = `❌ ${estadoJogo.ia.nome} ganhou o turno!`;
        tipoResultado = 'adversario';
        mostrarFalaIA(estadoJogo.ia.falar('ganhouTurno'));
    } else {
        textoResultado = '🤝 Empate no turno!';
        tipoResultado = 'empate';
    }

    estadoJogo.resultadosTurnos.push({ vencedor: tipoResultado });
    atualizarTurnos();
    mostrarResultadoTurno(textoResultado);

    // Verificar se a rodada acabou
    setTimeout(() => {
        esconderResultadoTurno();

        const vencedorRodada = verificarVencedorRodada();

        if (vencedorRodada) {
            finalizarRodada(vencedorRodada);
        } else {
            // Próximo turno
            estadoJogo.turnoAtual++;
            estadoJogo.cartaJogadorNaMesa = null;
            estadoJogo.cartaAdversarioNaMesa = null;
            document.getElementById('carta-mesa-jogador').innerHTML = '';
            document.getElementById('carta-mesa-adversario').innerHTML = '';

            // Quem ganhou o turno joga primeiro no próximo
            if (tipoResultado === 'jogador' || tipoResultado === 'empate') {
                estadoJogo.podeJogar = true;
                renderizarMaoJogador();
                atualizarBotoes();
            } else {
                estadoJogo.podeJogar = false;
                setTimeout(() => {
                    if (iaDevePedirTruco()) {
                        iaPedeTruco();
                    } else {
                        adversarioJoga();
                    }
                }, 800);
            }
        }
    }, 1500);
}

/**
 * Verifica se há um vencedor da rodada
 */
function verificarVencedorRodada() {
    const gJ = estadoJogo.turnosGanhosJogador;
    const gA = estadoJogo.turnosGanhosAdversario;

    // Ganhou 2 turnos
    if (gJ >= 2) return 'jogador';
    if (gA >= 2) return 'adversario';

    // 3 turnos jogados
    if (estadoJogo.resultadosTurnos.length >= 3) {
        if (gJ > gA) return 'jogador';
        if (gA > gJ) return 'adversario';

        // Empate: quem ganhou o primeiro turno
        if (estadoJogo.resultadosTurnos[0].vencedor === 'jogador') return 'jogador';
        if (estadoJogo.resultadosTurnos[0].vencedor === 'adversario') return 'adversario';

        // Todos empates: quem é mão
        return estadoJogo.jogadorEhMao ? 'jogador' : 'adversario';
    }

    // Regra: empate no 1º turno + alguém ganha o 2º = vencedor do 2º leva
    if (estadoJogo.resultadosTurnos.length >= 2) {
        if (estadoJogo.resultadosTurnos[0].vencedor === 'empate') {
            if (estadoJogo.resultadosTurnos[1].vencedor !== 'empate') {
                return estadoJogo.resultadosTurnos[1].vencedor;
            }
        }
    }

    return null;
}

/**
 * Finaliza uma rodada e atribui pontos
 */
function finalizarRodada(vencedor) {
    const pontos = estadoJogo.valorRodada;

    if (vencedor === 'jogador') {
        estadoJogo.pontosJogador += pontos;
        mostrarResultadoTurno(`🎉 Você ganhou a rodada! (+${pontos} ponto${pontos > 1 ? 's' : ''})`);
        mostrarFalaIA(estadoJogo.ia.falar('perdeuRodada'));
    } else {
        estadoJogo.pontosAdversario += pontos;
        mostrarResultadoTurno(`😤 ${estadoJogo.ia.nome} ganhou a rodada! (+${pontos} ponto${pontos > 1 ? 's' : ''})`);
        mostrarFalaIA(estadoJogo.ia.falar('ganhouRodada'));
    }

    atualizarPlacar();

    setTimeout(() => {
        esconderResultadoTurno();

        // Verificar fim de jogo
        if (estadoJogo.pontosJogador >= 12) {
            fimDeJogo('jogador');
        } else if (estadoJogo.pontosAdversario >= 12) {
            fimDeJogo('adversario');
        } else {
            iniciarRodada();
        }
    }, 2000);
}

// ========== SISTEMA DE TRUCO ==========

function iaDevePedirTruco() {
    if (estadoJogo.ultimoTrucoFoi === 'adversario') return false;
    if (!proximoValorTruco(estadoJogo.valorRodada)) return false;

    const cartasVivas = estadoJogo.maoAdversario.filter(c => c !== null);
    return estadoJogo.ia.decidirPedirTruco(
        cartasVivas,
        estadoJogo.vira,
        estadoJogo.turnosGanhosAdversario,
        estadoJogo.turnosGanhosJogador,
        estadoJogo.valorRodada,
        estadoJogo.pontosAdversario,
        estadoJogo.pontosJogador
    );
}

function iaPedeTruco() {
    const proximoValor = proximoValorTruco(estadoJogo.valorRodada);
    if (!proximoValor) return;

    estadoJogo.podeJogar = false;
    mostrarFalaIA(estadoJogo.ia.falar('pedeTruco'));

    let gritoTexto;
    if (proximoValor === 3) gritoTexto = 'TRUCO!';
    else if (proximoValor === 6) gritoTexto = 'SEIS!';
    else if (proximoValor === 9) gritoTexto = 'NOVE!';
    else if (proximoValor === 12) gritoTexto = 'DOZE!';

    const podeAumentar = proximoValorTruco(proximoValor) !== null;

    let botoesHTML = `
        <button class="btn-aceitar" onclick="responderTruco('aceitar', ${proximoValor})">
            ✅ Aceitar (vale ${proximoValor})
        </button>
        <button class="btn-correr" onclick="responderTruco('correr', ${proximoValor})">
            🏃 Correr (perder ${estadoJogo.valorRodada} ponto${estadoJogo.valorRodada > 1 ? 's' : ''})
        </button>
    `;

    if (podeAumentar) {
        const valorMaior = proximoValorTruco(proximoValor);
        let textoAumentar;
        if (valorMaior === 6) textoAumentar = 'SEIS!';
        else if (valorMaior === 9) textoAumentar = 'NOVE!';
        else if (valorMaior === 12) textoAumentar = 'DOZE!';

        botoesHTML += `
            <button class="btn-aumentar" onclick="responderTruco('aumentar', ${proximoValor})">
                📈 Pedir ${textoAumentar} (vale ${valorMaior})
            </button>
        `;
    }

    document.getElementById('modal-truco-texto').innerHTML = `
        <span class="truco-grito">${gritoTexto}</span>
        <p>${estadoJogo.ia.nome} está pedindo ${gritoTexto}</p>
        <p>O que você faz?</p>
    `;
    document.getElementById('modal-truco-botoes').innerHTML = botoesHTML;
    document.getElementById('modal-truco').classList.remove('escondido');
}

function responderTruco(resposta, valorPedido) {
    document.getElementById('modal-truco').classList.add('escondido');

    if (resposta === 'aceitar') {
        estadoJogo.valorRodada = valorPedido;
        estadoJogo.ultimoTrucoFoi = 'adversario';
        document.getElementById('valor-rodada').textContent = valorPedido;

        mostrarResultadoTurno(`Você aceitou! Rodada vale ${valorPedido} pontos!`);
        setTimeout(() => {
            esconderResultadoTurno();
            // Continua o jogo - IA joga se precisar
            if (estadoJogo.cartaJogadorNaMesa !== null) {
                // Jogador já jogou, IA joga
                adversarioJoga();
            } else if (estadoJogo.cartaAdversarioNaMesa !== null) {
                // IA já jogou, jogador joga
                estadoJogo.podeJogar = true;
                renderizarMaoJogador();
                atualizarBotoes();
            } else {
                // Ninguém jogou ainda
                if (estadoJogo.jogadorEhMao || estadoJogo.resultadosTurnos.length > 0) {
                    estadoJogo.podeJogar = true;
                    renderizarMaoJogador();
                    atualizarBotoes();
                } else {
                    adversarioJoga();
                }
            }
        }, 1000);

    } else if (resposta === 'correr') {
        // Jogador corre - adversário ganha os pontos
        estadoJogo.pontosAdversario += estadoJogo.valorRodada;
        atualizarPlacar();
        mostrarResultadoTurno(`Você correu! ${estadoJogo.ia.nome} ganha ${estadoJogo.valorRodada} ponto(s)!`);
        mostrarFalaIA(estadoJogo.ia.falar('ganhouRodada'));

        setTimeout(() => {
            esconderResultadoTurno();
            if (estadoJogo.pontosAdversario >= 12) {
                fimDeJogo('adversario');
            } else {
                iniciarRodada();
            }
        }, 1500);

    } else if (resposta === 'aumentar') {
        const valorMaior = proximoValorTruco(valorPedido);
        estadoJogo.valorRodada = valorPedido;
        estadoJogo.ultimoTrucoFoi = 'jogador';

        // IA decide sobre o aumento
        const cartasVivas = estadoJogo.maoAdversario.filter(c => c !== null);
        const respostaIA = estadoJogo.ia.decidirRespostaTruco(
            cartasVivas, estadoJogo.vira,
            estadoJogo.turnosGanhosAdversario, estadoJogo.turnosGanhosJogador,
            valorMaior, estadoJogo.pontosAdversario, estadoJogo.pontosJogador
        );

        setTimeout(() => {
            if (respostaIA === 'correr') {
                mostrarFalaIA(estadoJogo.ia.falar('correTruco'));
                estadoJogo.pontosJogador += valorPedido;
                atualizarPlacar();
                mostrarResultadoTurno(`${estadoJogo.ia.nome} correu! Você ganha ${valorPedido} ponto(s)!`);
                setTimeout(() => {
                    esconderResultadoTurno();
                    if (estadoJogo.pontosJogador >= 12) fimDeJogo('jogador');
                    else iniciarRodada();
                }, 1500);
            } else if (respostaIA === 'aceitar') {
                mostrarFalaIA(estadoJogo.ia.falar('aceitaTruco'));
                estadoJogo.valorRodada = valorMaior;
                estadoJogo.ultimoTrucoFoi = 'jogador';
                document.getElementById('valor-rodada').textContent = valorMaior;
                mostrarResultadoTurno(`${estadoJogo.ia.nome} aceitou! Rodada vale ${valorMaior}!`);
                setTimeout(() => {
                    esconderResultadoTurno();
                    continuarAposTruco();
                }, 1000);
            } else {
                // IA aumenta de volta
                estadoJogo.valorRodada = valorMaior;
                estadoJogo.ultimoTrucoFoi = 'adversario';
                iaPedeTruco();
            }
        }, 1000);
    }
}

/**
 * Jogador pede truco
 */
function pedirTruco() {
    const proximoValor = proximoValorTruco(estadoJogo.valorRodada);
    if (!proximoValor) return;
    if (estadoJogo.ultimoTrucoFoi === 'jogador') return;

    estadoJogo.podeJogar = false;

    // IA decide
    const cartasVivas = estadoJogo.maoAdversario.filter(c => c !== null);
    const respostaIA = estadoJogo.ia.decidirRespostaTruco(
        cartasVivas, estadoJogo.vira,
        estadoJogo.turnosGanhosAdversario, estadoJogo.turnosGanhosJogador,
        proximoValor, estadoJogo.pontosAdversario, estadoJogo.pontosJogador
    );

    let gritoTexto;
    if (proximoValor === 3) gritoTexto = 'TRUCO!';
    else if (proximoValor === 6) gritoTexto = 'SEIS!';
    else if (proximoValor === 9) gritoTexto = 'NOVE!';
    else if (proximoValor === 12) gritoTexto = 'DOZE!';

    mostrarResultadoTurno(`📢 Você pediu ${gritoTexto}`);

    setTimeout(() => {
        esconderResultadoTurno();

        if (respostaIA === 'correr') {
            mostrarFalaIA(estadoJogo.ia.falar('correTruco'));
            estadoJogo.pontosJogador += estadoJogo.valorRodada;
            atualizarPlacar();
            mostrarResultadoTurno(`${estadoJogo.ia.nome} correu! Você ganha ${estadoJogo.valorRodada} ponto(s)!`);
            setTimeout(() => {
                esconderResultadoTurno();
                if (estadoJogo.pontosJogador >= 12) fimDeJogo('jogador');
                else iniciarRodada();
            }, 1500);

        } else if (respostaIA === 'aceitar') {
            mostrarFalaIA(estadoJogo.ia.falar('aceitaTruco'));
            estadoJogo.valorRodada = proximoValor;
            estadoJogo.ultimoTrucoFoi = 'jogador';
            document.getElementById('valor-rodada').textContent = proximoValor;
            mostrarResultadoTurno(`${estadoJogo.ia.nome} aceitou! Rodada vale ${proximoValor}!`);
            setTimeout(() => {
                esconderResultadoTurno();
                continuarAposTruco();
            }, 1000);

        } else {
            // IA aumenta!
            estadoJogo.valorRodada = proximoValor;
            estadoJogo.ultimoTrucoFoi = 'jogador';
            document.getElementById('valor-rodada').textContent = proximoValor;
            mostrarFalaIA(estadoJogo.ia.falar('pedeTruco'));
            setTimeout(() => {
                iaPedeTruco();
            }, 800);
        }
    }, 1200);
}

function continuarAposTruco() {
    if (estadoJogo.cartaJogadorNaMesa !== null && estadoJogo.cartaAdversarioNaMesa !== null) {
        resolverTurno();
    } else if (estadoJogo.cartaJogadorNaMesa !== null) {
        adversarioJoga();
    } else if (estadoJogo.cartaAdversarioNaMesa !== null) {
        estadoJogo.podeJogar = true;
        renderizarMaoJogador();
        atualizarBotoes();
    } else {
        // Ninguém jogou
        estadoJogo.podeJogar = true;
        renderizarMaoJogador();
        atualizarBotoes();
    }
}

// ========== UI ==========

function atualizarPlacar() {
    document.getElementById('placar-jogador').textContent = estadoJogo.pontosJogador;
    document.getElementById('placar-adversario').textContent = estadoJogo.pontosAdversario;
    document.getElementById('valor-rodada').textContent = estadoJogo.valorRodada;
}

function atualizarTurnos() {
    // Reset
    for (let i = 1; i <= 3; i++) {
        document.getElementById(`turno-j${i}`).className = 'turno-dot';
        document.getElementById(`turno-a${i}`).className = 'turno-dot';
    }

    let idxJ = 0, idxA = 0;
    estadoJogo.resultadosTurnos.forEach(r => {
        if (r.vencedor === 'jogador') {
            idxJ++;
            document.getElementById(`turno-j${idxJ}`).classList.add('ganho');
            idxA++;
            document.getElementById(`turno-a${idxA}`).classList.add('perdido');
        } else if (r.vencedor === 'adversario') {
            idxA++;
            document.getElementById(`turno-a${idxA}`).classList.add('ganho');
            idxJ++;
            document.getElementById(`turno-j${idxJ}`).classList.add('perdido');
        } else {
            idxJ++;
            idxA++;
            document.getElementById(`turno-j${idxJ}`).classList.add('empate');
            document.getElementById(`turno-a${idxA}`).classList.add('empate');
        }
    });
}

function mostrarFalaIA(texto) {
    if (!texto) return;
    const balao = document.getElementById('balao-fala');
    const balaoTexto = document.getElementById('balao-texto');
    balaoTexto.textContent = texto;
    balao.classList.remove('escondido');
    setTimeout(() => balao.classList.add('escondido'), 2500);
}

function mostrarResultadoTurno(texto) {
    const el = document.getElementById('resultado-turno');
    document.getElementById('resultado-turno-texto').textContent = texto;
    el.classList.remove('escondido');
}

function esconderResultadoTurno() {
    document.getElementById('resultado-turno').classList.add('escondido');
}

function mostrarDica(texto) {
    const el = document.getElementById('dica-jogo');
    document.getElementById('dica-texto').textContent = texto;
    el.classList.remove('escondido');
    setTimeout(() => el.classList.add('escondido'), 6000);
}

function fecharDica() {
    document.getElementById('dica-jogo').classList.add('escondido');
}

// ========== FIM DE JOGO ==========

function fimDeJogo(vencedor) {
    estadoJogo.jogoEmAndamento = false;
    const modal = document.getElementById('modal-fim');
    const icone = document.getElementById('fim-icone');
    const titulo = document.getElementById('fim-titulo');
    const mensagem = document.getElementById('fim-mensagem');
    const placar = document.getElementById('fim-placar');

    if (vencedor === 'jogador') {
        icone.textContent = '🏆';
        titulo.textContent = 'VOCÊ VENCEU!';
        mensagem.textContent = getMensagemVitoria();
    } else {
        icone.textContent = '😤';
        titulo.textContent = 'VOCÊ PERDEU!';
        mensagem.textContent = getMensagemDerrota();
    }

    placar.innerHTML = `${estadoJogo.pontosJogador} x ${estadoJogo.pontosAdversario}`;
    modal.classList.remove('escondido');
}

function jogarNovamente() {
    document.getElementById('modal-fim').classList.add('escondido');
    iniciarJogo(estadoJogo.nivel);
}

function confirmarSaida() {
    if (estadoJogo.jogoEmAndamento) {
        if (confirm('Tem certeza que quer sair? O jogo será perdido!')) {
            estadoJogo.jogoEmAndamento = false;
            voltarInicio();
        }
    } else {
        voltarInicio();
    }
}
