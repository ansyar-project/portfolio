/**
 * @jest-environment jsdom
 */
import { renderHook, act } from "@testing-library/react";
import { useIntersectionObserver } from "../useIntersectionObserver";

// Mock IntersectionObserver
const mockObserve = jest.fn();
const mockUnobserve = jest.fn();
const mockDisconnect = jest.fn();

let observerCallback: (entries: IntersectionObserverEntry[]) => void;

const mockIntersectionObserver = jest
  .fn()
  .mockImplementation((callback,) => {
    observerCallback = callback;
    return {
      observe: mockObserve,
      unobserve: mockUnobserve,
      disconnect: mockDisconnect,
    };
  });

Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  configurable: true,
  value: mockIntersectionObserver,
});

// Helper to create mock IntersectionObserverEntry
const createMockEntry = (
  isIntersecting: boolean,
  target: Element
): IntersectionObserverEntry => ({
  isIntersecting,
  target,
  boundingClientRect: {} as DOMRectReadOnly,
  intersectionRatio: isIntersecting ? 0.5 : 0,
  intersectionRect: {} as DOMRectReadOnly,
  rootBounds: {} as DOMRectReadOnly,
  time: Date.now(),
});

describe("useIntersectionObserver", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns ref and initial isIntersecting state", () => {
    const { result } = renderHook(() => useIntersectionObserver());

    expect(result.current.ref).toBeDefined();
    expect(typeof result.current.ref).toBe("function");
    expect(result.current.isIntersecting).toBe(false);
  });

  it("creates IntersectionObserver with default options when element is attached", () => {
    const { result } = renderHook(() => useIntersectionObserver());

    // Simulate attaching a DOM element to the ref
    const mockElement = document.createElement("div");

    act(() => {
      result.current.ref(mockElement);
    });

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        threshold: 0.1,
        rootMargin: "0px",
      }
    );
    expect(mockObserve).toHaveBeenCalledWith(mockElement);
  });

  it("creates IntersectionObserver with custom options", () => {
    const options = {
      threshold: 0.5,
      rootMargin: "10px",
      triggerOnce: true,
    };

    const { result } = renderHook(() => useIntersectionObserver(options));

    // Simulate attaching a DOM element to the ref
    const mockElement = document.createElement("div");

    act(() => {
      result.current.ref(mockElement);
    });

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        threshold: 0.5,
        rootMargin: "10px",
      }
    );
  });

  it("observes element when ref is attached", () => {
    const { result } = renderHook(() => useIntersectionObserver());

    // Simulate attaching a DOM element to the ref
    const mockElement = document.createElement("div");

    act(() => {
      result.current.ref(mockElement);
    });

    expect(mockObserve).toHaveBeenCalledWith(mockElement);
  });

  it("updates isIntersecting when element enters viewport", () => {
    const { result } = renderHook(() => useIntersectionObserver());

    // Simulate attaching a DOM element
    const mockElement = document.createElement("div");

    act(() => {
      result.current.ref(mockElement);
    });

    // Simulate intersection
    const mockEntry = createMockEntry(true, mockElement);

    act(() => {
      observerCallback([mockEntry]);
    });

    expect(result.current.isIntersecting).toBe(true);
  });

  it("updates isIntersecting when element leaves viewport", () => {
    const { result } = renderHook(() => useIntersectionObserver());

    // Simulate attaching a DOM element
    const mockElement = document.createElement("div");

    act(() => {
      result.current.ref(mockElement);
    });

    // First intersection (enter)
    act(() => {
      observerCallback([createMockEntry(true, mockElement)]);
    });
    expect(result.current.isIntersecting).toBe(true);

    // Second intersection (leave)
    act(() => {
      observerCallback([createMockEntry(false, mockElement)]);
    });
    expect(result.current.isIntersecting).toBe(false);
  });

  it("unobserves element when triggerOnce is true and element is intersecting", () => {
    const { result } = renderHook(() =>
      useIntersectionObserver({ triggerOnce: true })
    );

    // Simulate attaching a DOM element
    const mockElement = document.createElement("div");

    act(() => {
      result.current.ref(mockElement);
    });

    // Simulate intersection
    const mockEntry = createMockEntry(true, mockElement);

    act(() => {
      observerCallback([mockEntry]);
    });

    expect(result.current.isIntersecting).toBe(true);
    expect(mockUnobserve).toHaveBeenCalledWith(mockElement);
  });

  it("does not unobserve when triggerOnce is true but element is not intersecting", () => {
    const { result } = renderHook(() =>
      useIntersectionObserver({ triggerOnce: true })
    );

    // Simulate attaching a DOM element
    const mockElement = document.createElement("div");

    act(() => {
      result.current.ref(mockElement);
    });

    // Simulate non-intersection
    const mockEntry = createMockEntry(false, mockElement);

    act(() => {
      observerCallback([mockEntry]);
    });

    expect(result.current.isIntersecting).toBe(false);
    expect(mockUnobserve).not.toHaveBeenCalled();
  });

  it("does not unobserve when triggerOnce is false", () => {
    const { result } = renderHook(() =>
      useIntersectionObserver({ triggerOnce: false })
    );

    // Simulate attaching a DOM element
    const mockElement = document.createElement("div");

    act(() => {
      result.current.ref(mockElement);
    });

    // Simulate intersection
    const mockEntry = createMockEntry(true, mockElement);

    act(() => {
      observerCallback([mockEntry]);
    });

    expect(result.current.isIntersecting).toBe(true);
    expect(mockUnobserve).not.toHaveBeenCalled();
  });

  it("disconnects observer on unmount", () => {
    const { result, unmount } = renderHook(() => useIntersectionObserver());

    // Simulate attaching a DOM element to trigger observer creation
    const mockElement = document.createElement("div");

    act(() => {
      result.current.ref(mockElement);
    });

    unmount();

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it("recreates observer when options change", () => {
    const { result, rerender } = renderHook(
      ({ threshold }) => useIntersectionObserver({ threshold }),
      { initialProps: { threshold: 0.1 } }
    );

    // Attach element to trigger observer creation
    const mockElement = document.createElement("div");

    act(() => {
      result.current.ref(mockElement);
    });

    expect(mockIntersectionObserver).toHaveBeenCalledTimes(1);

    // Change threshold
    rerender({ threshold: 0.5 });

    expect(mockIntersectionObserver).toHaveBeenCalledTimes(2);
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });

  it("does not create observer when element is not attached", () => {
    renderHook(() => useIntersectionObserver());

    // Observer should not be created since no element is attached
    expect(mockIntersectionObserver).not.toHaveBeenCalled();
    expect(mockObserve).not.toHaveBeenCalled();
  });

  it("handles multiple intersection entries correctly", () => {
    const { result } = renderHook(() => useIntersectionObserver());

    // Simulate attaching a DOM element
    const mockElement = document.createElement("div");

    act(() => {
      result.current.ref(mockElement);
    });

    // Simulate multiple entries (though typically only one for single element)
    const mockEntries = [
      createMockEntry(true, mockElement),
      createMockEntry(false, document.createElement("div")),
    ];

    act(() => {
      observerCallback(mockEntries);
    });

    // Should use the first entry
    expect(result.current.isIntersecting).toBe(true);
  });

  it("supports generic type parameter for element", () => {
    const { result } = renderHook(() =>
      useIntersectionObserver<HTMLDivElement>()
    );

    const divElement = document.createElement("div");

    act(() => {
      result.current.ref(divElement);
    });

    // Should work without TypeScript errors
    expect(mockObserve).toHaveBeenCalledWith(divElement);
  });

  it("cleans up properly when ref changes", () => {
    const { result } = renderHook(() => useIntersectionObserver());

    // Attach first element
    const firstElement = document.createElement("div");

    act(() => {
      result.current.ref(firstElement);
    });

    expect(mockObserve).toHaveBeenCalledWith(firstElement);

    // Clear the ref
    act(() => {
      result.current.ref(null);
    });

    // Should disconnect the previous observer
    expect(mockDisconnect).toHaveBeenCalled();
  });

  it("maintains state consistency across re-renders", () => {
    const { result, rerender } = renderHook(() => useIntersectionObserver());

    // Initial state
    expect(result.current.isIntersecting).toBe(false);

    // Re-render without changes
    rerender();

    // State should remain consistent
    expect(result.current.isIntersecting).toBe(false);
  });

  it("resets isIntersecting when element is detached", () => {
    const { result } = renderHook(() => useIntersectionObserver());

    // Attach element and trigger intersection
    const mockElement = document.createElement("div");

    act(() => {
      result.current.ref(mockElement);
    });

    act(() => {
      observerCallback([createMockEntry(true, mockElement)]);
    });

    expect(result.current.isIntersecting).toBe(true);

    // Detach element
    act(() => {
      result.current.ref(null);
    });

    expect(result.current.isIntersecting).toBe(false);
  });
});
