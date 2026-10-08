from transformers import pipeline
from asana_map import recommend_asana_from_mood

# ===============================
# LLM – ONLY for empathy
# ===============================
llm = pipeline(
    "text2text-generation",
    model="google/flan-t5-small",
    max_length=80,
    do_sample=False
)

# ===============================
# Load Yoga Knowledge
# ===============================
def load_yoga_knowledge():
    knowledge = {}
    current_asana = None
    buffer = []

    with open("yoga_knowledge.txt", "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue

            # Asana heading
            if "(" in line and line.endswith("):"):
                if current_asana:
                    knowledge[current_asana] = "\n".join(buffer)
                current_asana = line.split(" (")[0]
                buffer = [line]
            else:
                buffer.append(line)

        if current_asana:
            knowledge[current_asana] = "\n".join(buffer)

    return knowledge


YOGA_KNOWLEDGE = load_yoga_knowledge()

# ===============================
# STATIC DOMAIN ANSWERS
# ===============================
DOMAIN_ANSWERS = {
    "what is yoga": (
        "Yoga is an ancient practice from India that combines physical postures, "
        "breathing techniques, meditation, and mindfulness to improve physical, "
        "mental, and emotional well-being."
    ),

    "benefits of yoga": (
        "Yoga improves flexibility, strength, posture, stress management, mental "
        "clarity, emotional balance, and overall health."
    ),

    "what is meditation": (
        "Meditation is the practice of focusing the mind to achieve calmness, "
        "awareness, emotional balance, and mental clarity."
    ),

    "how does yoga help mental health": (
        "Yoga helps mental health by calming the nervous system, reducing stress, "
        "improving mood, increasing self-awareness, and promoting relaxation."
    )
}

# ===============================
# INTENT DETECTION (FIXED)
# ===============================
EMOTION_KEYWORDS = {
    "stress", "stressed",
    "anxiety", "anxious",
    "panic", "fear", "worried", "nervous",
    "sad", "depressed", "unhappy", "lonely",
    "tired", "fatigue", "exhausted",
    "angry", "mad", "furious",
    "insomnia", "sleepless",
    "relax", "calm", "overwhelmed"
}

def normalize(text: str) -> str:
    return text.lower().strip().replace("?", "").replace(".", "")

def is_emotional(text: str) -> bool:
    text = normalize(text)
    return any(word in text for word in EMOTION_KEYWORDS)

def is_domain_question(text: str) -> str | None:
    text = normalize(text)
    for key in DOMAIN_ANSWERS:
        if key in text:
            return key
    return None

# ===============================
# CHATBOT
# ===============================
def yoga_chatbot(user_message: str):
    user_message = normalize(user_message)

    # 🔹 Emotional → empathy + asana
    if is_emotional(user_message):
        asana = recommend_asana_from_mood(user_message)

        empathy_prompt = f"""
Respond empathetically in 1–2 sentences.

User: {user_message}
Assistant:
"""
        empathy = llm(empathy_prompt)[0]["generated_text"].strip()

        return {
            "answer": empathy,
            "recommended_asana": YOGA_KNOWLEDGE.get(asana)
        }

    # 🔹 Domain question → static answer
    domain_key = is_domain_question(user_message)
    if domain_key:
        return {
            "answer": DOMAIN_ANSWERS[domain_key],
            "recommended_asana": None
        }

    # 🔹 Fallback
    return {
        "answer": "You can ask about yoga or tell me how you are feeling.",
        "recommended_asana": None
    }
