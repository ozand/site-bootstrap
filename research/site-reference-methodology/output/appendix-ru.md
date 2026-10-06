# ПРИЛОЖЕНИЕ: Доказательная база, спот-чеки и результаты пилота (Technical Appendix)

- **Версия:** 1.0.0 (Финальный отчет)
- **Идентификатор задачи:** Issue #87
- **Связанный документ:** `output/proposal-ru.md`
- **Канонический каталог:** `research/site-reference-methodology/`

---

## Приложение А: Каталог первоисточников и уровни достоверности

Каждый источник классифицирован по уровням авторитетности (Tier 1 — прямой текст спецификаций, Tier 2 — клиентский рендеринг DOM, Tier 3 — структурированная Markdown-конверсия). Полные текстовые дампы сохранены в локальном приватном архиве (`[LOCAL_NOT_SHIPPED: private research archive]`), а публичная спецификация опирается на канонические URL и открытые стандарты:

1. **`SRC-01` — google-labs-code/design.md (`docs/spec.md`):**
   - URL: `https://github.com/google-labs-code/design.md/blob/main/docs/spec.md`
   - Статус архива: `[LOCAL_NOT_SHIPPED: private research archive]`
   - Уровень: Tier 1 (прямой текст). Разделы: `DESIGN.md Format`, `Do's and Don'ts`.
2. **`SRC-02` — W3C Design Tokens Format Module (DTCG):**
   - URL: `https://www.designtokens.org/tr/drafts/format/`
   - Статус архива: `[LOCAL_NOT_SHIPPED: private research archive]`
   - Уровень: Tier 1. Разделы: `3.1 (Design) Token`, `7.1.1 Curly Brace Syntax`.
3. **`SRC-03` — W3C Open UI Customizable Select Explainer:**
   - URL: `https://open-ui.org/components/customizable-select.explainer/`
   - Статус архива: `[LOCAL_NOT_SHIPPED: private research archive]`
   - Уровень: Tier 1. Раздел: `Replacing the button`.
4. **`SRC-04` — W3C Web Content Accessibility Guidelines (WCAG) 2.2:**
   - URL: `https://www.w3.org/TR/WCAG22/` (W3C Recommendation 12 Dec 2024)
   - Статус архива: `[LOCAL_NOT_SHIPPED: private research archive]`
   - Уровни: Tier 2 (рендеринг DOM) и Tier 3 (структурированный Markdown).
   - Подтверждены критерии (1.4.3, 2.4.7, 2.4.11, 2.5.8, 3.2.6, 3.3.8, 4.1.3), Conformance, Glossary.
5. **`SRC-06` — Nielsen Norman Group (10 Usability Heuristics):**
   - URL: `https://www.nngroup.com/articles/ten-usability-heuristics/`
   - Статус архива: `[LOCAL_NOT_SHIPPED: private research archive]`
   - Уровень: Tier 1. Разделы: `1: Visibility of System Status` по `10: Help and Documentation`.
6. **`SRC-06-sev` — Nielsen Norman Group (Usability Severity Ratings):**
   - URL: `https://www.nngroup.com/articles/how-to-rate-the-severity-of-usability-problems/`
   - Статус архива: `[LOCAL_NOT_SHIPPED: private research archive]`
   - Уровень: Tier 1. Разделы: `Severity Factors` (частота, критичность, устойчивость), шкала `0`–`4`.
7. **`SRC-07-quick` — April Dunford (A Quickstart Guide to Positioning):**
   - URL: `https://www.aprildunford.com/post/a-quickstart-guide-to-positioning`
   - Статус архива: `[LOCAL_NOT_SHIPPED: private research archive]`
   - Уровень: Tier 1. Разделы: 5 компонентов позиционирования, альтернативы и ловушки категорий.
8. **`SRC-10-jtbd` — Bob Moesta / The Re-Wired Group (Complete Guide to JTBD):**
   - URL: `https://therewiredgroup.com/learn/complete-guide-jobs-to-be-done/`
   - Статус архива: `[LOCAL_NOT_SHIPPED: private research archive]`
   - Уровень: Tier 3. Разделы: 4 силы прогресса (Push, Pull, Anxiety, Habit), 8 элементов, правила интервью.
