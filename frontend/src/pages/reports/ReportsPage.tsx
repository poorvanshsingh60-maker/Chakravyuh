import React, { useState } from 'react';
import { analyticsService } from '../../services/analyticsService';
import { Button } from '../../components/ui/button';
import { FileText, FileSpreadsheet, Download } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleExport = async (format: 'pdf' | 'excel') => {
    setDownloading(format);
    const blob = await analyticsService.exportReport(format);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chakravyuh_schedule_report.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setDownloading(null);
  };

  return (
    <div className="p-8 max-w-4xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[#101828]">Export Reports & Audit Data</h1>
        <p className="text-xs text-[#667085] mt-1">Download compiled candidate schedules, interviewer allocations, and utilization summaries.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* PDF Export */}
        <div className="p-6 bg-white rounded-xl border border-[#eaecf0] shadow-2xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#fef3f2] text-[#d92d20]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#101828]">Schedule PDF Summary</h3>
              <p className="text-xs text-[#667085]">Clean candidate and interviewer briefing packet.</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
            disabled={downloading === 'pdf'}
            onClick={() => handleExport('pdf')}
          >
            <Download className="w-4 h-4" />
            <span>{downloading === 'pdf' ? 'Generating...' : 'Download PDF Packet'}</span>
          </Button>
        </div>

        {/* Excel Export */}
        <div className="p-6 bg-white rounded-xl border border-[#eaecf0] shadow-2xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#ecfdf3] text-[#0b7c3e]">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#101828]">Complete Excel Export</h3>
              <p className="text-xs text-[#667085]">Raw tabular logs, room hours, and constraint records.</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
            disabled={downloading === 'excel'}
            onClick={() => handleExport('excel')}
          >
            <Download className="w-4 h-4" />
            <span>{downloading === 'excel' ? 'Exporting...' : 'Download Spreadsheet (.xlsx)'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
