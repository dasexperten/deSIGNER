#!/usr/bin/env bash
#
# export_detox_svg.sh
# ---------------------------------------------------------------------------
# Drives CorelDRAW (Graphics Suite, Mac) entirely through macOS GUI scripting
# (System Events) to open the DETOX .cdr and export it to SVG with the EXACT
# options our text-substitution renderer requires:
#
#     * Text  ........... AS TEXT      (editable <text> nodes, NOT curves)
#     * Embed fonts ..... ON           (embed fonts used)
#     * Rasterize / "Convert to bitmap" / "Export as image" ... OFF
#
# Then it verifies the produced .svg actually contains editable <text> nodes
# (and is not a rasterized <image> wrapper or an all-<path> "text as curves"
# file).
#
# HARD PRECONDITION (cannot be satisfied by this script):
#   The process that RUNS this script (Terminal.app, iTerm, the Claude agent
#   host, etc.) must hold macOS Accessibility permission:
#       System Settings -> Privacy & Security -> Accessibility -> [enable host]
#   Without it, every System Events UI call returns error -1719 / -1728
#   ("osascript is not allowed assistive access"). The script DETECTS this up
#   front and aborts with a clear instruction instead of failing opaquely.
#
# This script was written WITHOUT the ability to test-run it (permission not
# granted at authoring time). It is therefore deliberately conservative:
#   - discovers UI elements by ROLE + TITLE, never by fixed index
#   - polls/retries every wait instead of using fixed sleeps where it matters
#   - tries several plausible control titles (localized / version drift)
#   - times out gracefully with a labelled message at every blocking step
#
# Environment (verified on this machine 2026-06-07):
#   App bundle : /Applications/CorelDRAW.app
#   Process    : CorelDRW          (Info.plist CFBundleExecutable)
#   Bundle id  : com.corel.CorelDRAW
#   Version    : Graphics Suite 2025 (26.x) -- File>Export menu identical to 2021
#   macOS      : 14.1.2
# ---------------------------------------------------------------------------

set -u  # treat unset vars as errors; we do NOT set -e (we handle errors explicitly)

# ---------------------------------------------------------------------------
# Config -- all absolute paths, no relative paths anywhere.
# ---------------------------------------------------------------------------
CDR_PATH="/Users/dasexperten/Downloads/25.0 DETOX box 70ml Q.cdr"
OUT_DIR="/Users/dasexperten/packaging-localizer/detox_cdr"
OUT_SVG="${OUT_DIR}/DETOX_master.svg"

APP_PATH="/Applications/CorelDRAW.app"
APP_PROC="CorelDRW"            # System Events process name (CFBundleExecutable)
APP_OPEN_NAME="CorelDRAW"      # name usable by `open -a`

# Timeouts (seconds)
LAUNCH_TIMEOUT=90              # app process to appear
WINDOW_TIMEOUT=240            # 12 MB doc to fully open a document window
DIALOG_TIMEOUT=60             # any modal dialog (Save panel, options sheet)
EXPORT_WRITE_TIMEOUT=180     # Corel to actually write the .svg to disk

LOG_PREFIX="[export-detox-svg]"

log()  { printf '%s %s\n'      "$LOG_PREFIX" "$*" >&2; }
die()  { printf '%s ERROR: %s\n' "$LOG_PREFIX" "$*" >&2; exit 1; }

# ---------------------------------------------------------------------------
# 0. Sanity checks on files / app BEFORE we touch any GUI.
# ---------------------------------------------------------------------------
[ -f "$CDR_PATH" ]  || die "source .cdr not found: $CDR_PATH"
[ -d "$APP_PATH" ]  || die "CorelDRAW not installed at: $APP_PATH"
mkdir -p "$OUT_DIR" || die "cannot create output dir: $OUT_DIR"
[ -w "$OUT_DIR" ]   || die "output dir not writable: $OUT_DIR"

