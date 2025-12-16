# Roadmap de Desenvolvimento: KIViagem

Este documento apresenta um roadmap detalhado para o desenvolvimento do aplicativo **KIViagem**, transformando a estrutura atual em um produto funcional e completo. O roadmap é dividido em fases, priorizando a entrega de valor em cada etapa.

---

## Fase 1: Fundação e MVP Essencial (1-2 semanas)

**Objetivo:** Lançar a primeira versão funcional (MVP) com as funcionalidades mais críticas.

### Tarefas Principais:

1.  **Configurar Ambiente de Desenvolvimento:**
    -   [ ] Criar um arquivo `.env` para armazenar as chaves de API (Google, OpenWeather, etc.).
    -   [ ] Adicionar `react-native-dotenv` ao projeto para gerenciar as variáveis de ambiente.
    -   [ ] Instalar as dependências que faltam: `expo-location`, `@react-native-async-storage/async-storage`.

2.  **Criar Telas Faltantes (Placeholders):**
    -   [ ] Criar os arquivos de tela vazios para evitar erros de navegação:
        -   `src/modules/trip/screens/Route/index.tsx`
        -   `src/modules/trip/screens/Costs/index.tsx`
        -   `src/modules/rent/screens/Rent/index.tsx`
        -   `src/modules/travelMode/screens/TravelMode/index.tsx`

3.  **Implementar Cálculo de Rota (Tela `Route`):
    -   [ ] Criar formulário de entrada para **Origem** e **Destino**.
    -   [ ] Integrar com a **Google Directions API** para buscar a rota.
    -   [ ] Utilizar o componente `MapView` de `react-native-maps` para exibir o mapa.
    -   [ ] Desenhar a polilinha da rota no mapa.
    -   [ ] Exibir a **distância** e o **tempo estimado** da viagem.

4.  **Implementar Cálculo de Custos (Tela `Costs`):
    -   [ ] Criar formulário para o usuário inserir:
        -   Consumo do veículo (km/L).
        -   Preço do combustível (com base na localização ou manual).
    -   [ ] Integrar com uma API de pedágios (ex: **TollGuru**) para obter os valores na rota.
    -   [ ] Calcular e exibir o **custo total da viagem** (combustível + pedágios).
    -   [ ] Usar o **Zustand** para gerenciar o estado dos custos e inputs do usuário.

### Entregáveis da Fase 1:

-   Aplicativo funcional que calcula rotas e custos de viagem.
-   Estrutura pronta para receber as próximas funcionalidades.
-   README.md completo no repositório.

---

## Fase 2: Enriquecimento da Experiência (2-3 semanas)

**Objetivo:** Adicionar funcionalidades que tornem o planejamento mais completo e inteligente.

### Tarefas Principais:

1.  **Implementar Clima na Estrada (Tela `Route`):
    -   [ ] Integrar com a **OpenWeather API**.
    -   [ ] Exibir o clima na **origem**, **destino** e em pontos-chave da rota.
    -   [ ] Criar componentes visuais para representar as condições climáticas (ícones de sol, chuva, etc.).
    -   [ ] Adicionar alertas para condições perigosas (neblina, chuva forte).

2.  **Implementar Paradas Úteis (Tela `Route`):
    -   [ ] Integrar com a **Google Places API**.
    -   [ ] Adicionar uma seção para listar **restaurantes bem avaliados** próximos à rota.
    -   [ ] Adicionar uma seção para listar **postos de combustível** no trajeto.
    -   [ ] Exibir informações úteis: nota, distância da rota, faixa de preço.
    -   [ ] Permitir que o usuário adicione uma parada à rota.

3.  **Implementar Modo Viagem (Básico) (Tela `TravelMode`):
    -   [ ] Utilizar `expo-location` para obter a localização do usuário em tempo real.
    -   [ ] Criar uma interface de navegação (HUD) que exibe:
        -   Velocidade atual.
        -   Tempo restante para o destino.
        -   Distância restante.
    -   [ ] Exibir o próximo passo da navegação (ex: "Vire à direita em 200m").

### Entregáveis da Fase 2:

-   Planejamento de viagem enriquecido com informações de clima e paradas.
-   Versão inicial do modo de navegação ao vivo.

---

## Fase 3: Funcionalidades de Aluguel e Sugestão (1-2 semanas)

**Objetivo:** Integrar o sistema de aluguel de carros, uma das principais propostas de valor.

### Tarefas Principais:

1.  **Implementar Sugestão de Carro Ideal (Tela `Rent`):
    -   [ ] Criar uma lógica de negócio para recomendar um tipo de carro (econômico, SUV, etc.) com base em:
        -   Distância da viagem.
        -   Número de passageiros.
        -   Tipo de terreno (se a informação estiver disponível).
    -   [ ] Exibir as sugestões de forma clara para o usuário.

2.  **Implementar Aba de Aluguel (Tela `Rent`):
    -   [ ] Pesquisar e integrar uma **API de afiliados de locadoras** (ex: Rentcars, ou similar) ou criar um sistema de listagem manual.
    -   [ ] Criar filtros para busca de veículos (data, local, categoria).
    -   [ ] Exibir uma lista de carros disponíveis com preços e características.
    -   [ ] Direcionar o usuário para a página de reserva da locadora.

### Entregáveis da Fase 3:

-   Funcionalidade completa de sugestão e busca de carros para aluguel.
-   Nova fonte de monetização para o aplicativo (via afiliados).

---

## Fase 4: Refinamento e Otimização (Contínuo)

**Objetivo:** Melhorar a experiência do usuário, a performance e a estabilidade do aplicativo.

### Tarefas Principais:

1.  **Melhorar a UX/UI:**
    -   [ ] Adicionar animações e transições suaves.
    -   [ ] Implementar *loading states* e *empty states* em todas as telas.
    -   [ ] Realizar testes de usabilidade com usuários reais.

2.  **Otimização de Performance:**
    -   [ ] Otimizar o carregamento dos mapas e das listas.
    -   [ ] Reduzir o consumo de bateria, especialmente no Modo Viagem.
    -   [ ] Analisar e otimizar o tamanho do bundle do aplicativo.

3.  **Testes e Qualidade:**
    -   [ ] Configurar um framework de testes (ex: **Jest** e **React Native Testing Library**).
    -   [ ] Escrever testes unitários para a lógica de negócio (cálculos, etc.).
    -   [ ] Escrever testes de integração para os fluxos principais (planejamento, navegação).

4.  **Persistência de Dados:**
    -   [ ] Utilizar `@react-native-async-storage/async-storage` para salvar:
        -   Histórico de viagens.
        -   Preferências do usuário (veículo, etc.).
        -   Última rota pesquisada.

### Entregáveis da Fase 4:

-   Aplicativo mais rápido, estável e agradável de usar.
-   Cobertura de testes para garantir a qualidade do código.
-   Funcionalidades de histórico e personalização.
