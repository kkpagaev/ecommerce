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
  withReset?: boolean;
} & (
  | {
      multi?: false;
      onSelect: (value: string | null) => void;
      defaultValue: string | null;
    }
  | {
      multi: true;
      onSelect: (value: string[]) => void;
      defaultValue: string[];
    }
);

export function Combobox({
  values,
  onSelect,
  defaultValue,
  label,
  multi,
  withReset,
}: Props) {
  const [open, setOpen] = React.useState(false);

  // React.useEffect(() => {
  //   console.log({ defaultValue });
  //   if (multi === true && Array.isArray(defaultValue)) {
  //     onSelect(defaultValue);
  //   } else if (!multi && typeof defaultValue === "string") {
  //     onSelect(defaultValue);
  //   } else if (!multi) {
  //     onSelect(null);
  //   }
  // }, [defaultValue]);

  return (
    <div>
      <div className="flex flex-row">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="justify-between w-full"
            >
              {multi
                ? label
                : defaultValue
                  ? values.find((v) => v.value === defaultValue)?.label
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
                      return !(defaultValue as string[]).includes(v.value);
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
                          if (multi === true) {
                            if (defaultValue?.includes(value)) {
                              onSelect(defaultValue.filter((v) => v !== value));
                            } else {
                              onSelect([...(defaultValue || []), value]);
                            }
                          } else {
                            onSelect(value);
                          }
                          if (!multi) setOpen(false);
                        }}
                      >
                        {v.label}
                        <CheckboxIcon
                          className={cn(
                            "ml-auto h-4 w-4",
                            defaultValue === v.value
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))}
                </CommandList>
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        {withReset && (
          <Button
            type="button"
            onClick={() => {
              if (multi === true) {
                onSelect([]);
              } else {
                onSelect(null);
              }
            }}
          >
            Reset
          </Button>
        )}
      </div>

      {multi === true && (
        <div className="flex flex-wrap gap-1">
          {Array.from({ length: (defaultValue as string[])?.length ?? 0 }).map(
            (_, i) => {
              const v = (defaultValue as string[])[i];
              const label = values.find((value) => value.value === v)?.label;
              if (!label) return null;

              return (
                <Button
                  key={v}
                  variant="outline"
                  onClick={() => {
                    onSelect(
                      (defaultValue as string[]).filter((value) => value !== v),
                    );
                  }}
                >
                  {label}
                </Button>
              );
            },
          )}
        </div>
      )}
    </div>
  );
}