# If a previous SVG exists, move it aside so our "did the file appear / grow"
# detection is unambiguous and we never mistake a stale file for success.
if [ -e "$OUT_SVG" ]; then
  ts="$(date +%Y%m%d-%H%M%S)"
  mv -f "$OUT_SVG" "${OUT_SVG}.bak-${ts}" \
    && log "moved pre-existing SVG aside -> ${OUT_SVG}.bak-${ts}"
fi

# ---------------------------------------------------------------------------
# 1. Verify Accessibility permission with a harmless probe.
#    If denied, System Events raises -1719 / -1728. Detect and abort cleanly.
# ---------------------------------------------------------------------------
log "checking Accessibility (assistive access) permission..."
AX_PROBE="$(osascript -e 'tell application "System Events" to return (count of processes)' 2>&1)"
if printf '%s' "$AX_PROBE" | grep -Eq '\-1719|\-1728|not allowed assistive access'; then
  cat >&2 <<EOF
${LOG_PREFIX} ERROR: Accessibility permission is NOT granted to the process
running this script.

  System Events response: ${AX_PROBE}

GRANT IT, then re-run:
  1. Open  System Settings -> Privacy & Security -> Accessibility
  2. Add / enable the app that launches this script (Terminal, iTerm,
     or the Claude agent host process).
  3. Fully quit & reopen that app so the new permission takes effect.

This permission cannot be granted programmatically (TCC.db is SIP-protected).
EOF
  exit 2
fi
log "Accessibility permission OK."

# ===========================================================================
# 2. Launch CorelDRAW and open the document.
#    `open -a ... <file>` both launches the app (if needed) and opens the file.
# ===========================================================================
log "opening document in CorelDRAW ..."
open -a "$APP_OPEN_NAME" "$CDR_PATH" \
  || die "failed to 'open -a $APP_OPEN_NAME' the document"

# Wait for the process to exist.
log "waiting for CorelDRAW process ('$APP_PROC') to be running (<= ${LAUNCH_TIMEOUT}s) ..."
deadline=$(( $(date +%s) + LAUNCH_TIMEOUT ))
until pgrep -x "$APP_PROC" >/dev/null 2>&1; do
  [ "$(date +%s)" -lt "$deadline" ] || die "CorelDRAW process did not start within ${LAUNCH_TIMEOUT}s"
  sleep 1
done
log "CorelDRAW process is running."

# Bring it to front so menu-bar scripting targets the right app.
osascript -e "tell application \"$APP_OPEN_NAME\" to activate" >/dev/null 2>&1

# ---------------------------------------------------------------------------
# 2a. Dismiss a possible Welcome / license / "what's new" modal.
#     We try the gentle, idempotent things: press Escape, and click any obvious
#     "Continue / OK / Close / Got it / Start" button on a front sheet/window
#     if present. All wrapped so absence is a no-op (never fatal).
# ---------------------------------------------------------------------------
log "attempting to dismiss any welcome/license modal (best-effort) ..."
osascript <<OSA >/dev/null 2>&1 || true
tell application "System Events"
  tell process "$APP_PROC"
    set frontmost to true
    delay 1
    -- Escape often closes the Welcome screen / start page.
    key code 53 -- Escape
    delay 0.5
    -- Click a likely dismiss button on the front window if one exists.
    try
      set wlist to windows
      repeat with w in wlist
        repeat with b in (buttons of w)
          set bn to ""
          try
            set bn to (title of b as text)
          end try
          if bn is in {"Continue", "OK", "Close", "Got it", "Start", "Skip", "Later", "Dismiss", "Закрыть", "Продолжить", "ОК"} then
            try
              click b
              delay 0.5
            end try
          end if
        end repeat
      end repeat
    end try
  end tell
end tell
OSA

