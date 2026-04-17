import { cn } from "@/lib/utils";
import { FileQuestion } from "lucide-react";

interface EmptyProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function Empty({
  title = "No data found",
  description = "There's nothing here yet.",
  icon,
  action,
  className,
}: EmptyProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4 text-center",
        className
      )}
    >
      <div className="mb-4 text-gray-400">
        {icon || <FileQuestion className="h-12 w-12" />}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-4 max-w-sm">{description}</p>
      {action}
    </div>
  );
}
