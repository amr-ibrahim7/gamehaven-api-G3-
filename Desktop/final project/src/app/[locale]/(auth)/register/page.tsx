import { AuthPageLayout } from "@/components/auth/AuthPageLayout"
import { RegisterForm } from "@/components/auth/RegisterForm"

export default function RegisterPage() {
  return (
    <AuthPageLayout maxWidth="max-w-md">
      <RegisterForm />
    </AuthPageLayout>
  )
}
