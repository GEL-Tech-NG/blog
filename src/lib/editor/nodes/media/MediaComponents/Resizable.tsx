import { Image } from "@chakra-ui/react";
import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  ReactNode,
  MouseEvent,
  TouchEvent,
  CSSProperties,
} from "react";

// Type definitions
type ResizeHandle = "nw" | "ne" | "sw" | "se" | "n" | "s" | "w" | "e";

interface Dimensions {
  width: number;
  height: number;
}

interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  handle: ResizeHandle | null;
  aspectRatio: number;
  isMobile: boolean;
}

interface EventCoordinates {
  x: number;
  y: number;
}

interface UseResizerProps {
  initialWidth?: number;
  initialHeight?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  maintainAspectRatio?: boolean;
  onResize?: (dimensions: Dimensions) => void;
  handles?: ResizeHandle[];
}

interface UseResizerReturn {
  dimensions: Dimensions;
  elementRef: React.RefObject<HTMLDivElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  handleStart: (
    e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>,
    handle: ResizeHandle
  ) => void;
  getCursor: (handle: ResizeHandle) => string;
  handles: ResizeHandle[];
  isTouchDevice: boolean;
  isDragging: boolean;
}

interface ResizeHandleProps {
  handle: ResizeHandle;
  onStart: (
    e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>,
    handle: ResizeHandle
  ) => void;
  cursor: string;
  isTouchDevice: boolean;
  className?: string;
  size?: string;
}

interface ResizableWrapperProps {
  children: ReactNode;
  initialWidth?: number;
  initialHeight?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  maintainAspectRatio?: boolean;
  handles?: ResizeHandle[];
  onResize?: (dimensions: Dimensions) => void;
  className?: string;
  handleClassName?: string;
  handleSize?: string;
  showDimensions?: boolean;
}

