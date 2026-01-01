import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'destructive';
}

const variantStyles = {
  default: 'bg-card text-card-foreground',
  primary: 'bg-primary text-primary-foreground',
  success: 'bg-success text-success-foreground',
  warning: 'bg-warning text-warning-foreground',
  destructive: 'bg-destructive text-destructive-foreground',
};

const iconVariantStyles = {
  default: 'text-muted-foreground',
  primary: 'text-primary-foreground/80',
  success: 'text-success-foreground/80',
  warning: 'text-warning-foreground/80',
  destructive: 'text-destructive-foreground/80',
};

export function MetricCard({ title, value, subtitle, icon: Icon, variant = 'default' }: MetricCardProps) {
  return (
    <Card className={`${variantStyles[variant]} shadow-sm border`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium opacity-90">{title}</CardTitle>
        <Icon className={`h-5 w-5 ${iconVariantStyles[variant]}`} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs opacity-70 mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}
