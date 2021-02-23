new Vue({
    el: '#app',
    data: {
        running: false, //Determina se o jogo está executando ou não
        playerLife: 100, //Vida do Jogador (começa com 100%)
        monsterLife: 100, //Vida do Monstro (começa com 100%)
        logs: [] //Esse array armazenará todos os logs registrados
    },
    computed: {
        hasResult() {
            //Verificando se alguém ganhou a luta
            return this.playerLife == 0 || this.monsterLife == 0
        }
    },
    methods: {
        startGame() { //Método que inicia o jogo
            this.running = true
            this.playerLife = 100
            this.monsterLife = 100
            this.logs = []
        },
        attack(special) { //método que faz o ataque
            this.hurt('monsterLife',6, 11, special, 'Jogador', 'Monstro', 'player') //Definimos qual o range de ataque do lutador (nos 2º e 3º parâmetros)

            //Verificando se o monstro morreu (pois ai não precisa continuar)
            if(this.monsterLife > 0)
            {
                this.hurt('playerLife',1, 14, false, 'Monstro', 'Jogador', 'monster') //Definimos qual o range de ataque do monster (nos 2º e 3º parâmetros)
            }            
        },
        hurt(fighter, min, max, special, source, target, cls){ //Verá se é um ataque especial ou não (source é de onde vem o ataque, target é o alvo do ataque e cls é a classe de estilo)
            const plus = special ? 5 : 0  //Se for especial recebe 5, se não, recebe 0
            const hurt = this.getRandom(min + plus, max + plus) //Calculando o impacto
            this[fighter] = Math.max(this.playerLife - hurt, 0) //Para o life não ficar negativo (Math.max() pega o maior número entre os dois parâmetros)

            //Registrando a ação na luta (para exibir)
            this.registerLog(`${source} atingiu ${target} com ${hurt} de power`, cls)

        },
        cureAndHurt() { //Chamando o método que chamará o método de curar (mas também causará dano no player)
            this.cure(10, 15) //Chamando o método de curar
            this.hurt('playerLife', 5, 10, false, 'Monstro', 'Jogador', 'monster') //Causando um dano no player após ele se curar
        },
        cure(min, max) { //Método de calcular a cura (porém quando vc clica em cura, tanto você é curado quanto você é atacado e o monster recebe uma pequena cura)
            const curePlayer = this.getRandom(min, max) //Curando o Player
            const cureMonster = this.getRandom(1, 2)//Curando o Monster
            this.playerLife = Math.min(this.playerLife + curePlayer, 100) //A cura não pode ser maior que 100 (Math.min() pega o menor número entre os dois parâmetros)
            this.monsterLife = Math.min(this.monsterLife + cureMonster, 100) //A cura não pode ser maior que 100 (Math.min() pega o menor número entre os dois parâmetros)
            this.registerLog(`Jogador curou ${curePlayer} de life`, 'player') //Registrando o log de cura do player
            this.registerLog(`Monstro curou ${cureMonster} de life`, 'monster') //Registrando o log de cura do monster
        },
        getRandom(min, max) { //Calculando um valor randômico que definirá o poder do ataque
            const value = Math.random() * (max - min) + min
            return Math.round(value)
        },
        registerLog(text, cls) { //Registra o log da luta e aplica estilo em cada um dos registros de log
            this.logs.unshift({ text, cls }) //unshift() insere o elemento na primeira posição do array
        }

    },
    watch: {
        hasResult(value) { //Verificando se está havendo luta (se não houver, nós tiraremos os botões de ataque, etc...)
            if(value){
                this.running = false
            }
        }
    }
})