// Importar apenas Supabase
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Configuração
const SUPABASE_URL = '';
const SUPABASE_KEY = '';
const GEMINI_API_KEY = '';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log('✅ Configuração carregada!');

// ==================== FUNÇÕES DE GERAÇÃO ====================

function generatePrompt(inputs) {
    return `
Você é um especialista em educação brasileira. Gere um plano de aula em JSON.

DADOS:
- Série: ${inputs.grade}
- Disciplina: ${inputs.subject}  
- Tema: ${inputs.topic}
- Duração: ${inputs.duration} minutos
${inputs.specific_objective ? `- Objetivo Específico: ${inputs.specific_objective}` : ''}

INSTRUÇÕES CRÍTICAS:
1. Retorne APENAS um objeto JSON válido
2. Não use markdown, código ou texto adicional
3. NÃO use \`\`\`json ou \`\`\`
4. OBRIGATÓRIO: Todos os arrays devem ter pelo menos 1 item
5. OBRIGATÓRIO: Todos os campos devem estar preenchidos

FORMATO OBRIGATÓRIO:
{
  "introduction": "Introdução lúdica e engajadora com no mínimo 2 frases completas",
  "bncc_objective": "Objetivo da BNCC com código, exemplo: EF05MA03 - Identificar e representar frações",
  "activity_steps": [
    {"step": 1, "description": "Descrição detalhada de no mínimo 20 palavras", "duration": 10},
    {"step": 2, "description": "Descrição detalhada de no mínimo 20 palavras", "duration": 15}
  ],
  "evaluation_rubric": [
    {"criterion": "Critério 1", "excellent": "Descrição de excelente", "good": "Descrição de bom", "needs_improvement": "Descrição de precisa melhorar"},
    {"criterion": "Critério 2", "excellent": "Descrição de excelente", "good": "Descrição de bom", "needs_improvement": "Descrição de precisa melhorar"}
  ]
}

IMPORTANTE: 
- Gere no MÍNIMO 2 etapas em activity_steps
- Gere no MÍNIMO 2 critérios em evaluation_rubric
- Cada descrição deve ser completa e detalhada

Gere o plano de aula AGORA em JSON puro:`;
}

// Validar estrutura do plano gerado
function validateLessonPlan(plan) {
    console.log('🔍 Validando estrutura do plano...');
    
    const errors = [];
    
    // Validar campos obrigatórios
    if (!plan.introduction || typeof plan.introduction !== 'string' || plan.introduction.length < 10) {
        errors.push('Campo "introduction" inválido ou muito curto');
    }
    
    if (!plan.bncc_objective || typeof plan.bncc_objective !== 'string' || plan.bncc_objective.length < 10) {
        errors.push('Campo "bncc_objective" inválido ou muito curto');
    }
    
    // Validar activity_steps
    if (!Array.isArray(plan.activity_steps)) {
        errors.push('Campo "activity_steps" deve ser um array');
    } else if (plan.activity_steps.length === 0) {
        errors.push('Campo "activity_steps" não pode estar vazio');
    } else {
        plan.activity_steps.forEach((step, index) => {
            if (!step.step || !step.description || !step.duration) {
                errors.push(`Etapa ${index + 1} está incompleta (faltam campos)`);
            }
            if (typeof step.description !== 'string' || step.description.length < 10) {
                errors.push(`Etapa ${index + 1} tem descrição muito curta ou inválida`);
            }
        });
    }
    
    // Validar evaluation_rubric
    if (!Array.isArray(plan.evaluation_rubric)) {
        errors.push('Campo "evaluation_rubric" deve ser um array');
    } else if (plan.evaluation_rubric.length === 0) {
        errors.push('Campo "evaluation_rubric" não pode estar vazio');
    } else {
        plan.evaluation_rubric.forEach((rubric, index) => {
            if (!rubric.criterion || !rubric.excellent || !rubric.good || !rubric.needs_improvement) {
                errors.push(`Rubrica ${index + 1} está incompleta (faltam campos)`);
            }
        });
    }
    
    if (errors.length > 0) {
        console.error('❌ Erros de validação encontrados:');
        errors.forEach(error => console.error(`  - ${error}`));
        throw new Error('Plano gerado está incompleto ou inválido:\n' + errors.join('\n'));
    }
    
    console.log('✅ Validação passou! Plano está completo.');
    return true;
}

