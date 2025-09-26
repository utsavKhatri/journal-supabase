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

export function NewEntryForm() {
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
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
