#!/usr/bin/env python3
"""Show current chatbot mappings and responses"""
from yoga_llm import yoga_chatbot

test_inputs = [
    'I am depressed',
    'I am stressed',
    'I am anxious',
    'I feel sad',
    'I am lonely',
    'I am tired',
    'I am dizzy',
    'I am angry',
    'I am happy',
    'I am overwhelmed',
    'I am scared',
    'what is yoga',
    'hi'
]

print("="*80)
print("CHATBOT RESPONSE MAPPING")
print("="*80)

for test in test_inputs:
    result = yoga_chatbot(test)
    asana = result['recommended_asana'] if result['recommended_asana'] else 'None'
    answer = result['answer'][:60]
    print(f"{test:30} -> Asana: {asana:25} | Answer: {answer}...")

print("\n" + "="*80)
