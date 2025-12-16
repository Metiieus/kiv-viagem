# Próximos Passos: KIViagem

Este documento apresenta um guia prático e objetivo dos próximos passos para transformar o **KIViagem** de uma estrutura inicial em um aplicativo funcional. Os passos estão organizados por prioridade e dependência técnica.

---

## Passo 1: Configurar o Ambiente de Desenvolvimento

Antes de começar a implementar funcionalidades, é fundamental preparar o ambiente para trabalhar com APIs e variáveis sensíveis de forma segura.

### Ações Necessárias:

**1.1. Instalar dependências faltantes:**

Execute os seguintes comandos no terminal, dentro do diretório do projeto:

```bash
npm install react-native-dotenv
npm install expo-location
npm install @react-native-async-storage/async-storage
npm install date-fns
```

**1.2. Configurar variáveis de ambiente:**

Crie um arquivo `.env` na raiz do projeto para armazenar as chaves de API:

```env
GOOGLE_API_KEY=sua_chave_aqui
OPENWEATHER_API_KEY=sua_chave_aqui
TOLLGURU_API_KEY=sua_chave_aqui
```

**1.3. Configurar o Babel para usar o dotenv:**

Edite o arquivo `babel.config.js` e adicione o plugin:

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module:react-native-dotenv', {
        moduleName: '@env',
        path: '.env',
      }]
    ]
  };
};
```

**1.4. Adicionar o `.env` ao `.gitignore`:**

Certifique-se de que o arquivo `.env` está listado no `.gitignore` para não expor suas chaves de API:

```
.env
```

**1.5. Obter as chaves de API:**

Acesse os seguintes sites para criar contas e obter as chaves necessárias:

- **Google Cloud Platform:** https://console.cloud.google.com/ (habilite Directions API e Places API)
- **OpenWeather:** https://openweathermap.org/api
- **TollGuru:** https://tollguru.com/ (opcional para o MVP inicial)

---

## Passo 2: Criar as Telas Faltantes (Placeholders)

Atualmente, o sistema de navegação referencia telas que não existem fisicamente, o que causará erros ao tentar navegar. É necessário criar os arquivos de tela, mesmo que inicialmente sejam apenas placeholders.

### Ações Necessárias:

**2.1. Criar a tela Route:**

Crie o arquivo `src/modules/trip/screens/Route/index.tsx`:

```typescript
import { View, Text } from "react-native";

export default function RouteScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>
        Tela de Rota
      </Text>
    </View>
  );
}
```

**2.2. Criar a tela Costs:**

Crie o arquivo `src/modules/trip/screens/Costs/index.tsx`:

```typescript
import { View, Text } from "react-native";

export default function CostsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>
        Tela de Custos
      </Text>
    </View>
  );
}
```

**2.3. Criar a tela Rent:**

Crie o arquivo `src/modules/rent/screens/Rent/index.tsx`:

```typescript
import { View, Text } from "react-native";

export default function RentScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>
        Tela de Aluguel
      </Text>
    </View>
  );
}
```

**2.4. Criar a tela TravelMode:**

Crie o arquivo `src/modules/travelMode/screens/TravelMode/index.tsx`:

```typescript
import { View, Text } from "react-native";

export default function TravelModeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>
        Modo Viagem
      </Text>
    </View>
  );
}
```

**2.5. Testar a navegação:**

Execute o aplicativo e teste a navegação entre as telas para garantir que não há erros:

```bash
yarn start
```

---

## Passo 3: Implementar a Tela de Rota (MVP)

A tela de rota é a funcionalidade mais crítica do aplicativo. Ela deve permitir que o usuário insira origem e destino, e visualize a rota calculada no mapa.

### Ações Necessárias:

**3.1. Criar o formulário de entrada:**

Adicione campos de texto para **Origem** e **Destino**, e um botão para calcular a rota.

**3.2. Integrar com a Google Directions API:**

Utilize o Axios para fazer uma requisição à API e obter os dados da rota.

**3.3. Exibir o mapa com a rota:**

Utilize o componente `MapView` de `react-native-maps` para exibir o mapa. Desenhe a polilinha da rota usando as coordenadas retornadas pela API.

**3.4. Exibir distância e tempo estimado:**

Mostre essas informações de forma clara na interface.

**Exemplo de código (simplificado):**

```typescript
import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import axios from 'axios';
import { GOOGLE_API_KEY } from '@env';

