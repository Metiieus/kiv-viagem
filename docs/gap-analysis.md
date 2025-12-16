# Gap Analysis: KIViagem - Ideia vs. Implementação

## Resumo Executivo

O **KIViagem** possui uma visão de produto extremamente bem definida: um "copiloto inteligente" que combina planejamento de viagem, cálculo de custos, informações em tempo real e aluguel de carros. No entanto, o repositório atual contém apenas a **estrutura base** do aplicativo, sem nenhuma funcionalidade implementada.

**Gap de Implementação:** ~95% do produto ainda precisa ser desenvolvido.

---

## Comparação: Funcionalidades Planejadas vs. Implementadas

### ✅ O que está implementado

| Item | Status | Detalhes |
|------|--------|----------|
| Estrutura de navegação | ✅ Parcial | Rotas definidas mas telas não criadas |
| Sistema de tema | ✅ Completo | Cores, espaçamentos e bordas definidos |
| Configuração Expo | ✅ Completo | iOS, Android e Web configurados |
| TypeScript | ✅ Completo | Projeto totalmente tipado |
| Arquitetura modular | ✅ Completo | Separação clara de responsabilidades |

### ❌ O que falta implementar

| Funcionalidade | Prioridade MVP | Complexidade | APIs Necessárias |
|----------------|----------------|--------------|------------------|
| **1. Cálculo de rota** | 🔴 Crítica | Alta | Google Directions API |
| **2. Restaurantes no trajeto** | 🟡 Média | Média | Google Places API |
| **3. Postos próximos e preços** | 🔴 Crítica | Alta | Google Places + API de Preços |
| **4. Clima na estrada** | 🟡 Média | Baixa | OpenWeather API |
| **5. Pedágios + valores** | 🔴 Crítica | Alta | API de Pedágios (TollGuru ou similar) |
| **6. Custo total da viagem** | 🔴 Crítica | Média | Cálculo local baseado em inputs |
| **7. Sugestão de carro ideal** | 🟢 Baixa | Média | Lógica de negócio local |
| **8. Modo Viagem** | 🟡 Média | Alta | Integração com GPS + APIs em tempo real |
| **9. Aba de aluguel** | 🟢 Baixa | Alta | API de locadoras ou scraping |

---

## Análise Detalhada por Funcionalidade

### 🎯 Funcionalidade 1: Cálculo de Rota

**Status:** ❌ Não implementado  
**Prioridade MVP:** 🔴 Crítica  
**Complexidade:** Alta

**O que precisa:**
- Integração com Google Directions API
- Formulário de entrada (origem/destino)
- Visualização de mapa (react-native-maps já instalado ✅)
- Cálculo de distância e tempo
- Renderização da rota no mapa

**Tela correspondente:** `Route` (referenciada mas não criada)

**Dependências já instaladas:**
- ✅ `react-native-maps` (1.20.1)
- ✅ `axios` (^1.13.2)

**O que falta:**
- Criar componente de tela
- Configurar chave da API do Google
- Implementar lógica de requisição
- Criar interface de visualização

---

### 🍽️ Funcionalidade 2: Restaurantes no Trajeto

**Status:** ❌ Não implementado  
**Prioridade MVP:** 🟡 Média  
**Complexidade:** Média

**O que precisa:**
- Integração com Google Places API
- Filtro por tipo (restaurantes)
- Filtro por proximidade à rota
- Exibição de avaliações e preços
- Lista scrollável de resultados

**Tela correspondente:** Pode ser integrada à tela `Route` ou `Home`

**Dependências já instaladas:**
- ✅ `axios` (^1.13.2)

**O que falta:**
- Implementar busca de lugares
- Calcular proximidade à rota
- Criar componente de lista
- Implementar filtros

---

### ⛽ Funcionalidade 3: Postos Próximos e Preços

**Status:** ❌ Não implementado  
**Prioridade MVP:** 🔴 Crítica  
**Complexidade:** Alta

**O que precisa:**
- Integração com Google Places API (para localização)
- API de preços de combustível (ANP ou similar)
- Cálculo de distância até postos
- Ordenação por preço/distância
- Visualização em mapa e lista

**Tela correspondente:** Integrada ao `Modo Viagem` ou tela dedicada

**Desafios:**
- APIs de preço de combustível no Brasil são limitadas
- Pode requerer scraping ou dados manuais
- Atualização de preços em tempo real

---

### 🌦️ Funcionalidade 4: Clima na Estrada

**Status:** ❌ Não implementado  
**Prioridade MVP:** 🟡 Média  
**Complexidade:** Baixa

