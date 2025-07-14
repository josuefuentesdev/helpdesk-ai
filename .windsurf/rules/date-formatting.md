---
trigger: manual
---

Use useFormatter from next-intl for date formatting in client components.
Presets:
- 'fullShort' formats as: Nov 20, 2020, 10:36:01 AM.

```tsx
import {useFormatter} from 'next-intl';

function Component() {
  const format = useFormatter();
  const date = new Date('2020-11-20T10:36:01.516Z');

  return <p>{format.dateTime(date, 'fullShort')}</p>;
}
```