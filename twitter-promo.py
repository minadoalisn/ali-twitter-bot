#!/usr/bin/env python3
"""测试Secrets是否正确配置"""

import os

print("="*50)
print("测试 Twitter API Secrets 配置")
print("="*50)

# 检查环境变量
api_key = os.environ.get('TWITTER_API_KEY', '')
api_secret = os.environ.get('TWITTER_API_KEY_SECRET', '')
access_token = os.environ.get('TWITTER_ACCESS_TOKEN', '')
access_secret = os.environ.get('TWITTER_ACCESS_TOKEN_SECRET', '')

print(f"\nTWITTER_API_KEY: {'已设置 ✓' if api_key else '未设置 ✗'}")
print(f"TWITTER_API_KEY_SECRET: {'已设置 ✓' if api_secret else '未设置 ✗'}")
print(f"TWITTER_ACCESS_TOKEN: {'已设置 ✓' if access_token else '未设置 ✗'}")
print(f"TWITTER_ACCESS_TOKEN_SECRET: {'已设置 ✓' if access_secret else '未设置 ✗'}")

if all([api_key, api_secret, access_token, access_secret]):
    print("\n✅ 所有Secrets已配置!")
    print(f"\nAPI Key: {api_key[:10]}...")
    print(f"Access Token: {access_token[:20]}...")
else:
    print("\n❌ Secrets未完全配置")
    print("请在GitHub仓库的Settings → Secrets and variables → Actions中添加")
    exit(1)