**O que precisa:**
- Integração com OpenWeather API
- Busca de clima por coordenadas
- Previsão para pontos da rota
- Alertas de condições perigosas
- Interface visual de clima

**Tela correspondente:** Integrada à tela `Route` ou `TravelMode`

**Dependências já instaladas:**
- ✅ `axios` (^1.13.2)

**O que falta:**
- Configurar chave da API
- Implementar requisições
- Criar componentes de visualização
- Sistema de alertas

---

### 💰 Funcionalidade 5: Pedágios + Valores

**Status:** ❌ Não implementado  
**Prioridade MVP:** 🔴 Crítica  
**Complexidade:** Alta

**O que precisa:**
- Integração com API de pedágios (TollGuru, Mapbox Toll API)
- Identificação de pedágios na rota
- Cálculo de valores por categoria de veículo
- Soma total de pedágios
- Visualização no mapa

**Tela correspondente:** `Costs` (referenciada mas não criada)

**Desafios:**
- APIs de pedágio no Brasil são escassas
- Pode requerer base de dados própria
- Valores variam por tipo de veículo

---

### 🧮 Funcionalidade 6: Custo Total da Viagem

**Status:** ❌ Não implementado  
**Prioridade MVP:** 🔴 Crítica  
**Complexidade:** Média

**O que precisa:**
- Formulário de entrada:
  - Consumo do veículo (km/l)
  - Preço do combustível
  - Tipo de veículo (para pedágios)
- Cálculo automático:
  - Combustível = (distância / consumo) × preço
  - Pedágios = soma dos pedágios
  - Total = combustível + pedágios
- Visualização clara dos custos

**Tela correspondente:** `Costs` (referenciada mas não criada)

**Dependências já instaladas:**
- ✅ Zustand (para gerenciar estado dos inputs)

**O que falta:**
- Criar tela de custos
- Implementar formulário
- Criar lógica de cálculo
- Configurar gerenciamento de estado

---

### 🚗 Funcionalidade 7: Sugestão de Carro Ideal

**Status:** ❌ Não implementado  
**Prioridade MVP:** 🟢 Baixa  
**Complexidade:** Média

**O que precisa:**
- Base de dados de veículos:
  - Consumo médio
  - Categoria (econômico, SUV, popular)
  - Adequação ao terreno
- Algoritmo de recomendação baseado em:
  - Distância da viagem
  - Tipo de terreno
  - Prioridade (economia vs. conforto)
- Interface de sugestão

**Tela correspondente:** `Rent` (referenciada mas não criada)

**O que falta:**
- Criar base de dados de veículos
- Implementar lógica de recomendação
- Criar interface de sugestão

---

### 🧭 Funcionalidade 8: Modo Viagem

**Status:** ❌ Não implementado  
**Prioridade MVP:** 🟡 Média  
**Complexidade:** Alta

**O que precisa:**
- Rastreamento GPS em tempo real
- Interface tipo HUD (Head-Up Display)
- Informações dinâmicas:
  - Tempo restante
  - Clima atual
  - Próximos postos/restaurantes
  - Alertas de trânsito
- Notificações push
- Modo de economia de bateria

**Tela correspondente:** `TravelMode` (referenciada mas não criada)

**Dependências necessárias:**
- Geolocation API (Expo Location)
- Background tasks
- Notificações (Expo Notifications)

**O que falta:**
- Instalar dependências de localização
- Implementar rastreamento GPS
- Criar interface HUD
- Sistema de alertas em tempo real

---

### 🏢 Funcionalidade 9: Aba de Aluguel

**Status:** ❌ Não implementado  
**Prioridade MVP:** 🟢 Baixa  
**Complexidade:** Alta

**O que precisa:**
- Integração com APIs de locadoras ou
- Sistema próprio de listagem
- Filtros:
  - Categoria de veículo
  - Faixa de preço
  - Localização
  - Datas
- Comparação de preços
- Link para reserva

**Tela correspondente:** `Rent` (referenciada mas não criada)

**Desafios:**
- APIs de locadoras são limitadas
- Pode requerer parcerias comerciais
- Alternativa: links afiliados

---

## Análise de Dependências

### ✅ Já Instaladas

| Biblioteca | Versão | Uso Planejado |
|------------|--------|---------------|
| `react-native-maps` | 1.20.1 | Visualização de rotas e mapas |
| `axios` | ^1.13.2 | Requisições HTTP para APIs |
| `zustand` | ^5.0.9 | Gerenciamento de estado global |
| `styled-components` | ^6.1.19 | Estilização de componentes |
| `@react-navigation/*` | ^7.x | Navegação entre telas |

