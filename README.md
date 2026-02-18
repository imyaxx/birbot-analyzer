# birbot-profit-analyzer

Веб-приложение для быстрой оценки позиции магазина на Kaspi: пользователь вставляет ссылку на товар и название магазина, сервис показывает позицию магазина среди продавцов, цену лидера и дельту до топ-1.

## Что делает проект

- Пошаговый onboarding: welcome -> ввод данных -> анализ.
- Проверяет корректность ссылки и домен `kaspi.kz`.
- Получает список продавцов через backend и рассчитывает:
  - позицию вашего магазина,
  - цену лидера (top-1),
  - разницу цены до лидера,
  - топ продавцов для визуального рейтинга.
- Поддерживает 3 языка интерфейса: `ru`, `kk`, `en`.
- Показывает состояние загрузки и обработку ошибок API.

## Стек

- Frontend: React 19, Vite 6, Framer Motion, i18next.
- Backend: Node.js (ESM), Express 4, CORS, dotenv.
- Линт/формат: ESLint 9, Prettier 3.

## Архитектура

- `src/` - клиентское приложение (UI, шаги мастера, локализация, утилиты).
- `server/src/` - API-слой и сервис анализа Kaspi.
- В dev-режиме Vite проксирует `/api/*` на `http://localhost:4000`.

Поток данных:

1. Пользователь вводит `productUrl` и `shopName` на фронтенде.
2. Фронтенд отправляет `POST /api/analyze`.
3. Backend валидирует вход, извлекает `productId`, запрашивает офферы Kaspi и считает метрики.
4. Фронтенд показывает результат (ранг, цены, CTA).

## Требования

- Node.js 20+ (рекомендуется LTS).
- npm 10+.

## Быстрый старт

1. Установить зависимости фронтенда:

```bash
npm install
```

2. Установить зависимости backend:

```bash
npm --prefix server install
```

3. Создать `.env` для API:

```bash
cp server/.env.example server/.env
```

4. Запустить backend:

```bash
npm run dev:api
```

5. В отдельном терминале запустить frontend:

```bash
npm run dev
```

По умолчанию:

- Frontend: `http://localhost:3000`
- API: `http://localhost:4000`

## Переменные окружения

Файл: `server/.env`

- `PORT` - порт API (по умолчанию `4000`).
- `CORS_ORIGIN` - разрешенный origin для CORS (по умолчанию `http://localhost:3000`).
- `KASPI_LIMIT` - размер страницы офферов (опционально, по умолчанию `5`).
- `KASPI_ZONE_ID` - список зон через запятую (опционально, по умолчанию `Magnum_ZONE1`).

Переменная frontend:

- `VITE_API_URL` - базовый URL API (опционально; в dev обычно не нужен, потому что используется Vite proxy).

Примечание: в `server/.env.example` есть `PROXY_*` переменные, но в текущей реализации они не используются в коде.

## Скрипты

Корень проекта (`package.json`):

- `npm run dev` - запуск frontend (Vite).
- `npm run dev:api` - запуск backend в режиме watch.
- `npm run build` - production-сборка frontend.
- `npm run preview` - локальный preview сборки.
- `npm run lint` - линтинг `src/`.
- `npm run format` - форматирование исходников frontend.

Backend (`server/package.json`):

- `npm --prefix server run dev` - запуск API с `--watch`.
- `npm --prefix server run start` - обычный запуск API.

## API

### `POST /api/analyze`

Request body:

```json
{
  "productUrl": "https://kaspi.kz/shop/p/....",
  "shopName": "Название магазина"
}
```

Успешный ответ (`200`):

```json
{
  "productId": "12345678",
  "leaderShop": "Shop A",
  "leaderPrice": 739474,
  "myShopFound": true,
  "myShopPrice": 742883,
  "myShopPosition": 7,
  "priceToTop1": 3409,
  "offers": [
    {
      "name": "Shop A",
      "price": 739474,
      "rating": 4.9,
      "reviewCount": 512
    }
  ]
}
```

Ошибки:

- `400` - невалидные входные данные/ссылка.
- `404` - магазин не найден среди продавцов.
- `500` - ошибка обработки/интеграции.

## Полная структура проекта

Структура ниже отражает файлы репозитория (без `.git` и `node_modules`):

```text
.
|-- .gitignore
|-- .prettierignore
|-- .prettierrc
|-- README.md
|-- eslint.config.js
|-- index.html
|-- package-lock.json
|-- package.json
|-- server
|   |-- .env.example
|   |-- package-lock.json
|   |-- package.json
|   `-- src
|       |-- index.js
|       |-- routes
|       |   `-- analyze.js
|       `-- services
|           `-- kaspiParser.js
|-- src
|   |-- app
|   |   |-- App.jsx
|   |   |-- App.module.css
|   |   `-- main.jsx
|   |-- assets
|   |   |-- Logo_of_Kaspi_bank.png
|   |   `-- sellers-bg.png
|   |-- features
|   |   |-- analysis
|   |   |   |-- PositionRanking
|   |   |   |   |-- PositionRanking.jsx
|   |   |   |   `-- PositionRanking.module.css
|   |   |   |-- StepAnalysis
|   |   |   |   |-- StepAnalysis.jsx
|   |   |   |   `-- StepAnalysis.module.css
|   |   |   `-- StickyResult
|   |   |       |-- StickyResult.jsx
|   |   |       `-- StickyResult.module.css
|   |   `-- wizard
|   |       |-- StepInput
|   |       |   |-- StepInput.jsx
|   |       |   `-- StepInput.module.css
|   |       |-- StepProgress
|   |       |   |-- StepProgress.jsx
|   |       |   `-- StepProgress.module.css
|   |       `-- StepWelcome
|   |           |-- StepWelcome.jsx
|   |           `-- StepWelcome.module.css
|   |-- pages
|   |   `-- ProfitAnalyzerPage
|   |       |-- ProfitAnalyzerPage.jsx
|   |       `-- ProfitAnalyzerPage.module.css
|   `-- shared
|       |-- constants
|       |   |-- app.js
|       |   `-- demo.js
|       |-- i18n
|       |   |-- i18n.js
|       |   `-- locales
|       |       |-- en.json
|       |       |-- kz.json
|       |       `-- ru.json
|       |-- lib
|       |   |-- miniSellerRanking.js
|       |   |-- onboardingClient.js
|       |   `-- utils.js
|       `-- ui
|           |-- ErrorBoundary
|           |   `-- ErrorBoundary.jsx
|           |-- FormField
|           |   |-- FormField.jsx
|           |   `-- FormField.module.css
|           |-- LanguageMenu
|           |   |-- LanguageMenu.jsx
|           |   `-- LanguageMenu.module.css
|           `-- States
|               |-- States.jsx
|               `-- States.module.css
`-- vite.config.js
```
