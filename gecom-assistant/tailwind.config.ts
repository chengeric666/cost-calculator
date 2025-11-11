import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 专业蓝 - 主色调（用于主按钮、导航、关键指标）
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',  // 主色
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // 活力橙 - 强调色（用于CTA按钮、高亮数据、AI助手）
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',  // 主色
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // 正向绿 - 成功色（用于毛利率健康、ROI达标）
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',  // 主色
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        // 风险红 - 危险色（用于警告信息、成本过高）
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',  // 主色
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // 警告黄 - 警告色（用于中等风险提示）
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // 高级灰 - 中性色（用于背景、辅助文字）
        neutral: {
          50: '#f9fafb',   // 背景
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',  // 文字
          900: '#111827',
        },
      },
      // 等宽数字字体配置（用于表格对齐、金额显示）
      fontVariantNumeric: {
        tabular: 'tabular-nums',
      },
      fontFamily: {
        sans: [
          'PingFang SC',
          'Microsoft YaHei',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'SF Mono',
          'Monaco',
          'Cascadia Code',
          'Consolas',
          'monospace',
        ],
      },
      // Liquid Glass 多层阴影系统
      boxShadow: {
        'glass-sm': '0 2px 4px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
        'glass': '0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.08)',
        'glass-md': '0 6px 12px rgba(0, 0, 0, 0.08), 0 3px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.12)',
        'glass-lg': '0 12px 24px rgba(0, 0, 0, 0.1), 0 6px 12px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.14)',
        'glass-xl': '0 20px 40px rgba(0, 0, 0, 0.12), 0 10px 20px rgba(0, 0, 0, 0.14), 0 4px 10px rgba(0, 0, 0, 0.16)',
      },
      // 边框圆角
      borderRadius: {
        'glass': '16px',
        'glass-lg': '24px',
      },
      // 毛玻璃背景模糊
      backdropBlur: {
        'glass': '12px',
        'glass-lg': '24px',
      },
      // 间距系统（8px基线）
      spacing: {
        '18': '4.5rem',  // 72px
        '22': '5.5rem',  // 88px
      },
      // 动画时长
      transitionDuration: {
        '400': '400ms',
      },
    },
  },
  plugins: [],
};

export default config;
