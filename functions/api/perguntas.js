// functions/api/perguntas.js
export async function onRequest(context) {
    const { env } = context;
    try {
        // Selecionamos apenas id, pergunta e as opções. 
        // A resposta correta e a explicação ficam protegidas no banco.
        const { results } = await env.DB.prepare(
            "SELECT id, pergunta, opcoes FROM perguntas"
        ).all();

        return new Response(JSON.stringify(results), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}
