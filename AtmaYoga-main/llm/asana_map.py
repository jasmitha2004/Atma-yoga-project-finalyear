def recommend_asana_from_mood(text: str):
    text = text.lower()

    mood_asana_map = {
        # Stress & Anxiety
        "stress": "Balasana",
        "stressed": "Balasana",
        "anxious": "Baddha Konasana",
        "anxiety": "Baddha Konasana",
        "panic": "Balasana",
        "fear": "Balasana",
        "worried": "Balasana",
        "nervous": "Baddha Konasana",

        # Sadness & Depression
        "sad": "Janu Sirsasana",
        "depressed": "Paschimottanasana",
        "unhappy": "Paschimottanasana",
        "lonely": "Janu Sirsasana",
        "low": "Paschimottanasana",

        # Anger & Frustration
        "angry": "Ustrasana",
        "mad": "Ustrasana",
        "furious": "Ustrasana",
        "frustrated": "Ustrasana",

        # Fatigue & Tiredness
        "tired": "Pawanmuktasana",
        "fatigue": "Pawanmuktasana",
        "exhausted": "Pawanmuktasana",
        "sleepy": "Pawanmuktasana",
        "lazy": "Navasana",

        # Digestion / Heaviness
        "heavy": "Pawanmuktasana",
        "bloated": "Pawanmuktasana",
        "indigestion": "Pawanmuktasana",

        # Focus & Stability
        "weak": "Vajrasana",
        "unstable": "Vajrasana",
        "restless": "Navasana",

        # Sluggishness / Low energy
        "sluggish": "Salamba Bhujangasana",
        "dull": "Salamba Bhujangasana",
        "inactive": "Salamba Bhujangasana",

        # Overthinking / Mental load
        "overthinking": "Adho Mukha Svanasana",
        "overwhelmed": "Adho Mukha Svanasana",
        "overwhelming": "Adho Mukha Svanasana"
    }

    # Return FIRST matching asana
    for keyword, asana in mood_asana_map.items():
        if keyword in text:
            return asana

    # IMPORTANT: No default asana
    return None
