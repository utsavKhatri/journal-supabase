"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EntryEditor } from "@/components/journal/EntryEditor";
import { Entry } from "@/lib/types";

export function EditEntryForm({
  entry,
}: {
  entry: Pick<Entry, "id" | "date" | "mood" | "content" | "created_at">;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Entry</DialogTitle>
        </DialogHeader>
        <EntryEditor entry={entry} onSave={handleSave} />
      </DialogContent>
    </Dialog>
  );
}
