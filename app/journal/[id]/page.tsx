import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { EditEntryForm } from "@/components/journal/EditEntryForm";
import { DeleteEntryButton } from "@/components/journal/DeleteEntryButton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function EntryDetailPage({
  params,
}: PageProps<"/journal/[id]">) {
  const supabase = await createClient();

  const { data: entry, error } = await supabase
    .from("entries")
    .select("id, date, mood, content, created_at")
    .eq("id", (await params).id)
    .single();

  if (error || !entry) {
    redirect("/");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-8 items-center">
      <div className="w-full max-w-2xl px-4 md:px-0">
        <div className="flex justify-between items-center mb-4">
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Journal
            </Link>
          </Button>
          <div className="flex gap-2">
            <EditEntryForm entry={entry} />
            <DeleteEntryButton entryId={entry.id} />
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <span>{entry.mood}</span>
              <span>
                {new Date(entry.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </CardTitle>
            <CardDescription>Your mindful moment</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-lg">{entry.content}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
