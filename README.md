# 🏠 UniImmobile — Real Estate Management System

## 📌 Sobre o Projeto

O **UniImmobile** é uma aplicação desenvolvida para um cliente real, com o objetivo de **centralizar e otimizar o processo de anúncio, gestão e visualização de imóveis**.

A plataforma foi construída para substituir métodos informais de divulgação, como redes sociais ou indicações verbais, oferecendo uma solução estruturada para imobiliárias e clientes.

---

## 🎯 Objetivo

O sistema tem como foco:

* Facilitar o gerenciamento de imóveis para imobiliárias
* Melhorar a experiência de usuários interessados em compra ou aluguel
* Centralizar informações relevantes de imóveis em uma única plataforma

---

## 👥 Público-Alvo

A aplicação atende dois perfis principais:

* 🏢 Proprietários e funcionários de imobiliárias
* 🏡 Clientes interessados em imóveis

---

## 🧠 Arquitetura da Solução

A aplicação foi dividida em dois contextos principais:

### 🔐 Área Administrativa

Acessível apenas mediante autenticação, permite:

* Gerenciamento de usuários
* Cadastro e edição de imóveis
* Controle de imagens vinculadas aos imóveis

#### Funcionalidades:

* Cadastro de usuários (nome, CPF, email, telefone, data de nascimento)
* Cadastro de imóveis (endereço, localização, proprietário, dados complementares)
* Upload e gerenciamento de imagens por imóvel

---

### 🌐 Área Pública (Cliente)

Acessível sem autenticação:

* Visualização de imóveis disponíveis
* Acesso às informações detalhadas
* Redirecionamento para contato com responsáveis

---

## ⚙️ Tecnologias Utilizadas

* React.js
* TailwindCSS
* JavaScript
* GitHub

---

## 📐 Padrões e Organização

O projeto segue padrões de organização visando escalabilidade e manutenção:

### Convenções de código:

* camelCase para variáveis
* PascalCase para funções e objetos

---

### Estrutura de pastas:

* **Components/** → Componentes reutilizáveis
* **Services/** → Comunicação com APIs e requisições HTTP
* **Styles/** → Estilos globais
* **Models/** → Estruturas de dados e interfaces
* **Utilities/** → Funções auxiliares
* **Pages/** → Páginas da aplicação

---

## 🚀 Instalação e Execução

### 1. Clonar o repositório

```bash id="9xg1ks"
git clone <repo-url>
```

---

### 2. Acessar o projeto

```bash id="2kq7ap"
cd Imobiliaria_UniImmobile
```

---

### 3. Instalar dependências

```bash id="v3n8fd"
npm install
```

---

### 4. Executar aplicação

```bash id="r1t5lm"
npm run dev
```

---

## 👨‍💻 Contexto de Desenvolvimento

Este projeto foi desenvolvido como uma solução real para uma imobiliária, envolvendo:

* Levantamento de requisitos com cliente
* Desenvolvimento full stack (frontend + backend)
* Implementação de autenticação e controle de acesso
* Gestão de dados estruturados de imóveis e usuários

---

## 💡 Funcionalidades

* Autenticação de usuários (JWT no backend)
* CRUD completo de imóveis
* Gerenciamento de usuários
* Gerenciamento de imagens vinculadas aos imóveis
* Visualização pública de imóveis

---

## 📈 Possíveis Evoluções

* Integração com mapa (Google Maps API)
* Sistema de mensagens entre cliente e corretor
* Melhorias no fluxo de upload de imagens
* Deploy em ambiente cloud
* Versionamento de imóveis e histórico de alterações

---

## 📌 Observação

Este projeto foi desenvolvido em um período curto (~2 semanas), priorizando entrega funcional e validação de requisitos com o cliente.

---

## 💬 Considerações Finais

O UniImmobile representa uma experiência de desenvolvimento orientada a cliente real, envolvendo:

* Entrega sob prazo curto
* Estruturação de aplicação full stack
* Implementação de regras de negócio reais
* Experiência prática com autenticação e CRUDs complexos

---

