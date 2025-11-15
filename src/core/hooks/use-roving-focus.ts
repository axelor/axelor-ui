import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";

export type Orientation = React.AriaAttributes["aria-orientation"];
export type FocusStrategy = "dom-focus" | "active-descendant";

export type RovingFocusOptions = {
  /**
   * The orientation of the roving focus container.
   * @default "horizontal"
   */
  orientation?: Orientation;

  /**
   * The focus strategy to use.
   * - `"dom-focus"`: Moves actual browser focus between items (default)
   * - `"active-descendant"`: Uses aria-activedescendant pattern
   * @default "dom-focus"
   */
  focusStrategy?: FocusStrategy;

  /**
   * Whether the roving focus is RTL.
   * Reverses the direction of horizontal arrow key navigation.
   * @default false
   */
  rtl?: boolean;

  /**
   * Whether the roving focus should loop.
   * When true, navigation wraps around at the start/end.
   * @default true
   */
  loop?: boolean;

  /**
   * Whether the roving focus is disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * The currently active index.
   *
   * **Behavior:**
   * - If `onNavigate` is provided: Fully controlled mode
   * - If only `index` is provided: Hybrid mode (hook manages internal state, syncs with index, resets on blur)
   * - If neither provided: Uncontrolled mode (starts at -1)
   */
  index?: number;

  /**
   * Callback fired when the active index changes via keyboard navigation (arrow keys, Home, End).
   *
   * **When to use:**
   * - For fully controlled navigation where you manage the state
   * - If not provided, hook uses hybrid mode with internal state management
   *
   * @param index - The new active index
   * @param element - The HTMLElement at the new index
   */
  onNavigate?: (index: number, element: HTMLElement) => void;

  /**
   * Callback fired when an item is selected via click, Enter, or Space.
   *
   * @param index - The index of the selected item
   * @param element - The HTMLElement that was selected
   */
  onSelect?: (index: number, element: HTMLElement) => void;

  /**
   * Function to determine if an item is disabled.
   * Disabled items are skipped during keyboard navigation.
   *
   * @param index - The index of the item
   * @param element - The HTMLElement to check
   * @returns true if the item should be disabled
   */
  isDisabled?: (index: number, element: HTMLElement) => boolean;
};

export type RovingFocusResult = {
  /**
   * Function to get props for the root element.
   *
   * Returns props including ref and ARIA attributes for accessibility.
   * The root element is the one that handles keyboard navigation events.
   *
   * @returns Props object to spread on the root element
   *
   * @example
   * ```tsx
   * // Container pattern
   * <div {...getRootProps()}>
   *   {items.map((item, i) => <button {...getItemProps(i)}>{item}</button>)}
   * </div>
   *
   * // Input pattern (e.g., combobox)
   * <div>
   *   <input {...getRootProps()} />
   *   <ul>
   *     {items.map((item, i) => <li {...getItemProps(i)}>{item}</li>)}
   *   </ul>
   * </div>
   * ```
   */
  getRootProps: () => {
    ref: React.RefCallback<HTMLElement>;
  } & Pick<React.AriaAttributes, "aria-orientation" | "aria-activedescendant">;

  /**
   * Function to get props for each roving focus item element.
   *
   * Call this function with the item's index to get all necessary props
   * including ref, tabIndex, id (for active-descendant), etc.
   *
   * @param index - The index of the item in the collection
   * @returns Props object to spread on the item element
   *
   * @example
   * ```tsx
   * <button {...getItemProps(0)}>Item</button>
   * ```
   */
  getItemProps: (index: number) => {
    ref: React.RefCallback<HTMLElement>;
    tabIndex: number;
    id?: string;
  };

  /**
   * The currently active index.
   *
   * Useful for styling or conditional rendering based on active state.
   */
  index: number;
};

/**
 * Hook to create a stable callback that always has access to the latest values.
 * This is similar to the useEvent RFC pattern.
 */
