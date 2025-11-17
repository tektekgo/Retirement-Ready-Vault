import React from 'react';

interface RiskAssessmentStepProps {
  onChange: (riskTolerance: number) => void;
  onComplete: () => void;
  onBack: () => void;
  saving?: boolean;
}

export const RiskAssessmentStep: React.FC<RiskAssessmentStepProps> = ({ onChange, onComplete, onBack, saving = false }) => {
  const [answers, setAnswers] = React.useState<Record<string, number>>({});

  const questions = [
    {
      id: 'q1',
      text: 'How would you react if your portfolio lost 20% of its value in a market downturn?',
      options: [
        { value: 1, text: 'Sell everything immediately' },
        { value: 3, text: 'Sell some investments' },
        { value: 5, text: 'Hold steady' },
        { value: 7, text: 'Buy more at lower prices' },
      ],
    },
    {
      id: 'q2',
      text: 'What is your primary goal for retirement savings?',
      options: [
        { value: 1, text: 'Preserve capital at all costs' },
        { value: 3, text: 'Generate steady income' },
        { value: 5, text: 'Balance growth and income' },
        { value: 7, text: 'Maximize long-term growth' },
      ],
    },
    {
      id: 'q3',
      text: 'How much investment experience do you have?',
      options: [
        { value: 1, text: 'None - very new to investing' },
        { value: 3, text: 'Some - basic understanding' },
        { value: 5, text: 'Moderate - several years experience' },
        { value: 7, text: 'Extensive - very knowledgeable' },
      ],
    },
    {
      id: 'q4',
      text: 'How important is it to have access to your retirement funds before retirement?',
      options: [
        { value: 7, text: 'Not important - fully committed to long-term' },
        { value: 5, text: 'Somewhat important - prefer flexibility' },
        { value: 3, text: 'Very important - need access' },
        { value: 1, text: 'Critical - must have immediate access' },
      ],
    },
  ];

  const calculateRiskTolerance = (answers: Record<string, number>): number => {
    const values = Object.values(answers);
    if (values.length === 0) return 5; // Default
    
    // Calculate average and scale to 1-10 range
    const average = values.reduce((sum, val) => sum + val, 0) / values.length;
    // Answers are on 1-7 scale, convert to 1-10 scale
    const scaled = Math.round(((average - 1) / 6) * 9 + 1);
    return Math.max(1, Math.min(10, scaled));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(answers).length === questions.length) {
      // Calculate and update risk tolerance before completing
      const riskTolerance = calculateRiskTolerance(answers);
      onChange(riskTolerance);
      // Use setTimeout to ensure state update is processed before calling onComplete
      setTimeout(() => {
        onComplete();
      }, 0);
    }
  };

  const allQuestionsAnswered = Object.keys(answers).length === questions.length;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Risk Assessment</h2>
        <p className="text-gray-600">Help us understand your investment preferences and risk tolerance.</p>
      </div>

      {questions.map((question, index) => (
        <div key={question.id} className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            {index + 1}. {question.text}
          </h3>
          <div className="space-y-2">
            {question.options.map((option) => (
              <label
                key={option.value}
                className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:bg-blue-50 cursor-pointer"
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option.value}
                  checked={answers[question.id] === option.value}
                  onChange={() => setAnswers({ ...answers, [question.id]: option.value })}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-3 text-gray-700">{option.text}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {!allQuestionsAnswered && (
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-yellow-800">Please answer all questions to continue.</p>
        </div>
      )}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={!allQuestionsAnswered || saving}
          className={`px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center ${
            allQuestionsAnswered && !saving
              ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {saving ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            'Complete'
          )}
        </button>
      </div>
    </form>
  );
};
