"use client";

import * as React from "react";
import { CaretSortIcon, CheckboxIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  values: Array<{ value: string; label: string }>;
  label: string;
} & (
  | {
      multi?: false;
      onSelect: (value: string) => void;
      defaultValue?: string;
    }
  | {
      multi: true;
      onSelect: (value: string[]) => void;
      defaultValue?: string[];
    }
);

export function Combobox({
  values,
  onSelect,
  defaultValue,
  label,
  multi,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(() => {
    return multi ? defaultValue ?? [] : defaultValue;
  });

  React.useEffect(() => {
    if (multi === true && Array.isArray(selected)) {
      onSelect(selected);
    } else if (!multi && typeof selected === "string") {
      onSelect(selected);
    }
  }, [selected]);

  return (
    <div className="flex flex-col space-y-1.5">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between"
          >
            {multi
              ? label
              : selected
                ? values.find((v) => v.value === selected)?.label
                : label}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className=" p-0">
          <Command
            filter={(value, search, keywords = []) => {
              const extendValue = value + " " + keywords.join(" ");
              if (extendValue.toLowerCase().includes(search.toLowerCase())) {
                return 1;
              }
              return 0;
            }}
          >
            <CommandInput placeholder="Search category..." className="h-9" />
            <CommandEmpty>Not found.</CommandEmpty>
            <CommandGroup>
              <CommandList>
                {values
                  .filter((v) => {
                    if (!multi) return true;
                    return !(selected as string[]).includes(v.value);
                  })
                  .map((v) => (
                    <CommandItem
                      className={cn(
                        "hover:bg-accent hover:text-accent-foreground",
                      )}
                      key={v.value}
                      keywords={[v.label]}
                      value={v.value}
                      onSelect={(value) => {
                        if (multi === true && Array.isArray(selected)) {
                          if (selected?.includes(value)) {
                            setSelected(selected.filter((v) => v !== value));
                          } else {
                            setSelected([...(selected || []), value]);
                          }
                        } else {
                          setSelected(value);
                        }
                        if (!multi) setOpen(false);
                      }}
                    >
                      {v.label}
                      <CheckboxIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          selected === v.value ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandList>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      {multi === true && (
        <div className="flex flex-wrap gap-1">
          {(selected as string[])?.map((v) => (
            <Button
              key={v}
              variant="outline"
              onClick={() => {
                setSelected(
                  (selected as string[]).filter((value) => value !== v),
                );
              }}
            >
              {values.find((value) => value.value === v)?.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
