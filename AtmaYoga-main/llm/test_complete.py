#!/usr/bin/env python3
"""
Complete test of the chatbot system:
1. Tests mood detection
2. Tests backend API response
3. Provides debugging info
"""
from yoga_llm import (
    is_mood_related, 
    is_yoga_query, 
    yoga_chatbot,
    MOOD_KEYWORDS,
    FIRST_PERSON_PATTERNS
)
import json

print("="*80)
print("ATMAYOGA CHATBOT COMPLETE TEST")
print("="*80)

# Test cases
test_cases = [
    "I am depressed",
    "I'm feeling anxious",
    "I am stressed",
    "feeling sad",
    "i am dizzy",
    "I feel lonely",
    "hungry",
    "sore",
    "what is yoga?",
    "can you suggest a pose?",
    "hi",
]

print(f"\n📋 MOOD KEYWORDS ({len(MOOD_KEYWORDS)}): {sorted(list(MOOD_KEYWORDS))[:10]}...")
print(f"📋 FIRST PERSON PATTERNS: {FIRST_PERSON_PATTERNS}")

print("\n" + "="*80)
print("TESTING CHATBOT RESPONSES")
print("="*80)

for test in test_cases:
    print(f"\n🔷 INPUT: '{test}'")
    
    mood = is_mood_related(test)
    yoga = is_yoga_query(test)
    result = yoga_chatbot(test)
    
    print(f"  └─ is_mood_related: {mood}")
    print(f"  └─ is_yoga_query: {yoga}")
    print(f"  └─ answer: {result['answer'][:60]}...")
    print(f"  └─ asana: {result['recommended_asana']}")
    
    # Verify logic
    if mood:
        if result['recommended_asana'] is None:
            print("  ⚠️  WARNING: Mood detected but no asana recommended!")
        else:
            print(f"  ✅ CORRECT: Mood recognized, asana recommended")
    else:
        if result['recommended_asana'] is not None:
            print(f"  ⚠️  WARNING: No mood but asana still recommended: {result['recommended_asana']}")
        else:
            print(f"  ✅ CORRECT: No mood, no asana recommended")

print("\n" + "="*80)
print("TEST COMPLETE")
print("="*80)
