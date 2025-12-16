# KIViagem - A Viagem Perfeita Começa Aqui

O **KIViagem** é um assistente de viagem completo, projetado para ser o seu copiloto inteligente na estrada. Focado em planejamento, economia e segurança, o aplicativo centraliza tudo o que você precisa para uma viagem de carro perfeita.

> Este projeto está em desenvolvimento ativo. A estrutura inicial está pronta, e as funcionalidades estão sendo implementadas com base no roadmap de produto.

---

## 🎯 Visão do Produto

O objetivo do KIViagem é ajudar o usuário a **planejar a viagem perfeita**, calculando custos, mostrando rotas, paradas úteis, clima e opções de aluguel de carro. Ele não é apenas um GPS, mas um assistente completo que guia o usuário desde o planejamento até a conclusão da viagem.

**Analogia:** Google Maps + Waze + um app de economia + um app de aluguel de carros, tudo em um só lugar.

---

## ✨ Funcionalidades Planejadas

O KIViagem foi projetado para oferecer um conjunto completo de ferramentas para o viajante:

| Funcionalidade | Status | Descrição |
|---|---|---|
| 🗺️ **Cálculo de Rota** | ⏳ Em desenvolvimento | Rota completa, distância e tempo estimado (via Google Directions API). |
| 💰 **Custo Total da Viagem** | ⏳ Em desenvolvimento | Cálculo automático de combustível e pedágios. |
| ⛽ **Postos e Preços** | ⏳ Em desenvolvimento | Localização de postos e preços de combustível no trajeto. |
| 🍽️ **Restaurantes no Trajeto** | ⏳ Em desenvolvimento | Sugestão de restaurantes bem avaliados próximos à rota (via Google Places API). |
| 🌦️ **Clima na Estrada** | ⏳ Em desenvolvimento | Previsão do tempo na origem, destino e pontos importantes da rota (via OpenWeather API). |
| 톨 **Pedágios e Valores** | ⏳ Em desenvolvimento | Mapeamento de pedágios e cálculo do custo total. |
| 🚗 **Sugestão de Carro Ideal** | 📅 Planejado | Recomendação do melhor carro para alugar com base na viagem. |
| 🧭 **Modo Viagem** | 📅 Planejado | Interface de navegação ao vivo com informações em tempo real (clima, postos, alertas). |
| 🏢 **Aluguel de Carros** | 📅 Planejado | Área dedicada para busca, comparação e sugestão de aluguel de veículos. |

---

## 🚀 Tecnologias Utilizadas

- **React Native**: Framework para desenvolvimento de aplicativos móveis nativos.
- **Expo**: Plataforma para desenvolvimento e build de aplicativos universais.
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática.
- **React Navigation**: Solução de roteamento e navegação.
- **Zustand**: Gerenciador de estado simples e poderoso.
- **Styled Components**: Biblioteca para estilização de componentes com CSS-in-JS.
- **React Native Maps**: Componente de mapa para iOS e Android.
- **Axios**: Cliente HTTP para realizar requisições a APIs.

---

## 🛠️ Como Executar o Projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [Yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/Metiieus/kiv-viagem.git
   cd kiv-viagem
   ```

2. **Instale as dependências:**
   ```bash
   yarn install
   ```

### Execução

Para iniciar o aplicativo em modo de desenvolvimento, execute um dos seguintes comandos:

- **Iniciar o Metro Bundler:**
  ```bash
  yarn start
  ```

- **Abrir no Android:**
  ```bash
  yarn android
  ```

- **Abrir no iOS:**
  ```bash
  yarn ios
  ```

- **Abrir no Navegador Web:**
  ```bash
  yarn web
  ```

Após iniciar o Metro Bundler, escaneie o QR Code com o aplicativo **Expo Go** (disponível para [Android](https://play.google.com/store/apps/details?id=host.exp.exponent) e [iOS](https://apps.apple.com/us/app/expo-go/id982107779)) para abrir o app no seu dispositivo.

---

## 🏗️ Estrutura do Projeto

O projeto segue uma arquitetura modular para garantir escalabilidade e organização:

```
kiv-viagem/
├── src/
│   ├── app/                # Configuração de rotas e navegação
│   ├── core/               # Recursos compartilhados (tema, constantes, hooks)
│   └── modules/            # Módulos de funcionalidades (trip, rent, etc.)
├── assets/                 # Imagens, fontes e outros recursos estáticos
├── App.tsx                 # Componente raiz
└── package.json            # Dependências e scripts
```

---

## 🤝 Contribuição

Este projeto está em desenvolvimento. Novas contribuições são bem-vindas. Se você tiver sugestões ou encontrar problemas, sinta-se à vontade para abrir uma *issue* ou enviar um *pull request*.