# ---------------------------------------------------------------------------
# 2b. Poll for a real DOCUMENT window to be ready (12 MB file -> can be slow).
#     Heuristic: a CorelDRAW process window whose title is NOT one of the
#     known chrome/start-screen titles. We also require the File menu to be
#     enabled (proxy for "a document context exists").
# ---------------------------------------------------------------------------
log "waiting for the document window to be ready (<= ${WINDOW_TIMEOUT}s; big file) ..."
deadline=$(( $(date +%s) + WINDOW_TIMEOUT ))
DOC_READY=0
while [ "$(date +%s)" -lt "$deadline" ]; do
  # Returns "READY" when there is at least one window that looks like a doc
  # AND the File menu exists. Any AX glitch -> empty -> we just retry.
  state="$(osascript <<'OSA' 2>/dev/null
on isDocWindow(t)
  set chrome to {"", "Welcome", "Welcome Screen", "Start", "Hints", "CorelDRAW"}
  if t is in chrome then return false
  return true
end isDocWindow

tell application "System Events"
  tell process "CorelDRW"
    try
      if not (exists menu bar 1) then return "NOWIN"
      if not (exists menu bar item "File" of menu bar 1) then return "NOFILE"
      set wins to windows
      if (count of wins) is 0 then return "NOWIN"
      repeat with w in wins
        set t to ""
        try
          set t to (title of w as text)
        end try
        if my isDocWindow(t) then return "READY"
      end repeat
      return "CHROME"
    on error
      return "ERR"
    end try
  end tell
end tell
OSA
)"
  if [ "$state" = "READY" ]; then DOC_READY=1; break; fi
  sleep 2
done
[ "$DOC_READY" -eq 1 ] || die "document window not ready within ${WINDOW_TIMEOUT}s (last state: ${state:-none}). The file may still be loading, or a modal is blocking."
log "document window is ready."

# Give Corel a breath to finish rendering placed bitmaps before we export.
sleep 2

# ===========================================================================
# 3. File -> Export...   then drive the Save panel and the SVG options sheet.
#    We run ONE big AppleScript so the dialog state stays coherent; it returns
#    a status token we branch on. All element discovery is by role + title.
# ===========================================================================
log "invoking File -> Export... and driving the SVG export dialogs ..."

# We write the AppleScript to a temp file and invoke `osascript <file> <args>`.
# (Embedding a quoted heredoc INSIDE a "$( ... )" command substitution is
# fragile across bash versions when the body contains apostrophes/backticks;
# a temp file sidesteps that entirely.) The script receives OUT_DIR, the base
# filename, the full SVG path and the dialog timeout via `on run argv`.
ASCRIPT="$(mktemp -t detox_export_XXXXXX).applescript"
trap 'rm -f "$ASCRIPT"' EXIT
cat > "$ASCRIPT" <<'OSA'
-- Top-level handler: click first button in uiRoot whose title is in `names`.
-- (Handlers must be at script top level, NOT nested inside `on run`.)
on clickButtonNamed(uiRoot, names)
  tell application "System Events"
    try
      repeat with b in (buttons of uiRoot)
        set bn to ""
        try
          set bn to (title of b as text)
        end try
        if bn is in names then
          click b
          return true
        end if
      end repeat
    end try
  end tell
  return false
end clickButtonNamed

