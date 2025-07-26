# 勉強時間管理アプリ

A study time management app built with Next.js and TypeScript.

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

プロジェクトルートに `.env.local` ファイルを作成し、以下のFirebase設定を追加してください：

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Firebaseプロジェクトの設定

1. [Firebase Console](https://console.firebase.google.com/) で新しいプロジェクトを作成
2. Firestore Databaseを有効化
3. Webアプリを追加
4. 設定値（apiKey, authDomain, projectId等）をコピーして `.env.local` に設定

### 4. 開発サーバーの起動

```bash
npm run dev
```

## 機能

- 勉強時間の記録（科目名、ニックネーム、勉強時間）
- カレンダー表示（日別の勉強時間とニックネーム）
- レポート機能（ニックネーム別の勉強時間集計）
- リアルタイムデータ同期（Firebase Firestore）

## 技術スタック

- Next.js 14
- TypeScript
- Tailwind CSS
- Firebase Firestore
- React Hook Form
- Recharts