// Core resizer hook for shared logic
const useResizer = ({
  initialWidth = 300,
  initialHeight = 200,
  minWidth = 50,
  minHeight = 50,
  maxWidth = 1000,
  maxHeight = 1000,
  maintainAspectRatio = true,
  onResize,
  handles = ["nw", "ne", "sw", "se", "n", "s", "w", "e"],
}: UseResizerProps): UseResizerReturn => {
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: initialWidth,
    height: initialHeight,
  });

  const elementRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<DragState>({
    isDragging: false,
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    handle: null,
    aspectRatio: initialWidth / initialHeight,
    isMobile: false,
  });

  // Detect if device supports touch
  const isTouchDevice = useCallback((): boolean => {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  }, []);

  // Get coordinates from mouse or touch event
  const getEventCoordinates = useCallback(
    (e: MouseEvent | TouchEvent | Event): EventCoordinates => {
      if (
        e.type === "touchstart" ||
        e.type === "touchmove" ||
        e.type === "touchend"
      ) {
        const touchEvent = e as TouchEvent;
        const touch = touchEvent.touches?.[0] || touchEvent.changedTouches?.[0];
        return { x: touch?.clientX || 0, y: touch?.clientY || 0 };
      }
      const mouseEvent = e as MouseEvent;
      return { x: mouseEvent.clientX, y: mouseEvent.clientY };
    },
    []
  );

  // Optimized resize calculation
  const calculateNewDimensions = useCallback(
    (
      deltaX: number,
      deltaY: number,
      handle: ResizeHandle,
      startWidth: number,
      startHeight: number
    ): Dimensions => {
      let newWidth = startWidth;
      let newHeight = startHeight;
      const aspectRatio = dragStateRef.current.aspectRatio;

      switch (handle) {
        case "se":
          newWidth = startWidth + deltaX;
          if (maintainAspectRatio) {
            newHeight = newWidth / aspectRatio;
          } else {
            newHeight = startHeight + deltaY;
          }
          break;
        case "sw":
          newWidth = startWidth - deltaX;
          if (maintainAspectRatio) {
            newHeight = newWidth / aspectRatio;
          } else {
            newHeight = startHeight + deltaY;
          }
          break;
        case "ne":
          newWidth = startWidth + deltaX;
          if (maintainAspectRatio) {
            newHeight = newWidth / aspectRatio;
          } else {
            newHeight = startHeight - deltaY;
          }
          break;
        case "nw":
          newWidth = startWidth - deltaX;
          if (maintainAspectRatio) {
            newHeight = newWidth / aspectRatio;
          } else {
            newHeight = startHeight - deltaY;
          }
          break;
        case "n":
          newHeight = startHeight - deltaY;
          if (maintainAspectRatio) {
            newWidth = newHeight * aspectRatio;
          }
          break;
        case "s":
          newHeight = startHeight + deltaY;
          if (maintainAspectRatio) {
            newWidth = newHeight * aspectRatio;
          }
          break;
        case "e":
          newWidth = startWidth + deltaX;
          if (maintainAspectRatio) {
            newHeight = newWidth / aspectRatio;
          }
          break;
        case "w":
          newWidth = startWidth - deltaX;
          if (maintainAspectRatio) {
            newHeight = newWidth / aspectRatio;
          }
          break;
      }

      // Apply constraints
      newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
      newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));

      // Re-enforce aspect ratio after constraints if needed
      if (maintainAspectRatio) {
        if (newWidth / aspectRatio > newHeight) {
          newWidth = newHeight * aspectRatio;
        } else {
          newHeight = newWidth / aspectRatio;
        }
      }

      return { width: Math.round(newWidth), height: Math.round(newHeight) };
    },
    [minWidth, minHeight, maxWidth, maxHeight, maintainAspectRatio]
  );

  const getTransformOrigin = (handle: ResizeHandle): string => {
    switch (handle) {
      case "nw":
        return "bottom right";
      case "ne":
        return "bottom left";
      case "sw":
        return "top right";
      case "se":
        return "top left";
      case "n":
        return "bottom center";
      case "s":
        return "top center";
      case "w":
        return "center right";
      case "e":
        return "center left";
      default:
        return "center";
    }
  };

  // Unified move handler for mouse and touch
  const handleMove = useCallback(
    (e: Event) => {
      if (!dragStateRef.current.isDragging) return;

      e.preventDefault();

      const coords = getEventCoordinates(e);
      const deltaX = coords.x - dragStateRef.current.startX;
      const deltaY = coords.y - dragStateRef.current.startY;

      const newDimensions = calculateNewDimensions(
        deltaX,
        deltaY,
        dragStateRef.current.handle!,
        dragStateRef.current.startWidth,
        dragStateRef.current.startHeight
      );

      // Use transform for smooth visual feedback during drag
      if (elementRef.current) {
        elementRef.current.style.transform = `scale(${newDimensions.width / dragStateRef.current.startWidth}, ${newDimensions.height / dragStateRef.current.startHeight})`;
        elementRef.current.style.transformOrigin = getTransformOrigin(
          dragStateRef.current.handle!
        );
      }
    },
    [calculateNewDimensions, getEventCoordinates]
  );

  // Unified end handler for mouse and touch
  const handleEnd = useCallback(
    (e: Event) => {
      if (!dragStateRef.current.isDragging) return;

      const coords = getEventCoordinates(e);
      const deltaX = coords.x - dragStateRef.current.startX;
      const deltaY = coords.y - dragStateRef.current.startY;

      const newDimensions = calculateNewDimensions(
        deltaX,
        deltaY,
        dragStateRef.current.handle!,
        dragStateRef.current.startWidth,
        dragStateRef.current.startHeight
      );

      // Reset transform and apply actual dimensions
      if (elementRef.current) {
        elementRef.current.style.transform = "";
        elementRef.current.style.transformOrigin = "";
      }

      setDimensions(newDimensions);
      onResize?.(newDimensions);

      dragStateRef.current.isDragging = false;

      // Reset cursor and selection for mouse events
      if (!dragStateRef.current.isMobile) {
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    },
    [calculateNewDimensions, onResize, getEventCoordinates]
  );

  // Unified start handler for mouse and touch
  const handleStart = useCallback(
    (
      e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>,
      handle: ResizeHandle
    ) => {
      e.preventDefault();
      e.stopPropagation();

      const coords = getEventCoordinates(e);
      const isMobile = e.type === "touchstart";

      dragStateRef.current = {
        isDragging: true,
        startX: coords.x,
        startY: coords.y,
        startWidth: dimensions.width,
        startHeight: dimensions.height,
        handle,
        aspectRatio: dimensions.width / dimensions.height,
        isMobile,
      };

      // Only set cursor for non-touch devices
      if (!isMobile) {
        document.body.style.cursor = getCursor(handle);
        document.body.style.userSelect = "none";
      }
    },
    [dimensions, getEventCoordinates]
  );

  const getCursor = (handle: ResizeHandle): string => {
    const cursors: Record<ResizeHandle, string> = {
      nw: "nw-resize",
      ne: "ne-resize",
      sw: "sw-resize",
      se: "se-resize",
      n: "n-resize",
      s: "s-resize",
      w: "w-resize",
      e: "e-resize",
    };
    return cursors[handle] || "default";
  };

  // Global event listeners for both mouse and touch
  useEffect(() => {
    const handleGlobalMove = (e: Event) => {
      if (dragStateRef.current.isDragging) {
        handleMove(e);
      }
    };

    const handleGlobalEnd = (e: Event) => {
      if (dragStateRef.current.isDragging) {
        handleEnd(e);
      }
    };

    // Mouse events
    document.addEventListener("mousemove", handleGlobalMove, {
      passive: false,
    });
    document.addEventListener("mouseup", handleGlobalEnd);

    // Touch events
    document.addEventListener("touchmove", handleGlobalMove, {
      passive: false,
    });
    document.addEventListener("touchend", handleGlobalEnd);

    return () => {
      document.removeEventListener("mousemove", handleGlobalMove);
      document.removeEventListener("mouseup", handleGlobalEnd);
      document.removeEventListener("touchmove", handleGlobalMove);
      document.removeEventListener("touchend", handleGlobalEnd);
    };
  }, [handleMove, handleEnd]);

  const validHandles: ResizeHandle[] = handles.filter((h): h is ResizeHandle =>
    ["nw", "ne", "sw", "se", "n", "s", "w", "e"].includes(h)
  );

  return {
    dimensions,
    elementRef,
    containerRef,
    handleStart,
    getCursor,
    handles: validHandles,
    isTouchDevice: isTouchDevice(),
    isDragging: dragStateRef.current.isDragging,
  };
};

