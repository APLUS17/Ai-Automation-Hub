import React from "react";
import {
  Calculator,
  Thermometer,
  Brain,
  School,
  Users,
  CreditCard,
  Droplets,
  ShoppingBag,
  FlaskConical,
  Clapperboard,
  FileText,
  Activity,
  Award,
  Hotel,
  Briefcase
} from "lucide-react";

interface IndustryIconProps {
  id: string;
  className?: string;
}

export const IndustryIcon: React.FC<IndustryIconProps> = ({ id, className = "w-6 h-6" }) => {
  const iconMap: Record<string, React.ComponentType<any>> = {
    "accounting": Calculator,
    "hvac": Thermometer,
    "coaching": Brain,
    "k12": School,
    "hr": Users,
    "healthcare-rev": CreditCard,
    "water-damage": Droplets,
    "ecommerce": ShoppingBag,
    "pharma": FlaskConical,
    "theater": Clapperboard,
    "appraisal": FileText,
    "chiro": Activity,
    "women-owned": Award,
    "hotels": Hotel,
  };

  const IconComponent = iconMap[id] || Briefcase;
  return <IconComponent className={className} strokeWidth={1.75} />;
};