function useEvent<T extends (...args: any[]) => any>(handler?: T): T {
  // eslint-disable-line
  const handlerRef = useRef<T | undefined>(handler);

  useLayoutEffect(() => {
    handlerRef.current = handler;
  });

  return useCallback(
    ((...args: any[]) => handlerRef.current?.(...args)) as T, // eslint-disable-line
    [],
  );
}

/**
 * A hook for implementing roving focus (roving tabindex) pattern.
 *
 * Enables keyboard navigation through a collection of items using arrow keys,
 * while maintaining a single tab stop in the collection for efficient keyboard navigation.
 *
 * **Features:**
 * - Arrow key navigation (respects orientation and RTL)
 * - Home/End key support
 * - Enter/Space for selection
 * - Automatic tabIndex management
 * - Three modes: controlled, hybrid, or uncontrolled
 * - Auto-reset on blur (hybrid mode)
 * - Disabled item handling
 * - Event delegation for optimal performance
 *
 * **Usage Patterns:**
 *
 * **Hybrid Mode (Recommended):**
 * ```tsx
 * const { getRootProps, getItemProps, index } = useRovingFocus({
 *   index: selectedValue,
 *   onSelect: handleSelect,
 * });
 *
 * return (
 *   <div {...getRootProps()}>
 *     {items.map((item, i) => (
 *       <button key={i} {...getItemProps(i)}>
 *         {item}
 *       </button>
 *     ))}
 *   </div>
 * );
 * ```
 *
 * **Controlled Mode:**
 * ```tsx
 * const [navIndex, setNavIndex] = useState(0);
 * const { getRootProps, getItemProps } = useRovingFocus({
 *   index: navIndex,
 *   onNavigate: setNavIndex,
 *   onSelect: handleSelect,
 * });
 * ```
 *
 * **Uncontrolled Mode:**
 * ```tsx
 * const { getRootProps, getItemProps } = useRovingFocus({
 *   onSelect: handleSelect,
 * });
 * ```
 *
 * @param options - Configuration options for the roving focus behavior
 * @returns Object containing refs, active index, and container props
 *
 * @see https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_roving_tabindex
 */
