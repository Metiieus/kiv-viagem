# Changelog - KIViagem

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

---

## [1.0.0] - 2024-12-16

### 🎉 Lançamento do MVP

Primeira versão funcional do aplicativo KIViagem com todas as funcionalidades principais implementadas.

### ✨ Adicionado

#### Telas
- **Home**: Tela inicial com navegação para todas as funcionalidades
- **Route**: Cálculo e visualização de rotas no mapa
- **Costs**: Calculadora de custos de viagem (combustível + pedágios)
- **Rent**: Listagem de carros disponíveis para aluguel
- **TravelMode**: Modo de navegação com rastreamento GPS em tempo real

#### Componentes
- **Button**: Botão reutilizável com estados de loading e disabled
- **Input**: Campo de texto estilizado
- **Card**: Container com sombra para agrupar conteúdo

#### Funcionalidades
- Integração com Google Directions API para cálculo de rotas
- Visualização de rotas em mapa interativo (react-native-maps)
- Cálculo automático de custos de viagem
- Sistema de recomendação de carros
- Rastreamento GPS em tempo real com expo-location
- Sistema de tema consistente em todo o app
- Navegação entre telas com React Navigation

#### Configuração
- Suporte a variáveis de ambiente com react-native-dotenv
- Arquivo `.env` para armazenar chaves de API
- Configuração do Babel para dotenv
- Tipos TypeScript para variáveis de ambiente
- Atualização do .gitignore para proteger chaves de API

#### Documentação
- README.md completo com visão geral do projeto
- INSTALACAO.md com guia passo a passo de configuração
- CHANGELOG.md para rastrear mudanças
- Comentários no código para facilitar manutenção

#### Dependências
- `react-native-dotenv` - Gerenciamento de variáveis de ambiente
- `expo-location` - Rastreamento GPS
- `@react-native-async-storage/async-storage` - Persistência local
- `date-fns` - Manipulação de datas
- `@mapbox/polyline` - Decodificação de rotas do Google Maps

### 🔧 Modificado
- Atualização do `tsconfig.json` para incluir tipos customizados
- Atualização do `.gitignore` para incluir `.env`
- Configuração do `babel.config.js` para suportar dotenv

### 📝 Notas
- Chaves de API devem ser configuradas no arquivo `.env`
- Aplicativo testado com Expo Go em Android e iOS
- Dados de aluguel são mockados (prontos para integração futura)

---

## [0.1.0] - 2024-12-15

### 🏗️ Estrutura Inicial

Criação da estrutura base do projeto.

### ✨ Adicionado
- Configuração inicial do Expo
- Estrutura de navegação com React Navigation
- Sistema de tema (cores, espaçamentos, bordas)
- Constantes de telas
- Configuração do TypeScript
- Dependências principais (React Native, Expo, Styled Components, etc.)

---

## Formato

Este changelog segue o formato [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

### Tipos de Mudanças
- **Adicionado** para novas funcionalidades
- **Modificado** para mudanças em funcionalidades existentes
- **Descontinuado** para funcionalidades que serão removidas
- **Removido** para funcionalidades removidas
- **Corrigido** para correções de bugs
- **Segurança** para vulnerabilidades corrigidas
