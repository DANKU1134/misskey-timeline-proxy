// Vercel Serverless Function for Misskey API Proxy
export default async function handler(req, res) {
    // CORS設定
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // OPTIONSリクエスト（プリフライト）への対応
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    // POSTリクエストのみ許可
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        // URLパラメータからエンドポイントを取得
        const { endpoint } = req.query;
        const endpointPath = Array.isArray(endpoint) ? endpoint.join('/') : endpoint;
        
        console.log('Proxying request to:', endpointPath);
        console.log('Request body:', req.body);
        
        const { instance, apiToken, limit, withFiles, withReplies } = req.body;
        
        // デフォルト値の設定
        const misskeyInstance = instance || 'https://misskey.io';
        const requestLimit = limit || 10;
        
        // Misskeyインスタンスへのリクエスト
        const response = await fetch(`${misskeyInstance}/api/${endpointPath}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Twitch-Misskey-Extension/1.0'
            },
            body: JSON.stringify({
                i: apiToken,
                limit: requestLimit,
                withFiles: withFiles || false,
                withReplies: withReplies || false
            })
        });
        
        if (!response.ok) {
            console.error(`Misskey API error: ${response.status}`);
            const errorText = await response.text();
            return res.status(response.status).json({
                error: `Misskey API error: ${response.status}`,
                message: errorText
            });
        }
        
        const data = await response.json();
        console.log(`Successfully fetched ${data.length} posts`);
        
        // レスポンスヘッダーを設定
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        
        res.status(200).json(data);
        
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({
            error: 'Proxy server error',
            message: error.message
        });
    }
}
