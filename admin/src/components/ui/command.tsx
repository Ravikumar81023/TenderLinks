import React, { createContext, useContext, useState } from "react";
import { Search } from "lucide-react";

interface CommandContextType {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const CommandContext = createContext<CommandContextType | undefined>(undefined);

interface CommandProps {
  children: React.ReactNode;
  className?: string;
}

export function Command({ children, className }: CommandProps) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <CommandContext.Provider value={{ searchTerm, setSearchTerm }}>
      <div
        className={`flex flex-col overflow-hidden rounded-md bg-white ${className || ""}`}
      >
        {children}
      </div>
    </CommandContext.Provider>
  );
}

interface CommandInputProps {
  placeholder?: string;
  className?: string;
}

export function CommandInput({
  placeholder = "Type a command...",
  className,
}: CommandInputProps) {
  const context = useContext(CommandContext);

  if (!context) {
    throw new Error("CommandInput must be used within a Command");
  }

  const { searchTerm, setSearchTerm } = context;

  return (
    <div className="flex items-center border-b px-3">
      <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
      <input
        className={`flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none 
          placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50 ${className || ""}`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

interface CommandEmptyProps {
  children: React.ReactNode;
}

export function CommandEmpty({ children }: CommandEmptyProps) {
  const context = useContext(CommandContext);

  if (!context) {
    throw new Error("CommandEmpty must be used within a Command");
  }

  const { searchTerm } = context;

  if (!searchTerm) {
    return null;
  }

  return (
    <div className="py-6 text-center text-sm text-gray-500">{children}</div>
  );
}

interface CommandGroupProps {
  children: React.ReactNode;
  heading?: React.ReactNode;
  className?: string;
}

export function CommandGroup({
  children,
  heading,
  className,
}: CommandGroupProps) {
  return (
    <div className={`overflow-hidden p-1 ${className || ""}`}>
      {heading && (
        <div className="px-2 py-1.5 text-sm font-semibold text-gray-900">
          {heading}
        </div>
      )}
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}

interface CommandItemProps {
  children: React.ReactNode;
  onSelect?: () => void;
  className?: string;
  disabled?: boolean;
}

export function CommandItem({
  children,
  onSelect,
  className,
  disabled = false,
}: CommandItemProps) {
  return (
    <button
      className={`
        flex w-full items-center rounded-sm px-2 py-1.5 text-sm outline-none
        hover:bg-gray-100 aria-selected:bg-gray-100
        disabled:pointer-events-none disabled:opacity-50
        ${className || ""}
      `}
      onClick={onSelect}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