9. **`SRC-10-sales` — Bob Moesta / The Re-Wired Group (Demand-Side Sales 101):**
   - URL: `https://therewiredgroup.com/learn/demand-side-sales-101-stop-selling-and-help-your-customers-make-progress/`
   - Статус архива: `[LOCAL_NOT_SHIPPED: private research archive]`
   - Уровень: Tier 3. Разделы: 5 принципов проведения интервью, сопоставление спроса с воронкой продаж.
10. **`SRC-11` — Clayton Christensen et al. (HBR: Know Your Customers' JTBD):**
    - URL: `https://hbr.org/2016/09/know-your-customers-jobs-to-be-done`
    - Статус архива: `[LOCAL_NOT_SHIPPED: private research archive]`
    - Уровень: Tier 1. Разделы: концепция «найма» и «увольнения» продукта, кейс Intercom.
11. **`SRC-12` — Tony Ulwick / Strategyn (Outcome-Driven Innovation & Job Map):**
    - URL: `https://strategyn.com/jobs-to-be-done/`
    - Статус архива: `[LOCAL_NOT_SHIPPED: private research archive]`
    - Уровень: Tier 1. Разделы: универсальная 8-шаговая карта работы (Define to Conclude), 3 роли клиентов.
12. **`SRC-13` — Nielsen Norman Group (Journey Mapping 101):**
    - URL: `https://www.nngroup.com/articles/journey-mapping-101/`
    - Статус архива: `[LOCAL_NOT_SHIPPED: private research archive]`
    - Уровень: Tier 1. Разделы: 5 ключевых элементов CJM (Actor, Scenario, Phases, Actions/Mindsets/Emotions).
13. **`SRC-14` — Nielsen Norman Group (Service Blueprints: Definition):**
    - URL: `https://www.nngroup.com/articles/service-blueprints-definition/`
    - Статус архива: `[LOCAL_NOT_SHIPPED: private research archive]`
    - Уровень: Tier 1. Разделы: дорожки сервисного чертежа, Линия видимости (Line of Visibility).
14. **`SRC-15` — Baymard Institute (E-Commerce UX Research Methodology):**
    - URL: `https://baymard.com/research`
    - Статус архива: `[LOCAL_NOT_SHIPPED: private research archive]`
    - Уровень: Tier 1. Раздел: методология тестирования пользовательских интерфейсов.
15. **`SRC-16` — Nielsen Norman Group (Information Architecture: Study Guide):**
    - URL: `https://www.nngroup.com/articles/ia-study-guide/`
    - Статус архива: `[LOCAL_NOT_SHIPPED: private research archive]`
    - Уровень: Tier 1. Разделы: принципы организации IA, навигационные структуры.
16. **`SRC-17` — Martijn van Welie (Interaction Design Pattern Library):**
    - URL: `https://www.welie.com/patterns/showPattern.php?patternID=search`
    - Статус архива: `[LOCAL_NOT_SHIPPED: private research archive]`
    - Уровень: Tier 1. Разделы: анатомия паттерна (Problem, Solution, Use when / Context, How, Why).

---

## Приложение Б: Методологический аудит и устранение инструментальной обрезки

### Б.1. Результаты аудита матрицы покрытия
- **Документ матрицы:** `metadata/question-coverage.md`.
- **Канонический статус аудита:**
  - **28 методологических вопросов** из спецификации задачи #87 аудированы по 8 ключевым концептуальным темам (Design.md, DTCG токены, Open UI, WCAG доступность, эвристики NNG, позиционирование Dunford, JTBD силы/карты, CJM архитектура).
  - Нормативные разделы первоисточников сопоставлены с требованиями онтологии; текстовые корпуса для цитирования поддерживаются в отдельном приватном архиве исследования.
- **Разграничение методологического охвата и эмпирических ограничений:**
  - Нормативная база формирует правила библиотеки референсов.
  - При этом неинвазивный аудит публичного DOM имеет строгие границы: мобильное поведение на тач-устройствах, ментальные модели пользователей, внутренние показатели оттока и воронки продаж недоступны без прямого исследования пользователей и имеют статус гипотез (`[HYPOTHESIS]`) либо недоступных метрик (`[UNVERIFIABLE]`).
- **Модальности инструментального захвата:**
  - Экстракция текста (`surf page.text`), экспорт рендеринга DOM (`surf page.save`), вычисление стилей (`window.getComputedStyle`). Все полученные данные являются клиентскими артефактами рендеринга браузера, а не сетевыми пакетами сервера.

### Б.2. Первопричина обрезки surf page.text и протокол обхода
- **Дефект:** Контент-скрипт `surf-cli` (`dist/content/index.js`, строка 115) содержит жесткое усечение `r.substring(0, 5e4)`. CLI `page.text` не поддерживает пагинации, что вызывало скрытую обрезку документов длиннее 50 000 символов (например, WCAG 2.2 обрезался на SC 2.4.11).
- **Решение:** Использование команды `surf page.save --selector "html"`, экспортирующей полный DOM через `chrome.scripting.executeScript` и Node.js `fs.writeFileSync` без ограничений по длине. Полный протокол зафиксирован в `lessons/LESSON-surf-cli-50k-truncation-and-dom-export.md`.

---

## Приложение В: Результаты эмпирического пилота на 2 сайтах (Linear и thoughtbot)

### В.1. Девиации вьюпортов и статус мобильных снимков
- **Десктоп (разрешение 2018×1269 px):** Инструментальные замеры вычисленных стилей DOM верифицированы (`[LOCAL_NOT_SHIPPED: private research archive]`).
- **Мобильный вьюпорт (`NOT_VERIFIED`):** Снимки мобильных версий были масштабированы до 1200×755 px без полноценной эмуляции мобильного User-Agent. Мобильный CJM не верифицирован (`[not_verified]`).

### В.2. Прямые замеры вычисленных стилей DOM (getComputedStyle)
- **Кнопка CTA Linear (`linear.app`):**
  - Цвет фона: `rgb(229, 229, 230)` (`#E5E5E6`, светло-серый).
  - Цвет текста: `rgb(8, 9, 10)` (`#08090A`, почти черный).
  - Скругление углов: `9999px` (форма пилюли).
  - Контрастность: **15.83:1** (полное соответствие WCAG AA).
  - Опровергнутая память модели: классический брендовый фиолетовый `#5E6AD2` отсутствует на главной кнопке CTA.

### В.3. Сквозные трассировки утверждений и ролей
- **Linear (`site_id: linear-app`):**
  - Ниша: `developer-tools` (управление проектами).
  - Бизнес-модель: `subscription-saas`.
  - Стратегия GTM: `product-led-growth`.
- **thoughtbot (`site_id: thoughtbot`):**
  - Ниша: `software-consulting` (дизайн и разработка).
  - Бизнес-модель: `agency-retainer`.
  - Стратегия GTM: `content-led`.

### В.4. Фиксация неисследованных зон и границ авторизации
Экран онбординга `/signup` и рабочее пространство приложения на `linear.app` требуют авторизации и классифицированы как `[AUTH_LOCKED]`. Неисследованные пути навигации помечены `[not_explored]`.

---

## Приложение Г: Инвентарь файлов и путей артефактов исследования

Все материалы исследования разделены на публичные документы репозитория и приватный локальный архив:

1. **Публичные файлы репозитория (7 файлов):**
   - `output/proposal-ru.md`: Концептуальное предложение по методологии.
   - `output/appendix-ru.md`: Настоящее техническое приложение.
   - `README.md`: Структура каталога и уровни авторитетности.
   - `lessons/LESSON-surf-cli-50k-truncation-and-dom-export.md`: Технический урок и протокол извлечения DOM.
   - `metadata/source-catalog.json`: Открытый каталог первоисточников.
   - `metadata/question-coverage.md`: Матрица охвата методологических вопросов и соответствия разделам.
   - `.gitignore`: Локальное правило исключения приватных корпусов.

2. **Приватный локальный исследовательский архив (`[LOCAL_NOT_SHIPPED: private research archive]`):**
   - Полные текстовые дампы стандартов и статей.
   - Немодифицированные снимки рендеринга DOM нормативных спецификаций.
   - Инструментальные замеры вычисленных стилей пилотов (`pilot/sites/...`).
   - Концептуальный словарь сущностей (`synthesis/ontology.json`).
   - Скрипты нормализации и проверки.
