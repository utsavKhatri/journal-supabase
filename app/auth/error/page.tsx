import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * A page component that displays an authentication error message.
 * It retrieves the error message from the URL search parameters and presents it
 * in a user-friendly card format with an option to return to the homepage.
 */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex flex-1 w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl">
              Sorry, something went wrong.
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-6">
              {params?.error || "An unspecified error occurred."}
            </p>
            <Button asChild variant="outline">
              <Link href="/">Go back home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