on run argv
  set outDir to item 1 of argv
  set baseName to item 2 of argv         -- "DETOX_master" (no extension)
  set outSvg to item 3 of argv
  set dlgTimeout to (item 4 of argv) as integer
  set procName to "CorelDRW"

  tell application "System Events"
    tell process procName
      set frontmost to true

      -- ---- 3a. Open the Export menu item -----------------------------
      -- Prefer the menu path (robust); fall back to Cmd-E if menu missing.
      set didMenu to false
      try
        click menu item "Export..." of menu "File" of menu bar 1
        set didMenu to true
      end try
      if not didMenu then
        try
          click menu item "Export…" of menu "File" of menu bar 1 -- unicode ellipsis
          set didMenu to true
        end try
      end if
      if not didMenu then
        -- Last resort keyboard shortcut for Export.
        keystroke "e" using {command down}
        set didMenu to true
      end if

      -- ---- 3b. Wait for the Save (export destination) panel ----------
      -- This is a standard NSSavePanel: a sheet or window with a text field
      -- for the name and a "Save"/"Export" button. Poll imperatively.
      set tEnd to (current date) + dlgTimeout
      set panel to missing value
      repeat
        try
          -- a save sheet attached to the front document window
          if (count of sheets of window 1) > 0 then
            set panel to sheet 1 of window 1
          else
            -- or a standalone modal window that has a Save/Export button
            repeat with w in windows
              if (my clickButtonNamed(w, {"__never__"})) then exit repeat
            end repeat
            -- pick the frontmost window as panel candidate
            set panel to window 1
          end if
        end try
        if panel is not missing value then
          -- confirm it really looks like a save panel (has a text field)
          try
            if (count of text fields of panel) > 0 then exit repeat
          end try
        end if
        if (current date) > tEnd then return "ERR:no-save-panel"
        delay 0.4
      end repeat

      -- ---- 3c. Set filename + force the .svg type --------------------
      -- Set the name field. macOS save panel: first text field is the name.
      try
        set value of (text field 1 of panel) to (baseName & ".svg")
      on error
        try
          set focused of (text field 1 of panel) to true
          keystroke "a" using {command down}
          keystroke (baseName & ".svg")
        end try
      end try
      delay 0.3

      -- Choose the SVG format in the "Save as type" / "Format" popup if present.
      try
        repeat with pu in (pop up buttons of panel)
          try
            click pu
            delay 0.3
            -- pick a menu item whose name mentions SVG
            repeat with mi in (menu items of menu 1 of pu)
              set mn to ""
              try
                set mn to (title of mi as text)
              end try
              if mn contains "SVG" then
                click mi
                exit repeat
              end if
            end repeat
          end try
        end repeat
      end try
      delay 0.3

      -- Navigate to the output directory via the "Go to folder" sheet
      -- (Cmd-Shift-G) so we land EXACTLY in OUT_DIR regardless of last dir.
      try
        keystroke "g" using {command down, shift down}
        delay 0.6
        keystroke outDir
        delay 0.3
        keystroke return
        delay 0.6
      end try

      -- Click Save / Export on the panel.
      if not (my clickButtonNamed(panel, {"Save", "Export", "Сохранить", "Экспорт"})) then
        -- fall back to default button (Return)
        try
          keystroke return
        end try
      end if
      delay 0.8

      -- If a "replace existing file?" sheet appears, confirm Replace.
      try
        if (count of sheets of window 1) > 0 then
          my clickButtonNamed(sheet 1 of window 1, {"Replace", "Заменить", "OK"})
          delay 0.5
        end if
      end try

      -- ---- 3d. The SVG EXPORT OPTIONS dialog -------------------------
      -- After the save panel, Corel shows an SVG options dialog/sheet with:
      --   * a Text option: radio buttons / popup  "As text" vs "As curves"
      --   * an "Embed fonts" / "Embed font(s) used" checkbox
      --   * a rasterize / "Export text as image" option we must keep OFF
      -- Wait for it, then set those controls by TITLE.
      set tEnd to (current date) + dlgTimeout
      set opt to missing value
      repeat
        try
          -- options usually arrive as a sheet on the doc window, else a window
          if (count of sheets of window 1) > 0 then
            set opt to sheet 1 of window 1
          else
            set opt to window 1
          end if
        end try
        if opt is not missing value then
          -- Heuristic: an options dialog mentions "text"/"curves"/"font"
          set looksLikeOptions to false
          try
            set allDescr to (entire contents of opt) as text
            if (allDescr contains "curve") or (allDescr contains "Curve") ¬
               or (allDescr contains "text") or (allDescr contains "Text") ¬
               or (allDescr contains "font") or (allDescr contains "Font") then
              set looksLikeOptions to true
            end if
          end try
          if looksLikeOptions then exit repeat
        end if
        if (current date) > tEnd then
          -- No options dialog at all: maybe Corel exported directly. Not fatal.
          return "WARN:no-options-dialog"
        end if
        delay 0.4
      end repeat

      -- (i) TEXT = As text   ------------------------------------------
      -- Try radio buttons first.
      set setText to false
      try
        repeat with rb in (radio buttons of (radio groups of opt))
          set rn to ""
          try
            set rn to (title of rb as text)
          end try
          if (rn contains "text") or (rn contains "Text") then
            try
              click rb
              set setText to true
            end try
          end if
        end repeat
      end try
      -- If text option is a popup instead of radios, pick the "As text" entry.
      if not setText then
        try
          repeat with pu in (pop up buttons of opt)
            click pu
            delay 0.3
            repeat with mi in (menu items of menu 1 of pu)
              set mn to ""
              try
                set mn to (title of mi as text)
              end try
              if (mn contains "text") or (mn contains "Text") then
                click mi
                set setText to true
                exit repeat
              end if
            end repeat
            if setText then exit repeat
            -- close popup if we did not pick
            try
              key code 53
            end try
          end repeat
        end try
      end if

      -- (ii) Embed fonts = ON  ----------------------------------------
      try
        repeat with cb in (checkboxes of opt)
          set cn to ""
          try
            set cn to (title of cb as text)
          end try
          if (cn contains "Embed") or (cn contains "embed") or (cn contains "font") or (cn contains "Font") then
            -- turn ON only if currently OFF (value 0)
            try
              if (value of cb as integer) is 0 then click cb
            end try
          end if
        end repeat
      end try

      -- (iii) Rasterize / "export text as image" / "convert to bitmap" = OFF
      try
        repeat with cb in (checkboxes of opt)
          set cn to ""
          try
            set cn to (title of cb as text)
          end try
          if (cn contains "raster") or (cn contains "Raster") ¬
             or (cn contains "bitmap") or (cn contains "Bitmap") ¬
             or (cn contains "as image") or (cn contains "as Image") then
            try
              if (value of cb as integer) is 1 then click cb -- turn OFF
            end try
          end if
        end repeat
      end try

      delay 0.4

      -- (iv) Confirm the options dialog (OK / Export / Save).
      if not (my clickButtonNamed(opt, {"OK", "Export", "Save", "Экспорт", "ОК", "Сохранить"})) then
        try
          keystroke return
        end try
      end if

      return "OK:dialogs-driven"
    end tell
  end tell
