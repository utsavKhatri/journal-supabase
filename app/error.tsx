"use client";

import { Button } from "@/components/ui/button";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1">
      <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-4">
        Something went wrong!
      </h2>
      <Button onClick={() => reset()} variant={"destructive"}>
        Try again
      </Button>
    </div>
  );
}
