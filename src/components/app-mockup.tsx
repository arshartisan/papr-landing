"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent } from "react";
import { Bold, Bullets, Checklist, Cols, Italic, Moon, Plus, Sidebar, Sun } from "./icons";
import { Logo } from "./logo";

/* ------------------------------------------------------------------
   A working, in-memory miniature of the Papr new tab.
   Nothing is persisted - reload and it resets.
   ------------------------------------------------------------------ */

type Note = { id: string; html: string; group: string; meta: string };
type FontKey = "inter" | "geist" | "serif" | "mono";
type Fmt = { bold: boolean; italic: boolean; underline: boolean; block: string; list: "" | "ul" | "ol" | "check" };

const INITIAL_NOTES: Note[] = [
  {
    id: "launch",
    group: "Today",
    meta: "2m",
    html: `<h1>Launch week</h1><div>Ship small, ship calm.</div><ul class="checklist"><li class="done">Polish the onboarding note</li><li class="done">Write the store listing</li><li>Landing page - pricing section</li><li>Record the 30-second demo</li></ul><h2>Thoughts</h2><ul><li>Fewer settings, better defaults</li><li>Every tab should feel like a <i>fresh page</i></li></ul>`,
  },
  {
    id: "reading",
    group: "Today",
    meta: "1h",
    html: `<h1>Reading notes</h1><div>Attention is a budget. Spend the first two hours of the day on the one thing that matters, before the inbox gets a vote.</div><ol><li>One task per block</li><li>Batch the shallow work</li><li>End the day with a shutdown list</li></ol>`,
  },
  {
    id: "groceries",
    group: "Today",
    meta: "3h",
    html: `<h1>Groceries</h1><ul class="checklist"><li>Oat milk</li><li class="done">Coffee beans</li><li>Lemons</li><li>Sourdough</li></ul>`,
  },
  {
    id: "oneone",
    group: "Yesterday",
    meta: "Mon",
    html: `<h1>1:1 notes</h1><h2>Wins</h2><ul><li>Shipped the column layout</li></ul><h2>Next</h2><ul><li>Decide on pricing</li></ul>`,
  },
  {
    id: "pricing",
    group: "Yesterday",
    meta: "Mon",
    html: `<h1>Pricing ideas</h1><ul><li>One price, no tiers</li><li>Pay once, keep it</li></ul>`,
  },
  {
    id: "lisbon",
    group: "Last week",
    meta: "Nov 9",
    html: `<h1>Trip to Lisbon</h1><ul class="checklist"><li class="done">Book flights</li><li>Pastéis de nata in Belém</li><li>Tram 28 at sunrise</li></ul>`,
  },
  { id: "untitled", group: "Last week", meta: "Nov 8", html: "" },
];

const GROUPS = ["Today", "Yesterday", "Last week"];

const THEMES: Record<"dark" | "light", CSSProperties> = {
  dark: {
    "--m-bg": "#161616", "--m-surface": "#1c1c1c", "--m-raised": "#262626", "--m-fg": "#e8e8e8",
    "--m-muted": "#8c8c8c", "--m-faint": "#5c5c5c", "--m-line": "#2a2a2a", "--m-hover": "#232323",
    "--m-accent": "#ffdebd", "--m-accent-soft": "rgb(255 222 189 / 0.12)", "--m-on-accent": "#141414",
  } as CSSProperties,
  light: {
    "--m-bg": "#fafafa", "--m-surface": "#ffffff", "--m-raised": "#f0f0f0", "--m-fg": "#171717",
    "--m-muted": "#737373", "--m-faint": "#c4c4c4", "--m-line": "#e7e7e7", "--m-hover": "#f3f3f3",
    "--m-accent": "#005148", "--m-accent-soft": "#e2efec", "--m-on-accent": "#ffffff",
  } as CSSProperties,
};

const FONTS: { key: FontKey; name: string; kind: string; cls: string }[] = [
  { key: "inter", name: "Inter", kind: "sans", cls: "font-inter" },
  { key: "geist", name: "Geist", kind: "sans", cls: "font-sans" },
  { key: "serif", name: "Instrument Serif", kind: "serif", cls: "font-serif" },
  { key: "mono", name: "Source Code Pro", kind: "mono", cls: "font-code" },
];

