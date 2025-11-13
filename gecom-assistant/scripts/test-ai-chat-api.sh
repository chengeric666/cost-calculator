#!/bin/bash

# AI聊天API测试脚本
# 测试 /api/chat endpoint是否正常工作

echo "🧪 测试AI聊天API..."
echo ""

# 测试1：简单问题
echo "📝 测试1：发送简单问题"
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "你好，请介绍一下GECOM模型",
    "conversationHistory": [],
    "project": {
      "targetCountry": "US",
      "salesChannel": "amazon_fba",
      "industry": "pet"
    }
  }' \
  | jq '.success, .response' | head -20

echo ""
echo "✅ 测试1完成"
echo ""

# 测试2：工具调用 - 成本拆解
echo "📝 测试2：测试工具调用 - get_cost_breakdown"
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "请分析当前成本结构，找出主要成本驱动因素",
    "conversationHistory": [],
    "project": {
      "targetCountry": "US",
      "salesChannel": "amazon_fba",
      "industry": "pet",
      "scope": {
        "sellingPriceUsd": 39.99,
        "monthlyVolume": 1000,
        "cogsUsd": 12.0,
        "productWeightKg": 2.0,
        "cacUsd": 25.0,
        "repurchaseRate": 0.45
      }
    }
  }' \
  | jq '.success, .messages[-1].content' | head -30

echo ""
echo "✅ 测试2完成"
echo ""

# 测试3：工具调用 - 场景对比
echo "📝 测试3：测试工具调用 - compare_scenarios"
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "对比美国、越南、德国三个市场的毛利率",
    "conversationHistory": [],
    "project": {
      "targetCountry": "US",
      "salesChannel": "amazon_fba",
      "industry": "pet",
      "scope": {
        "sellingPriceUsd": 39.99,
        "monthlyVolume": 1000,
        "cogsUsd": 12.0,
        "productWeightKg": 2.0,
        "cacUsd": 25.0,
        "repurchaseRate": 0.45
      }
    }
  }' \
  | jq '.success, .messages[-1].content' | head -30

echo ""
echo "✅ 测试3完成"
echo ""
echo "🎉 所有测试完成！"
