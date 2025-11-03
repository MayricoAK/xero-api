import PropTypes from "prop-types";
import { Badge } from "../ui/badge";
import { CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export const PaymentBatchStatusBadge = ({
  isApproved,
  variant = "default",
  size = "default",
  showIcon = true,
  className = "",
}) => {
  const getStatusConfig = (approved) => {
    if (approved) {
      return {
        variant: "success",
        label: "Approved",
        icon: CheckCircle,
        className:
          "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
        iconClassName: "text-emerald-600",
      };
    }
    return {
      variant: variant,
      label: "Pending",
      icon: Clock,
      className:
        "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
      iconClassName: "text-amber-600",
    };
  };

  const getSizeConfig = (size) => {
    switch (size) {
      case "sm":
        return {
          badgeClass: "px-2 py-1 text-xs",
          iconSize: "h-3 w-3",
          gap: "gap-1",
        };
      case "lg":
        return {
          badgeClass: "px-3 py-1.5 text-sm font-medium",
          iconSize: "h-4 w-4",
          gap: "gap-1.5",
        };
      default:
        return {
          badgeClass: "px-2.5 py-1 text-xs font-medium",
          iconSize: "h-3.5 w-3.5",
          gap: "gap-1",
        };
    }
  };

  const config = getStatusConfig(isApproved);
  const sizeConfig = getSizeConfig(size);
  const IconComponent = config.icon;

  return (
    <Badge
      variant={config.variant}
      className={cn(
        config.className,
        sizeConfig.badgeClass,
        "transition-all duration-200 font-medium tracking-wide",
        "inline-flex items-center",
        sizeConfig.gap,
        "shadow-sm",
        className
      )}
    >
      {showIcon && (
        <IconComponent
          className={cn(
            sizeConfig.iconSize,
            config.iconClassName,
            "flex-shrink-0"
          )}
        />
      )}
      <span>{config.label}</span>
    </Badge>
  );
};

PaymentBatchStatusBadge.propTypes = {
  isApproved: PropTypes.bool.isRequired,
  variant: PropTypes.string,
  size: PropTypes.oneOf(["sm", "default", "lg"]),
  showIcon: PropTypes.bool,
  className: PropTypes.string,
};
