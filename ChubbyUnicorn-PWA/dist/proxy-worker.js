// Simple proxy worker for ForeFlight API
// Deploy this to Cloudflare Workers or similar service

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // Enable CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
  }

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the target URL from query parameter
    const url = new URL(request.url)
    const targetUrl = url.searchParams.get('url')
    
    if (!targetUrl) {
      return new Response('Missing url parameter', { 
        status: 400,
        headers: corsHeaders 
      })
    }

    // Extract API key from headers
    const apiKey = request.headers.get('x-api-key')
    
    // Forward the request to ForeFlight
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        'x-api-key': apiKey,
        'Accept': 'application/json',
        'User-Agent': 'ChubbyUnicorn/1.0'
      }
    })

    // Create response with CORS headers
    const body = await response.text()
    return new Response(body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...corsHeaders,
        'Content-Type': response.headers.get('Content-Type') || 'application/json'
      }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    })
  }
}