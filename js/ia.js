/**
 * Inteligência Artificial do Truco
 * 4 níveis de dificuldade com personalidades diferentes
 */

const NOMES_IA = {
    iniciante: ['Zezinho', 'Mariazinha', 'Pedrinho', 'Joaninha'],
    medio: ['Seu Zé', 'Dona Maria', 'Compadre Pedro', 'Dona Joana'],
    avancado: ['Zé Trovão', 'Maria Furacão', 'Pedro Malandro', 'Joana Fera'],
    lenda: ['Mestre Zé', 'Rainha Maria', 'Lenda Pedro', 'Imperatriz Joana']
};

const FALAS_IA = {
    iniciante: {
        inicio: ['Opa, vamos jogar! 😊', 'Tô aprendendo ainda, tá?', 'Vai com calma comigo!'],
        ganhouTurno: ['Eba, ganhei! 😄', 'Essa foi sorte!', 'Olha eu aí!'],
        perdeuTurno: ['Poxa... 😅', 'Essa doeu!', 'Tá difícil...'],
        pedeTruco: ['T-truco...? 😰', 'Será que eu peço truco...?', 'Truco! (acho...)'],
        aceitaTruco: ['Tá bom, eu aceito... 😬', 'Vamos nessa!', 'Aceito sim!'],
        correTruco: ['Ih, melhor correr! 🏃', 'Dessa vez eu passo...', 'Tô fora!'],
        ganhouRodada: ['Consegui! 🎉', 'Não acredito que ganhei!', 'Uhuu!'],
        perdeuRodada: ['Parabéns... 😢', 'Essa você levou!', 'Na próxima eu ganho!'],
        blefe: ['Hmm... será que eu blefe? 🤔', '...']
    },
    medio: {
        inicio: ['Bora jogar, parceiro!', 'Preparado? 😎', 'Vamos ver quem é bom!'],
        ganhouTurno: ['Essa é minha! 💪', 'Bem jogado, eu!', 'Tá vendo?'],
        perdeuTurno: ['Hmm, boa jogada...', 'Essa você levou.', 'Ainda tenho chance!'],
        pedeTruco: ['TRUCO! 😏', 'Opa, TRUCO aí!', 'Bora aumentar? TRUCO!'],
        aceitaTruco: ['Aceito! Vem! 😤', 'Pode vir!', 'Larga essa aí!'],
        correTruco: ['Dessa vez você levou... 😒', 'Vou guardar minhas fichas.', 'Estratégia!'],
        ganhouRodada: ['É isso aí! 🔥', 'Quem manda sou eu!', 'Pode anotar!'],
        perdeuRodada: ['Boa, boa... mas se liga! 👀', 'A próxima é minha!', 'Calminha...'],
        blefe: ['Será? 🤨', 'Hmm, interessante...']
    },
    avancado: {
        inicio: ['Senta aí que o jogo vai ser longo! 😈', 'Trouxe lenço? Vai precisar!', 'Sem choro, hein!'],
        ganhouTurno: ['Fácil demais! 😎', 'Achei que seria mais difícil.', 'Próximo!'],
        perdeuTurno: ['Aproveitou... mas não dura. 😏', 'Essa eu deixei passar.', 'Tudo calculado.'],
        pedeTruco: ['TRUCOOOOO! 🔥🔥', 'METE TRUCO! Quero ver aceitar!', 'TRUCO, PARCEIRO! Vai correr? 😈'],
        aceitaTruco: ['ACEITO E QUERO MAIS! 💪', 'Vem com tudo!', 'Aceito sorrindo! 😏'],
        correTruco: ['Tá... dessa vez você me pegou. 😤', 'Recuo estratégico.', 'Esperando a hora certa...'],
        ganhouRodada: ['PODE ANOTAR! 📝🔥', 'Mais fácil que tirar doce de criança!', 'Dominou!'],
        perdeuRodada: ['Essa é a última que você ganha... ⚡', 'Agora ficou pessoal.', 'Te dei essa de presente.'],
        blefe: ['(sorri de canto) 😏', 'Tenho algo especial aqui...']
    },
    lenda: {
        inicio: ['Você sabe com quem está jogando? 👑', 'Última chance de desistir...', 'Prepara o psicológico. 🧠'],
        ganhouTurno: ['Previsível. 🥱', 'Próxima vez tenta surpreender.', 'Básico.'],
        perdeuTurno: ['Hmm. Não muda nada. ♟️', 'Tudo dentro do plano.', 'Interessante...'],
        pedeTruco: ['TRUCOOO! 💀 Aceita se tiver coragem!', 'TRUCO! Essa mesa é minha! 👑', 'TRUCO, MOLEQUE! 🔥💀'],
        aceitaTruco: ['Aceito rindo. 😂', 'Com todo prazer.', 'Finalmente ficou interessante.'],
        correTruco: ['...estratégia de longo prazo. ♟️', 'Te dei essa migalha.', 'Guardando o melhor pro final.'],
        ganhouRodada: ['A lenda não falha. 👑', 'Rei é rei. 🏆', 'Ajoelha que lá vem a coroa! 👑'],
        perdeuRodada: ['...Sorte de principiante. 😐', 'Aproveita, é raro.', 'Não se acostuma.'],
        blefe: ['*olhar intimidador* 👁️', '(silêncio calculado)']
    }
};

