"""
Web scraper using Trafilatura to fetch and clean article content.
Reads URLs from resources_seed.json and saves cleaned content to scraped_resources.json.
"""
import json
from pathlib import Path
from typing import List, Dict, Any
import httpx
from trafilatura import extract, fetch_url

from app.config import RESOURCES_SEED_PATH, SCRAPED_RESOURCES_PATH


def scrape_sources() -> List[Dict[str, Any]]:
    """
    Scrape URLs from resources_seed.json and extract clean article content.
    
    Returns:
        List of dicts with url, title, topic, content
    """
    seed_path = Path(RESOURCES_SEED_PATH)
    
    if not seed_path.exists():
        print(f"Warning: Seed file not found at {RESOURCES_SEED_PATH}")
        return []
    
    # Load seed URLs
    with open(seed_path, 'r', encoding='utf-8') as f:
        seed_data = json.load(f)
    
    print(f"Loaded {len(seed_data)} URLs to scrape")
    
    scraped_resources = []
    
    for item in seed_data:
        url = item.get("url", "")
        topic = item.get("topic", "general")
        
        if not url:
            continue
        
        try:
            print(f"Scraping {url}...")
            
            # Fetch HTML using trafilatura
            downloaded = fetch_url(url)
            
            if not downloaded:
                print(f"  Failed to download {url}")
                continue
            
            # Extract clean text and metadata
            extracted = extract(
                downloaded,
                include_comments=False,
                include_tables=False,
                with_metadata=True,
                output_format='json'
            )
            
            if extracted:
                # Parse JSON output from trafilatura
                if isinstance(extracted, str):
                    extracted_data = json.loads(extracted)
                else:
                    extracted_data = extracted
                
                resource = {
                    "url": url,
                    "title": extracted_data.get("title", ""),
                    "topic": topic,
                    "content": extracted_data.get("text", ""),
                    "author": extracted_data.get("author", ""),
                    "date": extracted_data.get("date", "")
                }
                
                scraped_resources.append(resource)
                print(f"  ✓ Scraped: {resource['title'][:50]}...")
            else:
                print(f"  Failed to extract content from {url}")
                
        except Exception as e:
            print(f"  Error scraping {url}: {e}")
    
    # Save to JSON
    output_path = Path(SCRAPED_RESOURCES_PATH)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(scraped_resources, f, indent=2, ensure_ascii=False)
    
    print(f"\nSaved {len(scraped_resources)} scraped resources to {SCRAPED_RESOURCES_PATH}")
    
    return scraped_resources


if __name__ == "__main__":
    # Run scraper when executed directly
    results = scrape_sources()
    print(f"Scraping complete. Processed {len(results)} articles.")
