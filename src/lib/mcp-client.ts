const MCP_URL = "https://mcp.mospi.gov.in/";

interface MCPToolCallParams {
  name: string;
  arguments: Record<string, unknown>;
}

interface MCPResult {
  structuredContent?: Record<string, unknown>;
  content?: Array<{ type: string; text: string }>;
  isError?: boolean;
}

function parseSSEResponse(raw: string): MCPResult {
  const lines = raw.split("\n");
  for (const line of lines) {
    if (line.startsWith("data: ")) {
      const json = JSON.parse(line.slice(6));
      if (json.result) {
        return json.result as MCPResult;
      }
      if (json.error) {
        throw new Error(`MCP error: ${json.error.message ?? JSON.stringify(json.error)}`);
      }
    }
  }
  throw new Error("No valid SSE message found in response");
}

async function mcpFetch(
  body: Record<string, unknown>,
  sessionId?: string
): Promise<{ result: MCPResult; sessionId: string }> {
  const headers: Record<string, string> = {
    Accept: "text/event-stream, application/json",
    "Content-Type": "application/json",
  };
  if (sessionId) {
    headers["mcp-session-id"] = sessionId;
  }

  const res = await fetch(MCP_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`MCP HTTP ${res.status}: ${res.statusText}`);
  }

  const newSessionId = res.headers.get("mcp-session-id") ?? sessionId ?? "";
  const text = await res.text();
  const result = parseSSEResponse(text);

  return { result, sessionId: newSessionId };
}

export async function initSession(): Promise<string> {
  const { sessionId } = await mcpFetch({
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: { name: "india-dashboard", version: "1.0.0" },
    },
  });
  return sessionId;
}

export async function callTool(
  sessionId: string,
  params: MCPToolCallParams,
  requestId = 2
): Promise<MCPResult> {
  const { result } = await mcpFetch(
    {
      jsonrpc: "2.0",
      id: requestId,
      method: "tools/call",
      params: { name: params.name, arguments: params.arguments },
    },
    sessionId
  );

  if (result.isError) {
    const errorText = result.content?.[0]?.text ?? "Unknown MCP tool error";
    throw new Error(`MCP tool error (${params.name}): ${errorText}`);
  }

  return result;
}

export function extractData<T>(result: MCPResult): T {
  if (result.structuredContent?.data) {
    return result.structuredContent.data as T;
  }
  if (result.content?.[0]?.text) {
    const parsed = JSON.parse(result.content[0].text);
    if (parsed.data) {
      return parsed.data as T;
    }
    return parsed as T;
  }
  throw new Error("No data found in MCP response");
}
