# Especificação Técnica: APIs e Integrações do KIViagem

Este documento detalha todas as APIs externas necessárias para o funcionamento completo do **KIViagem**, incluindo configuração, custos, limitações e alternativas.

---

## 1. Google Directions API

### Propósito

A Google Directions API é responsável por calcular rotas entre dois pontos, fornecendo informações detalhadas sobre o caminho, distância e tempo estimado de viagem.

### Funcionalidades no KIViagem

- Cálculo de rota entre origem e destino.
- Obtenção de distância total em quilômetros.
- Tempo estimado de viagem.
- Coordenadas da polilinha para desenhar a rota no mapa.

### Configuração

Para utilizar a API, é necessário obter uma chave de API no Google Cloud Platform. A chave deve ser armazenada em um arquivo `.env` e acessada de forma segura no aplicativo.

**Exemplo de requisição:**

```javascript
import axios from 'axios';

const getRoute = async (origin, destination) => {
  const apiKey = process.env.GOOGLE_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${apiKey}`;
  
  const response = await axios.get(url);
  return response.data;
};
```

### Custos e Limitações

O Google Cloud Platform oferece um crédito mensal gratuito de **US$ 200**, o que cobre aproximadamente **40.000 requisições** da Directions API por mês. Após esse limite, o custo é de **US$ 5 por 1.000 requisições**.

**Recomendação:** Implementar cache de rotas e limitar requisições desnecessárias para otimizar o uso da API.

### Alternativas

- **Mapbox Directions API:** Oferece até **100.000 requisições gratuitas por mês**. É uma alternativa viável e mais econômica.
- **OpenRouteService:** Gratuito para uso não comercial, com algumas limitações de taxa de requisição.

---

## 2. Google Places API

### Propósito

A Google Places API permite buscar informações sobre locais próximos a uma determinada localização, incluindo restaurantes, postos de combustível, hotéis e outros pontos de interesse.

### Funcionalidades no KIViagem

- Busca de restaurantes bem avaliados próximos à rota.
- Busca de postos de combustível ao longo do trajeto.
- Exibição de avaliações, preços e distância.

### Configuração

A mesma chave de API do Google Cloud Platform pode ser utilizada para acessar a Places API. É necessário habilitar a API no console do Google Cloud.

**Exemplo de requisição:**

```javascript
const getNearbyPlaces = async (latitude, longitude, type) => {
  const apiKey = process.env.GOOGLE_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=${type}&key=${apiKey}`;
  
  const response = await axios.get(url);
  return response.data.results;
};
```

### Custos e Limitações

A Places API tem um custo de **US$ 17 por 1.000 requisições** para buscas de texto e **US$ 32 por 1.000 requisições** para buscas detalhadas (com fotos e avaliações). O crédito gratuito mensal de **US$ 200** cobre aproximadamente **11.000 requisições básicas**.

**Recomendação:** Utilizar buscas básicas sempre que possível e implementar cache de resultados.

### Alternativas

- **Foursquare Places API:** Oferece até **100.000 requisições gratuitas por mês**.
- **Yelp Fusion API:** Gratuito para até **5.000 requisições por dia**, ideal para buscar restaurantes.

---

## 3. OpenWeather API

### Propósito

A OpenWeather API fornece previsões meteorológicas e informações climáticas em tempo real para qualquer localização geográfica.

### Funcionalidades no KIViagem

- Exibição do clima na origem e no destino.
- Previsão do tempo em pontos-chave da rota.
- Alertas de condições climáticas perigosas (chuva forte, neblina).

### Configuração

É necessário criar uma conta gratuita no site da OpenWeather e obter uma chave de API. A chave deve ser armazenada no arquivo `.env`.

**Exemplo de requisição:**

```javascript
const getWeather = async (latitude, longitude) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=pt_br`;
  
  const response = await axios.get(url);
  return response.data;
};
```

### Custos e Limitações

A versão gratuita da OpenWeather API permite até **1.000 requisições por dia** e **60 requisições por minuto**. Para uso comercial ou maior volume, é necessário assinar um plano pago, que começa em **US$ 40 por mês** para até **100.000 requisições**.

**Recomendação:** Implementar cache de previsões climáticas para reduzir o número de requisições.

### Alternativas

- **WeatherAPI:** Oferece até **1.000.000 de requisições gratuitas por mês**.
- **AccuWeather API:** Gratuito para até **50 requisições por dia**.

---

## 4. TollGuru API (Pedágios)

### Propósito

A TollGuru API calcula os custos de pedágios em uma determinada rota, considerando o tipo de veículo e a categoria da via.

### Funcionalidades no KIViagem

- Identificação de pedágios ao longo da rota.
- Cálculo do custo total de pedágios.
- Exibição de cada pedágio individualmente no mapa.

### Configuração

É necessário criar uma conta no site da TollGuru e obter uma chave de API. A API aceita requisições com coordenadas de origem e destino.

**Exemplo de requisição:**

```javascript
const getTolls = async (origin, destination) => {
  const apiKey = process.env.TOLLGURU_API_KEY;
  const url = `https://apis.tollguru.com/toll/v2/origin-destination-waypoints`;
  
  const response = await axios.post(url, {
    source: origin,
    destination: destination,
    vehicleType: '2AxlesAuto',
  }, {
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
    },
  });
  
  return response.data;
};
```

### Custos e Limitações

A TollGuru oferece um plano gratuito com **200 requisições por mês**. Planos pagos começam em **US$ 49 por mês** para até **5.000 requisições**.

**Recomendação:** Para o MVP, utilizar o plano gratuito e implementar cache de rotas. Para produção, considerar criar uma base de dados própria de pedágios no Brasil.

### Alternativas

- **Mapbox Toll API:** Integrado com a Mapbox Directions API, mas com custos adicionais.
- **Base de dados própria:** Criar e manter uma base de dados de pedágios no Brasil, atualizada manualmente ou via scraping.

---

## 5. API de Preços de Combustível (ANP)

### Propósito

A Agência Nacional do Petróleo (ANP) disponibiliza dados públicos sobre os preços de combustível em postos de todo o Brasil.

### Funcionalidades no KIViagem

- Exibição de preços médios de combustível na região da viagem.
- Comparação de preços entre postos próximos à rota.

### Configuração

A ANP disponibiliza os dados em formato CSV, que podem ser baixados e processados. Não há uma API REST oficial, mas é possível criar um sistema de scraping ou utilizar serviços de terceiros que agregam esses dados.

**Alternativa:** Utilizar a API do **Preço da Hora** (se disponível) ou criar um sistema próprio de coleta e atualização de preços.

### Custos e Limitações

Os dados da ANP são públicos e gratuitos. No entanto, é necessário implementar um sistema de coleta e processamento dos dados, o que pode demandar tempo de desenvolvimento.

**Recomendação:** Para o MVP, permitir que o usuário insira manualmente o preço do combustível. Em versões futuras, integrar com uma fonte de dados automatizada.

### Alternativas

- **Preço da Hora API:** Serviço pago que agrega preços de combustível em tempo real.
- **Scraping de sites:** Coletar dados de sites como "Preço dos Combustíveis" ou similares.

---

## 6. Expo Location (GPS e Geolocalização)

### Propósito

O Expo Location é uma biblioteca nativa do Expo que permite acessar a localização do dispositivo em tempo real, essencial para o Modo Viagem.

### Funcionalidades no KIViagem

- Rastreamento da posição do usuário durante a viagem.
- Cálculo da distância restante até o destino.
- Exibição da velocidade atual.

### Configuração

A biblioteca já está incluída no Expo. É necessário solicitar permissões de localização ao usuário.

**Exemplo de uso:**

```javascript
import * as Location from 'expo-location';

const getCurrentLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  
  if (status !== 'granted') {
    console.error('Permissão de localização negada');
    return;
  }
  
  const location = await Location.getCurrentPositionAsync({});
  return location.coords;
};
```

### Custos e Limitações

O Expo Location é gratuito e não possui limitações de uso. No entanto, o rastreamento contínuo de GPS pode consumir bateria rapidamente, especialmente em viagens longas.

**Recomendação:** Implementar um modo de economia de bateria que reduz a frequência de atualização da localização.

---

## Resumo de Custos Mensais (Estimativa)

Considerando um uso moderado do aplicativo com **1.000 usuários ativos por mês**, cada um realizando em média **2 planejamentos de viagem**:

| API | Requisições Mensais | Custo Estimado |
|-----|---------------------|----------------|
| Google Directions API | 2.000 | Gratuito (dentro do crédito de US$ 200) |
| Google Places API | 4.000 | Gratuito (dentro do crédito de US$ 200) |
| OpenWeather API | 2.000 | Gratuito (dentro do limite de 1.000/dia) |
| TollGuru API | 2.000 | US$ 49/mês (plano básico) |
| **Total** | - | **~US$ 49/mês** |

Para reduzir custos, é possível implementar cache agressivo de rotas e resultados, além de utilizar alternativas gratuitas como Mapbox e WeatherAPI.

---

## Recomendações Finais

Para o desenvolvimento do MVP, é recomendado utilizar as versões gratuitas das APIs e implementar mecanismos de cache para otimizar o uso. Conforme o aplicativo ganhar tração e usuários, será necessário migrar para planos pagos ou desenvolver soluções próprias para reduzir a dependência de serviços de terceiros.

A escolha de APIs alternativas (como Mapbox e WeatherAPI) pode reduzir significativamente os custos operacionais, especialmente nas fases iniciais do projeto.
