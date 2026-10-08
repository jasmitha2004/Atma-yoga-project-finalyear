from yoga_llm import yoga_chatbot

tests = [
    'hungry',
    'I am hungry',
    'I feel hungry',
    'seely',
    'I am sleepy',
    "I'm stressed",
    'feeling anxious',
    'sore',
    'I have a headache',
    'headache',
    'hi',
    'what is yoga?'
]

for t in tests:
    r = yoga_chatbot(t)
    print(f"{t} -> answer: {r['answer']!r} | asana: {r['recommended_asana']!r}")
