# Misskey Timeline Proxy - Vercel版

TwitchのMisskey Timeline拡張機能用のプロキシサーバー（Vercel Serverless Functions）

## 🚀 デプロイ手順

### 1. GitHubリポジトリの作成
1. GitHub.com にログイン
2. 新しいリポジトリを作成（例：`misskey-timeline-proxy`）
3. このフォルダの内容をアップロード

### 2. Vercelでデプロイ
1. https://vercel.com にアクセス
2. GitHubアカウントでログイン
3. 「New Project」をクリック
4. 作成したリポジトリを選択
5. 「Deploy」をクリック

### 3. デプロイ完了
- デプロイが完了すると、URLが発行されます
- 例：`https://your-project-name.vercel.app`

## 📝 使用方法

### APIエンドポイント
```
POST https://your-project-name.vercel.app/api/misskey/notes/timeline
```

### リクエスト例
```json
{
  "instance": "https://misskey.io",
  "apiToken": "your-api-token",
  "limit": 10,
  "withFiles": false,
  "withReplies": false
}
```

## 🔧 Twitch拡張機能での設定

panel.jsの以下の行を変更：
```javascript
const proxyUrl = 'https://your-project-name.vercel.app/api/misskey/' + this.getTimelineEndpoint();
```

## 💰 費用

- **完全無料** - Vercelの無料プランで十分
- **制限**: 月100GB帯域（実際の使用量は1GB未満）
- **商用利用**: 個人配信での使用は非商用扱い

## 📊 使用量目安

- 1回のAPI呼び出し: 約5KB
- 30秒間隔で更新: 1時間で600KB
- 1日10時間配信: 6MB/日
- 月30日: 180MB/月（制限の0.18%）
