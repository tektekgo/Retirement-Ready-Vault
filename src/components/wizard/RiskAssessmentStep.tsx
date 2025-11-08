import React from 'react';

interface RiskAssessmentStepProps {
  onComplete: () => void;
  onBack: () => void;
}

export const RiskAssessmentStep: React.FC<RiskAssessmentStepProps> = ({ onComplete, onBack }) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(answers).length === questions.length) {
      onComplete();
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
          disabled={!allQuestionsAnswered}
          className={`px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            allQuestionsAnswered
              ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Complete
        </button>
      </div>
    </form>
  );
};
