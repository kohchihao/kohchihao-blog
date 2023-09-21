---
tags: [hooks]

---


# useHeader 

Useful if you want to set the title, or change back button behaviour in React Navigation.

```typescript
import React, { useLayoutEffect } from 'react';

type HeaderProps = NavigationStackParams;

const useHeader = (headerProps: HeaderProps, deps: any[] = []) => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      ...headerProps
    });
  }, deps);
};
```

**Usage**
```typescript
useHeader({ title: "DEF", ...otherReactNavigationStuffs});
```