async function generateLessonPlan(inputs) {
    const prompt = generatePrompt(inputs);
    
    try {
        console.log('📤 Enviando para Gemini API...');
        console.log('📝 Prompt enviado:', prompt.substring(0, 200) + '...');
        
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 2048,
                        responseMimeType: "application/json"
                    }
                })
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ Erro da API:', errorData);
            throw new Error(`Erro ${response.status}: ${errorData.error?.message || 'Erro desconhecido'}`);
        }

        const data = await response.json();
        console.log('📦 Resposta completa da API:', JSON.stringify(data, null, 2));
        
        // Extrair texto
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            console.error('❌ Estrutura de resposta inválida:', data);
            throw new Error('Resposta da API não contém dados esperados');
        }
        
        const aiText = data.candidates[0].content.parts[0].text;
        console.log('📝 Texto RAW da IA:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(aiText);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        // Limpar e parsear JSON
        let cleanText = aiText.trim();
        
        // Remover markdown
        cleanText = cleanText.replace(/```json\n?/g, '');
        cleanText = cleanText.replace(/```\n?/g, '');
        cleanText = cleanText.trim();
        
        // Remover possível texto antes do JSON
        const jsonStart = cleanText.indexOf('{');
        const jsonEnd = cleanText.lastIndexOf('}');
        
        if (jsonStart === -1 || jsonEnd === -1) {
            console.error('❌ Não foi possível encontrar JSON válido na resposta');
            throw new Error('Resposta da IA não contém JSON válido');
        }
        
        cleanText = cleanText.substring(jsonStart, jsonEnd + 1);
        
        console.log('🧹 Texto limpo (JSON extraído):');

        // Parsear JSON
        let lessonPlan;
        try {
            lessonPlan = JSON.parse(cleanText);
        } catch (parseError) {
            console.error('❌ Erro ao parsear JSON:', parseError);
            console.error('Texto que causou erro:', cleanText);
            throw new Error('IA retornou JSON inválido. Tente novamente.');
        }
        
        console.log('✅ JSON parseado com sucesso:');

        // VALIDAR antes de retornar
        validateLessonPlan(lessonPlan);

        return lessonPlan;
        
    } catch (error) {
        console.error('❌ ERRO COMPLETO:', error);
        console.error('Stack trace:', error.stack);
        throw error;
    }
}

async function saveLessonPlan(inputs, aiResponse) {
    try {
        console.log('💾 Tentando salvar no Supabase...');
        console.log('📋 Dados a serem salvos:', {
            grade: inputs.grade,
            subject: inputs.subject,
            topic: inputs.topic,
            duration: inputs.duration,
            has_introduction: !!aiResponse.introduction,
            has_bncc: !!aiResponse.bncc_objective,
            steps_count: aiResponse.activity_steps?.length || 0,
            rubric_count: aiResponse.evaluation_rubric?.length || 0
        });
        
        // Validar novamente antes de salvar
        validateLessonPlan(aiResponse);
        
        const { data, error } = await supabase
            .from('lesson_plans')
            .insert([{
                grade: inputs.grade,
                subject: inputs.subject,
                topic: inputs.topic,
                duration: parseInt(inputs.duration),
                specific_objective: inputs.specific_objective || null,
                introduction: aiResponse.introduction,
                bncc_objective: aiResponse.bncc_objective,
                activity_steps: aiResponse.activity_steps,
                evaluation_rubric: aiResponse.evaluation_rubric,
                raw_ai_response: aiResponse
            }])
            .select();

        if (error) {
            console.error('❌ Erro do Supabase:', error);
            throw error;
        }
        
        console.log('✅ Salvo com sucesso no Supabase!');
        console.log('💾 ID gerado:', data[0]?.id);
        
        // Atualizar histórico após salvar
        loadHistory();
        
        return data;
        
    } catch (error) {
        console.error('❌ Erro ao salvar:', error);
        throw new Error('Falha ao salvar no banco de dados: ' + error.message);
    }
}

// ==================== FUNÇÕES DE HISTÓRICO ====================

