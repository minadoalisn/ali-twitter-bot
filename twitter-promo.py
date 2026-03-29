#!/usr/bin/env python3
"""
ALI Charity Twitter 自动化发推脚本
用于GitHub Actions
"""

import os
import sys
import random
from datetime import datetime

# Twitter API 库
from requests_oauthlib import OAuth1
import requests

# ========================================
# 推文内容库
# ========================================
TWEETS = [
    # 英文推文
    "🌍 ALI Charity Platform Launch! Make every donation transparent with blockchain technology. ✅ 100% on-chain tracking ✅ Real-time fund visibility ✅ Governance with ALI tokens Join us: https://43.160.238.228 #CryptoCharity #Blockchain #DeFi #ALIToken",
    "📊 Transparency Dashboard is LIVE! See exactly where your donations go: real-time fund tracking, project progress updates, blockchain-verified transactions. No more black boxes. Full transparency! 🙌 https://43.160.238.228 #Charity #Transparency #Blockchain",
    "🎮 Donate to Mine ALI Tokens! Every 1 USDT donated = 1 ALI token. Platform voting rights, exclusive rewards, NFT airdrops. Your kindness has value! 💎 https://43.160.238.228 #ALIToken #DeFi #Crypto",
    "🤝 Join the Global Charity Movement! 🌍 4 languages supported 🏆 Transparent governance 💎 ALI token rewards Be part of the future of philanthropy! https://43.160.238.228 #Community #CryptoCharity #Web3",
    "📈 Our Impact: ✅ 8 pages ready ✅ Multi-language support (CN/EN/AR/TH) ✅ Real-time transparency ✅ 100% blockchain-backed Transparency isn't just a promise. It's code! 🚀 https://43.160.238.228 #ALICharity #BlockchainTransparency",
    # 中文推文
    "🌍 ALI慈善平台全球启动！让每一笔捐赠都透明可见。✅ 区块链100%可追溯 ✅ 资金实时可见 ✅ ALI代币参与治理 加入我们：https://43.160.238.228 #区块链慈善 #透明捐赠 #DeFi #ALI代币",
    "📊 透明度仪表板上线！实时追踪您的捐赠去向，告别黑箱，全程透明！加入我们：https://43.160.238.228 #慈善 #透明度 #区块链",
    "🎮 捐赠即挖矿，获得ALI代币！每捐赠1 USDT = 1 ALI代币，您的善心有价值！💎 加入我们：https://43.160.238.228 #ALI代币 #DeFi",
    # 阿拉伯文推文
    "🌍 إطلاق ALI Charity عالميًا! اجعل كل تبرع شفافًا مع تقنية البلوكتشين انضم إلينا: https://43.160.238.228 #العملات_الرقمية #الشفافية #الخيرية",
    # 泰文推文
    "🌍 เปิดตัว ALI Charity ทั่วโลก! ทำให้การบริจาคโปร่งใสด้วยเทคโนโลยีบล็อกเชน เข้าร่วมเรา: https://43.160.238.228 #CryptoCharity #Blockchain",
]

# 服务器地址
SERVER_URL = "https://43.160.238.228"

# ========================================
# 函数：发送推文
# ========================================
def post_tweet(message):
    """发送推文到Twitter"""
    print("="*50)
    print("开始发送推文...")
    print(f"推文内容: {message[:50]}...")
    
    # 获取API密钥
    api_key = os.environ.get('TWITTER_API_KEY', '')
    api_secret = os.environ.get('TWITTER_API_KEY_SECRET', '')
    access_token = os.environ.get('TWITTER_ACCESS_TOKEN', '')
    access_secret = os.environ.get('TWITTER_ACCESS_TOKEN_SECRET', '')
    
    print(f"API Key存在: {bool(api_key)}")
    print(f"API Secret存在: {bool(api_secret)}")
    print(f"Access Token存在: {bool(access_token)}")
    print(f"Access Secret存在: {bool(access_secret)}")
    
    # 创建OAuth1认证
    auth = OAuth1(
        api_key,
        client_secret=api_secret,
        resource_owner_key=access_token,
        resource_owner_secret=access_secret
    )
    
    # Twitter API v1.1 端点
    url = "https://api.twitter.com/1.1/statuses/update.json"
    
    # 发送请求
    try:
        print(f"发送请求到: {url}")
        response = requests.post(
            url,
            auth=auth,
            data={"status": message},
            timeout=60
        )
        
        print(f"响应状态码: {response.status_code}")
        print(f"响应内容: {response.text[:500]}")
        
        # 检查响应
        if response.status_code == 200:
            data = response.json()
            tweet_id = data.get("id", "N/A")
            print(f"✅ 推文发送成功!")
            print(f"   Tweet ID: {tweet_id}")
            print(f"   Tweet URL: https://twitter.com/i/status/{tweet_id}")
            return True
        else:
            print(f"❌ 推文发送失败!")
            print(f"   状态码: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ 发送出错: {str(e)}")
        import traceback
        traceback.print_exc()
        return False
    except Exception as e:
        print(f"❌ 发送出错: {str(e)}")
        return False

# ========================================
# 主程序
# ========================================
def main():
    print("="*50)
    print("ALI Charity Twitter 自动化发推系统")
    print("="*50)
    print(f"⏰ 时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"🌐 服务器: {SERVER_URL}")
    print("")
    
    # 验证API密钥
    if not all([os.environ.get('TWITTER_API_KEY'), os.environ.get('TWITTER_API_KEY_SECRET'), os.environ.get('TWITTER_ACCESS_TOKEN'), os.environ.get('TWITTER_ACCESS_TOKEN_SECRET')]):
        print("❌ 错误: Twitter API密钥未配置")
        print("请设置环境变量:")
        print("  TWITTER_API_KEY")
        print("  TWITTER_API_KEY_SECRET")
        print("  TWITTER_ACCESS_TOKEN")
        print("  TWITTER_ACCESS_TOKEN_SECRET")
        return 1
    
    # 选择推文（随机）
    tweet = random.choice(TWEETS)
    
    print("📝 推文内容:")
    print("-" * 50)
    print(tweet)
    print("-" * 50)
    print("")
    
    # 发送推文
    success = post_tweet(tweet)
    
    if success:
        print("")
        print("🎉 推广完成!")
        print("="*50)
        return 0
    else:
        print("")
        print("💥 推广失败!")
        print("="*50)
        return 1

if __name__ == "__main__":
    sys.exit(main())
