---
tags: [hooks]

---


# useIdleManager

When you want to know if the user is idle within your react native app, then do something about it.

```typescript
import { useEffect, useRef, useState } from 'react';
import { Keyboard, PanResponder } from 'react-native';

type UseIdleManagerProp = {
  idleDuration: number; // in "ms",
  checkIdleFrequency: number; // in ms;
  callback?: () => void;
};

const useIdleManager = ({
  idleDuration = 5000,
  checkIdleFrequency = 500,
  callback,
}: UseIdleManagerProp) => {
  const lastInteraction = useRef(new Date());
  const inactivityTimer = useRef<ReturnType<typeof setInterval>>();
  const [isInActive, setIsInActive] = useState(false);

  useEffect(() => {
    maybeStartWatchingForInactivity();
  }, []);

  // To keep track of keyboard. This is a hack to know if the user did try to type something or not?
  // This can roughly gauge if the user is idle or not.
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setIsActive();
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setIsActive();
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const setIsActive = () => {
    lastInteraction.current = new Date();
    if (isInActive) {
      setIsInActive(false);
    }

    maybeStartWatchingForInactivity();
  };

  const setIsInactive = () => {
    callback?.();
    setIsInActive(true);
    clearInterval(inactivityTimer.current);
    inactivityTimer.current = undefined;
  };

  const maybeStartWatchingForInactivity = () => {
    if (inactivityTimer.current) {
      return;
    }

    inactivityTimer.current = setInterval(() => {
      const currentTime = new Date().valueOf();
      const lastInteractionTime = lastInteraction.current.valueOf();
      if (currentTime - lastInteractionTime >= idleDuration) {
        setIsInactive();
      }
    }, checkIdleFrequency);
  };

  const handleStartShouldSetPanResponder = () => {
    setIsActive();
    return false;
  };

  const handleMoveShouldSetPanResponder = () => {
    setIsActive();
    return false;
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: handleStartShouldSetPanResponder,
    onMoveShouldSetPanResponder: handleMoveShouldSetPanResponder,
    onStartShouldSetPanResponderCapture: () => false,
    onMoveShouldSetPanResponderCapture: () => false,
    onPanResponderTerminationRequest: () => true,
    onShouldBlockNativeResponder: () => false,
  });

  const resetTimer = () => {
    setIsActive();
  };

  return {
    panResponder,
    isInActive,
    resetTimer,
  };
};

export default useIdleManager;

```

**Usage**
```typescript
const Home = () => {
  const onUserIdle = useCallback(() => {
    Alert.alert('Idle', 'user is idle', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'OK', onPress: resetTimer },
    ]);
  }, []);

  const { panResponder, isInActive, resetTimer } = useIdleManager({
    idleDuration: 10000,
    checkIdleFrequency: 500,
    callback: onUserIdle,
  });

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Text>User is idle? {isInActive.toString()}</Text>
    </View>
  );
};

```
