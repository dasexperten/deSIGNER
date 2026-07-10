# Packaging Localizer — пилот

Система: **дизайн упаковки заморожен один раз, тексты меняются по странам, превью генерится со 100% совпадением геометрии**. Печатный мастер остаётся в CorelDRAW; эта система делает превью для согласования.

Подтверждённый вердикт (см. чат): для **превью-макетов** достижимо 1:1 по геометрии/позициям; цвет — RGB-приближение (печатный CMYK финализируется в Corel); текст — 1:1 пока влезает в бокс, иначе авто-fit уменьшает кегль.

## Что доказал пилот (локально, реальный рендер)

`render.mjs` берёт замороженный `template/SYMBIOS.svg` + `strings.json` и рендерит превью. Три механизма проверены глазами:

| Версия | Что проверяет | Результат |
|---|---|---|
| RU | базовая подстановка | ✅ геометрия 1:1, кириллица |
| AR | RTL + bidi + латинские острова | ✅ арабский справа-налево, `SYMBIOS`/`Bacillus`/штрихкод остались LTR |
| DE | overflow длинного перевода | ✅ длинный заголовок авто-ужался 30→20px, остался в боксе |

```bash
npm install
node render.mjs SYMBIOS RU   # -> out/SYMBIOS_RU.png
node render.mjs SYMBIOS AR    # -> out/SYMBIOS_AR.png
node render.mjs SYMBIOS DE    # -> out/SYMBIOS_DE.png
```

Геометрия (зелёная полоса, панели, hero-круг, штрихкод) **пиксель-в-пиксель** одинакова во всех трёх — меняется только текст.

## Как устроено

- **Заморозка дизайна** = в SVG правится только содержимое `<text data-field="...">`. Все `x/y/transform/font/fill/path` неприкосновенны (ровно правило `designer` MODE B).
- **Подстановка** (`worker/src/substitute.js`, engine-agnostic): по `data-field` подставляет значение, меряет реальную ширину тем же движком рендера и при переполнении уменьшает кегль (никогда не раздувает трекинг).
- **RTL** решается по самой строке: арабский → выравнивание по правому краю + `direction=rtl` + арабский шрифт; латиница/цифры (бренд, коды) остаются LTR на месте.

## Ключевые правила точности (НЕ нарушать)

1. **Экспорт из Corel:** Text = **As text** (не curves) + **Embed fonts (used)** + снять Rasterize.
2. **Шрифты:** все начертания (вкл. кириллицу/арабский/армянский/...) встроены в SVG ИЛИ загружены в R2 `fonts/` — иначе подстановка шрифта ломает ширины.
3. **Цвет:** превью = RGB, НЕ печатно-точно. Печатный CMYK/spot/bleed = только `.cdr → PDF/X` из Corel.
4. **Ре-экспорт мастера** меняет структуру/ID узлов SVG → ломает привязку `data-field`. Повторный экспорт = контролируемый ре-маппинг ключей, не слепая замена файла.
5. **FROZEN-блоки** (импортёры, INCI, warnings) — через legalizer/product-skill, read-only.

## Продакшен на Cloudflare (`worker/`)

```
GET  /render?sku=SYMBIOS&country=AR   -> PNG превью
GET  /api/fields?sku=&country=        -> поля + значения (для редактора)
POST /api/string                      -> сохранить значение (новая версия)
GET  /                                -> веб-редактор (правит только текст, дизайн тронуть нельзя)
```

Хранилища: **D1** — тексты (`seed/schema.sql`), **R2** `packaging-assets` — SVG-шаблоны + шрифты, **KV** — кэш превью.

### Деплой
```bash
# токены: CF D1 Admin (D1), CF Cloud Master (R2/KV) — из SECRETS/cloudflare.md
wrangler d1 create packaging_localizer          # -> вписать database_id в wrangler.toml
wrangler r2 bucket create packaging-assets
wrangler kv namespace create CACHE              # -> вписать id в wrangler.toml
wrangler d1 execute packaging_localizer --file=../seed/schema.sql --remote
wrangler d1 execute packaging_localizer --file=../seed/seed_SYMBIOS.sql --remote
wrangler r2 object put packaging-assets/templates/SYMBIOS.svg --file=../template/SYMBIOS.svg
# загрузить шрифты:
wrangler r2 object put "packaging-assets/fonts/Arial.ttf" --file="/System/Library/Fonts/Supplemental/Arial.ttf"
wrangler r2 object put "packaging-assets/fonts/SFArabic.ttf" --file="/System/Library/Fonts/SFArabic.ttf"
npm i @resvg/resvg-wasm && wrangler deploy
```

## Ограничения (честно)

- Печатный цвет — всегда финал в Corel. Система даёт превью, не печатный мастер.
- Где перевод не влезает даже после ужатия — ручное решение дизайнера (сократить текст / переверстать блок).
- Полная безлюдная автоматизация «.cdr → PDF» невозможна: Corel обязан быть в цепочке на Windows как точка входа (мастер → SVG) и выхода (PDF/X).

## Перенос в репозиторий

Проект собран в `~/packaging-localizer` (папка `CoWork/PROJECTS` смонтирована read-only). Перенести:
`cp -R ~/packaging-localizer <writable-repo>/packaging-localizer`
