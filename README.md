# 🎮 PIXEL SURVIVORS - Top-Down Roguelite Arena

Uma página completa, imersiva e responsiva para o jogo **Pixel Survivors** (estilo *Vampire Survivors* em estética clássica de Pixel Art retrô dos anos 90), pronta para rodar e ser publicada no **Cloudflare Workers**.

---

## 🌟 O que foi construído

1. **Página Principal & Visual Retrô (`public/index.html` & `public/styles.css`)**:
   - **Estética Dark Fantasy Retrô**: Tipografia em pixel art (*Press Start 2P*, *Silkscreen*, *VT323*).
   - **Efeito CRT Scanlines**: Filtro de monitor de tubo de fliperama dos anos 90 com botão para Ligar/Desligar em tempo real.
   - **Brasas Mágicas Dinâmicas**: Partículas arcanas flutuantes ao fundo via Canvas de baixa sobrecarga.
   - **Tela Inicial Original em Destaque**: Moldura especial destacando a arte oficial e os controles da tela de apresentação (`assets/tela_inicial.jpeg`).

2. **Demo Jogável da Arena no Navegador (`public/game.js`)**:
   - Jogo funcional estilo *Vampire Survivors* rodando a 60 FPS no Canvas!
   - **Herói Mago** com animação de caminhada de 4 frames (`south_walk_0.png` até `south_walk_3.png`).
   - **Mira Automática (Auto-Aim)**: Dispara feitiços arcanos automaticamente no inimigo mais próximo.
   - **3 Inimigos com Comportamentos Únicos**:
     - 🟢 **Slime Verde (Comum)**: Enxame contínuo, velocidade moderada, drop de gemas verdes.
     - 🔴 **Morcego (Veloz)**: Voo rasante ultra rápido em direção ao mago, drop de gemas azuis.
     - 🔵 **Ogro Azul (Tanque)**: Mini-chefe colosso com muita vida e passos pesados, drop de gemas douradas.
   - **Sistema de Gemas de EXP & Magnetismo**: As gemas no chão são atraídas pelo herói quando ele se aproxima.
   - **Modal de Nível / Level Up Roguelite**: Ao encher a barra de EXP, o jogo pausa e você escolhe entre 3 aprimoramentos aleatórios (Orbes Orbitais Flamejantes, Nevasca em Área, Mais Projéteis, Botas de Velocidade, Poção de Vida, Aumento de Dano, etc.).
   - **Sintetizador de Áudio Chiptune 8-Bit (Web Audio API)**: Sons retrô gerados proceduralmente (tiro mágico, impacto, coleta de gema, fanfarra de level-up, dano e game over) sem depender de arquivos pesados de áudio externos, com botão de mutar/desmutar.
   - **Controles**: Suporte para teclado (`WASD` ou `Setas Direcionais`, tecla `P` para pausar) e direcional virtual para dispositivos móveis e touch.

3. **Inspecionador 360° do Herói Mago (`public/main.js`)**:
   - Visualizador interativo que permite girar o sprite do Mago nas **8 direções reais** fornecidas nos assets (`south`, `south-west`, `west`, `north-west`, `north`, `north-east`, `east`, `south-east`).
   - Botões de bússola, rotação automática contínua e arrasto com o mouse/dedo.

4. **Bestiário, Grimório de Magias, Roadmap & Newsletter**:
   - Cartões detalhados para cada criatura com barras de estatísticas e perigo.
   - Tabela de sinergias e fusões de feitiços arcanos.
   - Roadmap de desenvolvimento de 4 fases.
   - Formulário de inscrição para o Alfa fechado com feedback visual.

5. **Pronto para Cloudflare Workers (`wrangler.jsonc`, `wrangler.toml`, `src/index.js`)**:
   - Utiliza a arquitetura moderna de **Workers Static Assets** da Cloudflare (`assets: { directory: "./public" }`).
   - Script de borda (`src/index.js`) que serve os arquivos estáticos e disponibiliza endpoints de API:
     - `GET /api/health`: Status do Worker.
     - `GET /api/game-info`: Metadados do jogo, herói e monstros em formato JSON.
     - `POST /api/newsletter`: Endpoint para registrar inscrições de e-mail na nuvem da Cloudflare.

