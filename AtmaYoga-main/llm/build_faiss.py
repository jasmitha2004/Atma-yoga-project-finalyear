# llm/build_faiss.py

from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings

# ===============================
# Load yoga knowledge text
# ===============================
loader = TextLoader("yoga_knowledge.txt", encoding="utf-8")
documents = loader.load()

print(f"Loaded documents: {len(documents)}")

# ===============================
# Split into chunks
# ===============================
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50
)

docs = text_splitter.split_documents(documents)
print(f"Chunks created: {len(docs)}")

# ===============================
# Create embeddings
# ===============================
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# ===============================
# Build FAISS vector store
# ===============================
vectorstore = FAISS.from_documents(docs, embeddings)

# ===============================
# Save FAISS DB
# ===============================
vectorstore.save_local("yoga_faiss_db")

print("✅ FAISS Vector DB saved successfully")
