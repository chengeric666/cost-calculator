'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { Project, Industry, TargetCountry, SalesChannel, CostResult } from '@/types/gecom';
import { calculateCostModel } from '@/lib/gecom/calculator';
import PersistentAIAssistant from './PersistentAIAssistant';
import Step0ProjectInfo from './wizard/Step0ProjectInfo';
import Step1Scope from './wizard/Step1Scope';
import Step2DataCollection from './wizard/Step2DataCollection';
import Step3CostModeling from './wizard/Step3CostModeling';
import Step4ScenarioAnalysisV2 from './wizard/Step4ScenarioAnalysisV2';
import Step5ReportGeneration from './wizard/Step5ReportGeneration';

interface CostCalculatorWizardProps {
  onBack: () => void;
}

export default function CostCalculatorWizard({ onBack }: CostCalculatorWizardProps) {
  const [currentStep, setCurrentStep] = useState(0); // MVP 2.0: 从Step 0开始
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

  // MVP 2.0: 完整六步向导（Step 0-5）
  const steps = [
    { number: 0, title: '项目信息', component: Step0ProjectInfo },
    { number: 1, title: '业务场景', component: Step1Scope },
    { number: 2, title: '数据采集', component: Step2DataCollection },
    { number: 3, title: '成本建模', component: Step3CostModeling },
    { number: 4, title: '场景分析', component: Step4ScenarioAnalysisV2 },
    { number: 5, title: '报告生成', component: Step5ReportGeneration },
  ];

  const handleNext = () => {
    // If moving from step 2 to step 3, calculate the cost model
    if (currentStep === 2 && project.scope) {
      try {
        const result = calculateCostModel(project as Project);
        setCostResult(result);
      } catch (error) {
        console.error('Error calculating cost model:', error);
        alert('成本计算出错，请检查输入信息。');
        return;
      }
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleProjectUpdate = (updates: Partial<Project>) => {
    setProject((prev) => ({
      ...prev,
      ...updates,
      scope: updates.scope ? { ...prev.scope, ...updates.scope } : prev.scope,
    }));

    // MVP 2.0: 同步更新costResult（来自Step 2实时计算）
    if (updates.costData) {
      setCostResult(updates.costData);
    }
  };

  /**
   * Step 0完成后的回调
   */
  const handleStep0Complete = (createdProject: Project) => {
    setProject((prev) => ({
      ...prev,
      id: createdProject.id,
      name: createdProject.name,
      industry: createdProject.industry,
    }));
    setCurrentStep(1); // 进入Step 1
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header - 精致的顶部导航栏 */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="font-medium">返回首页</span>
            </button>
          </div>

          {/* Progress bar - 优化的进度指示器 */}
          <div className="flex items-center justify-between max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl border-2 transition-all duration-300 shadow-sm ${
                      currentStep === step.number
                        ? 'border-blue-600 bg-gradient-to-br from-blue-600 to-indigo-600 text-white scale-110 shadow-lg shadow-blue-500/30'
                        : currentStep > step.number
                        ? 'border-green-600 bg-gradient-to-br from-green-600 to-emerald-600 text-white shadow-md shadow-green-500/20'
                        : 'border-slate-300 bg-white text-slate-400'
                    }`}
                  >
                    {currentStep > step.number ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <span className="font-bold text-sm">{step.number}</span>
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <div
                      className={`text-xs font-semibold tracking-wide transition-colors duration-200 ${
                        currentStep >= step.number ? 'text-slate-900' : 'text-slate-400'
                      }`}
                    >
                      {step.title}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 rounded-full transition-all duration-300 ${
                      currentStep > step.number
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600'
                        : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Layout - 左右分栏 */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Step content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-8">
            <div className="mx-auto max-w-5xl">
              {/* Step 0 has different props than Step 1-5 */}
              {currentStep === 0 ? (
                <Step0ProjectInfo
                  onNext={handleStep0Complete}
                  initialData={project}
                />
              ) : (() => {
                  // TypeScript: currentStep > 0 means we're rendering Step 1-5, not Step 0
                  const StepComponent = steps[currentStep].component as React.ComponentType<{
                    project: Partial<Project>;
                    onUpdate: (updates: Partial<Project>) => void;
                    costResult: CostResult | null;
                  }>;
                  return (
                    <StepComponent
                      project={project}
                      onUpdate={handleProjectUpdate}
                      costResult={costResult}
                    />
                  );
                })()
              }

              {/* Navigation buttons - only shown for Step 1-5 (Step 0 has its own button) */}
              {currentStep > 0 && (
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
                  <button
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    className="group flex items-center gap-2 px-6 py-3 text-slate-700 bg-white border-2 border-slate-300 rounded-xl hover:border-slate-400 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
                    <span className="font-semibold">上一步</span>
                  </button>

                  {currentStep < steps.length - 1 ? (
                    <button
                      onClick={handleNext}
                      className="group flex items-center gap-2 px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 active:scale-95"
                    >
                      <span className="font-semibold">下一步</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                  ) : (
                    <button
                      onClick={onBack}
                      className="group flex items-center gap-2 px-6 py-3 text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:scale-105 active:scale-95"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span className="font-semibold">完成</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Persistent AI Assistant */}
        <div className="w-[360px] h-full border-l border-slate-200 flex-shrink-0 shadow-2xl">
          <PersistentAIAssistant
            project={project}
            costResult={costResult}
          />
        </div>
      </div>
    </div>
  );
}
