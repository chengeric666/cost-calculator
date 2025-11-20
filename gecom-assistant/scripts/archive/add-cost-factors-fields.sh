#!/bin/bash
set -e

# Load env
source .env.local 2>/dev/null || true

DB_ID="${NEXT_PUBLIC_APPWRITE_DATABASE}"
COL_ID="cost_factors"

echo "📝 添加cost_factors字段..."
echo ""

# 基础字段 (5个)
echo "添加基础字段 (5个)..."
npx appwrite databases create-string-attribute \
  --database-id "$DB_ID" --collection-id "$COL_ID" \
  --key country --size 10 --required true

npx appwrite databases create-string-attribute \
  --database-id "$DB_ID" --collection-id "$COL_ID" \
  --key country_name_cn --size 50 --required true

npx appwrite databases create-string-attribute \
  --database-id "$DB_ID" --collection-id "$COL_ID" \
  --key country_flag --size 10 --required false

npx appwrite databases create-string-attribute \
  --database-id "$DB_ID" --collection-id "$COL_ID" \
  --key industry --size 50 --required true --default "pet_food"

npx appwrite databases create-string-attribute \
  --database-id "$DB_ID" --collection-id "$COL_ID" \
  --key version --size 20 --required true --default "2025Q1"

echo "✅ 基础字段添加完成"

