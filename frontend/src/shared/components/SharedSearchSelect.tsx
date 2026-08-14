/**
 * SharedSearchSelect — Searchable select dropdown component with autocomplete functionality.
 * Allows users to search and select from a list of options.
 */

import React, { useState, useRef, useEffect, useMemo } from "react";
import { cn } from "@/shared/utils/cn";
import { Search, X, ChevronDown } from "lucide-react";

export interface SharedSearchSelectOption {
  value: string;
  label: string;
  description?: string;
}

export interface SharedSearchSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SharedSearchSelectOption[];
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  "aria-label"?: string;
  noResultsMessage?: string;
  searchPlaceholder?: string;
  maxHeight?: string;
}

export const SharedSearchSelect: React.FC<SharedSearchSelectProps> = ({
  value,
  onValueChange,
  options,
  className,
  disabled,
  placeholder = "Select an option",
  "aria-label": ariaLabel,
  noResultsMessage = "No results found",
  searchPlaceholder = "Search...",
  maxHeight = "200px",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionsContainerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;
    const query = searchQuery.toLowerCase();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(query) ||
        opt.value.toLowerCase().includes(query) ||
        (opt.description && opt.description.toLowerCase().includes(query))
    );
  }, [options, searchQuery]);

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value]
  );

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          event.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case "Enter":
          event.preventDefault();
          if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
            onValueChange(filteredOptions[highlightedIndex].value);
            setIsOpen(false);
            setSearchQuery("");
            setHighlightedIndex(-1);
            inputRef.current?.blur();
          }
          break;
        case "Escape":
          setIsOpen(false);
          setSearchQuery("");
          setHighlightedIndex(-1);
          inputRef.current?.blur();
          break;
        case "Tab":
          setIsOpen(false);
          setSearchQuery("");
          setHighlightedIndex(-1);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredOptions, highlightedIndex, onValueChange]);

  // Scroll highlighted option into view
  useEffect(() => {
    if (highlightedIndex >= 0 && optionsContainerRef.current) {
      const optionElement = optionsContainerRef.current.children[highlightedIndex] as HTMLElement;
      if (optionElement) {
        optionElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex]);

  const handleSelect = (optionValue: string) => {
    onValueChange(optionValue);
    setIsOpen(false);
    setSearchQuery("");
    setHighlightedIndex(-1);
    inputRef.current?.blur();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange("");
    setSearchQuery("");
    setHighlightedIndex(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setHighlightedIndex(-1);
    if (!isOpen) setIsOpen(true);
  };

  const handleInputFocus = () => {
    if (!disabled) setIsOpen(true);
  };

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled) setIsOpen(true);
  };

  return (
    <div ref={dropdownRef} className={cn("relative w-full", className)}>
      <div
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
          isOpen && "border-ring",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onClick={handleInputClick}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {isOpen && (
            <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          )}
          <input
            ref={inputRef}
            type="text"
            value={searchQuery || (selectedOption ? selectedOption.label : "")}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onClick={handleInputClick}
            placeholder={!isOpen && !selectedOption ? placeholder : undefined}
            disabled={disabled}
            readOnly={!isOpen}
            className={cn(
              "flex-1 bg-transparent border-none outline-none text-sm",
              isOpen ? "" : "cursor-pointer"
            )}
            aria-label={ariaLabel}
            aria-expanded={isOpen}
            aria-autocomplete="list"
            aria-controls={isOpen ? "search-select-options" : undefined}
          />
          {selectedOption && !isOpen && (
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear selection"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </div>

      {isOpen && !disabled && (
        <div
          className="absolute z-50 top-full left-0 right-0 mt-1 rounded-md border border-border bg-popover shadow-lg overflow-hidden"
          style={{ maxHeight }}
          role="listbox"
          id="search-select-options"
          ref={optionsContainerRef}
        >
          <div className="p-1 border-b border-border">
            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              placeholder={searchPlaceholder}
              className="flex h-9 w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              autoFocus
            />
          </div>
          <div className="max-h-[calc(100%-40px)] overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                {noResultsMessage}
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <div
                  key={option.value}
                  role="option"
                  aria-selected={index === highlightedIndex}
                  className={cn(
                    "px-3 py-2 text-sm cursor-pointer select-none transition-colors",
                    index === highlightedIndex
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent/50",
                    option.value === value && "font-medium"
                  )}
                  onClick={() => handleSelect(option.value)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  <div className="font-medium">{option.label}</div>
                  {option.description && (
                    <div className="text-xs text-muted-foreground truncate">
                      {option.description}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};