"""
Corpus loader - loads documents from filesystem and scraped JSON.
"""
import json
from pathlib import Path
from typing import List
from langchain.docstore.document import Document


def load_corpus(corpus_dir: str, scraped_json: str) -> List[Document]:
    """
    Load documents from corpus directory and scraped resources JSON.
    
    Args:
        corpus_dir: Path to directory with .md/.txt files
        scraped_json: Path to scraped_resources.json
        
    Returns:
        List of LangChain Document objects
    """
    documents = []
    
    # Load files from corpus directory
    corpus_path = Path(corpus_dir)
    if corpus_path.exists():
        for file_path in corpus_path.glob("**/*"):
            if file_path.suffix in [".md", ".txt"] and file_path.is_file():
                try:
                    content = file_path.read_text(encoding="utf-8")
                    doc = Document(
                        page_content=content,
                        metadata={
                            "source": str(file_path),
                            "filename": file_path.name,
                            "type": "corpus_file"
                        }
                    )
                    documents.append(doc)
                except Exception as e:
                    print(f"Warning: Could not load {file_path}: {e}")
    
    # Load scraped resources
    scraped_path = Path(scraped_json)
    if scraped_path.exists():
        try:
            with open(scraped_path, 'r', encoding='utf-8') as f:
                scraped_data = json.load(f)
            
            for item in scraped_data:
                if "content" in item and item["content"]:
                    doc = Document(
                        page_content=item["content"],
                        metadata={
                            "source": item.get("url", "unknown"),
                            "title": item.get("title", ""),
                            "topic": item.get("topic", "general"),
                            "type": "scraped_article"
                        }
                    )
                    documents.append(doc)
        except Exception as e:
            print(f"Warning: Could not load scraped resources: {e}")
    
    print(f"Loaded {len(documents)} documents from corpus and scraped resources")
    return documents
