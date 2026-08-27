# Project Goals

## Original project goal

`site-bootstrap` is a bootstrap repository for creating and deploying **separate, independent website repositories** from a common foundation.

The factory provides:

- a canonical Astro-based site template;
- a supported scaffolding path for creating new site repositories;
- portable skills and operating instructions for AI agents;
- git-based content management through files and Keystatic;
- hosting configurations that do not force a single provider;
- verification rules that keep every generated site in a working state.

The central operating model is **agent-led site creation and management**. Agents are expected to create, configure, maintain, verify, and improve sites while working alongside humans. Humans and agents use the same Git repository and produce reviewable, revertible changes.

This repository is a factory and shared foundation, not a finished website and not a central runtime for all generated sites. Each site created from it remains a separate repository with its own content, configuration, deployment, issues, and release history.

## Research and knowledge-base direction

The project maintains an engineering knowledge base for the frameworks, patterns, tools, deployment approaches, and operational lessons used by the factory and by sites created from it.

Research follows a source-to-knowledge pipeline:

```text
research question
  -> targeted source search
  -> raw evidence capture
  -> source comparison and verification
  -> canonical knowledge
  -> reusable procedure, decision, or lesson
  -> searchable knowledge base
```

### Source channels

Research may combine three complementary channels:

1. **Web and primary sources** — official documentation, specifications, release notes, changelogs, GitHub repositories, issues, pull requests, and maintainer materials. These are the primary basis for technical contracts and current behavior.
2. **Reddit and other communities** — practical reports, failure modes, environment details, benchmarks, workarounds, and discussion that help discover real-world problems. Community claims must be checked against primary sources or reproducible evidence before becoming recommendations.
3. **YouTube** — conference talks, technical deep dives, tutorials, interviews, deployment walkthroughs, and production incident discussions. Transcripts are useful for discovery and context; important claims require independent verification.

### Knowledge layers

The knowledge base separates evidence from conclusions:

- **Raw layer** — immutable or minimally transformed captures with source URL, date, version/context, provenance, and quality notes.
- **Canonical layer** — reviewed Markdown pages containing verified facts, recommended approaches, constraints, examples, and links to supporting raw material.
- **Lessons** — repeatable problem records following `symptom -> cause -> fix -> verification -> prevention`.
- **Procedures** — reproducible step-by-step workflows such as scaffolding, deployment, rollback, upgrades, and schema changes.
- **Decisions** — durable architectural and operational choices, including their rationale, trade-offs, and scope.

QMD is used to make the knowledge base searchable for agents. Search results are evidence and context, not an automatic substitute for judgment: agents must check freshness, applicability, source quality, and version compatibility.

### Research quality rules

- Prefer primary sources for contracts, APIs, compatibility, and current behavior.
- Use Reddit and YouTube to discover practical evidence, edge cases, and follow-up questions, not to bypass verification.
- Record versions, environment assumptions, dates, and reproducible commands whenever available.
- Distinguish `confirmed`, `corroborated`, `reported`, `hypothesis`, `deprecated`, and `rejected` claims.
- Preserve provenance and link canonical conclusions to their supporting evidence.
- Record contradictions and unresolved questions instead of silently averaging them away.
- Never store secrets, credentials, private cookies, access tokens, or sensitive runtime state.

## Long-term outcome

The desired outcome is a self-improving, agent-operable site factory: new sites can be created consistently, managed through explicit contracts and portable skills, and supported by a searchable body of verified engineering knowledge rather than by undocumented individual experience.
