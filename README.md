# 🎮 PIXEL SURVIVORS - Top-Down Roguelite Arena

Uma página completa, imersiva e responsiva para o jogo **Pixel Survivors** (estilo *Vampire Survivors* em estética clássica de Pixel Art retrô dos anos 90), com **Demo Jogável no Navegador** e **Download do Executável (.exe) para Windows**, pronta para rodar e ser publicada no **Cloudflare Workers**.

---

## 🌟 O que foi construído

1. **Página Principal & Visual Retrô (`public/index.html` & `public/styles.css`)**:
   - **Estética Dark Fantasy Retrô**: Tipografia em pixel art (*Press Start 2P*, *Silkscreen*, *VT323*).
   - **Efeito CRT Scanlines**: Filtro de monitor de tubo de fliperama dos anos 90 com botão para Ligar/Desligar em tempo real.
   - **Brasas Mágicas Dinâmicas**: Partículas arcanas flutuantes ao fundo via Canvas de baixa sobrecarga.
   - **Tela Inicial Original em Destaque**: Moldura especial destacando a arte oficial e os controles da tela de apresentação (`assets/tela_inicial.jpeg`).

2. **Área de Download Oficial para Windows (.exe) (`#download`)**:
   - **Executável Direto (`PixelSurvivors.exe`)**: Launcher portátil ultraleve compilado nativamente para Windows 10 e 11 (64-bit).
   - **Pacote Completo Portátil (`PixelSurvivors-v0.9.0-Windows-x64.zip`)**: Pacote com executável, manual de instruções e cópia completa dos assets do jogo para rodar 100% offline em qualquer PC.
   - **Vantagens da Versão .EXE em Destaque**:
     - ⚡ Taxa de quadros destravada (144Hz / 240Hz+) sem limitações de abas de navegador.
     - 🎮 Suporte nativo a gamepads USB e Bluetooth (Xbox, PlayStation, 8BitDo).
     - 📴 100% Offline: Jogue em viagens sem consumir internet.
     - 🛡️ Menor latência de entrada e menor consumo de RAM.
   - **Tabela de Requisitos de Sistema**: Requisitos mínimos e recomendados.
   - **Guia do Windows SmartScreen**: Instruções claras passo a passo para o usuário executar o jogo sem dúvidas sobre alertas de certificados em jogos indie recém-compilados.
   - **Notificação Interativa (Toast)**: Feedback sonoro e visual instantâneo ao clicar em qualquer botão de download.

3. **Demo Jogável da Arena no Navegador (`public/game.js`)**:
   - Jogo funcional estilo *Vampire Survivors* rodando a 60 FPS no Canvas!
   - **Herói Mago**: Movimentação com animação de caminhada de 4 frames (`south_walk_0.png` até `south_walk_3.png`).
   - **Mira Automática (Auto-Aim)**: Dispara feitiços arcanos automaticamente no inimigo mais próximo.
   - **3 Inimigos com Comportamentos Únicos**:
     - 🟢 **Slime Verde (Comum)**: Enxame contínuo, velocidade moderada, drop de gemas verdes.
     - 🔴 **Morcego (Veloz)**: Voo rasante ultra rápido em direção ao mago, drop de gemas azuis.
     - 🔵 **Ogro Azul (Tanque)**: Mini-chefe colosso com muita vida e passos pesados, drop de gemas douradas.
   - **Sistema de Gemas de EXP & Magnetismo**: As gemas no chão são atraídas pelo herói quando ele se aproxima.
   - **Modal de Nível / Level Up Roguelite**: Ao encher a barra de EXP, o jogo pausa e você escolhe entre 3 aprimoramentos aleatórios (Orbes Orbitais Flamejantes, Nevasca em Área, Mais Projéteis, Botas de Velocidade, Poção de Vida, Aumento de Dano, etc.).
   - **Sintetizador de Áudio Chiptune 8-Bit (Web Audio API)**: Sons retrô gerados proceduralmente (tiro mágico, impacto, coleta de gema, fanfarra de level-up, dano e game over) sem depender de arquivos pesados de áudio externos, com botão de mutar/desmutar.
   - **Controles**: Suporte para teclado (`WASD` ou `Setas Direcionais`, tecla `P` para pausar) e direcional virtual para dispositivos móveis e touch.