export function useRovingFocus(
  options: RovingFocusOptions = {},
): RovingFocusResult {
  const {
    orientation = "horizontal",
    focusStrategy = "dom-focus",
    rtl = false,
    loop = true,
    disabled = false,
    index: controlledIndex,
    onNavigate,
    onSelect,
    isDisabled,
  } = options;

  // State management: controlled vs uncontrolled
  const [internalIndex, setInternalIndex] = useState(controlledIndex ?? -1);
  const isControlled = onNavigate !== undefined;
  const activeIndex = isControlled ? (controlledIndex ?? -1) : internalIndex;

  // Sync internal state when controlledIndex changes (hybrid mode)
  useEffect(() => {
    if (!isControlled && controlledIndex !== undefined) {
      setInternalIndex(controlledIndex);
    }
  }, [controlledIndex, isControlled]);

  // Refs
  const containerRef = useRef<HTMLElement>(null);
  const itemsMapRef = useRef<Map<number, HTMLElement>>(new Map());
  const itemRefCallbacksRef = useRef<
    Map<number, React.RefCallback<HTMLElement>>
  >(new Map());

  // Store latest options and activeIndex in refs to avoid callback dependencies
  const optionsRef = useRef({
    disabled,
    orientation,
    rtl,
    loop,
    focusStrategy,
  });
  const indexRef = useRef(activeIndex);

  // Keep refs in sync during render (synchronous update)
  // This is safe because we're just keeping refs in sync with state, not causing side effects
  optionsRef.current = { disabled, orientation, rtl, loop, focusStrategy };
  indexRef.current = activeIndex;

  // Generate unique ID for this hook instance (for active-descendant)
  const baseId = useId();

  // Stable callbacks
  const handleNavigateStable = useEvent(onNavigate);
  const handleSelectStable = useEvent(onSelect);
  const isDisabledStable = useEvent(isDisabled);

  /**
   * Navigate to a specific index
   *
   * IMPORTANT: Uses flushSync to ensure tabIndex props are updated
   * synchronously before moving DOM focus. Without this, there's a
   * timing window where:
   * 1. DOM focus moves to new element (with old tabIndex={-1})
   * 2. Previous element still has tabIndex={0}
   * 3. Tab key finds previous element instead of exiting the group
   */
  const navigateToIndex = useCallback(
    (newIndex: number) => {
      const element = itemsMapRef.current.get(newIndex);
      if (!element) return;

      const { focusStrategy } = optionsRef.current; // eslint-disable-line

      if (isControlled) {
        handleNavigateStable(newIndex, element);
      } else {
        // Use flushSync to ensure tabIndex updates synchronously before focus moves
        flushSync(() => {
          setInternalIndex(newIndex);
        });
      }

      // Focus the element if using dom-focus strategy
      if (focusStrategy === "dom-focus" && element.isConnected) {
        element.focus();
      }

      // Scroll into view
      if (element.isConnected) {
        element.scrollIntoView({ block: "nearest", inline: "nearest" });
      }
    },
    [isControlled, handleNavigateStable],
  );

  /**
   * Select an item
   */
  const selectIndex = useCallback(
    (index: number) => {
      const element = itemsMapRef.current.get(index);
      if (
        element &&
        element.isConnected &&
        !isDisabledStable?.(index, element)
      ) {
        handleSelectStable(index, element);
      }
    },
    [handleSelectStable, isDisabledStable],
  );

  /**
   * Find the next enabled index in a given direction
   */
  const findNextEnabledIndex = useCallback(
    (startIndex: number, direction: 1 | -1): number => {
      const items = itemsMapRef.current;
      const itemCount = items.size;
      if (itemCount === 0) return -1;

      // Get sorted indices
      const indices = Array.from(items.keys()).sort((a, b) => a - b);
      const currentPos = indices.indexOf(startIndex);

      if (currentPos === -1) {
        // Start index not found, return first/last enabled item
        const searchIndices =
          direction === 1 ? indices : [...indices].reverse();
        for (const idx of searchIndices) {
          const element = items.get(idx);
          if (
            element &&
            element.isConnected &&
            !isDisabledStable?.(idx, element)
          ) {
            return idx;
          }
        }
        // All disabled, return -1
        return -1;
      }

      let nextPos = currentPos + direction;
      let attempts = 0;

      while (attempts < indices.length) {
        // Handle wrapping/boundaries
        if (loop) {
          if (nextPos < 0) nextPos = indices.length - 1;
          if (nextPos >= indices.length) nextPos = 0;
        } else {
          if (nextPos < 0 || nextPos >= indices.length) return startIndex;
        }

        const nextIndex = indices[nextPos];
        const nextElement = items.get(nextIndex);

        // Check if enabled and connected
        if (
          nextElement &&
          nextElement.isConnected &&
          !isDisabledStable?.(nextIndex, nextElement)
        ) {
          return nextIndex;
        }

        nextPos += direction;
        attempts++;
      }

      // All items disabled or disconnected - stay at current if it's valid
      const currentElement = items.get(startIndex);
      if (
        currentElement &&
        currentElement.isConnected &&
        !isDisabledStable?.(startIndex, currentElement)
      ) {
        return startIndex;
      }

      // Current is also invalid, return -1
      return -1;
    },
    [loop, isDisabledStable],
  );

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const { disabled, orientation, rtl } = optionsRef.current; // eslint-disable-line
      if (disabled) return;

      const items = itemsMapRef.current;
      if (items.size === 0) return;

      const indices = Array.from(items.keys()).sort((a, b) => a - b);
      let handled = false;

      // Always detect the currently focused item for navigation
      // This is the source of truth, not activeIndex
      const focusedElement = document.activeElement as HTMLElement;
      let currentIndex = -1;
      for (const [idx, elem] of items.entries()) {
        // Check if this item is focused, or contains the focused element
        if (elem === focusedElement || elem.contains(focusedElement)) {
          currentIndex = idx;
          break;
        }
      }

      // If no item is focused, can't navigate
      if (currentIndex < 0) return;

      let newIndex = currentIndex;

      const isHorizontal = orientation === "horizontal";
      const isVertical = orientation === "vertical";

      switch (event.key) {
        case "ArrowRight":
          if (isHorizontal) {
            const direction = rtl ? -1 : 1;
            newIndex = findNextEnabledIndex(currentIndex, direction);
            handled = true;
          }
          break;

        case "ArrowLeft":
          if (isHorizontal) {
            const direction = rtl ? 1 : -1;
            newIndex = findNextEnabledIndex(currentIndex, direction);
            handled = true;
          }
          break;

        case "ArrowDown":
          if (isVertical) {
            newIndex = findNextEnabledIndex(currentIndex, 1);
            handled = true;
          }
          break;

        case "ArrowUp":
          if (isVertical) {
            newIndex = findNextEnabledIndex(currentIndex, -1);
            handled = true;
          }
          break;

        case "Home":
          // Find first enabled item
          newIndex = findNextEnabledIndex(indices[0] - 1, 1);
          handled = true;
          break;

        case "End":
          // Find last enabled item
          newIndex = findNextEnabledIndex(indices[indices.length - 1] + 1, -1);
          handled = true;
          break;

        case "Enter":
        case " ": {
          if (currentIndex >= 0) {
            const element = items.get(currentIndex);
            // Skip if element will naturally fire a click (button, link, etc.)
            // to avoid double-firing onSelect
            const tagName = element?.tagName.toLowerCase();
            const willFireClick =
              tagName === "button" ||
              tagName === "a" ||
              element?.getAttribute("role") === "button";

            if (!willFireClick) {
              selectIndex(currentIndex);
            }
            handled = true;
          }
          break;
        }
      }

      if (handled) {
        event.preventDefault();
        event.stopPropagation();

        // Only navigate if the index actually changed
        if (newIndex !== currentIndex && newIndex >= 0) {
          navigateToIndex(newIndex);
        }
      }
    },
    [findNextEnabledIndex, navigateToIndex, selectIndex],
  );

  /**
   * Handle clicks on items via event delegation
   */
  const handleClick = useCallback(
    (event: MouseEvent) => {
      const { disabled } = optionsRef.current; // eslint-disable-line
      if (disabled) return;

      const target = event.target as HTMLElement;
      const container = containerRef.current;
      if (!container) return;

      // Find which item was clicked by traversing up the tree
      // This is more efficient than iterating through all items
      let currentElement: HTMLElement | null = target;
      const items = itemsMapRef.current;

      while (currentElement && currentElement !== container) {
        // Check if this element is one of our items
        for (const [index, element] of items.entries()) {
          if (element === currentElement) {
            if (element.isConnected && !isDisabledStable?.(index, element)) {
              handleSelectStable(index, element);
              navigateToIndex(index);
            }
            return; // Found it, stop searching
          }
        }
        currentElement = currentElement.parentElement;
      }
    },
    [isDisabledStable, handleSelectStable, navigateToIndex],
  );

  /**
   * Handle focus entering the container
   */
  const handleFocusIn = useCallback((event: FocusEvent) => {
    const target = event.target as HTMLElement;
    const container = containerRef.current;
    const { focusStrategy } = optionsRef.current; // eslint-disable-line
    const currentActiveIndex = indexRef.current;

    // If focus enters the container directly (not an item), focus the active item
    if (target === container && currentActiveIndex >= 0) {
      const element = itemsMapRef.current.get(currentActiveIndex);
      if (element && focusStrategy === "dom-focus") {
        element.focus();
      }
    }
  }, []);

  /**
   * Handle focus leaving the container (hybrid mode reset)
   */
  const handleBlur = useCallback(
    (event: FocusEvent) => {
      // Only in hybrid mode: reset to controlled index when focus leaves
      if (!isControlled && controlledIndex !== undefined) {
        const relatedTarget = event.relatedTarget as Node;
        const container = containerRef.current;
        if (container && !container.contains(relatedTarget)) {
          // Use flushSync to ensure tabIndex is updated before next focus
          // This ensures Shift+Tab returns to the correct item
          flushSync(() => {
            setInternalIndex(controlledIndex);
          });
        }
      }
    },
    [isControlled, controlledIndex],
  );

  /**
   * Setup event listeners on container
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("keydown", handleKeyDown);
    container.addEventListener("click", handleClick);
    container.addEventListener("focusin", handleFocusIn);
    container.addEventListener("blur", handleBlur, true);

    return () => {
      container.removeEventListener("keydown", handleKeyDown);
      container.removeEventListener("click", handleClick);
      container.removeEventListener("focusin", handleFocusIn);
      container.removeEventListener("blur", handleBlur, true);
    };
  }, [handleKeyDown, handleClick, handleFocusIn, handleBlur]);

  /**
   * Callback ref for the root element
   */
  const setContainerRef = useCallback((element: HTMLElement | null) => {
    containerRef.current = element;
  }, []);

  /**
   * Get props for the root element
   */
  const getRootProps = useCallback(() => {
    const { orientation, focusStrategy } = optionsRef.current; // eslint-disable-line
    const currentActiveIndex = indexRef.current;

    // Calculate active descendant ID for aria-activedescendant
    const activeElement = itemsMapRef.current.get(currentActiveIndex);
    const activeDescendantId =
      focusStrategy === "active-descendant" && activeElement
        ? `${baseId}-item-${currentActiveIndex}`
        : undefined;

    return {
      ref: setContainerRef,
      "aria-orientation": orientation,
      "aria-activedescendant": activeDescendantId,
    };
  }, [baseId, setContainerRef]);

  /**
   * Cleanup stale cached ref callbacks when items change.
   * This prevents memory leaks from accumulated callbacks.
   */
  useEffect(() => {
    const currentIndices = new Set(itemsMapRef.current.keys());
    const cachedIndices = Array.from(itemRefCallbacksRef.current.keys());

    for (const cachedIndex of cachedIndices) {
      if (!currentIndices.has(cachedIndex)) {
        itemRefCallbacksRef.current.delete(cachedIndex);
      }
    }
  });

  /**
   * Get a stable ref callback for a specific index.
   * Cached per index to avoid unnecessary ref cleanup/setup cycles.
   */
  const getItemRef = useCallback(
    (index: number): React.RefCallback<HTMLElement> => {
      let callback = itemRefCallbacksRef.current.get(index);

      if (!callback) {
        callback = (element: HTMLElement | null) => {
          if (element) {
            itemsMapRef.current.set(index, element);
          } else {
            itemsMapRef.current.delete(index);
          }
        };
        itemRefCallbacksRef.current.set(index, callback);
      }

      return callback;
    },
    [],
  );

  /**
   * Get props for an item at a specific index
   */
  const getItemProps = useCallback(
    (index: number) => {
      const { focusStrategy } = optionsRef.current; // eslint-disable-line
      const currentActiveIndex = indexRef.current;

      // When activeIndex is -1 (no selection), make first item (index 0) focusable
      // This ensures keyboard accessibility when starting from unselected state
      const isActiveOrFirst =
        index === currentActiveIndex || (currentActiveIndex < 0 && index === 0);

      return {
        ref: getItemRef(index),
        tabIndex: isActiveOrFirst ? 0 : -1,
        // Note: This generates an ID for active-descendant mode.
        // If you need a custom ID, spread getItemProps first, then override:
        // <div {...getItemProps(i)} id="my-custom-id" />
        ...(focusStrategy === "active-descendant" && {
          id: `${baseId}-item-${index}`,
        }),
      };
    },
    [getItemRef, baseId],
  );

  return {
    getRootProps,
    getItemProps,
    index: activeIndex,
  };
}