// Handle component
const ResizeHandle: React.FC<ResizeHandleProps> = ({
  handle,
  onStart,
  cursor,
  isTouchDevice,
  className = "",
  size = "w-3 h-3",
}) => {
  const getPosition = (handle: ResizeHandle): string => {
    const positions: Record<ResizeHandle, string> = {
      nw: "-top-1.5 -left-1.5",
      ne: "-top-1.5 -right-1.5",
      sw: "-bottom-1.5 -left-1.5",
      se: "-bottom-1.5 -right-1.5",
      n: "-top-1.5 left-1/2 -translate-x-1/2",
      s: "-bottom-1.5 left-1/2 -translate-x-1/2",
      w: "top-1/2 -left-1.5 -translate-y-1/2",
      e: "top-1/2 -right-1.5 -translate-y-1/2",
    };
    return positions[handle] || "";
  };

  const baseClasses = `absolute ${size} bg-blue-500 border-2 border-white shadow-lg hover:bg-blue-600 transition-colors rounded-sm z-10`;
  const touchClasses = isTouchDevice ? "touch-manipulation" : "";
  const cursorClass = !isTouchDevice ? `cursor-${cursor}` : "";

  const handleStyle: CSSProperties = {
    cursor: !isTouchDevice ? cursor : undefined,
  };

  return (
    <div
      className={`${baseClasses} ${getPosition(handle)} ${touchClasses} ${cursorClass} ${className}`}
      onMouseDown={(e) => onStart(e, handle)}
      onTouchStart={(e) => onStart(e, handle)}
      style={handleStyle}
    />
  );
};

// Wrapper component that makes any element resizable
const ResizableWrapper: React.FC<ResizableWrapperProps> = ({
  children,
  initialWidth = 300,
  initialHeight = 200,
  minWidth = 50,
  minHeight = 50,
  maxWidth = 1000,
  maxHeight = 1000,
  maintainAspectRatio = true,
  handles = ["nw", "ne", "sw", "se", "n", "s", "w", "e"],
  onResize,
  className = "",
  handleClassName = "",
  handleSize = "w-3 h-3",
  showDimensions = true,
}) => {
  const {
    dimensions,
    elementRef,
    containerRef,
    handleStart,
    getCursor,
    handles: validHandles,
    isTouchDevice,
    isDragging,
  } = useResizer({
    initialWidth,
    initialHeight,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    maintainAspectRatio,
    onResize,
    handles,
  });

  const containerStyle: CSSProperties = {
    width: dimensions.width,
    height: dimensions.height,
  };

  const elementStyle: CSSProperties = {
    width: dimensions.width,
    height: dimensions.height,
    willChange: isDragging ? "transform" : "auto",
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-block select-none ${className}`}
      style={containerStyle}
    >
      <div ref={elementRef} className="w-full h-full" style={elementStyle}>
        {children}
      </div>

      {/* Render handles */}
      {validHandles.map((handle) => (
        <ResizeHandle
          key={handle}
          handle={handle}
          onStart={handleStart}
          cursor={getCursor(handle)}
          isTouchDevice={isTouchDevice}
          className={handleClassName}
          size={handleSize}
        />
      ))}

      {/* Dimensions Display */}
      {showDimensions && (
        <div className="absolute -bottom-6 left-0 text-xs text-gray-600 bg-white px-2 py-1 rounded shadow border">
          {dimensions.width} × {dimensions.height}
        </div>
      )}
    </div>
  );
};

export { ResizableWrapper, useResizer };
export type {
  ResizeHandle,
  Dimensions,
  UseResizerProps,
  UseResizerReturn,
  ResizableWrapperProps,
  ResizeHandleProps,
};
// // Original ImageResizer component using the wrapper
// const ImageResizer = (props: ImageResizerProps) => {
//   return (
//     <ResizableWrapper {...props}>
//       <Image
//         src={props.src}
//         alt={props.alt || "Resizable"}
//         className="block w-full h-full object-contain"
//         draggable={false}
//       />
//     </ResizableWrapper>
//   );
// };
