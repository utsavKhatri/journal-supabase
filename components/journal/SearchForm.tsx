"use client";

import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function SearchForm({ initialQuery = "" }: { initialQuery?: string }) {
  return (
    <form method="get" className="flex items-center gap-2">
      <Input
        name="q"
        defaultValue={initialQuery}
        placeholder="Search mood or content"
      />
      <Button type="submit" variant={"outline"}>
        Search
      </Button>
    </form>
  );
}

export default SearchForm;
