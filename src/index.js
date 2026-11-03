/**
 * Cloudflare Worker for PIXEL SURVIVORS
 * Serves static assets and provides lightweight API endpoints for the game.
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Enable CORS for API routes
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // --- API Endpoints ---
    if (url.pathname === '/api/health') {
      return new Response(
        JSON.stringify({
          status: 'online',
          game: 'Pixel Survivors',
          version: '0.9.0-alpha',
          timestamp: new Date().toISOString()
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      );
    }

    if (url.pathname === '/api/game-info') {
      return new Response(
        JSON.stringify({
          title: 'PIXEL SURVIVORS',
          genre: 'Top-Down Roguelite Arena Survival',
          version: '0.9.0-alpha',
          description: 'Vampire Survivors style roguelite with pixel art aesthetics.',
          hero: {
            name: 'Herói Mago (Astralis)',
            description: 'A wizard wearing a wide-brimmed pointed hat and flowing star robes with glowing crystal orb staff.',
            baseHp: 100,
            baseSpeed: 155,
            attackStyle: 'Auto-target closest enemy'
          },
          enemies: [
            { id: 'slime', name: 'Slime Verde', type: 'Comum', role: 'Swarm', hp: 28, speed: 'Moderada' },
            { id: 'morcego', name: 'Morcego', type: 'Veloz', role: 'Rusher', hp: 18, speed: 'Alta' },
            { id: 'ogro', name: 'Ogro Azul', type: 'Tanque', role: 'Colossus', hp: 160, speed: 'Lenta' }
          ]
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      );
    }

    if (url.pathname === '/api/newsletter' && request.method === 'POST') {
      try {
        const data = await request.json();
        const email = data.email;
        if (!email || !email.includes('@')) {
          return new Response(
            JSON.stringify({ success: false, error: 'E-mail inválido' }),
            { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
          );
        }

        return new Response(
          JSON.stringify({
            success: true,
            message: 'Inscrição confirmada com sucesso na Alfa Fechada!',
            email
          }),
          {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          }
        );
      } catch (e) {
        return new Response(
          JSON.stringify({ success: false, error: 'Falha ao processar corpo JSON' }),
          { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
    }

    // --- Static Asset Serving via Cloudflare Workers Static Assets binding ---
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    // Fallback message
    return new Response('Pixel Survivors Cloudflare Worker - Static assets binding not attached.', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
};
