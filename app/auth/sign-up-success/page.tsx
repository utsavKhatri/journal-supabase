import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MailCheck } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

/**
 * Renders a success page after a user signs up.
 * This page informs the user that a confirmation email has been sent and
 * prompts them to check their inbox to activate their account.
 */
export default function Page() {
  return (
    <div className="flex w-full flex-1 items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card className="text-center">
          <CardHeader>
            <div className="bg-primary/10 text-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <MailCheck className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl">
              Thank you for signing up!
            </CardTitle>
            <CardDescription>
              A confirmation link has been sent to your email address.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6 text-sm">
              Please check your inbox and click the link to activate your
              account.
            </p>
            <Button asChild>
              <Link href="/auth/login">Back to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