end run
OSA

EXPORT_RESULT="$(osascript "$ASCRIPT" "$OUT_DIR" "DETOX_master" "$OUT_SVG" "$DIALOG_TIMEOUT" 2>&1)"

log "AppleScript dialog phase returned: ${EXPORT_RESULT}"
case "$EXPORT_RESULT" in
  OK:*|WARN:*) : ;;  # proceed to wait-for-file; WARN (no options dialog) still may have written
  ERR:no-save-panel)
    die "Export Save panel never appeared. File>Export may be disabled (no active doc) or a modal is blocking." ;;
  *)
    log "WARNING: unexpected AppleScript result, will still poll for the output file." ;;
esac

# ===========================================================================
# 4. Wait for Corel to actually finish writing the .svg to disk.
#    We poll for the file existing AND its size being stable across two reads
#    (so we don't grab a half-written file).
# ===========================================================================
log "waiting for ${OUT_SVG} to be written and stabilize (<= ${EXPORT_WRITE_TIMEOUT}s) ..."
deadline=$(( $(date +%s) + EXPORT_WRITE_TIMEOUT ))
last_size=-1
stable=0
while [ "$(date +%s)" -lt "$deadline" ]; do
  if [ -f "$OUT_SVG" ]; then
    sz=$(stat -f %z "$OUT_SVG" 2>/dev/null || echo 0)
    if [ "$sz" -gt 0 ] && [ "$sz" -eq "$last_size" ]; then
      stable=$((stable + 1))
      [ "$stable" -ge 2 ] && break   # size unchanged across ~2s -> done
    else
      stable=0
    fi
    last_size=$sz
  fi
  sleep 1
