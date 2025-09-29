import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

/**
 * Renders the forgot password page.
 * This component serves as a container for the `ForgotPasswordForm`,
 * centering it on the page for users who need to reset their password.
 */
export default function Page() {
  return (
    <div className="flex flex-1 w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
