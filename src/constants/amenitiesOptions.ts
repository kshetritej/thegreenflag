import {
  Wifi,
  ParkingCircle,
  Snowflake,
  Clock,
  Dog,
  ArrowUpDown,
  Accessibility,
  TreePine,
  Cigarette,
  Shirt,
  Bell,
  Lock,
  Shield,
  Wallet,
  Flower2,
  Luggage,
  Package,
  Toilet
} from "lucide-react";

export const amenitiesOptions = [
  { id: "wifi", label: "Wi-Fi", icon: Wifi },
  { id: "parking", label: "Parking", icon: ParkingCircle },
  { id: "airConditioning", label: "Air Conditioning", icon: Snowflake },
  { id: "frontDesk24Hours", label: "24-Hour Front Desk", icon: Clock },
  { id: "petFriendly", label: "Pet Friendly", icon: Dog },
  { id: "elevator", label: "Elevator", icon: ArrowUpDown },
  { id: "disabledAccess", label: "Disabled Access", icon: Accessibility },
  { id: "backyard", label: "Backyard", icon: TreePine },
  { id: "smokingArea", label: "Smoking Area", icon: Cigarette },
  { id: "laundry", label: "Laundry", icon: Shirt },
  { id: "roomService", label: "Room Service", icon: Bell },
  { id: "safe", label: "Safe", icon: Lock },
  { id: "security", label: "Security", icon: Shield },
  { id: "atm", label: "ATM", icon: Wallet },
  { id: "garden", label: "Garden", icon: Flower2 },
  { id: "luggageStorage", label: "Luggage Storage", icon: Luggage },
  { id: "vendingMachine", label: "Vending Machine", icon: Package },
  { id: "restrooms", label: "Restrooms", icon: Toilet },
] as const;

export type AmenityId = typeof amenitiesOptions[number]["id"];
