from asana_map import recommend_asana_from_mood

# ===============================
# Mood Intent Keywords
# ===============================
MOOD_KEYWORDS = {
    "stress", "stressed", "anxious", "anxiety",
    "sad", "depressed", "tired", "angry",
    "panic", "fear", "lonely", "overwhelmed",
    "calm", "relax", "peace", "sleep", "worried"
}

# ===============================
# Mood Detection
# ===============================
def is_mood_related(text: str) -> bool:
    text = text.lower()
    for word in MOOD_KEYWORDS:
        if word in text:
            return True
    return False

# ===============================
# Chatbot Function (SIMPLIFIED)
# ===============================
def yoga_chatbot(user_message: str) -> dict:
    """
    Simplified version that only recommends asanas
    based on mood keywords. No heavy LLM loading.
    """
    user_message = user_message.strip()

    # -------- 1. Detect mood intent --------
    mood_intent = is_mood_related(user_message)

    # -------- 2. Simple response --------
    if mood_intent:
        response = "I understand how you feel. Let me suggest a yoga asana to help you."
    else:
        response = "Hello! How can I help you with yoga and wellness today?"

    # -------- 3. Recommend asana if mood detected --------
    asana = None

    if mood_intent:
        asana = recommend_asana_from_mood(user_message)

    # -------- 4. Fallback asana if detection failed --------
    if asana is None and mood_intent:
        asana = "Balasana"  # Default relaxing pose

    return {
        "answer": response,
        "recommended_asana": asana
    }
