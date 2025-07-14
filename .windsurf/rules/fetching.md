---
trigger: always_on
---

Use trpc with useQuery, preferring data, isPending, and error.
Guard logic:
- data is valid only when !isPending && !error.

During loading (isPending === true), prefer shadcn <Skeleton /> over placeholder text.