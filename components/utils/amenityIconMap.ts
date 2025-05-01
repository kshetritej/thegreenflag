import { Wifi, ParkingCircle, Snowflake, Clock, Dog, ArrowUpDown, Accessibility, TreePine, Cigarette, Shirt, Bell, Lock, Shield, Wallet, Flower2, Luggage, Package, Toilet } from "lucide-react"

export const amenityIconMap = {
  wifi: { icon: Wifi, label: "Free Wi-Fi" },
  parking: { icon: ParkingCircle, label: "Parking Available" },
  airConditioning: { icon: Snowflake, label: "Air Conditioning" },
  frontDesk24Hours: { icon: Clock, label: "24-Hour Front Desk" },
  petFriendly: { icon: Dog, label: "Pet Friendly" },
  elevator: { icon: ArrowUpDown, label: "Elevator Access" },
  disabledAccess: { icon: Accessibility, label: "Wheelchair Accessible" },
  backyard: { icon: TreePine, label: "Backyard Area" },
  smokingArea: { icon: Cigarette, label: "Smoking Area" },
  laundry: { icon: Shirt, label: "Laundry Service" },
  roomService: { icon: Bell, label: "Room Service" },
  safe: { icon: Lock, label: "In-Room Safe" },
  security: { icon: Shield, label: "Security Provided" },
  atm: { icon: Wallet, label: "ATM Available" },
  garden: { icon: Flower2, label: "Garden Area" },
  luggageStorage: { icon: Luggage, label: "Luggage Storage" },
  vendingMachine: { icon: Package, label: "Vending Machine" },
  restrooms: { icon: Toilet, label: "Restrooms Available" }
} as const;
