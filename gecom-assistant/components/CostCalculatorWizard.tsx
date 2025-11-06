'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { Project, Industry, TargetCountry, SalesChannel, CostResult } from '@/types/gecom';
import { calculateCostModel } from '@/lib/gecom/calculator';
import Step1Strategic from './wizard/Step1Strategic';
import Step2DataCollection from './wizard/Step2DataCollection';
import Step3CostModeling from './wizard/Step3CostModeling';
import Step4ScenarioAnalysis from './wizard/Step4ScenarioAnalysis';
import Step5Insights from './wizard/Step5Insights';

interface CostCalculatorWizardProps {
  onBack: () => void;
}

export default function CostCalculatorWizard({ onBack }: CostCalculatorWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [project, setProject] = useState<Partial<Project>>({
    name: '',
    industry: 'pet',
    targetCountry: 'US',
    salesChannel: 'amazon_fba',
    scope: {
      productInfo: {
        sku: '',
        name: '',
        category: '',
        weight: 0,
        cogs: 0,
        targetPrice: 0,
      },
      assumptions: {
        monthlySales: 0,
        returnRate: 0.08,
      },
    },
  });
  const [costResult, setCostResult] = useState<CostResult | null>(null);

  const steps = [
    { number: 1, title: 'Strategic Alignment', component: Step1Strategic },
    { number: 2, title: 'Data Collection', component: Step2DataCollection },
    { number: 3, title: 'Cost Modeling', component: Step3CostModeling },
    { number: 4, title: 'Scenario Analysis', component: Step4ScenarioAnalysis },
    { number: 5, title: 'Insights & Roadmap', component: Step5Insights },
  ];

  const handleNext = () => {
    // If moving from step 2 to step 3, calculate the cost model
    if (currentStep === 2 && project.scope) {
      try {
        const result = calculateCostModel(project as Project);
        setCostResult(result);
      } catch (error) {
        console.error('Error calculating cost model:', error);
        alert('Error calculating costs. Please check your inputs.');
        return;
      }
    }

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleProjectUpdate = (updates: Partial<Project>) => {
    setProject((prev) => ({
      ...prev,
      ...updates,
      scope: updates.scope ? { ...prev.scope, ...updates.scope } : prev.scope,
    }));
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </button>
          </div>

          {/* Progress bar */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                      currentStep === step.number
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : currentStep > step.number
                        ? 'border-green-600 bg-green-600 text-white'
                        : 'border-gray-300 bg-white text-gray-400'
                    }`}
                  >
                    {currentStep > step.number ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <span className="font-semibold">{step.number}</span>
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <div
                      className={`text-sm font-medium ${
                        currentStep >= step.number ? 'text-gray-900' : 'text-gray-400'
                      }`}
                    >
                      {step.title}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 ${
                      currentStep > step.number ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="container mx-auto px-6 py-8">
        <div className="mx-auto max-w-4xl">
          <CurrentStepComponent
            project={project}
            onUpdate={handleProjectUpdate}
            costResult={costResult}
          />

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </button>

            {currentStep < steps.length ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-6 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCircle className="h-4 w-4" />
                Complete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
