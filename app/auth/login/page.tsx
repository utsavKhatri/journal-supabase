import { LoginForm } from "@/components/auth/LoginForm";

/**
 * Renders the login page.
 * This component serves as a container for the `LoginForm`,
 * centering it on the page for users to sign in.
 */
export default function Page() {
  return (
    <div className="flex flex-1 w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
