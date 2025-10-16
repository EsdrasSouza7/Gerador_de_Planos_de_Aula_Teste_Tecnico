# Configuração das Variáveis de Ambiente

Este documento explica como configurar as variáveis de ambiente necessárias para o funcionamento completo da aplicação Gerador de Planos de Aula.

## Variáveis Necessárias

### SUPABASE_URL
- **Descrição**: URL do seu projeto Supabase
- **Exemplo**: `https://xxxxx.supabase.co`
- **Obrigatória**: Sim

### SUPABASE_KEY
- **Descrição**: Chave pública (anon key) do Supabase
- **Exemplo**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Obrigatória**: Sim
- **Nota**: Esta é a chave pública, não a chave secreta

### GEMINI_API_KEY
- **Descrição**: Chave da API do Google Gemini
- **Exemplo**: `AIzaSyC...`
- **Obrigatória**: Sim
- **Nota**: Esta chave é mantida segura no servidor e não é exposta ao cliente

## Como Configurar

### Opção 1: Interface do Netlify (Recomendado para Produção)
1. Acesse o dashboard do Netlify
2. Vá para o seu site
3. Navegue até "Site configuration > Environment variables"
4. Adicione cada variável clicando em "Add a variable"
5. Para variáveis sensíveis como `GEMINI_API_KEY`, marque como "Secret"

### Opção 2: Netlify CLI
```bash
# Configurar variáveis uma por uma
netlify env:set SUPABASE_URL "sua-url-do-supabase"
netlify env:set SUPABASE_KEY "sua-chave-publica-do-supabase"
netlify env:set GEMINI_API_KEY "sua-chave-da-api-gemini" --secret
```

### Opção 3: Arquivo netlify.toml (Apenas para desenvolvimento)
⚠️ **CUIDADO**: Não coloque valores sensíveis no netlify.toml se o repositório for público.

```toml
[context.dev.environment]
  SUPABASE_URL = "sua-url-do-supabase"
  SUPABASE_KEY = "sua-chave-publica-do-supabase"
  GEMINI_API_KEY = "sua-chave-da-api-gemini"
```

## Verificação da Configuração

Após configurar as variáveis:

1. Execute `netlify dev` para testar localmente
2. Acesse `http://localhost:8888`
3. Abra o console do navegador (F12)
4. Você deve ver as mensagens de configuração carregada
5. Teste criando um plano de aula

## Arquitetura de Segurança

- **SUPABASE_URL** e **SUPABASE_KEY**: Expostas ao cliente via função `/.netlify/functions/config`
- **GEMINI_API_KEY**: Mantida segura no servidor, usada apenas na função `/.netlify/functions/generate-plan`

## Solução de Problemas

### Erro "Não foi possível carregar as variáveis de ambiente"
- Verifique se as variáveis estão configuradas corretamente
- Execute `netlify env:list` para ver as variáveis disponíveis
- Certifique-se de que o site está linkado: `netlify link`

### Erro "GEMINI_API_KEY não configurada"
- Verifique se a variável foi definida com o nome correto
- Use `--secret` ao definir via CLI para manter segura
- Redeploy o site após adicionar novas variáveis

## Comandos Úteis

```bash
# Ver todas as variáveis
netlify env:list

# Ver variáveis de produção
netlify env:list --context production

# Importar de arquivo .env
netlify env:import .env

# Remover variável
netlify env:unset VARIABLE_NAME

# Linkar site local
netlify link
```