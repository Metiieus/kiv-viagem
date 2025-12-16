# Kiv Viagem 🚗💨

**Kiv Viagem** é o seu assistente inteligente para mobilidade, projetado para atender tanto suas necessidades cotidianas na cidade quanto suas grandes aventuras na estrada.

O app possui uma "dupla personalidade" única, adaptando-se ao seu momento:

## 🏙️ Modo Urbano (Dia a Dia)
Ideal para a correria da cidade.
- **Navegação Livre**: Um velocímetro e mapa 3D para acompanhar seu trajeto sem destino definido.
- **Busca Rápida**: Digite "Para onde vamos?" e inicie a navegação imediatamente, sem burocracias.
- **Interface Limpa**: Foco total no mapa e na condução.

## 🛣️ Modo Viagem (Planejamento)
Ferramentas completas para cair na estrada com segurança e controle.
- **Planejador de Rotas**: Defina Origem e Destino com precisão (Google Places).
- **Estimativa de Custos**: Saiba exatamente quanto vai gastar com **Combustível** e **Pedágios**.
- **Gestão de Veículos**: Cadastre seu carro (consumo, tipo de combustível) para cálculos precisos.
- **Navegação GPS 3D**: Hud estilo Waze com instruções passo-a-passo, tempo restante e alertas.

---

## 🚀 Tecnologias
- **React Native (Expo)**: Performance e compatibilidade Cross-platform.
- **Google Maps Platform**:
    - *Maps SDK*: Renderização de mapas fluidos.
    - *Places API (New)*: Busca inteligente de endereços.
    - *Directions API*: Traçados de rota e instruções de manobra.
- **Expo Location**: Rastreamento GPS preciso em tempo real.

## 🛠️ Como Rodar

1.  **Instale as dependências**:
    ```bash
    npm install
    # ou
    yarn install
    ```

2.  **Configuração**:
    Crie um arquivo `.env` na raiz baseado no `.env.example` e adicione sua chave da Google Cloud:
    ```env
    GOOGLE_API_KEY=sua_chave_aqui
    ```

3.  **Inicie o App**:
    ```bash
    npx expo start -c
    ```

## 📱 Funcionalidades de Destaque
- **Toggle Inteligente**: Alterne entre "Cidade" e "Viagem" com um toque na tela inicial.
- **Modo Livre**: Monitore sua velocidade e o trânsito mesmo sem rota traçada.
- **Cálculo de Pedágio**: Estimativas automáticas baseadas na distância da rota.

---
*Desenvolvido com foco na experiência do motorista.*
