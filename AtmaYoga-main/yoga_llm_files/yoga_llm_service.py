"""
Yoga LLM Service using the fine-tuned Llama-3-8b adapter model
"""
import os
from pathlib import Path
import traceback

# Global variables for model and tokenizer
model = None
tokenizer = None
model_loaded = False
model_load_error = None

# Get the directory where this file is located
BASE_DIR = Path(__file__).parent

# Model paths
BASE_MODEL = "unsloth/llama-3-8b-bnb-4bit"
ADAPTER_PATH = str(BASE_DIR)

def load_model():
    """Load the base model and adapter"""
    global model, tokenizer, model_loaded, model_load_error
    
    if model_loaded and model is not None and tokenizer is not None:
        return model, tokenizer
    
    if model_load_error:
        raise Exception(f"Previous model load failed: {model_load_error}")
    
    try:
        print("=" * 60)
        print("Loading AI model... This may take 1-2 minutes on first run.")
        print("=" * 60)
        
        from transformers import AutoModelForCausalLM, AutoTokenizer
        from peft import PeftModel
        import torch
        
        print("Step 1/3: Loading tokenizer...")
        tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL)
        
        print("Step 2/3: Loading base model (this may take a while)...")
        base_model = AutoModelForCausalLM.from_pretrained(
            BASE_MODEL,
            torch_dtype=torch.float16,
            device_map="auto",
            trust_remote_code=True,
        )
        
        print("Step 3/3: Loading fine-tuned adapter from yoga_llm_files...")
        # Load the PEFT adapter
        model = PeftModel.from_pretrained(base_model, ADAPTER_PATH)
        model.eval()
        
        model_loaded = True
        print("=" * 60)
        print("✅ Model loaded successfully!")
        print("=" * 60)
        return model, tokenizer
        
    except Exception as e:
        model_load_error = str(e)
        print("=" * 60)
        print(f"❌ Error loading model: {e}")
        print("=" * 60)
        traceback.print_exc()
        print("=" * 60)
        print("⚠️  Will use fallback responses until model is available")
        print("=" * 60)
        raise

# ===============================
# Load Yoga Knowledge
# ===============================
def load_yoga_knowledge():
    """Load yoga knowledge base"""
    knowledge = {}
    # Try multiple possible locations
    possible_paths = [
        BASE_DIR.parent / "llm" / "yoga_knowledge.txt",  # Old location
        BASE_DIR / "yoga_knowledge.txt",  # New location (if moved)
    ]
    
    knowledge_file = None
    for path in possible_paths:
        if path.exists():
            knowledge_file = path
            break
    
    if not knowledge_file:
        print("⚠️ Warning: yoga_knowledge.txt not found. Asana descriptions will not be available.")
        return knowledge
    
    current_asana = None
    buffer = []
    
    try:
        with open(knowledge_file, "r", encoding="utf-8") as f:
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
    except Exception as e:
        print(f"Error loading yoga knowledge: {e}")
    
    return knowledge

YOGA_KNOWLEDGE = load_yoga_knowledge()

# ===============================
# Asana Recommendation
# ===============================
def recommend_asana_from_mood(text: str):
    """Recommend asana based on mood keywords"""
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

    # No default asana
    return None

