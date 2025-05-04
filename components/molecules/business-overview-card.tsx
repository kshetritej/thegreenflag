import { Business } from "@prisma/client";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

export default function BusinessOverviewCard({ business }: { business: Business }) {
  return (
    <Card className=" p-4">
      <h2 className="text-2xl font-semibold mb-4">{business?.name} Overview</h2>
      <div className="grid sm:grid-cols-2 gap-2">
        <div>
          <p>Website</p>
          <a className="font-bold" href={business?.website} target="_blank" rel="noopener noreferrer">{business?.website}</a>
        </div>
        <div>
          <p>Industry</p>
          <p className="font-bold">{business?.category}</p>
        </div>
        <div>
          <p>Location</p>
          <p className="font-bold">{business?.city}, {business?.state}, {business?.country}</p>
        </div>
        <div>
          <p>Founded</p>
          <p className="font-bold">{business?.establishedYear}</p>
        </div>
      </div>
      <p>
        {business?.description}
      </p>
      {
        business.tags.length > 0 &&
      <div>
        <p>Tags</p>
        <p className="flex gap-2 font-bold">{business?.tags.map(tag => <Badge key={tag}>{"#" + tag}</Badge>)}</p>
      </div>
      }
    </Card>
  );
}