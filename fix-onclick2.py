import re

files = [
    r'C:\Users\matt\galeops-site\demo-saas.html',
    r'C:\Users\matt\galeops-site\demo-ecommerce.html',
    r'C:\Users\matt\galeops-site\demo-agency.html',
    r'C:\Users\matt\galeops-site\demo-professional.html',
    r'C:\Users\matt\galeops-site\demo-healthcare.html',
]

for filepath in files:
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Remove ALL onclick="..." attributes from ALL elements (not just buttons)
    # This regex matches onclick="..." with any content including parentheses
    content = re.sub(r'\s+onclick\s*=\s*"[^"]*"', '', content)
    
    with open(filepath, 'w') as f:
        f.write(content)
    
    # Verify no onclick attributes remain
    remaining = re.findall(r'onclick\s*=\s*"[^"]*"', content)
    print(f"{filepath.split(chr(92))[-1]}: {len(remaining)} onclick attrs remaining")

print("\nDone!")
