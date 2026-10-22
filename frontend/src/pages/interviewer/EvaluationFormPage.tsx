import React, { useState } from 'react';
import { FeedbackForm } from '../../components/forms/FeedbackForm';
import { evaluationService } from '../../services/evaluationService';

export const EvaluationFormPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="p-8 max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[#101828]">Candidate Scorecard Submission</h1>
        <p className="text-xs text-[#667085] mt-1">Calibrate hiring decisions using rubric scoring.</p>
      </div>

      <div className="bg-white rounded-xl border border-[#eaecf0] p-6 shadow-2xs">
        {submitted ? (
          <div className="text-center py-8 text-xs text-[#0b7c3e] font-semibold">
            Evaluation submitted to candidate ledger!
          </div>
        ) : (
          <FeedbackForm 
            interviewId="int-492"
            candidateId="cand-1"
            candidateName="Zach Buechler"
            interviewerId="int-1"
            interviewerName="Claire Pritchett"
            onSubmit={(data) => {
              evaluationService.submit(data);
              setSubmitted(true);
            }}
            onCancel={() => {}}
          />
        )}
      </div>
    </div>
  );
};