# ===============================
# Fallback Response Generator
# ===============================
def generate_fallback_response(user_message: str):
    """Generate a helpful response without the AI model"""
    user_lower = user_message.lower().strip()
    
    # Check for emotional keywords
    asana = recommend_asana_from_mood(user_lower)
    
    # Domain-specific responses
    if "what is yoga" in user_lower or "what's yoga" in user_lower:
        answer = "Yoga is an ancient practice from India that combines physical postures, breathing techniques, meditation, and mindfulness to improve physical, mental, and emotional well-being."
    elif "benefit" in user_lower:
        answer = "Yoga improves flexibility, strength, posture, stress management, mental clarity, emotional balance, and overall health."
    elif "meditation" in user_lower:
        answer = "Meditation is the practice of focusing the mind to achieve calmness, awareness, emotional balance, and mental clarity."
    elif any(word in user_lower for word in ["stress", "stressed", "anxious", "anxiety", "worried"]):
        answer = "I understand you're feeling stressed or anxious. Deep breathing exercises and gentle yoga poses like Balasana (Child's Pose) can help calm your mind and body."
    elif any(word in user_lower for word in ["sad", "depressed", "unhappy", "lonely"]):
        answer = "I'm sorry you're feeling this way. Gentle forward folds and heart-opening poses can help. Consider trying Paschimottanasana or Janu Sirsasana."
    elif any(word in user_lower for word in ["tired", "fatigue", "exhausted", "sleepy"]):
        answer = "When you're feeling tired, restorative poses like Pawanmuktasana can help rejuvenate your energy. Make sure to rest and hydrate as well."
    elif any(word in user_lower for word in ["angry", "mad", "frustrated"]):
        answer = "Anger and frustration can be challenging. Heart-opening poses like Ustrasana (Camel Pose) can help release tension and open your heart."
    elif "hi" in user_lower or "hello" in user_lower or "hey" in user_lower:
        answer = "Hello! I'm your AtmaYoga assistant. I'm here to help you with yoga, meditation, and wellness. How are you feeling today?"
    else:
        answer = "I'm here to help you with yoga and wellness. You can ask me about yoga poses, meditation, or tell me how you're feeling and I'll recommend suitable practices."
    
    # Get asana information if recommended
    asana_info = None
    if asana:
        if asana in YOGA_KNOWLEDGE:
            asana_info = YOGA_KNOWLEDGE[asana]
        else:
            asana_info = f"Recommended asana: {asana}"
    
    return {
        "answer": answer,
        "recommended_asana": asana_info
    }

# ===============================
# Chatbot Function
# ===============================
def yoga_chatbot(user_message: str):
    """
    Main chatbot function that uses the fine-tuned model
    Falls back to rule-based responses if model is not available
    """
    global model, tokenizer, model_loaded
    
    user_message_lower = user_message.lower().strip()
    
    # Try to use AI model if available
    if not model_loaded:
        try:
            print("🤖 Attempting to load AI model...")
            model, tokenizer = load_model()
        except Exception as e:
            print(f"⚠️  Using fallback mode: {e}")
            # Use fallback response
            return generate_fallback_response(user_message)
    
    # If model is loaded, use it
    if model is not None and tokenizer is not None:
        try:
            # Check for emotional keywords
            asana = recommend_asana_from_mood(user_message_lower)
            
            # Create prompt for the model
            if asana:
                prompt = f"""You are a helpful and empathetic yoga assistant. The user is feeling: {user_message}

Respond with empathy and understanding in 1-2 sentences. Be warm, supportive, and encouraging."""
            else:
                prompt = f"""You are a helpful yoga assistant. The user asked: {user_message}

Provide a helpful and informative response about yoga, meditation, or wellness. Keep it concise (2-3 sentences)."""
            
            # Tokenize input
            inputs = tokenizer(prompt, return_tensors="pt", truncation=True, max_length=512)
            
            # Move to same device as model
            import torch
            device = next(model.parameters()).device
            inputs = {k: v.to(device) for k, v in inputs.items()}
            
            # Generate response
            with torch.no_grad():
                outputs = model.generate(
                    **inputs,
                    max_new_tokens=150,
                    temperature=0.7,
                    do_sample=True,
                    top_p=0.9,
                    pad_token_id=tokenizer.eos_token_id
                )
            
            # Decode response
            response = tokenizer.decode(outputs[0], skip_special_tokens=True)
            
            # Extract only the assistant's response (remove the prompt)
            if prompt in response:
                answer = response.split(prompt)[-1].strip()
            else:
                answer = response.strip()
            
            # Clean up the answer
            answer = answer.split("\n")[0].strip()  # Take first line
            if not answer or len(answer) < 10:
                answer = "I'm here to help you with yoga and wellness. How can I assist you today?"
            
            # Get asana information if recommended
            asana_info = None
            if asana:
                if asana in YOGA_KNOWLEDGE:
                    asana_info = YOGA_KNOWLEDGE[asana]
                else:
                    asana_info = f"Recommended asana: {asana}"
            
            return {
                "answer": answer,
                "recommended_asana": asana_info
            }
            
        except Exception as e:
            print(f"⚠️  Error using AI model, falling back: {e}")
            traceback.print_exc()
            # Fall back to rule-based response
            return generate_fallback_response(user_message)
    
    # Fallback if model not available
    return generate_fallback_response(user_message)
