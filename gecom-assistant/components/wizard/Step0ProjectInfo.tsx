'use client';

/**
 * Step 0: 项目基本信息
 *
 * MVP 2.0设计目标：
 * - 独立的项目创建步骤
 * - 支持历史项目加载
 * - Liquid Glass设计风格
 * - 清晰的行业选择（Pet Food / Vape）
 */

import { useState, useEffect } from 'react';
import { FileText, Clock, ChevronRight, AlertCircle } from 'lucide-react';
import { Project } from '@/types/gecom';
import { getProjects, createProject } from '@/lib/appwrite-data';

interface Step0Props {
  onNext: (project: Project) => void;
  initialData?: Partial<Project>;
}

interface FormState {
  projectName: string;
  industry: 'pet_food' | 'vape';
  description: string;
}

interface FormErrors {
  projectName?: string;
}

export default function Step0ProjectInfo({ onNext, initialData }: Step0Props) {
  // 表单状态
  const [formState, setFormState] = useState<FormState>({
    projectName: initialData?.name || '',
    industry: (initialData?.industry as 'pet_food' | 'vape') || 'pet_food',
    description: '',
  });

  // 验证错误
  const [errors, setErrors] = useState<FormErrors>({});

  // 历史项目列表
  const [existingProjects, setExistingProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);

  // 加载历史项目
  useEffect(() => {
    loadExistingProjects();
  }, []);

  /**
   * 加载用户的历史项目列表
   */
  const loadExistingProjects = async () => {
    setLoadingProjects(true);
    try {
      const projects = await getProjects(undefined, { limit: 5 });
      if (projects) {
        setExistingProjects(projects);
      }
    } catch (error) {
      console.error('加载历史项目失败:', error);
    } finally {
      setLoadingProjects(false);
    }
  };

  /**
   * 表单验证
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 项目名称必填
    if (!formState.projectName.trim()) {
      newErrors.projectName = '请输入项目名称';
    } else if (formState.projectName.trim().length < 2) {
      newErrors.projectName = '项目名称至少需要2个字符';
    } else if (formState.projectName.trim().length > 100) {
      newErrors.projectName = '项目名称不能超过100个字符';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * 处理下一步
   */
  const handleNext = async () => {
    // 验证表单
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // TODO: MVP 2.0 - Appwrite权限配置后启用数据库保存
      // 暂时使用本地生成的临时ID，避免anonymous权限问题
      const tempProject: Project = {
        id: `temp-${Date.now()}`, // 临时ID
        name: formState.projectName.trim(),
        industry: formState.industry,
        targetCountry: 'US', // 默认值，Step 1会更新
        salesChannel: 'amazon_fba', // 默认值，Step 1会更新
        userId: 'anonymous',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log('✅ 项目创建成功（本地模式）:', tempProject);

      // 传递项目信息到下一步
      onNext(tempProject);
    } catch (error) {
      console.error('创建项目失败:', error);
      setErrors({ projectName: '创建项目失败，请重试' });
    } finally {
      setLoading(false);
    }
  };

  /**
   * 加载历史项目
   */
  const handleLoadProject = (project: Project) => {
    setFormState({
      projectName: project.name,
      industry: project.industry === 'vape' ? 'vape' : 'pet_food',
      description: '',
    });
  };

  /**
   * 格式化日期
   */
  const formatDate = (dateInput: string | Date) => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* 标题区域 */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          创建成本测算项目
        </h1>
        <p className="text-lg text-gray-600">
          基于GECOM方法论，精准计算跨境电商出海成本
        </p>
      </div>

      {/* 主表单卡片 - Liquid Glass设计 */}
      <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl">
        {/* 装饰性渐变背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 -z-10" />

        <div className="p-8 space-y-6">
          {/* 项目信息标题 */}
          <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
            <div className="p-2 rounded-lg bg-blue-100">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">项目信息</h2>
          </div>

          {/* 项目名称输入 */}
          <div className="space-y-2">
            <label htmlFor="project-name" className="block text-sm font-medium text-gray-700">
              项目名称 <span className="text-red-500">*</span>
            </label>
            <input
              id="project-name"
              type="text"
              value={formState.projectName}
              onChange={(e) => setFormState({ ...formState, projectName: e.target.value })}
              onBlur={validateForm}
              placeholder="例如：益家之宠宠物食品美国市场测算"
              className={`
                w-full px-4 py-3 rounded-xl border-2 transition-all duration-200
                bg-white/50 backdrop-blur-sm
                focus:outline-none focus:ring-4 focus:ring-blue-100
                ${errors.projectName
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-gray-200 focus:border-blue-500'
                }
              `}
            />
            {errors.projectName && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.projectName}</span>
              </div>
            )}
            <p className="text-sm text-gray-500">
              为您的测算项目起一个清晰的名称，方便后续查找和管理
            </p>
          </div>

          {/* 行业类别选择 */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              行业类别 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              {/* Pet Food选项 */}
              <button
                type="button"
                onClick={() => setFormState({ ...formState, industry: 'pet_food' })}
                className={`
                  relative p-6 rounded-xl border-2 transition-all duration-200
                  flex flex-col items-start gap-3
                  ${formState.industry === 'pet_food'
                    ? 'border-blue-500 bg-blue-50/80 shadow-lg scale-105'
                    : 'border-gray-200 bg-white/50 hover:border-gray-300 hover:shadow-md'
                  }
                `}
              >
                {/* 选中指示器 */}
                {formState.industry === 'pet_food' && (
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <ChevronRight className="h-4 w-4 text-white" />
                    </div>
                  </div>
                )}

                <div className="text-4xl">🐾</div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-900">宠物食品</h3>
                  <p className="text-sm text-gray-600 mt-1">Pet Food</p>
                  <p className="text-xs text-gray-500 mt-2">
                    21国完整数据，覆盖关税/VAT/物流/合规
                  </p>
                </div>
              </button>

              {/* Vape选项 */}
              <button
                type="button"
                onClick={() => setFormState({ ...formState, industry: 'vape' })}
                className={`
                  relative p-6 rounded-xl border-2 transition-all duration-200
                  flex flex-col items-start gap-3
                  ${formState.industry === 'vape'
                    ? 'border-purple-500 bg-purple-50/80 shadow-lg scale-105'
                    : 'border-gray-200 bg-white/50 hover:border-gray-300 hover:shadow-md'
                  }
                `}
              >
                {/* 选中指示器 */}
                {formState.industry === 'vape' && (
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                      <ChevronRight className="h-4 w-4 text-white" />
                    </div>
                  </div>
                )}

                <div className="text-4xl">💨</div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-900">电子烟</h3>
                  <p className="text-sm text-gray-600 mt-1">Vape</p>
                  <p className="text-xs text-gray-500 mt-2">
                    8国开放市场数据（11国监管限制暂缓）
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* 产品描述（可选） */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              产品描述 <span className="text-gray-400">(可选)</span>
            </label>
            <textarea
              id="description"
              value={formState.description}
              onChange={(e) => setFormState({ ...formState, description: e.target.value })}
              placeholder="例如：天然无谷狗粮，针对成犬，2kg包装，使用新西兰羊肉..."
              rows={3}
              className="
                w-full px-4 py-3 rounded-xl border-2 border-gray-200
                bg-white/50 backdrop-blur-sm
                focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500
                transition-all duration-200 resize-none
              "
            />
            <p className="text-sm text-gray-500">
              选填，帮助您更好地记录项目信息
            </p>
          </div>
        </div>
      </div>

      {/* 历史项目加载 - 仅在有历史项目时显示 */}
      {existingProjects.length > 0 && (
        <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-white to-gray-50/50 -z-10" />

          <div className="p-6 space-y-4">
            {/* 标题 */}
            <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
              <div className="p-2 rounded-lg bg-gray-100">
                <Clock className="h-5 w-5 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">或从历史项目加载</h3>
            </div>

            {/* 项目列表 */}
            <div className="space-y-2">
              {loadingProjects ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-500" />
                  <p className="text-sm text-gray-600 mt-2">加载历史项目...</p>
                </div>
              ) : (
                existingProjects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => handleLoadProject(project)}
                    className="
                      w-full p-4 rounded-xl border-2 border-gray-200
                      bg-white/50 hover:bg-white hover:border-blue-300 hover:shadow-md
                      transition-all duration-200 text-left
                      flex items-center justify-between group
                    "
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-2xl">
                        {project.industry === 'vape' ? '💨' : '🐾'}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {project.name}
                        </h4>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                          <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                            {project.industry === 'vape' ? '电子烟' : '宠物食品'}
                          </span>
                          {project.createdAt && <span>{formatDate(project.createdAt)}</span>}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 底部操作按钮 */}
      <div className="flex justify-end">
        <button
          onClick={handleNext}
          disabled={loading}
          className="
            px-8 py-4 rounded-xl font-semibold text-white
            bg-gradient-to-r from-blue-600 to-purple-600
            hover:from-blue-700 hover:to-purple-700
            disabled:from-gray-400 disabled:to-gray-400
            shadow-lg hover:shadow-xl
            transition-all duration-200 transform hover:scale-105
            flex items-center gap-3
          "
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              <span>创建中...</span>
            </>
          ) : (
            <>
              <span>下一步：业务场景定义</span>
              <ChevronRight className="h-5 w-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
