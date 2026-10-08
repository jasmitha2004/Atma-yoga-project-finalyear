"""
Simple test script to verify the service is working
"""
import requests
import json

def test_service():
    base_url = "http://127.0.0.1:8001"
    
    print("=" * 60)
    print("Testing AtmaYoga LLM Service")
    print("=" * 60)
    
    # Test health endpoint
    print("\n1. Testing health endpoint...")
    try:
        response = requests.get(f"{base_url}/health", timeout=5)
        print(f"   ✅ Health check: {response.status_code}")
        print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"   ❌ Health check failed: {e}")
        print("   Make sure the service is running!")
        return False
    
    # Test chat endpoint
    print("\n2. Testing chat endpoint...")
    test_messages = [
        "hi",
        "what is yoga",
        "I'm feeling stressed"
    ]
    
    for msg in test_messages:
        try:
            print(f"\n   Sending: '{msg}'")
            response = requests.post(
                f"{base_url}/chat",
                json={"message": msg},
                headers={"Content-Type": "application/json"},
                timeout=60  # Longer timeout for first request (model loading)
            )
            
            if response.status_code == 200:
                data = response.json()
                print(f"   ✅ Response received:")
                print(f"      Answer: {data.get('answer', 'N/A')[:100]}...")
                if data.get('recommended_asana'):
                    print(f"      Asana: {data.get('recommended_asana')[:100]}...")
            else:
                print(f"   ❌ Error: {response.status_code}")
                print(f"   {response.text}")
                
        except requests.exceptions.Timeout:
            print(f"   ⏳ Request timed out (this is normal on first request while model loads)")
            print(f"   Please wait and try again...")
        except Exception as e:
            print(f"   ❌ Error: {e}")
    
    print("\n" + "=" * 60)
    print("Test complete!")
    print("=" * 60)
    return True

if __name__ == "__main__":
    test_service()

