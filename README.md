# TODO Management MCP Server

A TODO management MCP server using Cloudflare Workers and D1 database.

## Features

- `addTodo`: Create a new TODO
- `getTodos`: Get TODO list
- `completeTodo`: Mark TODO as complete
- `markIncomplete`: Mark TODO as incomplete
- `deleteTodo`: Delete TODO

## Setup

### 1. Create Project

```bash
npm create cloudflare@latest -- my-mcp-server --template=cloudflare/ai/demos/remote-mcp-authless
cd my-mcp-server
```

### 2. Create D1 Database

```bash
# Create D1 database
wrangler d1 create todo-tasks-db
```

### 3. Configure wrangler.jsonc

Add the created database ID to `wrangler.jsonc`:

```json
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "todo-mcp-server",
  "main": "src/index.ts",
  "compatibility_date": "2025-03-10",
  "compatibility_flags": ["nodejs_compat"],
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "todo-tasks-db",
      "database_id": "your-database-id-here"
    }
  ]
}
```

### 4. Create Database Schema

Create `schema.sql` file:

```sql
CREATE TABLE todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

Apply schema to database:

```bash
# Apply to local environment
wrangler d1 execute todo-tasks-db --file=./schema.sql --local

# Apply to remote environment
wrangler d1 execute todo-tasks-db --file=./schema.sql --remote
```

### 5. Generate Types

```bash
npm run cf-typegen
```

### 6. Implement src/index.ts

Create MCP agent class inheriting from McpAgent and implement TODO management tools. See `src/index.ts` for details.

### 7. Local Testing

Start development server:

```bash
npm run dev
```

Start MCP Inspector in another terminal:

```bash
npx @modelcontextprotocol/inspector@latest
```

Open the displayed port in web browser and enter `http://localhost:8787/mcp` in the MCP server URL field to test.

### 8. Deploy

```bash
npm run deploy
```

## Usage

### Claude Desktop Usage

After deployment, add the following to Claude Desktop's config file (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "todo": {
      "command": "npx",
      "args": [
        "mcp-remote@latest",
        "https://your-worker-domain.workers.dev/mcp"
      ]
    }
  }
}
```

## Resource Cleanup

To delete the project, follow these steps to remove Cloudflare resources:

### 1. Delete Worker

```bash
wrangler delete my-mcp-server
```

### 2. Delete D1 Database

```bash
wrangler d1 delete todo-tasks-db
```

**Note**: Deleting the Worker will automatically delete associated Durable Objects.

## License

MIT

## Author

Yusuke Wada <https://github.com/yusukebe>
