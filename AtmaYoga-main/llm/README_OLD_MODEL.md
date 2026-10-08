# ⚠️ Old LLM Model - No Longer Used

This folder contains the **old LLM implementation** that is no longer in use.

## Migration

The LLM service has been migrated to use the new fine-tuned model in `yoga_llm_files/`.

### Old Implementation
- Location: `llm/`
- Model: `google/flan-t5-small`
- Service: FastAPI on port 8000

### New Implementation
- Location: `yoga_llm_files/`
- Model: Fine-tuned Llama-3-8b (PEFT adapter)
- Service: FastAPI on port 8000

## What Changed

1. **Model**: Changed from `google/flan-t5-small` to fine-tuned `llama-3-8b-bnb-4bit`
2. **Service Location**: Moved from `llm/app.py` to `yoga_llm_files/app.py`
3. **Model Loading**: Now uses PEFT adapter loading instead of simple pipeline

## Files in This Folder

- `app.py` - Old FastAPI service (replaced)
- `yoga_llm.py` - Old model implementation (replaced)
- `asana_map.py` - Asana recommendation logic (still used by new service)
- `yoga_knowledge.txt` - Yoga knowledge base (still used by new service)
- Other files - Old implementation files

## Note

The `asana_map.py` and `yoga_knowledge.txt` files are still referenced by the new service, so they should be kept in this location or moved to `yoga_llm_files/` if you want to clean up.

## Cleanup

If you want to remove this folder:
1. Ensure `yoga_knowledge.txt` is copied to `yoga_llm_files/` or update the path in `yoga_llm_service.py`
2. Delete this folder

Otherwise, you can keep it for reference.

