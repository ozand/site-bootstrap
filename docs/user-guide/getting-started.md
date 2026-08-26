# Быстрый старт: новый сайт с нуля

Инструкция для человека. Агенту — `docs/agent-guide/bootstrap-workflow.md`.

## Что вы получите

Сайт на Astro 5 + React 19 + Tailwind + shadcn/ui с CMS-админкой Keystatic по адресу `/keystatic`. Без базы данных: весь контент — файлы в git-репозитории.

## Требования

- Node.js 18+ (рекомендуется 22 LTS)
- git

## Шаги

```bash
# 1. Создать сайт из шаблона
node scripts/create-site.mjs --name my-site --domain example.com --target ../my-site

# 2. Установить зависимости и запустить
cd ../my-site
npm install
npm run dev
```

- Сайт: http://localhost:4321
- CMS: http://localhost:4321/keystatic

## Что дальше

1. **Контент** — см. `content-editing.md`: как писать посты через Keystatic.
2. **Публикация** — см. `hosting.md`: Vercel или VPS.
3. **Агент** — откройте папку сайта в Claude Code: агент прочитает `CLAUDE.md`/`AGENTS.md` и будет работать по правилам проекта. Скиллы уже скопированы в `.agents/skills/`.

## Правила, которые нельзя нарушать

- Не добавляйте базу данных — контент живёт в git.
- Схемы контента описаны в двух файлах: `keystatic.config.ts` и `src/content.config.ts`. Меняются только парой.
- Новые посты создаются черновиками (`draft: true`); публикация — снятие флага.
