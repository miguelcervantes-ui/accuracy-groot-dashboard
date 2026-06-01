# Accuracy Groot Dashboard

Dashboard migrado de Google Apps Script a Node.js/Express.

## Requisitos
- Node.js 18+
- Una Service Account de Google Cloud con acceso al Sheets

## Setup

```bash
npm install
cp .env.example .env
# Edita .env con tus credenciales
node server.js
```

Abre http://localhost:3000

## Configuración de Google Sheets

1. Ve a [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Library
2. Habilita la **Google Sheets API**
3. Ve a Credentials → Create Credentials → Service Account
4. Descarga la clave JSON
5. Comparte tu Sheets con el email de la Service Account (Viewer)
6. En `.env`, pega el JSON completo en `GOOGLE_SERVICE_ACCOUNT_KEY`

## Diferencias respecto a Apps Script

| Apps Script | Esta versión |
|---|---|
| `google.script.run.getData()` | `GET /api/data` |
| `google.script.run.getUserInfo()` | `GET /api/userinfo` |
| Exportar → nuevo Google Sheets | Descarga CSV directa |
