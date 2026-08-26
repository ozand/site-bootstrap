# Хостинг

Шаблон по умолчанию собирается под Node-адаптер (standalone) — он работает на любом VPS и в контейнере. Для облачных платформ адаптер меняется одной командой.

## Vercel (проще всего)

```bash
npx astro add vercel     # заменит адаптер
vercel --prod            # или подключите репозиторий в дашборде Vercel
```

Подробно + настройка Keystatic (GitHub-режим, env-переменные): `hosting/vercel/README.md`.

## Netlify / Cloudflare

Аналогично: `npx astro add netlify` или `npx astro add cloudflare`. Keystatic — так же в GitHub-режиме.

## VPS

Готовые файлы в `hosting/vps/`: `Dockerfile`, `docker-compose.yml`, `nginx.conf`, systemd-юнит.

```bash
docker compose up -d --build   # сайт на 127.0.0.1:4321, nginx сверху для TLS
```

## Важно про Keystatic на проде

- Serverless (Vercel/Netlify/Cloudflare): файловая система read-only → работает ТОЛЬКО `github`-режим хранения.
- VPS: работает и `local`-режим, но правки надо пушить обратно в git (иначе умрут с контейнером). Рекомендация — тоже `github`-режим.
- Если админка на проде не нужна — оставьте `local` и редактируйте контент только локально/через агента; прод просто рендерит.
