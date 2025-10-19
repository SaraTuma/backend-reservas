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

- `POST /api/auth/login` – Fazer o login
    Request Body (exemplo):
```bash
{
    "emailOrNif": "igor@test.com",
    "password": "123456"
}

```
        
    Response:
```bash
{
            "message": "Login bem-sucedido.",
            "status": 200,
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            "data": {
                "user": {
                "id": 1,
                "name": "igor@test.com",
                "email": "maria@email.com",
                "nif": "123456789",
                "role": "ADMIN",
                "balance": 0
                }
            }
        }

```
        
    Status Codes:

        200 – Login bem-sucedido

        400 – Campos ausentes

        404 – Usuário não encontrado

        401 – Senha incorreta

- `POST /api/auth/register` – Criar um usuário  
    Request Body (exemplo):
```bash
 {
        "name": "Maria Silva",
        "nif": "123456789",
        "email": "maria@email.com",
        "password": "123456",
        "role": "CLIENT"
        }

```
       
    Response:
```bash
 {
            "message": "Usuário criado com sucesso.",
            "status": 201,
            "data": {
                "user": {
                "id": 1,
                "name": "Maria Silva",
                "role": "CLIENT",
                "email": "maria@email.com",
                "balance": 0
                }
            }
        }

```
       
    Status Codes:

        201 – Usuário criado

        400 – Campos ausentes ou NIF/email já existente

        500 – Erro interno


- `GET /api/users` – Lista todos os usuários (Admin) ou clientes de um Provider (Provider)  

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

