import io
import csv
from typing import List, Dict, Any


class ExporterService:
    @staticmethod
    def export_interviews_to_csv(interviews: List[Dict[str, Any]]) -> str:
        output = io.StringIO()
        fieldnames = [
            "id",
            "candidate_id",
            "round_id",
            "interviewer_ids",
            "room_id",
            "start_time",
            "end_time",
            "status",
        ]
        writer = csv.DictWriter(output, fieldnames=fieldnames, extrasaction="ignore")
        writer.writeheader()
        for inv in interviews:
            row = inv.copy()
            if isinstance(row.get("interviewer_ids"), list):
                row["interviewer_ids"] = ";".join(row["interviewer_ids"])
            writer.writerow(row)
        return output.getvalue()
