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

**Status: Implemented.**

This is deterministic keyword search, not an AI/LLM feature — a query with
zero results simply means no answer exists yet. Outline's search already
worked end-to-end (`app/scenes/Search/Search.tsx`,
`server/routes/api/documents/documents.ts`); what was missing was the
"write the answer" path out of the zero-results state.

Now built:

- The search empty state offers a **"Write the answer"** button that creates
  a document pre-titled with the query, via the `?title=` param
  `app/scenes/DocumentNew.tsx` already supported.
- The same is available from the command bar as *Create a document titled
  "…"* (`createDocumentWithTitleActionFactory` in
  `app/actions/definitions/documents.tsx`), alongside the existing
  *Search documents for "…"* action.
- The document is **published immediately** rather than left as a private
  draft, so any other author can pick the question up and answer it.
  Publishing needs a collection, so the destination is resolved by
  `CollectionsStore.publishTargetId`: the active collection filter → the
  team's `defaultCollectionId` → the first collection the user can create
  in. An unpublished draft is the fallback only when the user can write to
  no collection at all.
- Queries are normalized into titles by `documentTitleFromSearchQuery`
  (`app/utils/routeHelpers.ts`), which collapses whitespace and truncates to
  `DocumentValidation.maxTitleLength` so a long query can't fail creation.

Not covered: the "search in document" (`documentId`) filter does not create
a child of that document — that would need `title` support in
`newNestedDocumentPath`.

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
