# TODO 管理 MCP サーバー

Cloudflare の Worker と D1 データベースを使用した TODO 管理のための MCP サーバーです。

## 機能

- `addTodo`: 新しい TODO を作成
- `getTodos`: TODO 一覧を取得
- `completeTodo`: TODO を完了状態にマーク
- `markIncomplete`: TODO を未完了状態にマーク
- `deleteTodo`: TODO を削除

## セットアップ手順

### 1. プロジェクトの作成

```bash
npm create cloudflare@latest -- my-mcp-server --template=cloudflare/ai/demos/remote-mcp-authless
cd my-mcp-server
```

### 2. D1 データベースの作成

```bash
# D1データベースを作成
wrangler d1 create todo-db
```

### 3. wrangler.jsonc の設定

作成されたデータベース ID を`wrangler.jsonc`に追加：

```json
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "todo-mcp-server",
  "main": "src/index.ts",
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "todo-db",
      "database_id": "your-database-id-here"
    }
  ]
}
```

### 4. データベーススキーマの作成

`schema.sql`ファイルを作成：

```sql
CREATE TABLE todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

データベースにスキーマを適用：

```bash
# ローカル環境に適用
wrangler d1 execute todo-db --file=./schema.sql --local

# リモート環境に適用
wrangler d1 execute todo-db --file=./schema.sql --remote
```

### 5. 型生成

```bash
npm run cf-typegen
```

### 6. src/index.ts の実装

MCP エージェントを継承したクラスを作成し、TODO 管理ツールを実装します。詳細は`src/index.ts`を参照してください。

### 7. ローカルでのテスト

開発環境でサーバーを起動：

```bash
npm run dev
```

別ターミナルで MCP インスペクターを起動：

```bash
npx @modelcontextprotocol/inspector@latest
```

ウェブブラウザで表示されたポートを開き、MCP サーバー URL 欄に `http://localhost:8787/mcp` を入力してテストします。

### 8. デプロイ

```bash
npm run deploy
```

## 使用方法

### Claude Desktop での使用

デプロイ後、Claude Desktop の設定ファイル（`~/Library/Application Support/Claude/claude_desktop_config.json`）に以下を追加：

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

## リソースの削除

プロジェクトを削除したい場合は、以下の手順で Cloudflare のリソースを削除できます：

### 1. Worker の削除

```bash
wrangler delete my-mcp-server
```

### 2. D1 データベースの削除

```bash
wrangler d1 delete todo-tasks-db
```

**注意**: Worker を削除すると、関連する Durable Objects も自動的に削除されます。

## License

MIT

## Author

Yusuke Wada <https://github.com/yusukebe>
