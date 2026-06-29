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
  Briefcase,
  BookOpen,
  GraduationCap,
  Hammer,
  Building,
  Dribbble,
  Calendar,
  Compass,
  FileSpreadsheet,
  HardDrive,
  Heart,
  Home,
  Layers,
  Map,
  Camera,
  Scissors,
  Shield,
  Store,
  Wifi,
  Package,
  TrendingUp,
  Dog
} from "lucide-react";

interface IndustryIconProps {
  id: string;
  className?: string;
}

export const IndustryIcon: React.FC<IndustryIconProps> = ({ id, className = "w-6 h-6" }) => {
  const iconMap: Record<string, React.ComponentType<any>> = {
    // Legacy maps
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

    // New maps matching the generated IDs
    "pharmaceutical": FlaskConical,
    "adult-education-nonprofit-training": BookOpen,
    "ai-education-training": GraduationCap,
    "automation-reliability": Shield,
    "childcare-daycare-centers": School,
    "churches-faith-based-orgs": Compass,
    "commercial-laundries": Droplets,
    "construction-contractors": Hammer,
    "construction-plumbing-services": Droplets,
    "coworking-flex-spaces": Building,
    "dental-clinics": Activity,
    "driving-schools": Compass,
    "event-wedding-venues": Calendar,
    "funeral-homes": Heart,
    "independent-pharmacies": Briefcase,
    "law-firms": FileText,
    "legal-ip-legaltech": FileSpreadsheet,
    "manufacturing-job-shops": Hammer,
    "medical-clinics": Activity,
    "moving-storage-companies": Package,
    "music-arts-schools": GraduationCap,
    "nonprofit-membership-organizations": Users,
    "outpatient-therapy-clinics": Heart,
    "pest-control": Shield,
    "photography-video-studios": Camera,
    "residential-property-management": Home,
    "real-estate-agencies": Home,
    "residential-cleaning-services": SparklesIcon(),
    "restaurants-food-service": Store,
    "roofing-contractors": Home,
    "salons-spas": Scissors,
    "security-alarm-companies": Shield,
    "self-storage-facilities": Building,
    "specialty-retail-shops": Store,
    "tech-software-gtm": TrendingUp,
    "veterinary-clinics": Dog
  };

  const IconComponent = iconMap[id] || Briefcase;
  return <IconComponent className={className} strokeWidth={1.75} />;
};

function SparklesIcon() {
  // Simple custom svg loader or standard backup
  return Store;
}
