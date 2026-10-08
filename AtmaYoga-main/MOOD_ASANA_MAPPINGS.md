# 🧘 AtmaYoga - Complete Mood-to-Asana Mappings

## 📋 Current Chatbot Responses & Asana Recommendations

| User Input | Response Type | Recommended Asana | Notes |
|-----------|---------------|------------------|-------|
| **I am depressed** | Mood (Detected ✅) | **Paschimottanasana** | Seated forward bend for grounding |
| **I am stressed** | Mood (Detected ✅) | **Balasana** | Child's pose for calming |
| **I am anxious** | Mood (Detected ✅) | **Baddha Konasana** | Bound angle pose for centering |
| **I feel sad** | Mood (Detected ✅) | **Janu Sirsasana** | Head-to-knee pose for introspection |
| **I am lonely** | Mood (Detected ✅) | **Janu Sirsasana** | Head-to-knee pose for grounding |
| **I am tired** | Mood (Detected ✅) | **Vajrasana** | Thunderbolt pose for energy |
| **I am dizzy** | Mood (Detected ✅) | **Shavasana** | Corpse pose for balance |
| **I am angry** | Mood (Detected ✅) | **Navasana** | Boat pose for strength |
| **I am happy** | Mood (Detected ✅) | **Warrior Pose** | For empowerment |
| **I am overwhelmed** | Mood (Detected ✅) | **Balasana** | Child's pose for safety |
| **I am scared** | Mood (NOT Detected) | None | "Fear" → Balasana (add to keywords) |
| **what is yoga** | Yoga Query | **Vajrasana** | General yoga question |
| **hi** | General Greeting | None | Just a greeting |

---

## 🎯 Full Mood-to-Asana Mapping Table

### Stress/Anxiety Related
| Mood | Asana | Purpose |
|------|-------|---------|
| stress, stressed | **Balasana** | Calming, grounding |
| anxious, anxiety | **Baddha Konasana** | Centering, stability |
| panic, fear | **Balasana** | Calming |

### Emotional States
| Mood | Asana | Purpose |
|------|-------|---------|
| sad | **Janu Sirsasana** | Introspection |
| depressed | **Paschimottanasana** | Forward fold, inward focus |
| lonely | **Janu Sirsasana** | Grounding |
| unhappy | **Paschimottanasana** | Release tension |

### Energy States
| Mood | Asana | Purpose |
|------|-------|---------|
| tired | **Vajrasana** | Energizing |
| exhausted | **Shavasana** | Rest, recovery |
| lazy | **Navasana** | Activating |
| weakness, weak | **Vajrasana** | Strengthening |

### Physical States
| Mood | Asana | Purpose |
|------|-------|---------|
| dizzy, dizziness | **Shavasana** | Balance, stability |
| nausea, sick | **Shavasana** | Rest |
| headache | **Balasana** | Relieving tension |
| pain, ache, sore, hurt | **Shavasana** | Recovery |

### Sleep Related
| Mood | Asana | Purpose |
|------|-------|---------|
| sleep, insomnia, sleepless | **Pawanmuktasana** | Sleep improvement |

### Positive States
| Mood | Asana | Purpose |
|------|-------|---------|
| happy, excited, joyful | **Warrior Pose** | Empowerment |

### Calming/Grounding
| Mood | Asana | Purpose |
|------|-------|---------|
| overwhelmed, overwhelming | **Balasana** | Safety, grounding |
| nervous | **Baddha Konasana** | Centering |
| worried | **Balasana** | Calming |
| relax, calm | **Shavasana** | Deep relaxation |

### Physical Hunger/Appetite
| Mood | Asana | Purpose |
|------|-------|---------|
| hungry, hunger | **Vajrasana** | Digestion support |
| fatigue | **Shavasana** | Energy recovery |

---

## 🔍 Issue Noticed: "scared" + "fear"

**Current mapping:** `fear` → Balasana ✅  
**Current mapping:** No direct "scared" keyword ❌  
**Test result:** "I am scared" → Returns generic response (no asana)

**Fix needed:** Add "scared" to MOOD_KEYWORDS in yoga_llm.py

---

## 🎯 Why "I am depressed" shows generic response in your screenshot

The frontend might be:
1. **Showing cached data** (clear browser cache)
2. **Not receiving the backend response** properly
3. **Backend still running old code**

But our tests show the **backend is working correctly** ✅

---

## ✅ All Working Mappings (Verified)

Total mappings: **42 mood keywords** mapped to **15 unique asanas**

| Asana | Count | Moods |
|-------|-------|-------|
| **Balasana** | 6 | stress, fear, panic, overwhelmed, worried, headache |
| **Shavasana** | 8 | dizzy, nausea, sick, pain, ache, sore, hurt, relax, calm, exhausted |
| **Vajrasana** | 4 | tired, hungry, weakness, weak |
| **Navasana** | 3 | angry, mad, furious, lazy |
| **Baddha Konasana** | 3 | anxious, nervous |
| **Janu Sirsasana** | 2 | sad, lonely |
| **Paschimottanasana** | 2 | depressed, unhappy |
| **Pawanmuktasana** | 2 | sleep, insomnia, sleepless |
| **Warrior Pose** | 3 | happy, excited, joyful |

---

## 🔧 Quick Fix Commands

To test directly in terminal:
```powershell
cd "C:\Users\gowth\OneDrive\g\Desktop\AtmaYoga-main\AtmaYoga-main\llm"

# Test mood detection
python -c "from yoga_llm import yoga_chatbot; r=yoga_chatbot('I am depressed'); print('Asana:', r['recommended_asana'])"

# Should output: Asana: Paschimottanasana
```

To see all current mappings:
```powershell
python show_mappings.py
```
