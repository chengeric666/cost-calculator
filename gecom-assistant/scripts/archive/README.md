# 归档脚本说明

本目录包含开发过程中的测试脚本和已废弃的实现，仅供参考。

## 归档原因

### 测试/诊断脚本
- `check-collections.ts` - Collection存在性检查（已被verify-database-setup.ts替代）
- `test-permissions.ts` - API权限测试（问题已解决，不再需要）
- `create-one-collection.ts` - 单个Collection创建测试
- `list-collections-simple.ts` - 简单查询测试

### 废弃实现
- `setup-database.ts` - 原始并行创建脚本（有并发问题，已被顺序创建替代）
- `import-data.ts` - 旧版数据导入（已被import-5-countries-data.ts替代）
- `add-cost-factors-fields.sh` - Shell脚本实现（改用TypeScript实现）

## 重要经验教训

### Appwrite并发操作问题
**问题**: 使用Promise.all()并行创建Collections时报"authorization error"
**原因**: Appwrite对并发操作有限制，并非API权限问题
**解决**: 改用顺序创建（for循环 + await）

**示例**:
```typescript
// ❌ 失败：并行创建
await Promise.all([
  databases.createCollection(...),
  databases.createCollection(...),
]);

// ✅ 成功：顺序创建
for (const col of collections) {
  await databases.createCollection(...);
}
```

---

**最后更新**: 2025-11-09
**归档时间**: MVP 2.0 Week 1 Day 5
