import React, { createContext, useContext, useState } from "react";

interface PopoverContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PopoverContext = createContext<PopoverContextType | undefined>(undefined);

interface PopoverProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Popover({ children, open, onOpenChange }: PopoverProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : uncontrolledOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  return (
    <PopoverContext.Provider
      value={{ open: isOpen, onOpenChange: handleOpenChange }}
    >
      <div className="relative inline-block">{children}</div>
    </PopoverContext.Provider>
  );
}

interface PopoverTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}

export function PopoverTrigger({
  children,
  asChild,
  className,
}: PopoverTriggerProps) {
  const context = useContext(PopoverContext);

  if (!context) {
    throw new Error("PopoverTrigger must be used within a Popover");
  }

  const { open, onOpenChange } = context;

  const handleClick = () => {
    onOpenChange(!open);
  };

  if (asChild) {
    return React.cloneElement(children as React.ReactElement, {
      onClick: handleClick,
      className: `${(children as React.ReactElement).props.className || ""} ${className || ""}`,
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center justify-center ${className || ""}`}
    >
      {children}
    </button>
  );
}

interface PopoverContentProps {
  children: React.ReactNode;
  className?: string;
  align?: "start" | "end" | "center";
  side?: "top" | "right" | "bottom" | "left";
}

export function PopoverContent({
  children,
  className,
  align = "center",
  side = "bottom",
}: PopoverContentProps) {
  const context = useContext(PopoverContext);

  if (!context) {
    throw new Error("PopoverContent must be used within a Popover");
  }

  const { open } = context;

  if (!open) {
    return null;
  }

  const alignmentClasses = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  };

  const sideClasses = {
    top: "bottom-full mb-2",
    right: "left-full ml-2",
    bottom: "top-full mt-2",
    left: "right-full mr-2",
  };

  return (
    <div
      className={`
        absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 
        bg-white p-1 shadow-md animate-in fade-in-0 zoom-in-95
        ${sideClasses[side]} ${alignmentClasses[align]} ${className || ""}
      `}
    >
      {children}
    </div>
  );
}
