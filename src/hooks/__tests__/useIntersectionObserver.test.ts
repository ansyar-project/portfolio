/**
 * @jest-environment jsdom
 */
import { renderHook } from "@testing-library/react";
import { useIntersectionObserver } from "../useIntersectionObserver";

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
const mockObserve = jest.fn();
const mockUnobserve = jest.fn();
const mockDisconnect = jest.fn();

Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  configurable: true,
  value: jest.fn((callback) => {
    mockIntersectionObserver(callback);
    return {
      observe: mockObserve,
      unobserve: mockUnobserve,
      disconnect: mockDisconnect,
    };
  }),
});

describe("useIntersectionObserver", () => {
  let mockCallback: (entries: IntersectionObserverEntry[]) => void;

  beforeEach(() => {
    jest.clearAllMocks();
    mockIntersectionObserver.mockImplementation((callback) => {
      mockCallback = callback;
    });
  });

  it("returns ref and initial isIntersecting state", () => {
    const { result } = renderHook(() => useIntersectionObserver());

    expect(result.current.ref).toBeDefined();
    expect(result.current.ref.current).toBeNull();
    expect(result.current.isIntersecting).toBe(false);
  });

  it("creates IntersectionObserver with default options", () => {
    renderHook(() => useIntersectionObserver());

    expect(window.IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        threshold: 0.1,
        rootMargin: "0px",
      }
    );
  });

  it("creates IntersectionObserver with custom options", () => {
    const options = {
      threshold: 0.5,
      rootMargin: "10px",
      triggerOnce: true,
    };

    renderHook(() => useIntersectionObserver(options));

    expect(window.IntersectionObserver).toHaveBeenCalledWith(
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
    result.current.ref.current = mockElement;

    // Re-render to trigger useEffect
    renderHook(() => useIntersectionObserver());

    expect(mockObserve).toHaveBeenCalledWith(mockElement);
  });

  it("updates isIntersecting when element enters viewport", () => {
    const { result } = renderHook(() => useIntersectionObserver());

    // Simulate attaching a DOM element
    const mockElement = document.createElement("div");
    result.current.ref.current = mockElement;

    // Simulate intersection
    const mockEntry = {
      isIntersecting: true,
      target: mockElement,
    } as IntersectionObserverEntry;

    mockCallback([mockEntry]);

    expect(result.current.isIntersecting).toBe(true);
  });

  it("updates isIntersecting when element leaves viewport", () => {
    const { result } = renderHook(() => useIntersectionObserver());

    // Simulate attaching a DOM element
    const mockElement = document.createElement("div");
    result.current.ref.current = mockElement;

    // First intersection (enter)
    let mockEntry = {
      isIntersecting: true,
      target: mockElement,
    } as IntersectionObserverEntry;

    mockCallback([mockEntry]);
    expect(result.current.isIntersecting).toBe(true);

    // Second intersection (leave)
    mockEntry = {
      isIntersecting: false,
      target: mockElement,
    } as IntersectionObserverEntry;

    mockCallback([mockEntry]);
    expect(result.current.isIntersecting).toBe(false);
  });

  it("unobserves element when triggerOnce is true and element is intersecting", () => {
    const { result } = renderHook(() =>
      useIntersectionObserver({ triggerOnce: true })
    );

    // Simulate attaching a DOM element
    const mockElement = document.createElement("div");
    result.current.ref.current = mockElement;

    // Simulate intersection
    const mockEntry = {
      isIntersecting: true,
      target: mockElement,
    } as IntersectionObserverEntry;

    mockCallback([mockEntry]);

    expect(result.current.isIntersecting).toBe(true);
    expect(mockUnobserve).toHaveBeenCalledWith(mockElement);
  });

  it("does not unobserve when triggerOnce is true but element is not intersecting", () => {
    const { result } = renderHook(() =>
      useIntersectionObserver({ triggerOnce: true })
    );

    // Simulate attaching a DOM element
    const mockElement = document.createElement("div");
    result.current.ref.current = mockElement;

    // Simulate non-intersection
    const mockEntry = {
      isIntersecting: false,
      target: mockElement,
    } as IntersectionObserverEntry;

    mockCallback([mockEntry]);

    expect(result.current.isIntersecting).toBe(false);
    expect(mockUnobserve).not.toHaveBeenCalled();
  });

  it("does not unobserve when triggerOnce is false", () => {
    const { result } = renderHook(() =>
      useIntersectionObserver({ triggerOnce: false })
    );

    // Simulate attaching a DOM element
    const mockElement = document.createElement("div");
    result.current.ref.current = mockElement;

    // Simulate intersection
    const mockEntry = {
      isIntersecting: true,
      target: mockElement,
    } as IntersectionObserverEntry;

    mockCallback([mockEntry]);

    expect(result.current.isIntersecting).toBe(true);
    expect(mockUnobserve).not.toHaveBeenCalled();
  });

  it("disconnects observer on unmount", () => {
    const { unmount } = renderHook(() => useIntersectionObserver());

    unmount();

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it("recreates observer when options change", () => {
    const { rerender } = renderHook(
      ({ threshold }) => useIntersectionObserver({ threshold }),
      { initialProps: { threshold: 0.1 } }
    );

    expect(window.IntersectionObserver).toHaveBeenCalledTimes(1);

    // Change threshold
    rerender({ threshold: 0.5 });

    expect(window.IntersectionObserver).toHaveBeenCalledTimes(2);
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });

  it("does not create observer when element is not attached", () => {
    renderHook(() => useIntersectionObserver());

    // Observer should be created but not observe anything since ref.current is null
    expect(window.IntersectionObserver).toHaveBeenCalled();
    expect(mockObserve).not.toHaveBeenCalled();
  });

  it("handles multiple intersection entries correctly", () => {
    const { result } = renderHook(() => useIntersectionObserver());

    // Simulate attaching a DOM element
    const mockElement = document.createElement("div");
    result.current.ref.current = mockElement;

    // Simulate multiple entries (though typically only one for single element)
    const mockEntries = [
      {
        isIntersecting: true,
        target: mockElement,
      } as IntersectionObserverEntry,
      {
        isIntersecting: false,
        target: document.createElement("div"),
      } as IntersectionObserverEntry,
    ];

    mockCallback(mockEntries);

    // Should use the first entry
    expect(result.current.isIntersecting).toBe(true);
  });

  it("supports generic type parameter for element", () => {
    const { result } = renderHook(() =>
      useIntersectionObserver<HTMLDivElement>()
    );

    const divElement = document.createElement("div");
    result.current.ref.current = divElement;

    // TypeScript should not complain about this assignment
    expect(result.current.ref.current).toBe(divElement);
  });

  it("cleans up properly when ref changes", () => {
    const { result, rerender } = renderHook(() => useIntersectionObserver());

    // Attach first element
    const firstElement = document.createElement("div");
    result.current.ref.current = firstElement;
    rerender();

    expect(mockObserve).toHaveBeenCalledWith(firstElement);

    // Clear the ref
    result.current.ref.current = null;
    rerender();

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
});
