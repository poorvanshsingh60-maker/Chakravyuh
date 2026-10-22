import React from 'react';
import { Card, CardHeader, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Video } from 'lucide-react';

export const MySchedulePage: React.FC = () => {
  const schedule = [
    { title: 'Design Exercise 1', time: '9:00 AM – 9:30 AM PST', interviewer: 'Claire Pritchett', room: 'Virtual Pod Alpha' },
    { title: 'Company Values', time: '9:30 AM – 10:00 AM PST', interviewer: 'Phil Dunphy', room: 'Virtual Pod Gamma' },
    { title: 'Design Presentation', time: '10:00 AM – 11:00 AM PST', interviewer: 'Manny Delgado', room: 'Conference Suite 402' },
  ];

  return (
    <div className="p-8 max-w-4xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[#101828]">My Confirmed Schedule</h1>
        <p className="text-xs text-[#667085] mt-1">Onsite interview agenda, panel members, and meeting links.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <span className="font-bold text-sm text-[#101828]">May 18, 2024 — Product Design Onsite</span>
            <Badge variant="success">Confirmed (3 Rounds)</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {schedule.map((s, i) => (
            <div key={i} className="p-3.5 rounded-lg border border-[#eaecf0] bg-[#fafafa] flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-[#101828] block">{s.title}</span>
                <span className="text-[#667085]">{s.time} • Interviewer: {s.interviewer}</span>
              </div>
              <a 
                href="https://meet.google.com" 
                target="_blank" 
                rel="noreferrer"
                className="px-3 py-1 rounded bg-[#1668e8] text-white font-semibold flex items-center gap-1"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Join</span>
              </a>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