### ❌ Faltam Instalar

| Biblioteca | Propósito |
|------------|-----------|
| `expo-location` | Rastreamento GPS para Modo Viagem |
| `expo-notifications` | Alertas e notificações |
| `@react-native-async-storage/async-storage` | Persistência local de dados |
| `react-native-dotenv` | Gerenciamento de variáveis de ambiente |
| `date-fns` ou `dayjs` | Manipulação de datas |

---

## Análise de APIs Necessárias

### APIs Externas Obrigatórias

| API | Funcionalidade | Custo | Alternativas |
|-----|----------------|-------|--------------|
| **Google Directions API** | Cálculo de rotas | Pago (créditos gratuitos limitados) | Mapbox Directions |
| **Google Places API** | Restaurantes e postos | Pago (créditos gratuitos limitados) | Foursquare, Yelp |
| **OpenWeather API** | Clima | Gratuito até 1000 req/dia | WeatherAPI, AccuWeather |
| **TollGuru API** | Pedágios | Pago | Base de dados própria |
| **API de Preços ANP** | Preços de combustível | Gratuito (dados públicos) | Scraping de sites |

### Chaves de API Necessárias

Para o MVP funcionar, você precisará de:

1. ✅ Google Cloud Platform (Directions + Places)
2. ✅ OpenWeather API Key
3. ⚠️ TollGuru API Key (ou alternativa)
4. ⚠️ API de preços de combustível (ou scraping)

---

## Estrutura de Telas Faltantes

### Telas Referenciadas mas Não Criadas

```
src/modules/
├── trip/
│   └── screens/
│       ├── Home/
│       │   └── index.tsx ✅ (existe mas vazia)
│       ├── Route/
│       │   └── index.tsx ❌ NÃO EXISTE
│       └── Costs/
│           └── index.tsx ❌ NÃO EXISTE
├── rent/
│   └── screens/
│       └── Rent/
│           └── index.tsx ❌ NÃO EXISTE
└── travelMode/
    └── screens/
        └── TravelMode/
            └── index.tsx ❌ NÃO EXISTE
```

**Ação necessária:** Criar 4 arquivos de tela para evitar crashes ao navegar.

---

## Estimativa de Esforço

### Distribuição de Trabalho por Fase

| Fase | Esforço | Descrição |
|------|---------|-----------|
| **Fase 1: Estrutura Base** | ✅ 5% | Navegação, tema, configuração |
| **Fase 2: MVP Core** | ⏳ 40% | Rotas, custos, pedágios, clima |
| **Fase 3: Features Avançadas** | ⏳ 30% | Modo Viagem, sugestões, otimizações |
| **Fase 4: Aluguel** | ⏳ 15% | Sistema de aluguel completo |
| **Fase 5: Polish** | ⏳ 10% | UX, testes, otimizações |

**Total implementado:** ~5%  
**Total restante:** ~95%

---

## Priorização para MVP

### 🔴 Crítico (Sem isso o app não funciona)

1. ✅ Criar telas faltantes (Route, Costs, Rent, TravelMode)
2. ✅ Implementar cálculo de rota (Google Directions)
3. ✅ Implementar cálculo de custos (combustível + pedágios)
4. ✅ Visualização de rota no mapa
5. ✅ Configurar variáveis de ambiente para API keys

### 🟡 Importante (Agrega valor significativo)

6. ✅ Clima na estrada (OpenWeather)
7. ✅ Restaurantes no trajeto (Google Places)
8. ✅ Postos próximos (Google Places)
9. ✅ Modo Viagem básico (GPS + tempo restante)

### 🟢 Desejável (Pode ser adicionado depois)

10. ⏳ Sugestão de carro ideal
11. ⏳ Sistema de aluguel completo
12. ⏳ Alertas avançados no Modo Viagem
13. ⏳ Histórico de viagens
14. ⏳ Compartilhamento de rotas

---

## Conclusão

O **KIViagem** tem uma visão de produto excepcional e bem documentada. A estrutura técnica está corretamente estabelecida, mas o desenvolvimento das funcionalidades core ainda não começou. O próximo passo crítico é implementar o MVP com as funcionalidades essenciais (rotas, custos, clima) antes de avançar para features mais complexas como Modo Viagem e Aluguel.

**Recomendação:** Seguir o roadmap de desenvolvimento proposto, priorizando as funcionalidades críticas do MVP e garantindo que todas as APIs necessárias estejam configuradas e funcionais antes de avançar para features secundárias.
