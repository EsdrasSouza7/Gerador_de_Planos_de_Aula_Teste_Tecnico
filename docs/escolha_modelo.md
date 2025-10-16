# Escolha do Modelo de IA

Solicitações por minuto (RPM)
Solicitações por dia (RPD)

## Modelos Analisados

### 1. Gemini 2.5 Pro

- **Contexto:** 1M tokens
- **Custo:** Gratuito até 5 RPM e 100 RPD
- **Qualidade:** Excelente
- ❌ **Problema:**
  - Não tem embasamento com a pesquisa Google na versão Gratuita

### 2. Gemini 2.5 Flash

- **Contexto:** 1M tokens
- **Custo:** Gratuito até 10 RPM e 250 RPD
- **Velocidade:** Rápido (1-3s)
- **Qualidade:** Ótima para geração estruturada
- ✅ **Vantagens:**
  - Resposta rápida
  - Excelente com JSON
  - Suporta português bem
- ❌ **Problema:**
- Gratuito suficiente para testes, mas não para uso pratico.

### 3. Gemini 2.5 Flash-Lite

- **Contexto:** 1M tokens
- **Custo:** Gratuito até 15 RPM e 1000 RPD
- **Velocidade:** Rápido (1-3s)
- **Qualidade:** Ótima para geração estruturada
- ✅ **Vantagens:**
  - Resposta rápida
  - Excelente com JSON
  - Gratuito suficiente para testes, quantidade boa para uso pratico.
  - Suporta português bem
  - Tem suporte a PDF

## Testes Realizados

### Teste 1: Geração de JSON

```javascript
Prompt: "Gere um plano de aula sobre frações para 5º ano em JSON"
Resultado:
Gemini 2.5 Flash: ✅ JSON válido em 29.5s, com pesquisa ao google e ja adicionou o código BNCC. (com pensar Ligado)
Gemini 2.5 Flash-Lite: ✅ JSON válido em 13.8s, com pesquisa ao google e ja adicionou o codigo BNCC. (com pensar Ligado)
```

### Teste 2: Alinhamento BNCC

```javascript
Prompt: "Inclua código da BNCC para matemática 5º ano"
Resultado:
Gemini 2.5 Flash: ✅ Código correto (EF05MA03->EF05MA05)
Gemini 2.5 Flash-Lite: ✅ Código correto (EF05MA03->EF05MA05)
```

### Teste 3: Idioma Português

```javascript
Resultado:
Gemini 2.5 Flash: ✅ Fluente, sem traduções estranhas
Gemini 2.5 Flash-Lite: ✅ Fluente, sem traduções estranhas
```

## Decisão Final

**Gemini 2.5 Flash** será usado para este projeto por:

1. Velocidade adequada para UX
2. Qualidade suficiente para uso pratico
3. Custo zero dentro dos limites
4. Excelente suporte a JSON estruturado
5. Mesmo sendo mais lento a qualidade parece superior ao Gemini 2.5 Flash-Lite.

## Limitações Identificadas

- Poucas solicitações por dia
- Solução:
- Prompt engineering robusto para evitar erros
- Trocar para o Gemini 2.5 Flash-Lite se Precisar de mais Solicitações por Dia(RPD).

## Palavra final

Para o teste que não exige muitas solicitações o Gemini 2.5 Flash apresenta resultados melhor. Mas para questoes praticas em que são muitas solicitações por dia o Gemini 2.5 Flash-Lite seria a melhor escolha Gratuita.
