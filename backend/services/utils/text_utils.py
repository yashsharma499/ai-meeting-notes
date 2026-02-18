import re
import unicodedata

def normalize_text(text: str) -> str:
    if not text:
        return ""
    
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    
    text = text.replace("–", "-").replace("—", "-").replace("−", "-")
    
    text = re.sub(r"\s+", " ", text)
    
    return text.strip().lower()
