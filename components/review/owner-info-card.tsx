import { AvatarImage, Avatar, AvatarFallback} from "@/components/ui/avatar";
import { User } from "@prisma/client";
import { Clock, Globe, Mail, Phone } from "lucide-react";

export default function OwnerInfoCard({owner, establishedYear}: {owner: User, establishedYear: number}) {
  return (
  <div className="mb-8 border rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">About the Owner</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/4 flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-3">
              <AvatarImage src={owner?.profileImage ?? ""} alt="Owner" />
              <AvatarFallback>{owner?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <h3 className="font-medium text-center">{owner?.name}</h3>
            <p className="text-sm text-gray-500 text-center">Owner since {establishedYear}</p>
          </div>

          <div className="md:w-3/4">
            <p className="text-gray-700 mb-4">
              {owner?.bio}
            </p>

            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-600" />
                <span className="text-gray-700">{owner?.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-600" />
                <span className="text-gray-700">Response time: Within 1 hour</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-gray-600" />
                <span className="text-gray-700">{owner?.languages}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-600" />
                <span className="text-gray-700">{owner?.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}