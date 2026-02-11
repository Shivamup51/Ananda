"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Option = {
  value: string;
  label: string;
};

type SearchFilterBarProps = {
  searchPlaceholder: string;
  filterKey?: string;
  filterOptions?: Option[];
};

export function SearchFilterBar({
  searchPlaceholder,
  filterKey = "sort",
  filterOptions = [
    { value: "desc", label: "Latest" },
    { value: "asc", label: "Oldest" },
  ],
}: SearchFilterBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get("q") ?? "";
  const initialFilter = searchParams.get(filterKey) ?? filterOptions[0]?.value ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [filterValue, setFilterValue] = useState(initialFilter);

  const isDirty = useMemo(() => {
    return query !== initialQuery || filterValue !== initialFilter;
  }, [filterValue, initialFilter, initialQuery, query]);

  function apply() {
    const params = new URLSearchParams(searchParams.toString());

    if (query.trim()) params.set("q", query.trim());
    else params.delete("q");

    if (filterValue) params.set(filterKey, filterValue);
    else params.delete(filterKey);

    router.push(`${pathname}?${params.toString()}`);
  }

  function clear() {
    setQuery("");
    setFilterValue(filterOptions[0]?.value ?? "");
    router.push(pathname);
  }

  return (
    <div className="mb-8 rounded-2xl border bg-card/70 p-4 shadow-sm backdrop-blur">
      <div className="grid gap-3 md:grid-cols-[1fr_200px_auto_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            className="h-11 rounded-xl pl-9"
          />
        </div>
        <select
          value={filterValue}
          onChange={(event) => setFilterValue(event.target.value)}
          className="h-11 rounded-xl border bg-background px-3 text-sm"
        >
          {filterOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <Button onClick={apply} disabled={!isDirty} className="h-11 rounded-xl">
          Apply
        </Button>
        <Button onClick={clear} variant="outline" className="h-11 rounded-xl">
          Reset
        </Button>
      </div>
    </div>
  );
}

