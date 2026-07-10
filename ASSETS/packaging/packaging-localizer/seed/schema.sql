-- Packaging Localizer — D1 schema (single source of truth for per-country text)
CREATE TABLE IF NOT EXISTS templates (
  sku        TEXT PRIMARY KEY,
  r2_key     TEXT NOT NULL,            -- frozen SVG template object key in R2
  version    INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT
);
CREATE TABLE IF NOT EXISTS strings (
  sku        TEXT NOT NULL,
  country    TEXT NOT NULL,            -- RU / AR / DE / PL / ...
  field_key  TEXT NOT NULL,            -- front.h1, back.inci, ...
  value      TEXT NOT NULL,
  dir        TEXT NOT NULL DEFAULT 'ltr',
  status     TEXT NOT NULL DEFAULT 'draft',  -- draft | approved
  version    INTEGER NOT NULL DEFAULT 1,
  updated_by TEXT,
  updated_at TEXT,
  PRIMARY KEY (sku, country, field_key)
);
CREATE INDEX IF NOT EXISTS idx_strings_locale ON strings (sku, country);
