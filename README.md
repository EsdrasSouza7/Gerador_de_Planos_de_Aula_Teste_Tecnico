# Gerador de Planos de Aula com IA

## 📖 Sobre

Sistema que gera planos de aula personalizados usando Gemini AI + Supabase

## 🚀 Como Executar

### Pré-requisitos

- Conta no Supabase
- API Key do Google AI Studio

### Instalação

1. Clone: `git clone https://github.com/EsdrasSouza7/Gerador_de_Planos_de_Aula_Teste_Tecnico`
2. Entre na pasta: `cd Gerador_de_Planos_de_Aula_Teste_Tecnico`
3. Configure as Chaves API em script.js

### Execusão

Opção A: VSCode Live Server (Recomendado)

```bash
1. Instale a extensão "Live Server" no VSCode
2. Clique com botão direito no index.html
3. Escolha "Open with Live Server"
4. Abre automaticamente no navegador!
```

Opção B: Python

```bash
# No terminal, dentro da pasta do projeto:
python -m http.server 8000

# Ou no Python 2:
python -m SimpleHTTPServer 8000

# Depois acesse:
# http://localhost:8000
```

OU qualquer outra opção preferencial de servidor local.

### Configuração do Banco

Execute o SQL em `database/schema.sql` no seu projeto Supabase

## 🤖 Escolha do Modelo

**Gemini 2.5 Flash** - Veja justificativa completa em `docs/model-choice.md`

## 🏗️ Arquitetura

- **Frontend:** HTML/CSS
- **Backend:** Supabase (PostgreSQL)
- **IA:** Gemini 2.5 Flash API

## 📊 Estrutura do Banco

Ver diagrama em `database/diagram.png`

## 🎯 Funcionalidades

- ✅ Geração de planos com IA
- ✅ Alinhamento com BNCC
- ✅ Salvamento no banco
- ✅ Histórico de planos
- ✅ Tratamento de erros

## 📝 Decisões Técnicas

- netlify para visualizar funcionando
- Supabase pela simplicidade do setup
- Gemini Flash pelo custo zero e rapidez

## 👨‍💻 Autor

Esdras Souza dos Santos - [GitHub](https://github.com/EsdrasSouza7)