/**
 * Classe da IA do Truco
 */
class TrucoIA {
    constructor(nivel) {
        this.nivel = nivel;
        this.nome = this.sortearNome();
        this.falas = FALAS_IA[nivel];
    }

    sortearNome() {
        const nomes = NOMES_IA[this.nivel];
        return nomes[Math.floor(Math.random() * nomes.length)];
    }

    falar(tipo) {
        const opcoes = this.falas[tipo];
        if (!opcoes || opcoes.length === 0) return '';
        return opcoes[Math.floor(Math.random() * opcoes.length)];
    }

    /**
     * Decide qual carta jogar
     * Retorna { indice, escondida } onde indice é o index da carta na mão
     */
    escolherCarta(maoIA, vira, turnoAtual, turnosGanhosIA, turnosGanhosJogador, cartaJogadorNaMesa) {
        // Ordena as cartas por força
        const cartasOrdenadas = maoIA.map((carta, idx) => ({
            carta,
            idx,
            forca: forcaCarta(carta, vira),
            ehManilha: ehManilha(carta, vira)
        })).sort((a, b) => a.forca - b.forca);

        switch (this.nivel) {
            case 'iniciante':
                return this.jogadaIniciante(cartasOrdenadas, cartaJogadorNaMesa, vira);
            case 'medio':
                return this.jogadaMedio(cartasOrdenadas, cartaJogadorNaMesa, vira, turnoAtual, turnosGanhosIA, turnosGanhosJogador);
            case 'avancado':
                return this.jogadaAvancado(cartasOrdenadas, cartaJogadorNaMesa, vira, turnoAtual, turnosGanhosIA, turnosGanhosJogador);
            case 'lenda':
                return this.jogadaLenda(cartasOrdenadas, cartaJogadorNaMesa, vira, turnoAtual, turnosGanhosIA, turnosGanhosJogador);
            default:
                return { indice: cartasOrdenadas[0].idx, escondida: false };
        }
    }

    // Iniciante: joga quase aleatório, às vezes joga a mais forte
    jogadaIniciante(cartasOrdenadas, cartaJogadorNaMesa, vira) {
        if (Math.random() < 0.4) {
            // Joga carta aleatória
            const idx = Math.floor(Math.random() * cartasOrdenadas.length);
            return { indice: cartasOrdenadas[idx].idx, escondida: false };
        }
        // Joga a carta mais forte
        const maisForte = cartasOrdenadas[cartasOrdenadas.length - 1];
        return { indice: maisForte.idx, escondida: false };
    }

    // Médio: tenta ganhar com a menor carta possível
    jogadaMedio(cartasOrdenadas, cartaJogadorNaMesa, vira, turnoAtual, turnosGanhosIA, turnosGanhosJogador) {
        if (cartaJogadorNaMesa) {
            // O jogador já jogou, tenta ganhar com a menor carta possível
            const forcaJogador = forcaCarta(cartaJogadorNaMesa, vira);
            const cartaQueGanha = cartasOrdenadas.find(c => c.forca > forcaJogador);
            if (cartaQueGanha) {
                return { indice: cartaQueGanha.idx, escondida: false };
            }
            // Não consegue ganhar - joga a mais fraca
            return { indice: cartasOrdenadas[0].idx, escondida: false };
        }

        // Joga primeiro: usa carta média
        if (cartasOrdenadas.length >= 2) {
            const meio = Math.floor(cartasOrdenadas.length / 2);
            return { indice: cartasOrdenadas[meio].idx, escondida: false };
        }
        return { indice: cartasOrdenadas[0].idx, escondida: false };
    }

