"""
build_quiz.py - Build the AI Security Quiz HTML by injecting questions.json into index.html
"""

import json
import os
import re

base = r'C:\Users\matt\galeops-site\quiz'

# Load questions
with open(os.path.join(base, 'questions.json')) as f:
    quiz_data = json.load(f)

# Read template
with open(os.path.join(base, 'index.html')) as f:
    html = f.read()

# Inject QUIZ_DATA (escape any </script> in data to prevent injection)
quiz_json = json.dumps(quiz_data).replace('</', '<\\/')

# Replace placeholder
html = html.replace('__QUIZ_DATA__', quiz_json)

# Write final output
output = os.path.join(base, 'index.html')
with open(output, 'w') as f:
    f.write(html)

print(f"✅ Quiz built: {output}")
print(f"   Size: {os.path.getsize(output):,} bytes")
print(f"   Questions: {len(quiz_data['questions'])}")
print(f"   Tiers: {len(quiz_data['scoring']['tiers'])}")
print()
print("Ready to deploy:")
print("  - The HTML is self-contained")
print("  - Email capture posts to Modal endpoint (need to update URL after backend deployed)")
print("  - Netlify Forms integration can be added separately")