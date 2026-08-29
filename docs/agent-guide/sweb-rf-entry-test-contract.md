# sweb RF Entry disposable-test contract

**Status:** candidate boundary only; not a deployment authorization
**Repository:** `ozand/site-bootstrap`
**Candidate project label:** `sweb_rf_entry`

This document records the safe preflight for a possible later static-site test. It
must not be read as permission to deploy to the candidate host or to inspect its
private state.

## Boundary map

The following documented facts are **README-derived**; live values below are
separately marked as read-only observations.

| Boundary | Evidence/status | Permitted interpretation |
| --- | --- | --- |
| Candidate project identity | `sweb_rf_entry/README.md` was read locally | The repository documentation identifies a sanitized RF Entry candidate and describes it as a production infrastructure project |
| Candidate services | Candidate README lists `xray`, `nginx`, `fail2ban`, and `ssh` | These are documented services, not a live inventory or authorization to touch them |
| Candidate OS/runtime | Candidate README documents Ubuntu 24.04.4 LTS and an SSH-based operator path | Documentation only; current host state is unverified |
| SSH reachability | Direct README-documented operator target accepted a BatchMode key-based connection | Read-only access is verified for this inspection; the target remains a production candidate, not a disposable deployment target |
| Docker client/server/context | Read-only remote metadata reported client/server `29.1.3` and context `default` | Docker is available for a separately authorized disposable run; no workload or resource inventory was inspected |
| Nginx/systemd availability | Read-only metadata reported Nginx `1.24.0`; `nginx`, `docker`, and `xray` units reported `active` | Service presence/active state is not permission to reload, reconfigure, or use production traffic |
| Existing projects/containers/resources | Not inspected | Must remain untouched; no inventory or workload selection is permitted for this test |

The candidate README explicitly prohibits storing private keys, passwords, raw
VLESS links, raw Xray configs, `.env` files, logs, and sensitive evidence in the
repository. None were read or copied during this preflight. The direct operator
path is a local-only prerequisite and is intentionally not repeated here.

## Disposable test contract

A future run is allowed only after a maintainer records the exact authorized host
alias/account and confirms ownership of the test window. Until then, status is
`needs_decision`/`access_unavailable`. The successful metadata preflight does not
authorize use of production services, paths, containers, or ports.

If authorized, the run must use:

- a local temporary checkout or build artifact from an explicit site-bootstrap
  revision, never the candidate project's source tree;
- a unique run identifier used only for disposable resource names and sanitized
  evidence;
- a dedicated high TCP port selected after an owner-approved non-invasive
  availability check;
- a disposable container/network or static serving root with no host-network mode,
  no bind mounts into existing project paths, and no reuse of existing resources;
- synthetic environment values only; no host `.env`, credentials, private config,
  inventory, raw logs, or production data;
- health checks at the actual selected serving boundary, retaining status/content
  type only and never response bodies containing private data;
- cleanup owned by the runner: remove only resources carrying the unique run
  identifier, then verify that those resources are gone.

The public VPS architecture requires static artifacts only. A test must not start
public Node/SSR or Keystatic; if an editor-host test is separately approved, it
must use its own private boundary and acceptance criteria.

## Abort conditions

Stop before execution if any condition holds:

1. host alias, account, authorization, or ownership is ambiguous;
2. SSH/Docker engine is unavailable or the selected port/resource collides;
3. the run would require reading a host project, existing container, `.env`,
   private key, secret, inventory, raw log, or private configuration;
4. the only available path is production traffic, public deployment, host network,
   or a non-disposable resource;
5. a command would mutate an existing service, release, container, volume, network,
   firewall, Nginx config, systemd unit, or project file;
6. cleanup cannot be guaranteed or a failure leaves unidentified resources.

On abort, leave the candidate and its services unchanged, report the blocker class
(`needs_decision`, `access_unavailable`, `environment_unavailable`, or
`safety_boundary`), and do not claim that the candidate is unavailable as a fact
about the host beyond the observed check.

## Evidence and handoff

A sanitized future receipt should include only:

- candidate label and authorized run ID;
- source revision/artifact identity without private paths;
- local versus remote client/server/context facts;
- selected disposable resource names in redacted/short form and port class;
- build, health, HTTP, and teardown statuses;
- observed facts, bounded inference, unverified checks, and residual risks.

Do not include hostnames, public/private IPs, SSH usernames, key paths, tokens,
passwords, cookies, headers, private URLs, raw payloads, inventories, or runtime
checkpoints. A successful local or disposable test is not production certification.
