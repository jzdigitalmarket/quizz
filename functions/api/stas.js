export async function onRequestGet(context) {
  const { env } = context;

  try {
    // 1. Procura o total geral de questões
    const statsGeral = await env.DB.prepare("SELECT COUNT(*) as total FROM perguntas").first();
    
    // 2. Agrupa por temas usando a coluna 'tema' que atualizámos via SQL
    // Se a coluna 'tema' estiver vazia, ele agrupa como 'Não Categorizado'
    const temas = await env.DB.prepare(`
      SELECT 
        IFNULL(tema, 'Gramática Geral') as categoria,
        COUNT(*) as quantidade
      FROM perguntas
      GROUP BY categoria
      ORDER BY quantidade DESC
    `).all();

    // 3. Retorna o JSON com os cabeçalhos corretos para evitar problemas de cache
    return new Response(JSON.stringify({
      total: statsGeral.total,
      temas: temas.results
    }), {
      headers: { 
        "Content-Type": "application/json",
        "Cache-Control": "no-cache" 
      }
    });

  } catch (e) {
    // Caso ocorra erro (ex: coluna 'tema' ainda não existe)
    return new Response(JSON.stringify({ 
      error: "Erro ao aceder ao D1", 
      details: e.message 
    }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
