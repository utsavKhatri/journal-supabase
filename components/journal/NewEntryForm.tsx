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
import { PlusIcon } from "lucide-react";

/**
 * The NewEntryForm component provides a dialog-based form for creating a new journal entry.
 * It wraps the `EntryEditor` component in a dialog and provides a trigger button to open it.
 * The dialog closes automatically upon a successful save.
 */
export function NewEntryForm() {
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Closes the dialog. This function is passed as a callback to the EntryEditor.
   */
  const handleSave = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="max-sm:w-full">
          <PlusIcon className="h-4 w-4" />
          New Entry
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Entry</DialogTitle>
        </DialogHeader>
        <EntryEditor onSave={handleSave} />
      </DialogContent>
    </Dialog>
  );
}
