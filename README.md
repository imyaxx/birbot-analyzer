# SaleScout - Profit Analyzer

Интерактивный анализатор для продавцов на kaspi.kz: пользователь вводит ссылку на товар и название магазина, сервер обращается к внутреннему API Kaspi, находит позицию магазина, цену лидера и разницу до ТОП-1, а фронтенд показывает результат в виде анимированного мини‑рейтинга и липкой панели.

## Стек

**Frontend**

- React 19 + Vite 6
- JavaScript (ES2022+)
- CSS Modules
- Framer Motion (анимации)
- Lucide React (иконки)
- i18next + react-i18next (RU / KZ / EN)
- ESLint + Prettier

**Backend**

- Node.js (ESM)
- Express
- dotenv
- CORS

## Архитектура

- Один роут на фронте, 3‑шаговый wizard:
  1. Приветствие
  2. Ввод данных (URL товара + название магазина)
  3. Анализ (интерактивный дашборд)
- Бэкенд:
  - `GET /api/health` — health check
  - `POST /api/analyze` — анализ по внутреннему API Kaspi

## Структура проекта

```
.
├── index.html
├── vite.config.js
├── eslint.config.js
├── .prettierrc
├── package.json
│
└── src/
    ├── app/
    │   ├── main.jsx                          # Точка входа React
    │   ├── App.jsx                           # Корневой компонент
    │   └── App.module.css
    │
    ├── shared/
    │   ├── ui/
    │   │   ├── ErrorBoundary/                # React Error Boundary
    │   │   ├── FormField/                    # Переиспользуемое поле формы
    │   │   ├── LanguageMenu/                 # Переключение языка
    │   │   └── States/                       # LoadingState / ErrorState
    │   │
    │   ├── i18n/
    │   │   ├── i18n.js                       # Конфигурация i18next
    │   │   └── locales/
    │   │       ├── ru.json                   # Русский
    │   │       ├── kz.json                   # Казахский
    │   │       └── en.json                   # Английский
    │   │
    │   ├── lib/
    │   │   ├── utils.js                      # Утилиты (cn, formatMoney, toNumber, safeString)
    │   │   ├── onboardingClient.js           # API‑клиент (analyzeKaspi)
    │   │   └── miniSellerRanking.js          # Логика мини‑рейтинга продавцов
    │   │
    │   └── constants/
    │       ├── app.js                        # Константы приложения (URL, домен, языки)
    │       └── demo.js                       # Фолбэк‑данные
    │
    ├── features/
    │   ├── wizard/
    │   │   ├── StepWelcome/                  # Шаг 1 — приветствие
    │   │   ├── StepInput/                    # Шаг 2 — ввод URL + магазин
    │   │   └── StepProgress/                 # Прогресс‑бар (3 шага)
    │   │
    │   └── analysis/
    │       ├── StepAnalysis/                 # Оркестратор дашборда
    │       ├── PositionRanking/              # Мини‑рейтинг продавцов
    │       └── StickyResult/                 # Липкая панель результата
    │
    ├── pages/
    │   └── ProfitAnalyzerPage/               # Главная страница — состояние визарда
    │
    └── assets/
        ├── sellers-bg.png                    # Фон телефона для мини‑рейтинга
        └── Logo_of_Kaspi_bank.png            # Логотип Kaspi

server/
├── package.json
├── .env.example
└── src/
    ├── index.js                              # Express API
    ├── routes/
    │   └── analyze.js                        # POST /api/analyze
    └── services/
        └── kaspiParser.js                    # Интеграция с Kaspi API
```

## Переменные окружения

**Frontend**

- `VITE_API_URL` — базовый URL API (опционально, по умолчанию same‑origin `/api`)

**Backend** (`server/.env`)

- `PORT` — порт API (default `4000`)
- `CORS_ORIGIN` — origin фронтенда (default `http://localhost:3000`)
- `KASPI_LIMIT` — лимит офферов на страницу (опционально)
- `KASPI_ZONE_ID` — список зон доставки через запятую (опционально)
- `PROXY_*` — присутствуют в `server/.env.example`, в текущем коде не используются

## Константы

Общие константы приложения вынесены в `src/shared/constants/app.js`:
- `TRIAL_LOGIN_URL` — URL страницы логина
- `ALLOWED_DOMAIN` — домен для валидации ссылок (`kaspi.kz`)
- `LANGUAGES` — массив поддерживаемых языков
- `STORAGE_KEYS` — ключи localStorage

## Запуск

**Frontend**

```bash
npm install
npm run dev
```

**Backend**

```bash
npm --prefix server install
npm run dev:api
```

## Скрипты

```bash
npm run dev        # Запуск dev‑сервера (localhost:3000)
npm run dev:api    # Запуск API (localhost:4000)
npm run build      # Production‑сборка
npm run preview    # Предпросмотр production‑сборки
npm run lint       # ESLint
npm run format     # Prettier
```

## Что умеет Step 3 (анализ)

- Получает данные из внутреннего API Kaspi (без HTML‑парсинга)
- Показывает ТОП‑продавцов с ценой, рейтингом и количеством отзывов
- Анимирует мини‑рейтинг в мокапе телефона: пользователь «поднимается» к #1, конкуренты шевелятся
- Плавное появление мокапа телефона (fade + scale + slide‑up)
- Отображает липкую панель сравнения цен и CTA
- Поддержка `prefers-reduced-motion` для accessibility

## Локализация

Сайт поддерживает 3 языка: русский (по умолчанию), казахский и английский. Переводы хранятся в `src/shared/i18n/locales/`. Выбранный язык сохраняется в localStorage.

## Важно

- Проект работает только с kaspi.kz
- Для других маркетплейсов возвращается корректная ошибка
- Внешние UI‑библиотеки не используются
