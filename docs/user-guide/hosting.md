# Хостинг

Целевая архитектура разделяет приватное редактирование, сборку и публичную
публикацию: Keystatic работает в GitHub-режиме на приватном editor host,
сборка выполняется на локальном Docker/CI host, а публичный VPS обслуживает
только проверенный статический релиз через Nginx. Подробности — в
[архитектурном контракте](../architecture/separated-static-site.md).

## Другие провайдеры

Vercel, Netlify и Cloudflare не являются частью целевого публичного VPS
контракта этого проекта. Их адаптеры и provider-specific rollout требуют
отдельного решения и проверки; не переносите на них автоматически правила
публичного статического VPS.

```bash
npx astro add vercel     # заменит адаптер
vercel --prod            # или подключите репозиторий в дашборде Vercel
```

Подробно + настройка Keystatic (GitHub-режим, env-переменные): `hosting/vercel/README.md`.

## Netlify / Cloudflare

Аналогично: `npx astro add netlify` или `npx astro add cloudflare`. Keystatic — так же в GitHub-режиме.

## VPS

Целевая архитектура публикует на VPS только проверенный статический релиз:
Nginx обслуживает `releases/<release-id>/current`, без публичного Node/SSR,
Keystatic или базы данных. Сборка выполняется отдельно на локальном Docker/CI
host после `npm ci`, `npm run verify` и `npm run build`.

Готовые VPS-файлы в `hosting/vps/` — исторический Node/Docker baseline и
implementation reference для follow-up issues; они не являются разрешением
запускать публичный Node/Keystatic runtime в целевой архитектуре.

```bash
# Follow-up deployment implementation; not a production command by itself.
docker compose up -d --build
```

## Важно про Keystatic и публичную публикацию

- Keystatic не размещается на публичном VPS; редактор работает на приватном
  editor host в `github`-режиме и отправляет изменения в GitHub.
- Публичный VPS не выполняет Node/SSR, не предоставляет `/keystatic` и не
  хранит runtime-базу данных.
- `local`-режим остаётся вариантом локальной разработки/непубликуемого
  редактора; он не является публичной production auth или publication boundary.
- После commit в GitHub отдельный build host выполняет проверку и публикует
  только статический `dist/` release.
