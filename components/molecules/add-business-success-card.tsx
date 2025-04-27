import { Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"


export default function AddBusinessSuccessCard() {
  return(
      <div className="max-w-3xl mx-auto py-12 px-4">
      <Card className="border-green-200">
          <CardHeader>
            <div className="mx-auto rounded-full bg-green-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-center text-2xl">Business Added Successfully!</CardTitle>
            <CardDescription className="text-center">
            Your business has been submitted for review. We&apos;ll notify you once it&apos;s approved.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center pt-6">
            <Button onClick={() => (window.location.href = "/")}>Return to Home</Button>
          </CardFooter>
        </Card>
      </div>
  )
}