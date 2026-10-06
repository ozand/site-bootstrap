# Site Reference Methodology Research

- **Path:** `research/site-reference-methodology/`
- **Issue Reference:** GitHub Issue #87 (Evidence-based methodology for website reference analysis)
- **Status:** Research Proposal & Conceptual Specification (No application mutations)

---

## 1. Scope & Repository Boundary

This directory contains the methodology proposal, conceptual ontology, and source attribution catalog for analyzing website references at the niche and site levels.

### Public Repository vs. Private Research Archive
Full third-party raw scrape bodies, long-form articles, and complete HTML dumps are omitted from the public repository; no legal determination is made. Raw source captures and extraction receipts are preserved separately in the local private research archive (`LOCAL_NOT_SHIPPED`).

**Files Shipped in this Repository (7 files):**
1. `output/proposal-ru.md`: Executive research proposal and methodology rules.
2. `output/appendix-ru.md`: Technical appendix with conceptual ontology and catalog.
3. `README.md`: Entry point, methodology guide, and public file inventory.
4. `lessons/LESSON-surf-cli-50k-truncation-and-dom-export.md`: Technical RCA on browser DOM extraction.
5. `metadata/source-catalog.json`: Canonical source catalog with URLs, authors, and domains.
6. `metadata/question-coverage.md`: Methodological requirements audit and section mappings.
7. `.gitignore`: Scoped rule excluding private local research corpora.

---

## 2. Source Authority Tiers

Methodological evidence collected in the private research archive is classified into three tiers of fidelity:

- **Tier 1: Direct Unedited Plain Text**
  Extracted text captures from public specifications and articles under the 50,000-character tool threshold.
  *Examples:* Design.md specification (`SRC-01`), DTCG token format (`SRC-02`), Open UI research (`SRC-03`), NN/g heuristics (`SRC-06`), Dunford positioning (`SRC-07`), HBR JTBD (`SRC-11`), Ulwick ODI (`SRC-12`), Welie patterns (`SRC-17`).

- **Tier 2: Direct Unedited Rendered DOM (HTML)**
  Raw full-page client-rendered DOM captures exported to capture standards exceeding plain text character limits.
  *Canonical asset:* W3C WCAG 2.2 Recommendation (`SRC-04`).

- **Tier 3: Derived Structured Markdown**
  Deterministic structural conversions from raw DOM, simplifying navigation links and table formatting while retaining normative text.
  *Examples:* Structured WCAG 2.2 checklist, Moesta demand-side framework guides (`SRC-10`).

- **Tier 4: Reference Records**
  Official documentation URLs, companion guides, and bibliographic records (`SRC-05`, `SRC-08`, `SRC-09`).

---

## 3. Tool Lesson & References
- Tool truncation root cause analysis and headless browser DOM export protocol are documented in `lessons/LESSON-surf-cli-50k-truncation-and-dom-export.md`.
- Canonical source bibliographic metadata and public citations are recorded in `metadata/source-catalog.json`.
