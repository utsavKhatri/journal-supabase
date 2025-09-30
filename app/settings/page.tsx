import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

import { ExportButtons } from '@/components/setting/ExportButton';
import { DeleteAccountButton } from '@/components/setting/DeleteAccountButton';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

/**
 * The Settings page provides users with options to manage their account data.
 * It includes functionality for exporting all journal entries and for deleting the user's account.
 * This page requires the user to be authenticated.
 */
export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect('/auth/login');
  }

  return (
    <section className="flex w-full flex-1 flex-col gap-8 max-sm:px-2">
      {/* Card for exporting user data. */}
      <Card>
        <CardHeader>
          <CardTitle>Export Data</CardTitle>
          <CardDescription>Download all your entries.</CardDescription>
        </CardHeader>
        <CardContent>
          <ExportButtons />
        </CardContent>
      </Card>

      {/* Card for deleting the user's account. */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your account password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action="/auth/update-password">
            <Button type="submit">Change Password</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delete Account</CardTitle>
          <CardDescription>
            Permanently delete your account and all your data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DeleteAccountButton />
        </CardContent>
      </Card>
    </section>
  );
}
