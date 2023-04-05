---
tags: [hooks]

---


# useDebounce 
When you want to do a search, but you only want to get the delayed string instead of immediately.

```typescript
import { useEffect, useState } from 'react'

function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

export default useDebounce
```

**Usage**
```typescript
const [value, setValue] = useState<string>('')
const debouncedValue = useDebounce<string>(value, 500)

// call api with your debounced value 
useQuery(debouncedValue)
```
