/* Public snapshot only. Never import credentials or local provider configuration here. */
const REALLMS_DATA = {
  checked: 'October 14, 2026',
  chatModels: [
    { name: 'Gemma 4 31B IT', id: 'gemma-4-31B-it', type: 'Conversation', kind: 'chat' },
    { name: 'GLM 5.2', id: 'glm-5.2', type: 'Conversation', kind: 'chat' },
    { name: 'GPT OSS 120B', id: 'gpt-oss-120b', type: 'Conversation', kind: 'chat' },
    { name: 'Qwen3 Coder Next', id: 'Qwen3-Coder-Next', type: 'Coding', kind: 'coding' }
  ],
  apiModels: [
    { name: 'Gemma 4 31B IT', id: 'gemma-4-31B-it', type: 'Conversation', kind: 'chat', endpoints: ['/chat/completions', '/completions'] },
    { name: 'GPT OSS 120B', id: 'gpt-oss-120b', type: 'Conversation', kind: 'chat', endpoints: ['/chat/completions', '/completions'] },
    { name: 'Qwen 3.8 27B', id: 'qwen3.8-27b', type: 'Type unverified', kind: 'unverified', endpoints: [] },
    { name: 'Granite Docling 258M', id: 'granite-docling-258m', type: 'Document processing', kind: 'document', endpoints: ['/chat/completions', '/completions'] },
    { name: 'EmbeddingGemma 300M', id: 'embeddinggemma-300m', type: 'Embeddings', kind: 'embeddings', endpoints: ['/embeddings'] },
    { name: 'Qwen3 Embedding 8B', id: 'Qwen3-Embedding-8B', type: 'Embeddings', kind: 'embeddings', endpoints: ['/embeddings'] },
    { name: 'Qwen3 Reranker 8B', id: 'Qwen3-Reranker-8B', type: 'Reranking', kind: 'reranking', endpoints: ['/rerank'] },
    { name: 'Qwen3 ASR 1.7B', id: 'Qwen3-ASR-1.7B', type: 'Transcription', kind: 'transcription', endpoints: ['/audio/transcriptions'] },
    { name: 'Whisper', id: 'whisper', type: 'Transcription', kind: 'transcription', endpoints: ['/audio/transcriptions'] },
    { name: 'Z Image Turbo', id: 'z-image-turbo', type: 'Image generation', kind: 'image', endpoints: ['/images/generations'] }
  ],
  recipes: {
    curl: {
      file: 'Terminal / cURL 8.3 or later',
      intro: 'Send a request directly, without an AI client. This example uses Chat Completions.',
      code: `curl -q --fail-with-body --silent --show-error \\
  --variable '%REALLMS_API_KEY' \\
  --expand-header 'Authorization: Bearer {{REALLMS_API_KEY}}' \\
  --json '{"model":"gemma-4-31B-it","messages":[{"role":"user","content":"Why is the sky blue?"}]}' \\
  'https://reallms.rescloud.iu.edu/direct/v1/chat/completions'`,
      setup: 'Before running: supply your personal key as the REALLMS_API_KEY environment variable in your terminal. For Bash, read it without putting it in shell history: read -rs -p "API key: " REALLMS_API_KEY; export REALLMS_API_KEY. Do not use verbose or trace logging with credentials.',
      check: 'Check: a successful response contains a choices array with a message. A 401 usually means the key is missing or invalid. Never include your key when asking for help.',
      docs: 'https://curl.se/docs/manpage.html#--variable'
    },
    opencode: {
      file: 'opencode.json / OpenCode V2',
      intro: 'Connect a terminal coding agent using a custom OpenAI-compatible provider. This recipe is for OpenCode V2; V1 uses a different configuration format.',
      code: JSON.stringify({ '$schema': 'https://opencode.ai/config.json', model: 'reallms/gemma-4-31B-it', providers: { reallms: { name: 'REALLMS', env: ['REALLMS_API_KEY'], package: '@opencode/ai/providers/openai-compatible', settings: { baseURL: 'https://reallms.rescloud.iu.edu/direct/v1' }, models: { 'gemma-4-31B-it': { name: 'Gemma 4 31B IT' } } } } }, null, 2),
      setup: 'Setup: install OpenCode V2, place this file in the project root, and supply REALLMS_API_KEY to the OpenCode server process environment. No key belongs in this JSON file.',
      check: 'Check: start OpenCode in the project and send a short question to the selected REALLMS model. Text responses and agent tool calls are separate capabilities; tool calling is not verified by this prototype.',
      docs: 'https://opencode.ai/v2/docs/providers/#custom'
    },
    pi: {
      file: '~/.pi/agent/models.json / Pi Coding Agent',
      intro: 'Add REALLMS to Pi with a custom provider. Pi names its Chat Completions adapter "openai-completions"; this is not the legacy completions endpoint.',
      code: JSON.stringify({ '$schema': 'https://pi.dev/schemas/models.schema.json', providers: { reallms: { baseUrl: 'https://reallms.rescloud.iu.edu/direct/v1', api: 'openai-completions', apiKey: '${REALLMS_API_KEY}', models: [{ id: 'gemma-4-31B-it' }] } } }, null, 2),
      setup: 'Setup: install Pi, save this provider in ~/.pi/agent/models.json, and supply REALLMS_API_KEY in the environment before launching Pi. If PI_CODING_AGENT_DIR is set, use that directory instead. Merge with existing providers rather than overwriting them.',
      check: 'Check: open /model in Pi, select the REALLMS model, and ask a short question. This follows current Pi documentation; agent tool calls still need end-to-end verification.',
      docs: 'https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/models.md'
    },
    continue: {
      file: '~/.continue/config.yaml / Continue in VS Code',
      intro: 'Bring REALLMS into your editor. Start with Continue Chat mode; this recipe does not configure autocomplete or claim agent tool support.',
      code: `name: REALLMS
version: 1.0.0
schema: v1

models:
  - name: REALLMS Gemma 4
    provider: openai
    model: gemma-4-31B-it
    apiBase: https://reallms.rescloud.iu.edu/direct/v1
    apiKey: \${{ secrets.REALLMS_API_KEY }}
    roles: [chat]
    useResponsesApi: false
    useLegacyCompletionsEndpoint: false`,
      setup: 'Setup: install Continue in VS Code. Add REALLMS_API_KEY=YOUR_OWN_KEY to ~/.continue/.env, not to this YAML file. On Windows, use %USERPROFILE%\\.continue\\. Restart the IDE after changing secrets. Keep .env files out of Git; workspace .env files can override the global file.',
      check: 'Check: select this local configuration and REALLMS Gemma 4 in Continue, open Chat mode, and send a short question.',
      docs: 'https://docs.continue.dev/customize/model-providers/top-level/openai'
    }
  }
};
