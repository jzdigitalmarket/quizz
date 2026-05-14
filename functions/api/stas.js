export async function onRequestGet(context) {
  const { env } = context;

  try {
    // Busca o total de questões
    const statsGeral = await env.DB.prepare("SELECT COUNT(*) as total FROM perguntas").first();
    
    // Agrupa por temas baseando-se em palavras-chave
    const temas = await env.DB.prepare(`
      SELECT 
        CASE 
          WHEN pergunta LIKE '%pronome%' THEN 'Pronomes'
          WHEN pergunta LIKE '%verbo%' THEN 'Verbos'
          WHEN pergunta LIKE '%sujeito%' OR pergunta LIKE '%oração%' THEN 'Sintaxe'
          WHEN pergunta LIKE '%acento%' OR pergunta LIKE '%acentuação%' THEN 'Acentuação'
          WHEN pergunta LIKE '%ortografia%' OR pergunta LIKE '%grafia%' THEN 'Ortografia'
          ELSE 'Gramática Geral'
        END as categoria,
        COUNT(*) as quantidade
      FROM perguntas
      GROUP BY categoria
      ORDER BY quantidade DESC
    `).all();

    return Response.json({
      total: statsGeral.total,
      temas: temas.results
    }, {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response("Erro ao buscar estatísticas", { status: 500 });
  }
}
