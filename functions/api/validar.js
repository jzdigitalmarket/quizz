// functions/api/validar.js
export async function onRequestPost(context) {
    const { env, request } = context;
    const { id, respostaUsuario } = await request.json();

    const pergunta = await env.DB.prepare(
        "SELECT correta, explicacao FROM perguntas WHERE id = ?"
    ).bind(id).first();

    const eCorreta = pergunta.correta === respostaUsuario;

    return new Response(JSON.stringify({
        correta: eCorreta,
        explicacao: pergunta.explicacao // Só envia a explicação após a resposta
    }), {
        headers: { "Content-Type": "application/json" }
    });
}
