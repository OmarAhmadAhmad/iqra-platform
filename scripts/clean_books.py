import os
import json
import re

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')

def fix_spelling_and_format(text):
    if not isinstance(text, str):
        return text
    
    # 1. استبدال الصلاة على النبي بالرمز الشريف
    text = re.sub(r'\((?:ص|صلعم)\)', 'ﷺ', text)
    
    # 2. ضبط المسافات الزائدة قبل علامات الترقيم
    text = re.sub(r'\s+([\.،؛:؟!])', r'\1', text)
    
    # 3. تصحيح أخطاء الهمزات والكلمات الشائعة
    corrections = {
        r'\bان\b': 'أن',
        r'\bالى\b': 'إلى',
        r'\bبان\b': 'بأن',
        r'\bانهم\b': 'أنهم',
        r'\bابناء\b': 'أبناء',
        r'\bهذا الكلمات\b': 'هذه الكلمات'
    }
    for pattern, replacement in corrections.items():
        text = re.sub(pattern, replacement, text)
        
    return text

def process_json_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # معالجة النصوص سواء كانت قائمة أو نصاً
        def clean_recursive(obj):
            if isinstance(obj, str):
                return fix_spelling_and_format(obj)
            elif isinstance(obj, list):
                return [clean_recursive(item) for item in obj]
            elif isinstance(obj, dict):
                return {k: clean_recursive(v) for k, v in obj.items()}
            return obj

        cleaned_data = clean_recursive(data)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(cleaned_data, f, ensure_ascii=False, indent=2)
            
        print(f"✅ تم تنظيف وتنسيق: {os.path.basename(file_path)}")
    except Exception as e:
        print(f"❌ خطأ في الملف {os.path.basename(file_path)}: {e}")

def main():
    if not os.path.exists(DATA_DIR):
        print("لم يتم العثور على مجلد data!")
        return

    for filename in os.listdir(DATA_DIR):
        if filename.endswith('.json'):
            process_json_file(os.path.join(DATA_DIR, filename))

if __name__ == '__main__':
    main()