async function loadHistory() {
    const historyList = document.getElementById('historyList');
    
    try {
        historyList.innerHTML = '<div class="loading"><div class="spinner"></div><p>Carregando...</p></div>';
        
        console.log('📚 Buscando planos salvos no Supabase...');
        
        const { data, error } = await supabase
            .from('lesson_plans')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) {
            console.error('❌ Erro ao buscar planos:', error);
            throw error;
        }

        console.log(`✅ ${data.length} planos encontrados`);

        if (data.length === 0) {
            historyList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📭</div>
                    <p>Nenhum plano de aula salvo ainda.</p>
                    <p>Crie seu primeiro plano ao lado!</p>
                </div>
            `;
            return;
        }

        historyList.innerHTML = data.map(plan => {
            try {
                return createLessonCard(plan);
            } catch (cardError) {
                console.error('❌ Erro ao criar card do plano:', plan.id, cardError);
                return `
                    <div class="lesson-card" style="border-color: #f44336;">
                        <p style="color: #f44336;">⚠️ Plano com dados incompletos (ID: ${plan.id})</p>
                        <button class="btn-small btn-delete" onclick="deletePlan('${plan.id}')">
                            🗑️ Excluir
                        </button>
                    </div>
                `;
            }
        }).join('');
        
    } catch (error) {
        console.error('❌ Erro ao carregar histórico:', error);
        historyList.innerHTML = `
            <div class="error">
                <strong>Erro ao carregar histórico:</strong><br>
                ${error.message}
            </div>
        `;
    }
}

function createLessonCard(plan) {
    // Validar se o plano tem os dados necessários
    if (!plan.topic || !plan.grade || !plan.subject) {
        throw new Error('Plano sem dados básicos');
    }
    
    const date = new Date(plan.created_at).toLocaleString('pt-BR');
    const bnccPreview = plan.bncc_objective 
        ? plan.bncc_objective.substring(0, 60) + (plan.bncc_objective.length > 60 ? '...' : '')
        : 'Não disponível';
    
    return `
        <div class="lesson-card">
            <div class="lesson-card-header">
                <div>
                    <h3 class="lesson-card-title">${plan.topic}</h3>
                    <div class="lesson-card-meta">
                        <span class="lesson-card-badge">${plan.grade}</span>
                        <span class="lesson-card-badge">${plan.subject}</span>
                        <span class="lesson-card-badge">⏱️ ${plan.duration} min</span>
                    </div>
                </div>
            </div>
            
            <div class="lesson-card-info">
                <strong>BNCC:</strong> ${bnccPreview}
            </div>
            
            <div style="font-size: 12px; color: #999; margin-top: 10px;">
                📅 Criado em: ${date}
            </div>
            
            <div class="lesson-card-actions">
                <button class="btn-small btn-view" onclick="viewPlan('${plan.id}')">
                    👁️ Ver Completo
                </button>
                <button class="btn-small btn-delete" onclick="deletePlan('${plan.id}')">
                    🗑️ Excluir
                </button>
            </div>
        </div>
    `;
}

window.viewPlan = async function(planId) {
    try {
        console.log('👁️ Visualizando plano:', planId);
        
        const { data, error } = await supabase
            .from('lesson_plans')
            .select('*')
            .eq('id', planId)
            .single();

        if (error) throw error;

        console.log('📄 Plano carregado:', data);

        displayPlanInModal(data);
        
    } catch (error) {
        console.error('❌ Erro ao carregar plano:', error);
        alert('Erro ao carregar plano: ' + error.message);
    }
}

window.deletePlan = async function(planId) {
    if (!confirm('Tem certeza que deseja excluir este plano?')) {
        return;
    }
    
    try {
        console.log('🗑️ Excluindo plano:', planId);
        
        const { error } = await supabase
            .from('lesson_plans')
            .delete()
            .eq('id', planId);

        if (error) throw error;

        console.log('✅ Plano excluído com sucesso');
        loadHistory();
        
    } catch (error) {
        console.error('❌ Erro ao excluir:', error);
        alert('Erro ao excluir plano: ' + error.message);
    }
}

function displayPlanInModal(plan) {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modalContent');
    
    // Validar arrays antes de usar .map()
    const activitySteps = Array.isArray(plan.activity_steps) ? plan.activity_steps : [];
    const evaluationRubric = Array.isArray(plan.evaluation_rubric) ? plan.evaluation_rubric : [];
    
    modalContent.innerHTML = `
        <h2>${plan.topic || 'Sem título'}</h2>
        <p><strong>Série:</strong> ${plan.grade || 'N/A'} | <strong>Disciplina:</strong> ${plan.subject || 'N/A'} | <strong>Duração:</strong> ${plan.duration || 'N/A'} min</p>
        
        <hr style="margin: 20px 0;">
        
        <h3>📚 Introdução</h3>
        <p>${plan.introduction || 'Não disponível'}</p>
        
        <h3>🎯 Objetivo BNCC</h3>
        <p>${plan.bncc_objective || 'Não disponível'}</p>
        
        <h3>📋 Etapas da Atividade</h3>
        ${activitySteps.length > 0 ? activitySteps.map(step => `
            <div style="background: #f9f9f9; padding: 15px; margin: 10px 0; border-radius: 4px;">
                <strong>Etapa ${step.step || '?'}</strong> (${step.duration || '?'} min)
                <p>${step.description || 'Sem descrição'}</p>
            </div>
        `).join('') : '<p>Nenhuma etapa disponível</p>'}
        
        <h3>📊 Rubrica de Avaliação</h3>
        ${evaluationRubric.length > 0 ? evaluationRubric.map(rubric => `
            <div style="background: #f9f9f9; padding: 15px; margin: 10px 0; border-radius: 4px;">
                <h4>${rubric.criterion || 'Sem critério'}</h4>
                <p><strong>✅ Excelente:</strong> ${rubric.excellent || 'N/A'}</p>
                <p><strong>👍 Bom:</strong> ${rubric.good || 'N/A'}</p>
                <p><strong>⚠️ Precisa Melhorar:</strong> ${rubric.needs_improvement || 'N/A'}</p>
            </div>
        `).join('') : '<p>Nenhuma rubrica disponível</p>'}
    `;
    
    modal.style.display = 'block';
}

window.closeModal = function() {
    document.getElementById('modal').style.display = 'none';
}

// ==================== FUNÇÕES DE UI ====================

function displayLessonPlan(plan) {
    const result = document.getElementById('result');
    result.innerHTML = `
        <div class="success">
            <h3>✅ Plano de Aula Gerado e Salvo!</h3>
            <p>✅ Validado com sucesso</p>
            <p>✅ Salvo no banco de dados</p>
            <p>📚 Confira no histórico ao lado →</p>
        </div>
    `;
}

function showErrorMessage(message) {
    const result = document.getElementById('result');
    result.innerHTML = `
        <div class="error">
            <strong>❌ Erro:</strong><br>
            ${message}
            <br><br>
            <small>💡 Dica: Abra o Console (F12) para mais detalhes</small>
        </div>
    `;
}

function showLoading() {
    const result = document.getElementById('result');
    result.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>⏳ Gerando plano... Aguarde.</p>
            <small>Isso pode levar de 5 a 15 segundos</small>
        </div>
    `;
}

// ==================== EVENT LISTENERS ====================

document.getElementById('lessonForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const btn = document.getElementById('generateBtn');
    btn.disabled = true;
    btn.textContent = '⏳ Gerando...';
    
    showLoading();
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚀 INICIANDO GERAÇÃO DE PLANO DE AULA');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    try {
        const formData = new FormData(e.target);
        const inputs = Object.fromEntries(formData.entries());
        
        console.log('📝 Dados do formulário:', inputs);
        
        if (!inputs.grade || !inputs.subject || !inputs.topic || !inputs.duration) {
            throw new Error('Preencha todos os campos obrigatórios (marcados com *)');
        }
        
        console.log('⏱️ Etapa 1/3: Gerando com IA...');
        const plan = await generateLessonPlan(inputs);
        
        console.log('⏱️ Etapa 2/3: Salvando no banco...');
        await saveLessonPlan(inputs, plan);
        
        console.log('⏱️ Etapa 3/3: Exibindo resultado...');
        displayLessonPlan(plan);
        
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ PROCESSO CONCLUÍDO COM SUCESSO!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        e.target.reset();
        
    } catch (error) {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('❌ PROCESSO FALHOU');
        console.error('Erro:', error.message);
        console.error('Stack:', error.stack);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        showErrorMessage(error.message || 'Erro desconhecido');
    } finally {
        btn.disabled = false;
        btn.textContent = '🚀 Gerar Plano de Aula';
    }
});

window.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Página carregada, iniciando...');
    loadHistory();
});

window.loadHistory = loadHistory;

console.log('✅ Script carregado e pronto!');
