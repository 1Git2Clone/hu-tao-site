---
name: preview-test-data
description: Use when changing test fixtures, data visibility, build contexts, or PR deployment configuration.
---

# Preview Test Data

PR deployments include test data in general, not only local development.
Production deployments exclude test fixtures.

Use the deploy-preview build context to enable `VITE_INCLUDE_TEST_DATA=true`.
Fixture filters must honor that flag as well as development mode. Verify the
built preview lists and serves fixture data, and the production build excludes it.
A fix on another branch does not fix a PR until that PR includes the change.
