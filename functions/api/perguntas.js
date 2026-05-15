export async function onRequest(context) {
    const { env } = context;
    try {
        const { results } = await env.DB.prepare(
            "SELECT id, pergunta, opcoes, correta, explicacao, tema FROM perguntas"
        ).all();

        // Converte a string do banco em array real para o frontend
        const formatados = results.map(p => ({
            ...p,
            opcoes: typeof p.opcoes === 'string' ? JSON.parse(p.opcoes) : p.opcoes
        }));

        return new Response(JSON.stringify(formatados), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}