    // Avançado: estratégias mais sofisticadas
    jogadaAvancado(cartasOrdenadas, cartaJogadorNaMesa, vira, turnoAtual, turnosGanhosIA, turnosGanhosJogador) {
        if (cartaJogadorNaMesa) {
            const forcaJogador = forcaCarta(cartaJogadorNaMesa, vira);
            // Tenta ganhar com a menor carta possível
            const cartaQueGanha = cartasOrdenadas.find(c => c.forca > forcaJogador);

            if (cartaQueGanha) {
                // Se já ganhou 1 turno, usa carta mínima pra ganhar
                if (turnosGanhosIA >= 1) {
                    return { indice: cartaQueGanha.idx, escondida: false };
                }
                // Se é o último turno, joga a mais forte
                if (turnoAtual === 2) {
                    const maisForte = cartasOrdenadas[cartasOrdenadas.length - 1];
                    return { indice: maisForte.idx, escondida: false };
                }
                return { indice: cartaQueGanha.idx, escondida: false };
            }
            // Não consegue ganhar - joga a mais fraca
            return { indice: cartasOrdenadas[0].idx, escondida: false };
        }

        // Joga primeiro
        if (turnoAtual === 0) {
            // Primeiro turno: se tem manilha, guarda. Joga a segunda mais forte
            if (cartasOrdenadas.length >= 2) {
                const temManilha = cartasOrdenadas.some(c => c.ehManilha);
                if (temManilha) {
                    // Encontra a mais forte que não é manilha
                    const semManilha = cartasOrdenadas.filter(c => !c.ehManilha);
                    if (semManilha.length > 0) {
                        const melhorSemManilha = semManilha[semManilha.length - 1];
                        return { indice: melhorSemManilha.idx, escondida: false };
                    }
                }
                // Joga a mais forte
                return { indice: cartasOrdenadas[cartasOrdenadas.length - 1].idx, escondida: false };
            }
        }

        // Joga a mais forte disponível
        return { indice: cartasOrdenadas[cartasOrdenadas.length - 1].idx, escondida: false };
    }

    // Lenda: jogador imbatível
    jogadaLenda(cartasOrdenadas, cartaJogadorNaMesa, vira, turnoAtual, turnosGanhosIA, turnosGanhosJogador) {
        if (cartaJogadorNaMesa) {
            const forcaJogador = forcaCarta(cartaJogadorNaMesa, vira);

            // Se já ganhou 1 turno, ganha com o mínimo possível
            if (turnosGanhosIA >= 1) {
                const cartaQueGanha = cartasOrdenadas.find(c => c.forca > forcaJogador);
                if (cartaQueGanha) return { indice: cartaQueGanha.idx, escondida: false };
                // Se não pode ganhar mas já tem 1 turno, descarta fraca
                return { indice: cartasOrdenadas[0].idx, escondida: false };
            }

            // Precisa ganhar: usa a menor carta que ganha
            const cartaQueGanha = cartasOrdenadas.find(c => c.forca > forcaJogador);
            if (cartaQueGanha) return { indice: cartaQueGanha.idx, escondida: false };

            // Não consegue ganhar - descarta a mais fraca
            return { indice: cartasOrdenadas[0].idx, escondida: false };
        }

        // Joga primeiro - estratégia avançada
        if (turnoAtual === 0) {
            // Primeiro turno: joga carta forte mas guarda a melhor
            if (cartasOrdenadas.length >= 3) {
                // Se tem 2+ manilhas, joga a mais forte não-manilha no 1o turno
                const manilhas = cartasOrdenadas.filter(c => c.ehManilha);
                if (manilhas.length >= 2) {
                    const semManilha = cartasOrdenadas.filter(c => !c.ehManilha);
                    if (semManilha.length > 0) {
                        return { indice: semManilha[semManilha.length - 1].idx, escondida: false };
                    }
                    // Todas manilhas - joga a mais fraca
                    return { indice: manilhas[0].idx, escondida: false };
                }

                // Joga a segunda mais forte
                return { indice: cartasOrdenadas[cartasOrdenadas.length - 2].idx, escondida: false };
            }

            return { indice: cartasOrdenadas[cartasOrdenadas.length - 1].idx, escondida: false };
        }

        // Turnos seguintes: joga a mais forte
        return { indice: cartasOrdenadas[cartasOrdenadas.length - 1].idx, escondida: false };
    }

