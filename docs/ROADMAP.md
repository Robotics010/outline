# Roadmap: «На Автопилоте» knowledge base

This is the tracked backlog for customizing this Outline fork into the
knowledge base for the **«На Автопилоте»** robotics student project. Each
item below was checked against the current state of the repo so the status
reflects reality, not assumptions — see the notes for what's already there
versus what still needs building. Nothing here is implemented yet; this is
a plan, not a spec.

## 1. Track authorship via login

**Status: Already implemented.**

Outline already requires authentication everywhere — there is no anonymous
create/edit path (`server/middlewares/authentication.ts`). Every document
already records who created and last modified it
(`Document.createdById`/`lastModifiedById` in `server/models/Document.ts`),
and every revision records its author (`Revision.userId` in
`server/models/Revision.ts`), surfaced in the UI via `DocumentMeta.tsx`.
Multiple login providers (email, Google, OIDC, Slack, passkeys) are already
wired up under `plugins/*` and enabled per-provider via env vars.

Nothing to build — only choose/configure which login provider(s) to enable.

## 2. Single home window with overview and key links

**Status: Already implemented**, with one optional gap.

`/home` (`app/scenes/Home.tsx`) already renders a "key links" section
(`PinnedDocuments`, backed by `server/models/Pin.ts`) plus
recent/popular/created activity feeds. Documents can already be pinned to
the team home via existing actions in
`app/actions/definitions/documents.tsx`.

Gap: no freeform editable "welcome" blurb above the pinned links — a minor
addition if wanted, not a redesign.

## 3. Quick search to ask a question and find an answer

**Status: Minor change.**

This is deterministic keyword search, not an AI/LLM feature — a query with
zero results simply means no answer exists yet. Outline's search already
works end-to-end (`app/scenes/Search/Search.tsx`,
`server/routes/api/documents/documents.ts`). What's missing is the
"suggest creating a new document titled with the question" CTA on the
zero-results state: `app/scenes/DocumentNew.tsx` already supports creating
a pre-titled document from a `title` query param, it just isn't surfaced
in the search empty state or as a command-bar action yet.

## 4. Any author can view or change any KB document

**Status: Configuration/operational, no global switch exists yet.**

`server/policies/collection.ts` already grants team-wide read/write access
on any collection with `permission = ReadWrite` and `isPrivate = false` —
no per-user membership required. This is already the default for a new
team's first collection. Getting this repo-wide today means either (a)
always creating collections as non-private/ReadWrite, or (b) a one-time
migration to update existing collections. A true unbypassable "flat mode"
would need a small, contained addition: a new `Team` preference checked in
`server/policies/collection.ts`.

## 5. Required document template (question title, TLDR, full answer)

**Status: Split — partially exists, partially new.**

Outline's template feature already fully exists (`server/models/
Template.ts`, template settings/menu UI, template-as-prefill on document
creation). Two things are genuinely missing:

- A **default/required template per collection** — no such field on
  `Collection` today; needs a `defaultTemplateId` FK + migration + minor
  UI/wiring. Minor-to-moderate change.
- **Structural enforcement** (title must be a question, body must contain
  a TLDR + detailed-answer section) — there is no validate-against-a-shape
  concept anywhere in the codebase today. This is a genuinely new feature
  (validation logic + editor UX), bigger scope than the rest of this list.

## 6. Deploy Outline on a production VPS

**Status: Already supported by existing tooling, just needs following.**

A production Docker image is already published (`outlinewiki/outline`,
built from the root `Dockerfile`), all required env vars are documented in
`.env.sample`, and the official step-by-step self-hosting guide lives at
docs.getoutline.com/s/hosting/ (linked from `README.md`). The repo's own
`docker-compose.yml` is a dev-only Postgres/Redis helper, not a full prod
stack — assembling one with the app service added is a small mechanical
step, not new tooling.