---

## 📁 Estrutura de Arquivos

```text
Site_game/
├── assets/                           # Imagens e sprites originais fornecidos
│   ├── tela inicial.jpeg
│   ├── P1/P1/animation/              # Animações de caminhada do mago
│   ├── P1/P1/Idle/rotations/         # Sprites nas 8 direções
│   └── enemies/                      # Sprites extraídos (Slime, Morcego, Ogro)
│
├── public/                           # Diretório servido no Cloudflare Workers
│   ├── index.html                    # Estrutura HTML semântica e responsiva
│   ├── styles.css                    # Estilos retrô, CRT filter, neon glow e responsividade
│   ├── game.js                       # Motor do jogo survivor, áudio chiptune e canvas
│   ├── main.js                       # Rotação 8 direções, toggles de som/CRT, newsletter
│   └── assets/                       # Mídia organizada para o site público
│       ├── tela_inicial.jpeg
│       ├── enemies/                  # slime.png, morcego.png, ogro.png
│       └── wizard/                   # south_walk_0..3, gif e pasta rotations/
│
├── src/
│   └── index.js                      # Worker script (Cloudflare Workers Static Assets & APIs)
│
├── wrangler.jsonc                    # Configuração moderna Cloudflare Workers
├── wrangler.toml                     # Configuração alternativa de compatibilidade
├── package.json                      # Scripts npm (dev, deploy)
└── README.md                         # Documentação do projeto
```

---

## 🚀 Como Executar Localmente

### Opção 1: Abrir diretamente no navegador (Zero instalação)
Basta dar dois cliques no arquivo `public/index.html` ou abrir pelo navegador (Google Chrome, Firefox, Edge, etc.). 
A página e a demo jogável funcionarão de imediato!

### Opção 2: Com um servidor HTTP local simples
Se tiver Python instalado:
```bash
python -m http.server 8080 --directory public
```
Ou com extensões como o **Live Server** do VS Code apontando para a pasta `public`.

---

## ☁️ Como Rodar e Publicar no Cloudflare Workers

O projeto está 100% configurado para o Cloudflare Workers usando o [Wrangler](https://developers.cloudflare.com/workers/wrangler/).

### 1. Pré-requisitos
Ter o [Node.js](https://nodejs.org/) instalado em seu computador.

### 2. Testar localmente no emulador do Cloudflare Workers
No terminal, na pasta raiz do projeto:
```bash
npx wrangler dev
```
O Wrangler iniciará um servidor local emulado do Cloudflare Workers (geralmente em `http://localhost:8787`), servindo o site estático e os endpoints de API.

### 3. Fazer Deploy para o Cloudflare Workers (Produção)
Para publicar seu site mundialmente na rede de borda da Cloudflare:
```bash
npx wrangler deploy
```
*Se for a primeira vez, o Wrangler abrirá uma janela no navegador solicitando login na sua conta Cloudflare gratuita. Em poucos segundos você receberá uma URL pública como `https://pixel-survivors.<seu-subdominio>.workers.dev`.*

---

## 🌐 Publicação Alternativa: Cloudflare Pages
Se preferir usar o **Cloudflare Pages**:
1. No painel da Cloudflare (dash.cloudflare.com), vá em **Workers & Pages** > **Create application** > **Pages**.
2. Conecte seu repositório Git ou faça **Upload Assets**.
3. Defina o diretório de build/saída para: `public`.
4. Clique em **Deploy**.

---

## 🕹️ Controles do Mini-Game
- **Mover o Herói:** Teclas `W`, `A`, `S`, `D` ou `Setas Direcionais` (ou D-Pad na tela em celulares).
- **Ataque:** 100% automático no monstro mais próximo.
- **Pausar Jogo:** Tecla `P` ou botão "Pausar" no rodapé do fliperama.
- **Tela Cheia:** Botão "Tela Cheia" para imersão total.