export default function RouteScreen() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');

  const calculateRoute = async () => {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${GOOGLE_API_KEY}`;
    const response = await axios.get(url);
    
    if (response.data.routes.length > 0) {
      const route = response.data.routes[0];
      const points = decodePolyline(route.overview_polyline.points);
      setRouteCoordinates(points);
      setDistance(route.legs[0].distance.text);
      setDuration(route.legs[0].duration.text);
    }
  };

  const decodePolyline = (encoded) => {
    // Implementar decodificação de polyline (use uma biblioteca como @mapbox/polyline)
  };

  return (
    <View style={{ flex: 1 }}>
      <TextInput placeholder="Origem" value={origin} onChangeText={setOrigin} />
      <TextInput placeholder="Destino" value={destination} onChangeText={setDestination} />
      <Button title="Calcular Rota" onPress={calculateRoute} />
      <Text>Distância: {distance}</Text>
      <Text>Tempo: {duration}</Text>
      <MapView style={{ flex: 1 }}>
        {routeCoordinates.length > 0 && (
          <Polyline coordinates={routeCoordinates} strokeWidth={4} strokeColor="blue" />
        )}
      </MapView>
    </View>
  );
}
```

---

## Passo 4: Implementar a Tela de Custos (MVP)

A tela de custos deve calcular o custo total da viagem com base no consumo do veículo, preço do combustível e pedágios.

### Ações Necessárias:

**4.1. Criar o formulário de entrada:**

Adicione campos para:
- Consumo do veículo (km/L)
- Preço do combustível (R$/L)

**4.2. Calcular o custo de combustível:**

Use a fórmula: `Custo = (Distância / Consumo) × Preço`

**4.3. Integrar com a API de pedágios (opcional para MVP):**

Se disponível, busque os valores de pedágios na rota. Caso contrário, permita que o usuário insira manualmente.

**4.4. Exibir o custo total:**

Mostre o custo de combustível, pedágios e o total de forma clara.

---

## Passo 5: Adicionar Funcionalidades de Clima

Integre a OpenWeather API para exibir o clima na origem e no destino.

### Ações Necessárias:

**5.1. Fazer requisições à OpenWeather API:**

Utilize as coordenadas da origem e do destino para buscar o clima.

**5.2. Exibir as informações climáticas:**

Mostre temperatura, condições (sol, chuva, etc.) e alertas.

---

## Passo 6: Testar e Iterar

Após implementar as funcionalidades básicas, é fundamental testar o aplicativo em diferentes cenários e dispositivos.

### Ações Necessárias:

**6.1. Testar em dispositivos reais:**

Use o Expo Go para testar em smartphones Android e iOS.

**6.2. Coletar feedback:**

Peça para amigos ou familiares testarem e fornecerem feedback sobre a usabilidade.

**6.3. Corrigir bugs e melhorar a UX:**

Itere sobre o design e a experiência do usuário com base no feedback recebido.

---

## Resumo dos Próximos Passos

| Passo | Descrição | Prioridade |
|-------|-----------|------------|
| 1 | Configurar ambiente de desenvolvimento e APIs | 🔴 Crítica |
| 2 | Criar telas faltantes (placeholders) | 🔴 Crítica |
| 3 | Implementar tela de rota com mapa | 🔴 Crítica |
| 4 | Implementar tela de custos | 🔴 Crítica |
| 5 | Adicionar funcionalidades de clima | 🟡 Média |
| 6 | Testar e iterar | 🟡 Média |

Seguindo esses passos, você terá um MVP funcional do **KIViagem** em poucas semanas, pronto para ser testado e refinado.
