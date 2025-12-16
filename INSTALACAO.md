# Guia de Instalação e Configuração - KIViagem

Este guia detalha todos os passos necessários para configurar e executar o aplicativo **KIViagem** em seu ambiente de desenvolvimento.

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior) - [Download](https://nodejs.org/)
- **npm** ou **yarn** - Gerenciador de pacotes
- **Expo CLI** - Instalado globalmente: `npm install -g expo-cli`
- **Expo Go** - Aplicativo para testar em dispositivos móveis
  - [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)
  - [iOS](https://apps.apple.com/us/app/expo-go/id982107779)

---

## 🚀 Passo 1: Clonar o Repositório

```bash
git clone https://github.com/Metiieus/kiv-viagem.git
cd kiv-viagem
```

---

## 📦 Passo 2: Instalar Dependências

Execute o comando abaixo para instalar todas as dependências do projeto:

```bash
npm install --legacy-peer-deps
```

> **Nota:** O flag `--legacy-peer-deps` é necessário devido a algumas incompatibilidades de versão entre dependências.

---

## 🔑 Passo 3: Configurar Variáveis de Ambiente

### 3.1. Criar arquivo .env

Copie o arquivo de exemplo e crie seu próprio arquivo `.env`:

```bash
cp .env.example .env
```

### 3.2. Obter Chaves de API

Você precisará obter chaves de API gratuitas dos seguintes serviços:

#### **Google Cloud Platform (Obrigatório)**

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative as seguintes APIs:
   - **Directions API** (para cálculo de rotas)
   - **Places API** (para buscar restaurantes e postos)
   - **Maps SDK for Android** (se for testar em Android)
   - **Maps SDK for iOS** (se for testar em iOS)
4. Vá em **Credenciais** → **Criar Credenciais** → **Chave de API**
5. Copie a chave gerada

**Créditos gratuitos:** US$ 200/mês (aproximadamente 40.000 requisições)

#### **OpenWeather API (Obrigatório)**

1. Acesse [OpenWeather](https://openweathermap.org/api)
2. Crie uma conta gratuita
3. Vá em **API Keys** e copie sua chave
4. A chave pode levar alguns minutos para ser ativada

**Limite gratuito:** 1.000 requisições/dia

#### **TollGuru API (Opcional)**

1. Acesse [TollGuru](https://tollguru.com/)
2. Crie uma conta
3. Obtenha sua chave de API

**Limite gratuito:** 200 requisições/mês

> **Para o MVP:** Você pode deixar a chave do TollGuru em branco e inserir os valores de pedágio manualmente.

### 3.3. Preencher o arquivo .env

Abra o arquivo `.env` e substitua os valores:

```env
GOOGLE_API_KEY=SUA_CHAVE_GOOGLE_AQUI
OPENWEATHER_API_KEY=SUA_CHAVE_OPENWEATHER_AQUI
TOLLGURU_API_KEY=SUA_CHAVE_TOLLGURU_AQUI
```

---

## ▶️ Passo 4: Executar o Aplicativo

### 4.1. Iniciar o Metro Bundler

```bash
npm start
```

ou

```bash
expo start
```

### 4.2. Abrir no Dispositivo

Após executar o comando acima, você verá um QR Code no terminal.

**No Android:**
1. Abra o aplicativo **Expo Go**
2. Toque em **Scan QR Code**
3. Escaneie o código exibido no terminal

**No iOS:**
1. Abra o aplicativo **Câmera** nativo
2. Aponte para o QR Code
3. Toque na notificação que aparecerá
4. O app abrirá no **Expo Go**

### 4.3. Executar em Emuladores (Opcional)

**Android:**
```bash
npm run android
```

**iOS (somente macOS):**
```bash
npm run ios
```

---

## 🧪 Passo 5: Testar as Funcionalidades

### Tela Home
- Navegue pelas diferentes funcionalidades do app

### Calcular Rota
1. Insira uma **origem** (ex: "São Paulo, SP")
2. Insira um **destino** (ex: "Rio de Janeiro, RJ")
3. Toque em **Calcular Rota**
4. Visualize a rota no mapa com distância e tempo estimado

### Calcular Custos
1. Insira a **distância** (em km)
2. Insira o **consumo do veículo** (km/L)
3. Insira o **preço do combustível** (R$/L)
4. (Opcional) Insira o **custo de pedágios**
5. Toque em **Calcular**
6. Veja o custo total da viagem

### Aluguel de Carros
- Navegue pela lista de carros disponíveis
- Veja recomendações baseadas em economia

### Modo Viagem
1. Toque em **Iniciar Rastreamento**
2. Permita o acesso à localização
3. Veja sua velocidade e coordenadas em tempo real

---

## 🐛 Solução de Problemas

### Erro: "Unable to resolve module @env"

**Solução:**
1. Limpe o cache do Metro Bundler:
   ```bash
   expo start -c
   ```
2. Certifique-se de que o arquivo `babel.config.js` está configurado corretamente

### Erro: "API key not valid"

**Solução:**
1. Verifique se a chave foi copiada corretamente no arquivo `.env`
2. Certifique-se de que as APIs estão habilitadas no Google Cloud Console
3. Aguarde alguns minutos para a chave ser ativada

### Mapa não aparece

**Solução:**
1. Verifique se a Google Maps API está habilitada
2. Certifique-se de que há conexão com a internet
3. Reinicie o aplicativo

### Erro de permissão de localização

**Solução:**
1. Vá nas configurações do dispositivo
2. Permita acesso à localização para o Expo Go
3. Reinicie o aplicativo

---

## 📱 Testando em Produção

Para gerar builds de produção para Android e iOS:

```bash
# Android (APK)
expo build:android

# iOS (IPA - requer conta Apple Developer)
expo build:ios
```

---

## 🆘 Suporte

Se encontrar problemas não listados aqui:

1. Verifique se todas as dependências foram instaladas corretamente
2. Certifique-se de que as chaves de API estão válidas
3. Consulte a documentação do [Expo](https://docs.expo.dev/)
4. Abra uma issue no repositório do GitHub

---

## ✅ Checklist de Configuração

- [ ] Node.js instalado
- [ ] Repositório clonado
- [ ] Dependências instaladas (`npm install --legacy-peer-deps`)
- [ ] Arquivo `.env` criado e preenchido
- [ ] Chave do Google Cloud Platform obtida e configurada
- [ ] Chave do OpenWeather obtida e configurada
- [ ] Aplicativo executado com sucesso (`npm start`)
- [ ] Testado no dispositivo via Expo Go
- [ ] Funcionalidades testadas (Rota, Custos, Aluguel, Modo Viagem)

---

**Pronto!** Agora você está com o KIViagem rodando em seu ambiente de desenvolvimento. Boa viagem! 🚗✨
