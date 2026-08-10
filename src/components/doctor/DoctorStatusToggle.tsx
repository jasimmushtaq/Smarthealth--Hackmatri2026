import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Activity } from "lucide-react";

interface Props { doctor: any; onUpdate: () => void; }

export function DoctorStatusToggle({ doctor, onUpdate }: Props) {
  const statuses = [
    { value: "available", label: "Available", className: "bg-success text-success-foreground" },
    { value: "not_available", label: "Not Available", className: "bg-muted text-muted-foreground" },
    { value: "on_leave", label: "On Leave", className: "bg-warning text-warning-foreground" },
  ];

  const handleChange = async (status: string) => {
    const { error } = await supabase.from("doctors").update({ status }).eq("id", doctor.id);
    if (error) toast.error(error.message);
    else toast.success(`Status updated to ${status.replace("_", " ")}`);
    onUpdate();
  };

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5 text-primary" />Quick Status</CardTitle></CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">Current status: <Badge className={statuses.find((s) => s.value === doctor.status)?.className}>{statuses.find((s) => s.value === doctor.status)?.label}</Badge></p>
        <div className="flex flex-wrap gap-3">
          {statuses.map((s) => (
            <Button key={s.value} variant={doctor.status === s.value ? "default" : "outline"} onClick={() => handleChange(s.value)}>
              {s.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