/** First non-empty line of a note, SSR-safe (no DOM). */
function titleOf(html: string) {
  const text = html
    .replace(/<(div|h1|h2|li|p|br|ul|ol)[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
  return text.split("\n").map((l) => l.trim()).find(Boolean) ?? "";
}

const exec = (cmd: string, value?: string) => document.execCommand(cmd, false, value);

export function AppMockup() {
  const rootRef = useRef<HTMLDivElement>(null);
  const editors = useRef(new Map<number, HTMLDivElement>());
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const noteSeq = useRef(0);

  const [notes, setNotes] = useState(INITIAL_NOTES);
  const [cols, setColsState] = useState(2);
  const [panes, setPanes] = useState<string[]>(["launch", "reading", "groceries", "lisbon"]);
  const [cur, setCur] = useState(0);
  const [sidebar, setSidebar] = useState(true);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [font, setFont] = useState<FontKey>("inter");
  const [size, setSize] = useState(14);
  const [fontMenu, setFontMenu] = useState(false);
  const [editing, setEditing] = useState(false);
  const [fmt, setFmt] = useState<Fmt>({ bold: false, italic: false, underline: false, block: "", list: "" });
  const [focusPane, setFocusPane] = useState<number | null>(null);

  const byId = (id: string) => notes.find((n) => n.id === id);
  const current = byId(panes[cur]);

  /* ---------- editing ---------- */
  const markEdited = () => {
    setEditing(true);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => setEditing(false), 700);
  };
  const updateNote = useCallback((id: string, html: string) => {
    setNotes((ns) => ns.map((n) => (n.id === id ? { ...n, html, meta: "now" } : n)));
  }, []);
  const commitPane = (pane: number) => {
    const el = editors.current.get(pane);
    if (el) updateNote(panes[pane], el.innerHTML);
    markEdited();
  };

  /* Focus an editor after a structural change (new note, open note) */
  useEffect(() => {
    if (focusPane === null) return;
    const el = editors.current.get(focusPane);
    if (el) {
      el.focus();
      const r = document.createRange();
      r.selectNodeContents(el);
      r.collapse(false);
      const s = getSelection();
      s?.removeAllRanges();
      s?.addRange(r);
    }
    const id = requestAnimationFrame(() => setFocusPane(null));
    return () => cancelAnimationFrame(id);
  }, [focusPane]);

  /* Toolbar pressed-state from the live selection */
  useEffect(() => {
    exec("defaultParagraphSeparator", "div");
    const onSel = () => {
      const s = getSelection();
      const node = s?.anchorNode;
      const el = node ? (node.nodeType === 1 ? (node as Element) : node.parentElement) : null;
      if (!el || !el.closest(".demo-ed") || !rootRef.current?.contains(el)) return;
      const ul = el.closest("ul, ol");
      setFmt({
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        underline: document.queryCommandState("underline"),
        block: el.closest("h1") ? "h1" : el.closest("h2") ? "h2" : "",
        list: !ul ? "" : ul.tagName === "OL" ? "ol" : ul.classList.contains("checklist") ? "check" : "ul",
      });
    };
    document.addEventListener("selectionchange", onSel);
    return () => document.removeEventListener("selectionchange", onSel);
  }, []);

  /* ---------- commands ---------- */
  const inEditor = () => {
    const n = getSelection()?.anchorNode;
    const el = n ? (n.nodeType === 1 ? (n as Element) : n.parentElement) : null;
    return el?.closest<HTMLElement>(".demo-ed") && rootRef.current?.contains(el) ? el : null;
  };
  const run = (fn: () => void) => {
    if (!inEditor()) editors.current.get(cur)?.focus();
    fn();
    commitPane(cur);
  };
  const block = (tag: "h1" | "h2" | "div") => run(() => exec("formatBlock", `<${tag}>`));
  const inline = (cmd: "bold" | "italic" | "underline") => run(() => exec(cmd));
  const list = (kind: "ul" | "ol" | "check") =>
    run(() => {
      const el = inEditor();
      const ul = el?.closest("ul, ol");
      if (kind === "check") {
        if (ul?.tagName === "UL") {
          ul.classList.toggle("checklist");
          return;
        }
        exec("insertUnorderedList");
        inEditor()?.closest("ul")?.classList.add("checklist");
        return;
      }
      if (kind === "ul" && ul?.classList.contains("checklist")) {
        ul.classList.remove("checklist");
        return;
      }
      exec(kind === "ul" ? "insertUnorderedList" : "insertOrderedList");
    });

  const setCols = (n: number) => {
    setColsState(n);
    if (cur >= n) setCur(n - 1);
  };
  const openNote = (id: string) => {
    setPanes((p) => p.map((x, i) => (i === cur ? id : x)));
    setFocusPane(cur);
  };
  const newNote = () => {
    const id = `n${++noteSeq.current}`;
    setNotes((ns) => [{ id, html: "", group: "Today", meta: "now" }, ...ns]);
    setPanes((p) => p.map((x, i) => (i === cur ? id : x)));
    setFocusPane(cur);
  };

  /* ---------- keyboard: same shortcuts as the extension ---------- */
  const onKeyDown = (e: ReactKeyboardEvent) => {
    const k = e.code;
    const ctrl = e.ctrlKey || e.metaKey;
    let hit = true;
    if (ctrl && e.altKey && k === "Digit1") block("h1");
    else if (ctrl && e.altKey && k === "Digit2") block("h2");
    else if (ctrl && e.altKey && k === "Digit0") block("div");
    else if (ctrl && e.shiftKey && k === "Digit8") list("ul");
    else if (ctrl && e.shiftKey && k === "Digit7") list("ol");
    else if (ctrl && e.shiftKey && k === "Digit9") list("check");
    else if (ctrl && e.shiftKey && k === "KeyL") setTheme((t) => (t === "dark" ? "light" : "dark"));
    else if (ctrl && e.shiftKey && k === "Period") setSize((s) => Math.min(20, s + 1));
    else if (ctrl && e.shiftKey && k === "Comma") setSize((s) => Math.max(11, s - 1));
    else if (ctrl && k === "Backslash") setSidebar((v) => !v);
    else if (e.altKey && !ctrl && /^Digit[1-4]$/.test(k)) setCols(Number(k.slice(5)));
    else if (e.altKey && !ctrl && k === "KeyN") newNote();
    else hit = false;
    if (hit) e.preventDefault();
  };

  const vars = THEMES[theme];
  const fontCls = FONTS.find((f) => f.key === font)!.cls;

  return (
    <div
      ref={rootRef}
      onKeyDown={onKeyDown}
      style={vars}
      data-font={font}
      className="relative flex h-full flex-col overflow-hidden bg-(--m-bg) text-left text-(--m-fg) transition-colors duration-300"
    >
      {/* top bar */}
      <div className="flex h-11 flex-none items-center gap-2.5 border-b border-(--m-line) px-3 text-[12px] sm:px-4">
        <TbButton label="Toggle sidebar (Ctrl+\)" pressed={sidebar} onClick={() => setSidebar((v) => !v)} className="hidden md:grid">
          <Sidebar className="size-3.5" />
        </TbButton>
        <Logo className="size-4 flex-none" />
        <span className="hidden text-(--m-muted) sm:inline">papr</span>
        <span className="hidden text-(--m-faint) sm:inline">/</span>
        <span className="max-w-[30vw] truncate">{(current && titleOf(current.html)) || "Untitled"}</span>
        <span className="ml-1 inline-flex flex-none items-center gap-1.5 rounded-full bg-(--m-raised) px-2 py-[3px] text-[9.5px] font-medium tracking-[0.06em] text-(--m-muted) uppercase">
          <span className={`size-[5px] rounded-full transition-colors ${editing ? "bg-(--m-faint)" : "bg-(--m-accent)"}`} />
          {editing ? "Editing" : "Saved"}
        </span>
        <div role="group" aria-label="Columns" className="ml-auto hidden gap-0.5 rounded-lg border border-(--m-line) p-0.5 md:flex">
          {([1, 2, 3, 4] as const).map((c) => (
            <button
              key={c}
              type="button"
              title={`${c} column${c > 1 ? "s" : ""} (Alt+${c})`}
              aria-pressed={c === cols}
              onClick={() => setCols(c)}
              className={`grid h-5 w-6 cursor-pointer place-items-center rounded-md transition-colors ${
                c === cols ? "bg-(--m-accent-soft) text-(--m-accent)" : "text-(--m-muted) hover:bg-(--m-hover) hover:text-(--m-fg)"
              }`}
            >
              <Cols n={c} className="size-3.5" />
            </button>
          ))}
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* sidebar */}
        {sidebar && (
          <aside className="hidden w-[210px] flex-none flex-col border-r border-(--m-line) md:flex">
            <div className="flex items-center justify-between px-5 pt-3 pb-1 text-[9.5px] font-medium tracking-[0.06em] text-(--m-muted) uppercase">
              Notes
              <TbButton label="New note (Alt+N)" onClick={newNote}>
                <Plus className="size-3.5" />
              </TbButton>
            </div>
            <div data-lenis-prevent className="flex-1 overflow-y-auto px-2 pb-4 demo-scroll">
              {GROUPS.map((g) => {
                const items = notes.filter((n) => n.group === g);
                if (!items.length) return null;
                return (
                  <div key={g}>
                    <div className="px-3 pt-3 pb-1 text-[11px] text-(--m-muted)">{g}</div>
                    {items.map((n) => {
                      const title = titleOf(n.html);
                      const isCur = panes[cur] === n.id;
                      const isOpen = !isCur && panes.slice(0, cols).includes(n.id);
                      return (
                        <button
                          key={n.id}
                          type="button"
                          onClick={() => openNote(n.id)}
                          aria-current={isCur || undefined}
                          className={`flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-[6px] text-left text-[12px] transition-colors ${
                            isCur ? "bg-(--m-accent-soft)" : "hover:bg-(--m-hover)"
                          }`}
                        >
                          <span className={`flex-1 truncate ${title ? "" : "text-(--m-muted)"}`}>
                            {title || "Untitled"}
                            {isOpen && <span className="mb-px ml-1.5 inline-block size-1 rounded-full bg-(--m-accent) align-middle" />}
                          </span>
                          <span className={`font-mono text-[10px] ${isCur ? "text-(--m-accent)" : "text-(--m-faint)"}`}>{n.meta}</span>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </aside>
        )}

        {/* panes */}
        <div
          className="grid min-w-0 flex-1 pr-12 md:grid-cols-[repeat(var(--cols),minmax(0,1fr))]"
          style={{ "--cols": cols } as CSSProperties}
        >
          {panes.slice(0, cols).map((id, i) => {
            const note = byId(id);
            if (!note) return null;
            const isCur = i === cur;
            return (
              <div
                key={i}
                onMouseDown={() => setCur(i)}
                className={`min-w-0 flex-col ${i > 0 ? "md:border-l md:border-(--m-line)" : ""} ${isCur ? "flex" : "hidden md:flex"}`}
              >
                {cols > 1 && (
                  <div
                    className={`hidden h-9 flex-none items-center border-b border-(--m-line) px-5 text-[12px] md:flex ${
                      isCur ? "text-(--m-fg) shadow-[inset_0_-2px_0_var(--m-accent)]" : "text-(--m-muted)"
                    }`}
                  >
                    <span className="truncate">{titleOf(note.html) || "Untitled"}</span>
                  </div>
                )}
                <div data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto demo-scroll">
                  <Editor
                    key={note.id}
                    note={note}
                    className={fontCls}
                    size={size}
                    register={(el) => (el ? editors.current.set(i, el) : editors.current.delete(i))}
                    onInput={(html) => {
                      updateNote(note.id, html);
                      markEdited();
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* toolbar rail */}
      <nav
        aria-label="Formatting"
        onMouseDown={(e) => e.preventDefault() /* keep the editor selection */}
        className={`absolute top-[calc(50%+22px)] right-2 flex -translate-y-1/2 flex-col gap-1 rounded-xl border border-(--m-line) bg-(--m-surface) p-1 text-(--m-muted) transition-opacity duration-200 sm:right-3 ${
          editing ? "opacity-0" : "opacity-100"
        }`}
      >
        <RailBtn label="Font" pressed={fontMenu} onClick={() => setFontMenu((v) => !v)}>
          <span className={`text-[11px] font-medium ${fontCls}`}>Aa</span>
        </RailBtn>
        <Sep />
        <RailBtn label="Larger text (Ctrl+Shift+.)" onClick={() => setSize((s) => Math.min(20, s + 1))}>
          <Plus className="size-3" />
        </RailBtn>
        <span className="text-center font-mono text-[10px] text-(--m-fg)">{size}</span>
        <RailBtn label="Smaller text (Ctrl+Shift+,)" onClick={() => setSize((s) => Math.max(11, s - 1))}>
          <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" aria-hidden><path d="M5 12h14" /></svg>
        </RailBtn>
        <Sep />
        <RailBtn label="Heading 1 (Ctrl+Alt+1)" pressed={fmt.block === "h1"} onClick={() => block(fmt.block === "h1" ? "div" : "h1")}>
          <span className="text-[10.5px] font-medium">H1</span>
        </RailBtn>
        <RailBtn label="Heading 2 (Ctrl+Alt+2)" pressed={fmt.block === "h2"} onClick={() => block(fmt.block === "h2" ? "div" : "h2")}>
          <span className="text-[10.5px] font-medium">H2</span>
        </RailBtn>
        <Sep />
        <RailBtn label="Bold (Ctrl+B)" pressed={fmt.bold} onClick={() => inline("bold")}><Bold className="size-3.5" /></RailBtn>
        <RailBtn label="Italic (Ctrl+I)" pressed={fmt.italic} onClick={() => inline("italic")}><Italic className="size-3.5" /></RailBtn>
        <Sep />
        <RailBtn label="Bullets (Ctrl+Shift+8)" pressed={fmt.list === "ul"} onClick={() => list("ul")}><Bullets className="size-3.5" /></RailBtn>
        <RailBtn label="Checklist (Ctrl+Shift+9)" pressed={fmt.list === "check"} onClick={() => list("check")}><Checklist className="size-3.5" /></RailBtn>
        <Sep />
        <RailBtn label="Light / dark (Ctrl+Shift+L)" onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}>
          {theme === "dark" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
        </RailBtn>
      </nav>

      {/* font menu */}
      {fontMenu && (
        <div
          onMouseDown={(e) => e.preventDefault()}
          className="absolute top-[calc(50%-110px)] right-14 z-10 flex min-w-[210px] flex-col rounded-xl border border-(--m-line) bg-(--m-surface) p-1.5 shadow-[0_16px_40px_-16px_rgb(0_0_0/0.45)] sm:right-16"
        >
          <div className="px-2.5 pt-1.5 pb-2 text-[9.5px] font-medium tracking-[0.06em] text-(--m-muted) uppercase">Font</div>
          {FONTS.map((f) => (
            <button
              key={f.key}
              type="button"
              aria-pressed={font === f.key}
              onClick={() => {
                setFont(f.key);
                setFontMenu(false);
              }}
              className={`flex cursor-pointer items-center justify-between gap-4 rounded-md px-2.5 py-2 text-[13px] transition-colors ${
                font === f.key ? "bg-(--m-accent-soft)" : "hover:bg-(--m-hover)"
              }`}
            >
              <span className={f.cls}>{f.name}</span>
              <code className={`font-mono text-[10.5px] ${font === f.key ? "text-(--m-accent)" : "text-(--m-muted)"}`}>{f.kind}</code>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

const MD_TRIGGERS: Record<string, (ed: HTMLElement) => void> = {
  "#": () => exec("formatBlock", "<h1>"),
  "##": () => exec("formatBlock", "<h2>"),
  "-": () => exec("insertUnorderedList"),
  "*": () => exec("insertUnorderedList"),
  "1.": () => exec("insertOrderedList"),
  "[]": () => {
    exec("insertUnorderedList");
    const n = getSelection()?.anchorNode;
    const el = n ? (n.nodeType === 1 ? (n as Element) : n.parentElement) : null;
    el?.closest("ul")?.classList.add("checklist");
  },
};

function Editor({
  note,
  className,
  size,
  register,
  onInput,
}: {
  note: Note;
  className: string;
  size: number;
  register: (el: HTMLDivElement | null) => void;
  onInput: (html: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Set once per mount; React never touches the content again (caret stays put).
  const [initial] = useState(() => ({ __html: note.html }));

  useEffect(() => {
    register(ref.current);
    return () => register(null);
  }, [register]);

  // Same note open in another pane: mirror its edits here.
  useEffect(() => {
    const el = ref.current;
    if (el && document.activeElement !== el && el.innerHTML !== note.html) el.innerHTML = note.html;
  }, [note.html]);

  const emit = () => ref.current && onInput(ref.current.innerHTML);

  // Click the box of a checklist item to tick it
  const onClick = (e: ReactMouseEvent) => {
    const li = (e.target as Element).closest?.("ul.checklist > li");
    if (!li) return;
    if (e.clientX < li.getBoundingClientRect().left) {
      li.classList.toggle("done");
      emit();
    }
  };

  // Markdown: "# ", "## ", "- ", "* ", "1. ", "[] " at the start of an empty line
  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== " ") return;
    const ed = ref.current;
    const s = getSelection();
    if (!ed || !s?.rangeCount || !s.isCollapsed) return;
    let blockEl: Node | null = s.anchorNode;
    if (!blockEl || blockEl === ed) return;
    if ((blockEl.nodeType === 1 ? (blockEl as Element) : blockEl.parentElement)?.closest("li")) return;
    while (blockEl.parentNode && blockEl.parentNode !== ed) blockEl = blockEl.parentNode;
    const r = document.createRange();
    r.setStart(blockEl, 0);
    r.setEnd(s.anchorNode!, s.anchorOffset);
    const before = r.toString();
    const fn = MD_TRIGGERS[before];
    if (!fn || (blockEl.textContent ?? "") !== before) return;
    e.preventDefault();
    r.deleteContents();
    if (blockEl.nodeType === 1 && !blockEl.textContent) (blockEl as Element).innerHTML = "<br>";
    // put the caret back inside the (now empty) line before formatting it
    const caret = document.createRange();
    caret.setStart(blockEl, 0);
    caret.collapse(true);
    s.removeAllRanges();
    s.addRange(caret);
    fn(ed);
    emit();
  };

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      role="textbox"
      aria-multiline="true"
      aria-label="Note"
      data-placeholder="Start writing…"
      onInput={emit}
      onClick={onClick}
      onKeyDown={onKeyDown}
      dangerouslySetInnerHTML={initial}
      style={{ "--size": `${size}px` } as CSSProperties}
      className={`demo-ed ${className}`}
    />
  );
}

function TbButton({
  label,
  pressed,
  onClick,
  className = "grid",
  children,
}: {
  label: string;
  pressed?: boolean;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      className={`${className} size-6 flex-none cursor-pointer place-items-center rounded-md transition-colors hover:bg-(--m-hover) hover:text-(--m-fg) ${
        pressed ? "bg-(--m-raised) text-(--m-fg)" : "text-(--m-muted)"
      }`}
    >
      {children}
    </button>
  );
}

function RailBtn({
  label,
  pressed,
  onClick,
  children,
}: {
  label: string;
  pressed?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      className={`grid size-7 cursor-pointer place-items-center rounded-md transition-colors ${
        pressed ? "bg-(--m-accent-soft) text-(--m-accent)" : "hover:bg-(--m-hover) hover:text-(--m-fg)"
      }`}
    >
      {children}
    </button>
  );
}
const Sep = () => <span className="mx-1 h-px bg-(--m-line)" />;
