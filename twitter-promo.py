#!/usr/bin/env python3
"""
ALI Charity Twitter 自动化发推脚本
用于GitHub Actions
"""

import os
import sys
import random
from datetime import datetime
from requests_oauthlib import OAuth1
import requests

# 推文内容库
TWEETS = [
    "🌍 ALI Charity Platform Launch! Make every donation transparent with blockchain technology. ✅ 100% on-chain tracking ✅ Real-time fund visibility ✅ Governance with ALI tokens Join us: https://43.160.238.228 #CryptoCharity #Blockchain #DeFi #ALIToken",
    "📊 Transparency Dashboard is LIVE! See exactly where your donations go: real-time fund tracking, project progress updates, blockchain-verified transactions. No more black boxes. Full transparency! 🙌 https://43.160.238.228 #Charity #Transparency #Blockchain",
    "🎮 Donate to Mine ALI Tokens! Every 1 USDT donated = 1 ALI token. Platform voting rights, exclusive rewards, NFT airdrops. Your kindness has value! 💎 https://43.160.238.228 #ALIToken #DeFi #Crypto",
    "🤝 Join the Global Charity Movement! 🌍 4 languages supported 🏆 Transparent governance 💎 ALI token rewards Be part of the future of philanthropy! https://43.160.238.228 #Community #CryptoCharity #Web3",
    "📈 Our Impact: ✅ 8 pages ready ✅ Multi-language support ✅ Real-time transparency ✅ 100% blockchain-backed Transparency isn't just a promise. It's code! 🚀 https://43.160.238.228 #ALICharity #BlockchainTransparency",
    "🌍 ALI慈善平台全球启动！让每一笔捐赠都透明可见。✅ 区块链100%可追溯 ✅ 资金实时可见 ✅ ALI代币参与治理 加入我们：https://43.160.238.228 #区块链慈善 #透明捐赠 #DeFi #ALI代币",
    "📊 透明度仪表板上线！实时追踪您的捐赠去向，告别黑箱，全程透明！加入我们：https://43.160.238.228 #慈善 #透明度 #区块链",
    "🎮 捐赠即挖矿，获得ALI代币！每捐赠1 USDT = 1 ALI代币，您的善心有价值！💎 加入我们：https://43.160.238.228 #ALI代币 #DeFi",
]

SERVER_URL = "https://43.160.238.228"

def post_tweet(message):
    print("="*50)
    print("开始发送推文...")
    
    auth = OAuth1(
        os.environ.get('TWITTER_API_KEY', ''),
        client_secret=os.environ.get('TWITTER_API_KEY_SECRET', ''),
        resource_owner_key=os.environ.get('TWITTER_ACCESS_TOKEN', ''),
        resource_owner_secret=os.environ.get('TWITTER_ACCESS_TOKEN_SECRET', '')
    )
    
    try:
        response = requests.post(
            'https://api.twitter.com/1.1/statuses/update.json',
            auth=auth,
            data={"status": message},
            timeout=60
        )
        
        if response.status_code == 200:
            tweet_id = response.json().get("id")
            print(f"✅ 推文发送成功!")
            print(f"   Tweet URL: https://twitter.com/i/status/{tweet_id}")
            return True
        else:
            print(f"❌ 发送失败: {response.status_code}")
            print(f"   {response.text[:200]}")
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
    print(f"📝 推文: {tweet[:50]}...")
    print("")
    
    success = post_tweet(tweet)
    print("🎉 推广完成!" if success else "💥 推广失败!")
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())
