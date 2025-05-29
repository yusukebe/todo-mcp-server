import { McpAgent } from 'agents/mcp'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

export class MyMCP extends McpAgent<Env> {
  server = new McpServer({
    name: 'TODO management application',
    version: '0.0.1',
  })

  async init() {
    this.server.tool(
      'addTodo',
      'Add TODO to the DB',
      { title: z.string() },
      async ({ title }) => {
        const result = await this.env.DB.prepare(
          'INSERT INTO todos (title) VALUES (?)'
        )
          .bind(title)
          .run()

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result),
            },
          ],
        }
      }
    )

    this.server.tool(
      'getTodos',
      'Get registered TODOs from DB',
      {},
      async () => {
        const result = await this.env.DB.prepare(
          'SELECT * FROM todos ORDER BY created_at DESC'
        ).all()

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result),
            },
          ],
        }
      }
    )

    this.server.tool(
      'completeTodo',
      'Make the TODO complete',
      { id: z.number() },
      async ({ id }) => {
        const result = await this.env.DB.prepare(
          'UPDATE todos SET completed = true, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
        )
          .bind(id)
          .run()

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result),
            },
          ],
        }
      }
    )

    this.server.tool(
      'markIncomplete',
      'Mark the TODO as incomplete',
      { id: z.number() },
      async ({ id }) => {
        const result = await this.env.DB.prepare(
          'UPDATE todos SET completed = false, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
        )
          .bind(id)
          .run()

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result),
            },
          ],
        }
      }
    )

    this.server.tool(
      'deleteTodo',
      'Delete the TODO from DB',
      { id: z.number() },
      async ({ id }) => {
        const result = await this.env.DB.prepare(
          'DELETE FROM todos WHERE id = ?'
        )
          .bind(id)
          .run()

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result),
            },
          ],
        }
      }
    )
  }
}

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url)
    if (url.pathname === '/mcp') {
      return MyMCP.serve('/mcp').fetch(request, env, ctx)
    }
    return new Response('Not found', { status: 404 })
  },
}
