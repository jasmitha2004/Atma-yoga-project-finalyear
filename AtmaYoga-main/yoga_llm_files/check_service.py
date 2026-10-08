"""
Quick script to check if the LLM service is running
"""
import requests
import sys

def check_service():
    url = "http://127.0.0.1:8001/health"
    
    try:
        response = requests.get(url, timeout=2)
        if response.status_code == 200:
            print("✅ LLM Service is RUNNING!")
            print(f"   Response: {response.json()}")
            return True
        else:
            print(f"❌ LLM Service returned status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ LLM Service is NOT RUNNING!")
        print("   Please start it with: python app.py")
        return False
    except Exception as e:
        print(f"❌ Error checking service: {e}")
        return False

if __name__ == "__main__":
    print("=" * 50)
    print("Checking LLM Service Status...")
    print("=" * 50)
    if check_service():
        print("\n✅ Service is ready! Chatbot should work.")
        sys.exit(0)
    else:
        print("\n❌ Service is not running. Please start it first.")
        print("\nTo start:")
        print("  cd yoga_llm_files")
        print("  python app.py")
        sys.exit(1)

