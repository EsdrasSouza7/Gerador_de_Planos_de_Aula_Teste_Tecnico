exports.handler = async (event, context) => {
  // Retorna as variáveis de ambiente públicas (não sensíveis)
  // IMPORTANTE: Apenas inclua variáveis que podem ser expostas publicamente
  
  const config = {
    SUPABASE_URL: process.env.SUPABASE_URL || '',
    SUPABASE_KEY: process.env.SUPABASE_KEY || '', // Esta deve ser a chave PÚBLICA do Supabase
    // GEMINI_API_KEY não deve ser exposta aqui pois é sensível
    // Em vez disso, crie uma função separada para fazer chamadas para a API
  };

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(config),
  };
};