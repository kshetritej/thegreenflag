import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex  items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}
