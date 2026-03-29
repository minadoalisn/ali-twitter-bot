#!/usr/bin/env python3
"""
ALI Charity Twitter 自动化发推脚本 - 调试版本
"""

import os
import sys
import random
from datetime import datetime
from requests_oauthlib import OAuth1
import requests

# 推文内容库
TWEETS = [
    "🌍 ALI Charity Platform Launch! Make every donation transparent with blockchain. Join us: https://43.160.238.228 #CryptoCharity #Blockchain",
    "📊 Transparency Dashboard is LIVE! See exactly where your donations go. Full transparency! https://43.160.238.228 #Charity #Blockchain",
    "🎮 Donate to Mine ALI Tokens! Every 1 USDT donated = 1 ALI token. https://43.160.238.228 #ALIToken #DeFi",
]

SERVER_URL = "https://43.160.238.228"

def post_tweet(message):
    print("="*50)
    print("开始发送推文...")
    print(f"消息: {message[:80]}...")
    
    # 获取环境变量
    api_key = os.environ.get('TWITTER_API_KEY', '')
    api_secret = os.environ.get('TWITTER_API_KEY_SECRET', '')
    access_token = os.environ.get('TWITTER_ACCESS_TOKEN', '')
    access_secret = os.environ.get('TWITTER_ACCESS_TOKEN_SECRET', '')
    
    print(f"API Key长度: {len(api_key)}")
    print(f"Access Token长度: {len(access_token)}")
    
    # 创建OAuth1认证
    auth = OAuth1(
        api_key,
        client_secret=api_secret,
        resource_owner_key=access_token,
        resource_owner_secret=access_secret
    )
    
    url = "https://api.twitter.com/1.1/statuses/update.json"
    
    try:
        print(f"发送请求...")
        response = requests.post(
            url,
            auth=auth,
            data={"status": message},
            timeout=60
        )
        
        print(f"响应状态码: {response.status_code}")
        print(f"响应内容: {response.text[:500]}")
        
        if response.status_code == 200:
            tweet_id = response.json().get("id")
            print(f"✅ 推文发送成功!")
            print(f"   Tweet URL: https://twitter.com/i/status/{tweet_id}")
            return True
        else:
            print(f"❌ 发送失败!")
            return False
    except Exception as e:
        print(f"❌ 错误: {str(e)}")
        return False

def main():
    print("="*50)
    print("ALI Charity Twitter 自动化发推系统")
    print("="*50)
    print(f"⏰ 时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("")
    
    tweet = random.choice(TWEETS)
    print(f"📝 推文: {tweet}")
    print("")
    
    success = post_tweet(tweet)
    print("🎉 推广完成!" if success else "💥 推广失败!")
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())
