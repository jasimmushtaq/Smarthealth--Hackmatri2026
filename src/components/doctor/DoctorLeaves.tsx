import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Trash2, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Props { doctorId: string; }

export function DoctorLeaves({ doctorId }: Props) {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    const { data } = await supabase.from("doctor_leaves").select("*").eq("doctor_id", doctorId).order("start_date");
    setLeaves(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, [doctorId]);

  const handleAdd = async () => {
    if (!startDate || !endDate) { toast.error("Select both dates"); return; }
    if (endDate < startDate) { toast.error("End date must be after start date"); return; }
    const { error } = await supabase.from("doctor_leaves").insert({ doctor_id: doctorId, start_date: startDate, end_date: endDate, reason: reason || null });
    if (error) toast.error(error.message); else { toast.success("Leave added"); setStartDate(""); setEndDate(""); setReason(""); }
    fetch();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("doctor_leaves").delete().eq("id", id);
    toast.success("Leave deleted");
    fetch();
  };

  const today = new Date().toISOString().split("T")[0];
  const upcoming = leaves.filter((l) => l.end_date >= today);
  const past = leaves.filter((l) => l.end_date < today);

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" />My Leaves</CardTitle></CardHeader>
      <CardContent className="space-y-6">
        {/* Add Leave */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <h4 className="font-medium text-sm">Add Leave</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Start Date</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">End Date</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Reason (optional)</Label>
              <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason..." />
            </div>
          </div>
          <Button size="sm" onClick={handleAdd}><Plus className="h-4 w-4 mr-1" />Add Leave</Button>
        </div>

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-2">Upcoming Leaves</h4>
            <div className="space-y-2">
              {upcoming.map((l) => (
                <div key={l.id} className="flex items-center justify-between bg-card border rounded-lg px-3 py-2">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-warning border-warning text-xs">{l.start_date} → {l.end_date}</Badge>
                    {l.reason && <span className="text-sm text-muted-foreground">{l.reason}</span>}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(l.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {upcoming.length === 0 && !loading && (
          <p className="text-center text-muted-foreground text-sm py-4">No upcoming leaves</p>
        )}
      </CardContent>
    </Card>
  );
}
