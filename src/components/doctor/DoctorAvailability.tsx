import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { DAYS_OF_WEEK } from "@/lib/constants";
import { formatTime } from "@/lib/availability";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Props { doctorId: string; }

export function DoctorAvailability({ doctorId }: Props) {
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editSlot, setEditSlot] = useState<any>(null);
  const [form, setForm] = useState({ day_of_week: "1", start_time: "09:00", end_time: "17:00" });

  const fetch = async () => {
    const { data } = await supabase.from("availability_slots").select("*").eq("doctor_id", doctorId).order("day_of_week");
    setSlots(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, [doctorId]);

  const openAdd = () => { setEditSlot(null); setForm({ day_of_week: "1", start_time: "09:00", end_time: "17:00" }); setDialogOpen(true); };
  const openEdit = (s: any) => { setEditSlot(s); setForm({ day_of_week: s.day_of_week.toString(), start_time: s.start_time.slice(0, 5), end_time: s.end_time.slice(0, 5) }); setDialogOpen(true); };

  const handleSave = async () => {
    if (form.end_time <= form.start_time) { toast.error("End time must be after start time"); return; }

    // Check duplicate
    const dup = slots.find((s) => s.day_of_week === parseInt(form.day_of_week) && s.start_time.slice(0, 5) === form.start_time && s.end_time.slice(0, 5) === form.end_time && s.id !== editSlot?.id);
    if (dup) { toast.error("Duplicate slot exists"); return; }

    const payload = { doctor_id: doctorId, day_of_week: parseInt(form.day_of_week), start_time: form.start_time, end_time: form.end_time };

    if (editSlot) {
      const { error } = await supabase.from("availability_slots").update(payload).eq("id", editSlot.id);
      if (error) toast.error(error.message); else toast.success("Slot updated ✏️");
    } else {
      const { error } = await supabase.from("availability_slots").insert(payload);
      if (error) toast.error(error.message); else toast.success("Slot added ➕");
    }
    setDialogOpen(false);
    fetch();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("availability_slots").delete().eq("id", id);
    if (error) toast.error(error.message); else toast.success("Slot deleted 🗑️");
    fetch();
  };

  const toggleActive = async (s: any) => {
    await supabase.from("availability_slots").update({ is_active: !s.is_active }).eq("id", s.id);
    fetch();
  };

  const slotsByDay = slots.reduce((acc: Record<number, any[]>, s) => {
    if (!acc[s.day_of_week]) acc[s.day_of_week] = [];
    acc[s.day_of_week].push(s);
    return acc;
  }, {});

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>My Availability</CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={openAdd}><Plus className="h-4 w-4 mr-1" />Add Slot</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editSlot ? "Edit Slot" : "Add Slot"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Day</Label>
                <Select value={form.day_of_week} onValueChange={(v) => setForm((p) => ({ ...p, day_of_week: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{DAYS_OF_WEEK.map((d, i) => <SelectItem key={i} value={i.toString()}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Input type="time" value={form.start_time} onChange={(e) => setForm((p) => ({ ...p, start_time: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Input type="time" value={form.end_time} onChange={(e) => setForm((p) => ({ ...p, end_time: e.target.value }))} />
                </div>
              </div>
              <Button onClick={handleSave} className="w-full">{editSlot ? "Update" : "Add"} Slot</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? <div className="h-32 bg-muted animate-pulse rounded-lg" /> : Object.keys(slotsByDay).length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">No slots yet. Add your first availability slot.</p>
        ) : (
          <div className="space-y-4">
            {[0, 1, 2, 3, 4, 5, 6].filter((d) => slotsByDay[d]).map((d) => (
              <div key={d}>
                <h4 className="font-medium text-sm mb-2">{DAYS_OF_WEEK[d]}</h4>
                <div className="space-y-2">
                  {slotsByDay[d].map((s: any) => (
                    <div key={s.id} className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-3">
                        <Switch checked={s.is_active} onCheckedChange={() => toggleActive(s)} />
                        <span className={`text-sm ${s.is_active ? "text-foreground" : "text-muted-foreground line-through"}`}>
                          {formatTime(s.start_time)} – {formatTime(s.end_time)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(s)}><Pencil className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
