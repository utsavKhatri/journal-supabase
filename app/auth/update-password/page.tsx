import { UpdatePasswordForm } from '@/components/auth/UpdatePasswordForm';

/**
 * Renders the update password page.
 * This component serves as a container for the `UpdatePasswordForm`,
 * centering it on the page for users to update their password after
 * following a password reset link.
 */
export default function Page() {
  return (
    <div className="flex w-full flex-1 items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <UpdatePasswordForm />
      </div>
    </div>
  );
}
