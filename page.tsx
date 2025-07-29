
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ZeiterfassungApp() {
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [pauseMinutes, setPauseMinutes] = useState(0);
  const [name, setName] = useState("");
  const [project, setProject] = useState("");
  const [note, setNote] = useState("");
  const [log, setLog] = useState([]);

  const handleStart = () => setStartTime(new Date());
  const handleEnd = () => setEndTime(new Date());

  const calculateWorkedHours = () => {
    if (!startTime || !endTime) return 0;
    const diff = (endTime - startTime) / (1000 * 60); // in Minuten
    return Math.max(0, ((diff - pauseMinutes) / 60).toFixed(2));
  };

  const handleSave = () => {
    if (!name || !startTime || !endTime) return;
    const workedHours = calculateWorkedHours();
    const entry = {
      name,
      project,
      note,
      start: startTime.toLocaleString(),
      end: endTime.toLocaleString(),
      pause: pauseMinutes,
      workedHours,
    };
    setLog([...log, entry]);
    // Reset
    setStartTime(null);
    setEndTime(null);
    setPauseMinutes(0);
    setProject("");
    setNote("");
  };

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <Card>
        <CardContent className="space-y-3 pt-4">
          <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Projekt/Baustelle" value={project} onChange={(e) => setProject(e.target.value)} />
          <Textarea placeholder="Kommentar" value={note} onChange={(e) => setNote(e.target.value)} />
          <Input
            type="number"
            placeholder="Pause in Minuten"
            value={pauseMinutes}
            onChange={(e) => setPauseMinutes(parseInt(e.target.value) || 0)}
          />
          <div className="flex gap-2">
            <Button onClick={handleStart}>Start (Kommen)</Button>
            <Button onClick={handleEnd}>Ende (Gehen)</Button>
            <Button onClick={handleSave} disabled={!startTime || !endTime}>Speichern</Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {log.map((entry, i) => (
          <Card key={i}>
            <CardContent className="p-3 text-sm">
              <p><strong>{entry.name}</strong> | {entry.project}</p>
              <p>Zeit: {entry.start} – {entry.end} | Pause: {entry.pause} Min</p>
              <p>Arbeitszeit: {entry.workedHours} Std</p>
              {entry.note && <p>Notiz: {entry.note}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
