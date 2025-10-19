# Backend – Plataforma de reservas

Este repositório contém o backend da Plataforma de reservas, responsável por fornecer a API para gerenciamento de usuários, serviços, reservas e transações.  

O backend está **deployado no Render** e pronto para ser consumido pelo frontend.

---

## Tecnologias utilizadas

- Node.js
- Express
- Prisma ORM
- PostgreSQL
- TypeScript
- Joi (validação, se aplicável)

---

## Endpoints principais

O backend disponibiliza os seguintes recursos:

### Usuários
- `GET /api/users` – Lista todos os usuários (Admin) ou clientes de um Provider (Provider)  
- `POST /api/auth/register` – Criar um usuário  
- `POST /api/auth/login` – Fazer o login
- `PUT /api/users/:id` – Atualizar usuário  
- `DELETE /api/users/:id` – Excluir usuário  

### Serviços
- `GET /api/services` – Listar serviços (filtrados por tipo de usuário)  
- `POST /api/services` – Criar serviço  
- `PUT /api/services/:id` – Atualizar serviço  
- `DELETE /api/services/:id` – Excluir serviço  

### Reservas
- `GET /api/reservations` – Listar reservas  
- `POST /api/reservations` – Criar reserva  
- `PUT /api/reservations/:id/status` – Atualizar status da reserva  
- `PUT /api/reservations/:id/cancel` – Cancelar reserva  

### Transações
- `GET /api/transactions` – Listar todas as transações  

### Estatísticas
- `GET /api/stats` – Obter contagem de usuários, serviços e reservas  


---

## Deploy

O backend está **deployado no Render** e pode ser acessado em: https://backend-reservas-cl7a.onrender.com