4. **Inspecionador 360° do Herói Mago (`public/main.js`)**:
   - Visualizador interativo que permite girar o sprite do Mago nas **8 direções reais** fornecidas nos assets (`south`, `south-west`, `west`, `north-west`, `north`, `north-east`, `east`, `south-east`).
   - Botões de bússola, rotação automática contínua e arrasto com o mouse/dedo.

5. **Bestiário, Grimório de Magias, Roadmap & Newsletter**:
   - Cartões detalhados para cada criatura com barras de estatísticas e perigo.
   - Tabela de sinergias e fusões de feitiços arcanos.
   - Roadmap de desenvolvimento de 4 fases.
   - Formulário de inscrição para o Alfa fechado com feedback visual.

6. **Pronto para Cloudflare Workers (`wrangler.jsonc`, `wrangler.toml`, `src/index.js`)**:
   - Utiliza a arquitetura moderna de **Workers Static Assets** da Cloudflare (`assets: { directory: "./public" }`).
   - Script de borda (`src/index.js`) que serve os arquivos estáticos e disponibiliza endpoints de API:
     - `GET /api/health`: Status do Worker.
     - `GET /api/game-info`: Metadados do jogo, herói e monstros em formato JSON.
     - `GET /api/downloads`: Informações dos arquivos para download, versão e checksum SHA-256.
     - `GET /download/exe` e `GET /download/zip`: Redirecionamentos diretos para os arquivos de download.
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
│   ├── styles.css                    # Estilos retrô, CRT filter, seções de download e demo
│   ├── game.js                       # Motor do jogo survivor, áudio chiptune e canvas
│   ├── main.js                       # Rotação 8 direções, download toast, toggles de som/CRT
│   ├── downloads/                    # Arquivos executáveis para download
│   │   ├── PixelSurvivors.exe        # Executável portátil oficial para Windows
│   │   └── PixelSurvivors-v0.9.0-Windows-x64.zip # Pacote completo portátil offline
│   └── assets/                       # Mídia organizada para o site público
│       ├── icon.ico                  # Ícone pixel art do executável
│       ├── tela_inicial.jpeg
│       ├── enemies/                  # slime.png, morcego.png, ogro.png
│       └── wizard/                   # south_walk_0..3, gif e pasta rotations/
│
├── src/
│   └── index.js                      # Worker script (Cloudflare Workers Static Assets & APIs)
│
├── src-desktop/
│   └── Program.cs                    # Código-fonte C# do launcher desktop Windows
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
A página, a demo jogável e os downloads funcionarão de imediato!

### Opção 2: Jogar pelo Executável Windows (.exe)
Basta dar dois cliques em `public/downloads/PixelSurvivors.exe` para abrir o launcher desktop.

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
O Wrangler iniciará um servidor local emulado do Cloudflare Workers em `http://localhost:8787`, servindo tanto a página web quanto os arquivos de download (`.exe` e `.zip`).

### 3. Fazer Deploy para o Cloudflare Workers (Produção)
Para publicar seu site mundialmente na rede de borda da Cloudflare:
```bash
npx wrangler deploy
```
*Se for a primeira vez, o Wrangler abrirá uma janela no navegador solicitando login na sua conta Cloudflare gratuita. Em poucos segundos você receberá uma URL pública como `https://pixel-survivors.<seu-subdominio>.workers.dev`.*

---

## 🔄 Como Atualizar ou Recompilar o .EXE

Se você fizer alterações no launcher em `src-desktop/Program.cs`, pode recompilá-lo facilmente no Windows usando o compilador nativo do .NET Framework com o comando:

```powershell
$csc = "C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe"
& $csc /target:winexe "/win32icon:public\assets\icon.ico" "/out:public\downloads\PixelSurvivors.exe" /reference:System.Windows.Forms.dll,System.Drawing.dll,System.dll src-desktop\Program.cs
```
Ou se você gerar um `.exe` a partir de uma engine como Godot, Unity, GameMaker ou Love2D, basta colocar o arquivo gerado dentro de `public/downloads/` com o nome `PixelSurvivors.exe`.
