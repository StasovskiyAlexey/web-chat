# 🚀 Web-Chat Application

#### **Чат в реальном времени, с комнатами, сообщениями, ролями и оповещениями**

## 🖼️ Интерфейс приложения (Screenshots)

<p align="center">
  Ниже представлены ключевые экраны приложения. Вы можете развернуть каждый блок, чтобы увидеть интерфейс системы.
</p>

---

### 🔐 1. Аутентификация и Вход

<details>
<summary><b>Посмотреть экран авторизации (Нажмите, чтобы развернуть)</b></summary>
<br />
<p align="center">
  <img src="https://www.dropbox.com/scl/fi/tlagwhuqbyztrcavcn0pn/auth.png?rlkey=kpc5tjzi6h1e6i7900bxbe52j&st=pm4rz68b&raw=1" width="100%" alt="Страница авторизации" />
</p>
<p align="center"><i>Минималистичная форма входа и регистрации пользователя с валидацией полей.</i></p>
</details>

---

### 📋 2. Комнаты пользователя (Рабочие пространства)

<details>
<summary><b>Посмотреть список комнат(чатов) (Нажмите, чтобы развернуть)</b></summary>
<br />
<p align="center">
  <img src="https://www.dropbox.com/scl/fi/jnqadxtqz6zp2zv9tomgv/rooms.png?rlkey=dd6n2kud8hrjnz6gbmxe5zuo5&st=jnurnfhq&raw=1" width="100%" alt="Список комнат" />
</p>
<p align="center"><i>Список комнат(чатов) доступные пользователю.</i></p>
</details>

---

### ⚡ 3. Чат-комната

<details>
<summary><b>Посмотреть интерфейс комнаты (Нажмите, чтобы развернуть)</b></summary>
<br />
<p align="center">
  <img src="https://www.dropbox.com/scl/fi/78aw509gao1l2x4mqrikf/chat-room.png?rlkey=m2wz0viqv90t08jzqeoj634ey&st=qgyc35bg&raw=1" width="100%" alt="Чат комната" />
</p>
<p align="center"><i>Интерфейс комнаты с данными о комнате и чатом с сообщениями которые приходят в реальном времени</i></p>
</details>

---

### 📄 4. Настройки

<details>
<summary><b>Посмотреть настройки пользователя (Нажмите, чтобы развернуть)</b></summary>
<br />
<p align="center">
  <img src="https://www.dropbox.com/scl/fi/w2678xcfto2hbpr9oz7h0/settings.png?rlkey=ky6pkpbz0xw97zljniktwuswf&st=9i5sna2v&raw=1" width="100%" alt="Настройки" />
</p>
<p align="center"><i>Настройки пользователя</i></p>
</details>

---

## 🏗 Технологический стек

### Frontend (Vite + TanStack)

- **Ядро**: React 19, TypeScript
- **Роутинг**: `@tanstack/react-router`
- **Данные**: `@tanstack/react-query`, Axios
- **Валидация**: React Hook Form + Zod
- **UI**: Tailwind CSS, Radix UI, Framer Motion, Vaul (для модальных окон)

### Backend (FastAPI + SQLAlchemy)

- **Ядро**: Python 3.12, FastAPI
- **Тестирование**: Pytest, httpx
- **ORM**: SQLAlchemy 2.0 + Alembic (миграции)
- **БД**: PostgreSQL (через `asyncpg`)
- **Real-time**: WebSockets
- **Безопасность**: JWT (PyJWT), Passlib

---

## **⚙️ Функционал:**

1. Создание, удаление комнаты.
2. У каждого пользователя и комнаты есть уникальный идентификатор в виде кода user_code или room_code.
3. Приглашение пользователя по его коду или приглашение в комнату от пользователя по коду комнаты.
4. Создание сообщений в комнате от участников комнаты.
5. Реализация отправки, получения сообщений, и создание уведомлений в аккаунте пользователя в реальном времени, интеграция с Websocket.
6. Поп-ап для уведомлений пользователя о событиях связанным с ним.
7. Аутентификация через JWT токен с использованием pyJWT, регистрация и логин в аккаунт, пользователи создаются и лежат в БД postgreSQL.

---

## 📂 Структура проекта

### Frontend (`/frontend`)

```
src/
├── app/            # API клиенты (Axios), типы, конфигурация, маршрутизация
├── entities/       # Бизнес-сущности (User, Message, Invite)
├── features/       # Бизнес-фичи (Auth, SendMessage, Notifications, СreateRoom)
├── shared/         # UI-кит (Shadcn UI, хуки, стили, Dependency Injection)
├── widgets/        # Крупные блоки (Header, Footer, Sidebar, Modals, Popups)
```

### Back-end (`/backend`)

```
tests/
├── api/            # Тесты API, отдельные файлы с тестированием эндпоинтов
app/
├── routers/        # Эндпоинты
├── dependencies/   # Внедрение зависимостей в виде функций (Аутентификация, получения сервисов)
├── core/           # Конфигурация, Security, DB session
├── models/         # SQLAlchemy модели (таблицы)
├── schemas/        # Pydantic модели (валидация запросов/ответов)
└── services/       # Бизнес-логика и WebSocket Manager
```

---

## 📃 Запуск проекта

## Front-end

1. Путь к проекту - **cd frontend**
2. Установка зависимостей - **npm i**
3. Создать .env внутри папки frontend для зависимостей окружения со следующими переменными:

- VITE_BASE_URL=http://localhost:5173/
- VITE_API_BASE_URL=http://localhost:8000/api/v1/
- VITE_API_WS_BASE_URL=ws://localhost:8000/api/v1/websockets

4. Запуск фронтенда в dev режиме - **npm run dev**

## Back-end

1. Путь к проекту - **cd frontend**
2. Установка зависимостей - **poetry install**
3. Создать зависимости окружения проекта:

#### .env.dev - для разработки

- POSTGRES_USER=postgres
- POSTGRES_PASSWORD=postgres
- POSTGRES_DB=chat-db
- DEBUG=True
- MAX_IMAGE_SIZE_MB=5
- SECREY_KEY=secret_key
- DATABASE_URL=postgresql+asyncpg://postgres:postgres@db:5432/chat-db

#### .env.test - для тестирования

- POSTGRES_USER=postgres
- POSTGRES_PASSWORD=postgres
- POSTGRES_DB=chat-test-db
- DEBUG=True
- MAX_IMAGE_SIZE_MB=5
- SECRET_KEY=secret_for_tests_only
- DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5433/chat-test-db

4. Собираем docker-compose - **make build**
5. Поднимаем наш docker-compose - **make up**
6. Заходим в docker контейнер бекенда через новый терминал, предварительно<br>
   прописывая путь к бекенду для доступа к контейнеру - **docker exec -it chat-backend bash**
7. Создаем миграции с помощью alembic - **alembic upgrade head**
