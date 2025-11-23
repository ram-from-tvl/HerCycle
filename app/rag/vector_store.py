"""
Vector store initialization and management using Chroma + Gemini embeddings.
"""
from typing import Optional
import chromadb
from chromadb.config import Settings
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter

from app.config import (
    GEMINI_API_KEY,
    GEMINI_EMBED_MODEL_NAME,
    VECTOR_STORE_PATH
)


# Global vector store and retriever
_vectorstore = None
_retriever = None
_embeddings = None


def _get_embeddings():
    """Get or create embeddings model"""
    global _embeddings
    if _embeddings is None:
        # Set environment variable for Google SDK
        import os
        os.environ["GOOGLE_API_KEY"] = GEMINI_API_KEY
        
        try:
            _embeddings = GoogleGenerativeAIEmbeddings(
                model=GEMINI_EMBED_MODEL_NAME
            )
        except Exception as e:
            print(f"Warning: Failed to initialize Gemini embeddings: {e}")
            print("Falling back to a simple mock embedding for development...")
            # Use a simple mock embedding for development
            from langchain_community.embeddings import FakeEmbeddings
            _embeddings = FakeEmbeddings(size=384)
    return _embeddings


def init_vector_store(
    corpus_dir: str,
    scraped_json: str,
    persist_dir: str = VECTOR_STORE_PATH
) -> None:
    """
    Initialize the vector store with documents from corpus directory and scraped JSON.
    
    Args:
        corpus_dir: Path to directory containing .md/.txt files
        scraped_json: Path to JSON file with scraped resources
        persist_dir: Path where Chroma will persist data
    """
    global _vectorstore, _retriever
    
    print(f"Initializing vector store at {persist_dir}...")
    
    # Get embeddings model
    embeddings = _get_embeddings()
    
    # Load corpus
    from app.rag.corpus_loader import load_corpus
    documents = load_corpus(corpus_dir, scraped_json)
    
    if not documents:
        print("Warning: No documents found for vector store initialization")
        # Create empty vector store
        _vectorstore = Chroma(
            persist_directory=persist_dir,
            embedding_function=embeddings
        )
        _retriever = _vectorstore.as_retriever(search_kwargs={"k": 3})
        return
    
    # Split documents into chunks
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )
    
    chunks = text_splitter.split_documents(documents)
    print(f"Split {len(documents)} documents into {len(chunks)} chunks")
    
    # Create or load vector store
    _vectorstore = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=persist_dir
    )
    
    # Create retriever
    _retriever = _vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 3}
    )
    
    print(f"Vector store initialized with {len(chunks)} chunks")


def get_retriever():
    """
    Get the retriever object for RAG queries.
    
    Returns:
        LangChain retriever object
    """
    if _retriever is None:
        raise RuntimeError("Vector store not initialized. Call init_vector_store first.")
    return _retriever


def query_knowledge(query: str, k: int = 3) -> list[dict]:
    """
    Query the knowledge base and return relevant documents.
    
    Args:
        query: Search query
        k: Number of results to return
        
    Returns:
        List of dicts with 'content' and 'metadata'
    """
    if _vectorstore is None:
        raise RuntimeError("Vector store not initialized. Call init_vector_store first.")
    
    results = _vectorstore.similarity_search(query, k=k)
    
    return [
        {
            "content": doc.page_content,
            "metadata": doc.metadata
        }
        for doc in results
    ]
