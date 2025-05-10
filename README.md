# Projeto_Tarefas

## Descrição
API REST em Node.js com as funções de cadastrar, listar, atualizar e remover tarefas. Cada tarefa possui:
* ID (chave primária, gerado automaticamente)
* Título (string, obrigatório)
* Descrição (string, opcional)
* Status (pendente, em andamento, concluído)
* Data de criação (gerada automaticamente)

## Tecnologias Utilizadas
* Backend
  * Node.js
  * Express
  * PostgreSQL
  * TypeORM
  * TypeScript
  * Jest
* Frontend
  * React
  * Axios
  * TypeScript
  * Tailwind CSS

## Instalação e Execução
Para executar o projeto, siga os passos abaixo:
1. Clone o repositório:
```bash
git clone https://github.com/GuilhermeDeitos/Projeto_Tarefas.git
```
2. Navegue até o diretório do projeto:
```bash
cd Projeto_Tarefas
```
3. Instale as dependências da api:
```bash
cd api
npm install
```
4. Instale as dependências do frontend:
```bash
cd frontend
npm install
```
5. Crie um banco de dados PostgreSQL e configure as credenciais no arquivo `.env` contida na raiz da pasta `api`. Deve conter as seguintes variáveis:
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=nome_do_banco
```
6. Execute a api:
```bash
cd api
npm run dev 
```

7. Agora em outro terminal, execute o frontend:
```bash
cd frontend
npm run dev
```

8. Acesse a aplicação no navegador para visualizar o frontend:
```
http://localhost:5173
```
9. A API por padrão está rodando na porta 3000, mas você pode alterar isso no arquivo no arquivo `.env` contida na raiz da pasta `api` com a variável `PORT`. 

## Documentação da API
### URL base
```
http://localhost:3000/tasks
```
### Métodos disponíveis
| Método | Descrição |
|--------|-----------|
| GET    | Listar todas as tarefas |
| GET    | Listar uma tarefa específica |
| POST   | Criar uma nova tarefa |
| PUT    | Atualizar uma tarefa existente |
| DELETE | Remover uma tarefa existente |

### Códigos de resposta
| Código | Descrição |
|--------|-----------|
| 200    | Requisição bem-sucedida |
| 201    | Recurso criado com sucesso |
| 400    | Requisição inválida |
| 404    | Recurso não encontrado |
| 500    | Erro interno do servidor |

### Endpoints
#### Listar todas as tarefas
Busca todas as tarefas cadastradas no banco de dados.
- **Método:** GET
- **URL:** `/tasks`
- **Resposta: `200` - Tarefas encontradas**
```json
[
  {
    "id": 1,
    "title": "Título da tarefa",
    "description": "Descrição da tarefa",
    "status": "Pendente",
    "createdAt": "2025-05-10T15:03:40.717Z"
  },
  ...
]
```
* **Resposta: `404` - Nenhuma tarefa encontrada**
```json
{
  "message": "No tasks found"
}
```
* **Resposta: `500` - Erro no servidor**
```json
{
  "message": "Error fetching tasks"
}
```
#### Listar tarefa específica
Busca uma tarefa específica pelo ID.
- **Método:** GET
- **URL:** `/tasks/:id`
- **Parâmetros:**
  - `id`: ID da tarefa a ser buscada.
- **Resposta: `200` - Tarefa encontrada**
```json
{
  "id": 1,
  "title": "Título da tarefa",
  "description": "Descrição da tarefa",
  "status": "Pendente",
  "createdAt": "2025-05-10T15:03:40.717Z"
}
```
* **Resposta: `404` - Tarefa não encontrada**
```json
{
  "message": "Task not found"
}
```
* **Resposta: `500` - Erro no servidor**
```json
{
  "message": "Error fetching task"
}
```
#### Criar tarefa
- **Método:** POST
- **URL:** `/tasks`
- **Atributos:**
  - `title`: Título da tarefa (string, obrigatório)
  - `description`: Descrição da tarefa (string, opcional)
  - `status`: Status da tarefa (string (As opções são "Pending", "InProgress" e "Completed"), opcional, padrão é "Pending")
- **Corpo da requisição:**
```json
{
  "title": "Título da tarefa",
  "description": "Descrição da tarefa", 
  "status": "Pending" 
}
```

- **Resposta: 200 - Tarefa criada com sucesso**
```json
{
  "id": 1,
  "title": "Título da tarefa",
  "description": "Descrição da tarefa",
  "status": "Pending",
  "createdAt": "2025-05-10T15:03:40.717Z"
}
```
* **Resposta: `400` - Requisição inválida**
  * **Caso o título não seja informado ou possua menos de 3 caracteres**
  ```json
  {
    "message": "Validation failed",
    "errors": [
      "title must be longer than or equal to 3 characters"
    ]
  }
  ```
  * **Caso o status não seja um dos valores válidos**
  ```json
  {
    "message": "Validation failed",
    "errors": [
      "status must be one of the following values: Pending, InProgress, Completed"
    ]
  }
  ```
* **Resposta: `500` - Erro no servidor**
```json
{
  "message": "Error creating task",
  "error": ... // Detalhes do erro
}
```

#### Atualizar tarefa
- **Método:** PUT
- **URL:** `/tasks/:id`
- **Parâmetros:**
  - `id`: ID da tarefa a ser atualizada.
- **Atributos:**
  - `title`: Título da tarefa (string, opcional)
  - `description`: Descrição da tarefa (string, opcional)
  - `status`: Status da tarefa (string (As opções são "Pending", "InProgress" e "Completed"), opcional)
- **Corpo da requisição:**
```json
{
  "title": "Título atualizado",
  "description": "Descrição atualizada",
  "status": "InProgress" 
}
```
- **Resposta: `200` - Tarefa atualizada com sucesso**
```json
{
  "id": 1,
  "title": "Título atualizado",
  "description": "Descrição atualizada",
  "status": "InProgress",
  "createdAt": "2025-05-10T15:03:40.717Z"
}
```
* **Resposta: `400` - Requisição inválida**
  * **Caso o novo título possua menos de 3 caracteres**
  ```json
  {
    "message": "Validation failed",
    "errors": [
      "title must be longer than or equal to 3 characters"
    ]
  }
  ```
  * **Caso o novo status não seja um dos valores válidos**
  ```json
  {
    "message": "Validation failed",
    "errors": [
      "status must be one of the following values: Pending, InProgress, Completed"
    ]
  }
  ```
* **Resposta: `404` - Tarefa não encontrada**
```json
{
  "message": "Task not found"
}
```
* **Resposta: `500` - Erro no servidor**
```json
{
  "message": "Error updating task",
  "error": ... // Detalhes do erro
}
```
#### Remover tarefa
- **Método:** DELETE
- **URL:** `/tasks/:id`
- **Parâmetros:**
  - `id`: ID da tarefa a ser removida.
- **Resposta:**
```json
{
  "message": "Tarefa removida com sucesso"
}
```
* **Resposta: `404` - Tarefa não encontrada**
```json
{
  "message": "Task not found"
}
```
* **Resposta: `500` - Erro no servidor**
```json
{
  "message": "Error deleting task",
  "error": ... // Detalhes do erro
}
```
### Testes
Os testes estão na pasta `tests` dentro da pasta `api`. Para executar os testes, execute o seguinte comando:
```bash
npm test
```