done
[ -f "$OUT_SVG" ] || die "no SVG produced at ${OUT_SVG} within ${EXPORT_WRITE_TIMEOUT}s. Check that the options dialog was confirmed."
log "SVG written: ${OUT_SVG} ($(stat -f %z "$OUT_SVG") bytes)"

# ===========================================================================
# 5. VERIFY the SVG: it must have editable <text> nodes, not be all-curves,
#    and not be a rasterized <image> wrapper.
# ===========================================================================
log "verifying SVG content ..."

TEXT_COUNT=$(grep -o '<text' "$OUT_SVG" | wc -l | tr -d ' ')
TSPAN_COUNT=$(grep -o '<tspan' "$OUT_SVG" | wc -l | tr -d ' ')
PATH_COUNT=$(grep -o '<path' "$OUT_SVG" | wc -l | tr -d ' ')
IMAGE_COUNT=$(grep -o '<image' "$OUT_SVG" | wc -l | tr -d ' ')
# Does any <text> actually carry visible characters (letters/digits)?
TEXT_WITH_CHARS=$(grep -oE '<text[^>]*>[^<]*[[:alnum:]А-Яа-яЁё][^<]*' "$OUT_SVG" | wc -l | tr -d ' ')

log "  <text>=${TEXT_COUNT}  <tspan>=${TSPAN_COUNT}  <path>=${PATH_COUNT}  <image>=${IMAGE_COUNT}  text-with-chars=${TEXT_WITH_CHARS}"

VERIFY_FAIL=0

# (a) Must contain at least one <text> node.
if [ "$TEXT_COUNT" -lt 1 ]; then
  log "  FAIL: no <text> nodes -> text was exported AS CURVES (or rasterized), not as text."
  VERIFY_FAIL=1
fi

# (b) The <text> nodes must actually carry characters (not empty placeholders).
if [ "$TEXT_COUNT" -ge 1 ] && [ "$TEXT_WITH_CHARS" -lt 1 ] && [ "$TSPAN_COUNT" -lt 1 ]; then
  log "  FAIL: <text> present but carry no visible characters -> not usable editable text."
  VERIFY_FAIL=1
fi

# (c) Must NOT be a rasterized wrapper: a single giant <image> and no text.
if [ "$IMAGE_COUNT" -ge 1 ] && [ "$TEXT_COUNT" -lt 1 ]; then
  log "  FAIL: SVG contains <image> and no <text> -> looks RASTERIZED."
  VERIFY_FAIL=1
fi

# (d) Soft warning: huge path count with text present can still be fine
#     (design vectors are paths). Only warn if paths dwarf everything AND
#     there is exactly zero text (already failed above) — so nothing extra here.

if [ "$VERIFY_FAIL" -ne 0 ]; then
  cat >&2 <<EOF
${LOG_PREFIX} VERIFICATION FAILED. The exported SVG does not contain usable
editable text. Re-export and make sure in the SVG options dialog:
    Text   = "As text"   (NOT "As curves")
    Embed fonts (used) = ON
    Rasterize / "Export text as image" = OFF
File left in place for inspection: ${OUT_SVG}
EOF
  exit 3
fi

log "VERIFICATION PASSED: SVG has ${TEXT_COUNT} editable <text> node(s)"
log "  (tspans=${TSPAN_COUNT}, design paths=${PATH_COUNT}, raster images=${IMAGE_COUNT})."
log "DONE -> ${OUT_SVG}"
exit 0
