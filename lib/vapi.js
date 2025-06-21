import Vapi from '@vapi-ai/web';

const vapiApiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY;
const vapiAgentId = process.env.NEXT_PUBLIC_VAPI_AGENT_ID;

let vapiClient = null;

export function getVapiClient() {
  if (!vapiClient && typeof window !== 'undefined') {
    vapiClient = new Vapi({
      apiKey: vapiApiKey,
      agentId: vapiAgentId,
    });
  }
  return vapiClient;
} 