    /**
     * Decide se deve pedir truco
     */
    decidirPedirTruco(maoIA, vira, turnosGanhosIA, turnosGanhosJogador, valorRodadaAtual, pontosIA, pontosJogador) {
        const score = avaliarMao(maoIA, vira);
        const podeAumentar = valorRodadaAtual < 12;

        if (!podeAumentar) return false;

        switch (this.nivel) {
            case 'iniciante':
                // Só pede truco com mão muito boa, raramente
                return score >= 75 && Math.random() < 0.3;

            case 'medio':
                // Pede truco com mão boa ou blefe ocasional
                if (score >= 60) return Math.random() < 0.5;
                if (score >= 40 && turnosGanhosIA >= 1) return Math.random() < 0.3;
                // Blefe raro
                return Math.random() < 0.08;

            case 'avancado':
                // Mais agressivo
                if (score >= 50) return Math.random() < 0.6;
                if (turnosGanhosIA >= 1) return Math.random() < 0.45;
                // Blefe frequente
                if (score < 30 && Math.random() < 0.2) return true;
                // Se o adversário está quase ganhando, arrisca
                if (pontosJogador >= 9 && Math.random() < 0.4) return true;
                return Math.random() < 0.1;

            case 'lenda':
                // Muito agressivo e estratégico
                if (score >= 45) return Math.random() < 0.7;
                if (turnosGanhosIA >= 1) return Math.random() < 0.6;
                // Blefe calculado
                if (pontosIA >= 9) return Math.random() < 0.5; // Já está quase ganhando
                if (pontosJogador >= 9 && score < 30) return Math.random() < 0.3; // Pressiona
                // Blefe puro
                return Math.random() < 0.2;

            default:
                return false;
        }
    }

    /**
     * Decide resposta quando o jogador pede truco
     * Retorna: 'aceitar', 'correr', ou 'aumentar'
     */
    decidirRespostaTruco(maoIA, vira, turnosGanhosIA, turnosGanhosJogador, valorRodadaAtual, pontosIA, pontosJogador) {
        const score = avaliarMao(maoIA, vira);
        const podeAumentar = valorRodadaAtual < 12;

        switch (this.nivel) {
            case 'iniciante':
                // Corre fácil
                if (score < 40) return 'correr';
                if (score >= 70 && podeAumentar && Math.random() < 0.2) return 'aumentar';
                return Math.random() < 0.6 ? 'aceitar' : 'correr';

            case 'medio':
                if (score < 30) return 'correr';
                if (score >= 65 && podeAumentar && Math.random() < 0.35) return 'aumentar';
                if (score >= 40) return 'aceitar';
                return Math.random() < 0.4 ? 'aceitar' : 'correr';

            case 'avancado':
                if (score < 20) return Math.random() < 0.15 ? 'aceitar' : 'correr'; // Às vezes aceita na cara dura
                if (score >= 55 && podeAumentar && Math.random() < 0.45) return 'aumentar';
                if (score >= 30) return 'aceitar';
                // Já ganhou 1 turno? Aceita mais fácil
                if (turnosGanhosIA >= 1) return Math.random() < 0.6 ? 'aceitar' : 'correr';
                return Math.random() < 0.3 ? 'aceitar' : 'correr';

            case 'lenda':
                // Quase nunca corre
                if (score < 15 && turnosGanhosIA === 0) return Math.random() < 0.3 ? 'aceitar' : 'correr';
                if (score >= 45 && podeAumentar) return Math.random() < 0.55 ? 'aumentar' : 'aceitar';
                if (turnosGanhosIA >= 1) return podeAumentar && Math.random() < 0.4 ? 'aumentar' : 'aceitar';
                return 'aceitar'; // Lenda quase sempre aceita

            default:
                return 'aceitar';
        }
    }
}
