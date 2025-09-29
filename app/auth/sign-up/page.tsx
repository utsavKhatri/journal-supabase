import { SignUpForm } from "@/components/auth/SignUpForm";

/**
 * Renders the sign-up page.
 * This component serves as a container for the `SignUpForm`,
 * centering it on the page for new users to create an account.
 */
export default function Page() {
  return (
    <div className="flex flex-1 w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignUpForm />
      </div>
    </div>
  );
}
