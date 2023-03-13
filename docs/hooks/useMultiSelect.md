---
tags: [hooks]

---


# useMultiSelect 
When you want to multi select items. When the item is selected again, it will be removed. 

```typescript
export const useMultiSelect = (initialState: string[]) => {
  const [selectedItems, setSelectedItems] = useState<string[]>(initialState);
  const onSelected = (option: string) => {
    // To Remove
    const optionIndex = selectedItems.findIndex(value => value === option);
    if (optionIndex !== -1) {
      const filteredFilters = selectedItems.filter(value => value !== option);
      setSelectedItems(filteredFilters);
      return;
    }

    // To Add
    setSelectedItems([...selectedItems, option]);
    return;
  };

  const reset = () => {
    setSelectedItems([]);
  };

  return { selectedItems, onSelected, reset };
};
```

**Usage**
```typescript
const { selectedItem, onSelected } = useMultiSelect(); 


const handleOnSelected = (item: string) => {
  onSelected(item);
}
```
