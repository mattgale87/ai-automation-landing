import re

files = {
    r'C:\Users\matt\galeops-site\demo-saas.html': {
        'prefix': 'saas',
        'scenarios': ['support', 'churn', 'onboarding'],
        'run_func': 'runSaasAgent',
        'leads_func': 'runSaasLeads',
        'select_func': 'selectSaasScenario',
    },
    r'C:\Users\matt\galeops-site\demo-ecommerce.html': {
        'prefix': 'ec',
        'scenarios': ['cart', 'inventory', 'review'],
        'run_func': 'runEcAgent',
        'leads_func': 'runEcLeads',
        'select_func': 'selectEcScenario',
    },
    r'C:\Users\matt\galeops-site\demo-agency.html': {
        'prefix': 'agency',
        'scenarios': ['reporting', 'campaign', 'onboarding'],
        'run_func': 'runAgencyAgent',
        'leads_func': 'runAgencyLeads',
        'select_func': 'selectAgencyScenario',
    },
    r'C:\Users\matt\galeops-site\demo-professional.html': {
        'prefix': 'ps',
        'scenarios': ['intake', 'compliance', 'proposal'],
        'run_func': 'runPSAgent',
        'leads_func': 'runPSLeads',
        'select_func': 'selectPSScenario',
    },
    r'C:\Users\matt\galeops-site\demo-healthcare.html': {
        'prefix': 'hc',
        'scenarios': ['intake', 'compliance', 'scheduling'],
        'run_func': 'runHCAgent',
        'leads_func': 'runHCLeads',
        'select_func': 'selectHCScenario',
    },
}

for filepath, cfg in files.items():
    with open(filepath, 'r') as f:
        content = f.read()
    
    # 1. Remove all onclick="..." attributes from buttons
    content = re.sub(r'\s+onclick="[^"]*"', '', content)
    
    # 2. Replace the old addEventListener block with a clean one
    old_pattern = r'// Expose to global scope for browser automation.*?document\.querySelectorAll\(\'\[onclick\*="select\w+Scenario"\]\)\.forEach\(function\(b\) \{.*?\}\);'
    
    new_block = f"""// Wire buttons via addEventListener (fixes synthetic click dispatch)
document.getElementById('{cfg['run_func']}').addEventListener('click', {cfg['run_func']});
document.getElementById('{cfg['leads_func']}').addEventListener('click', {cfg['leads_func']});"""

    for s in cfg['scenarios']:
        new_block += f"\ndocument.querySelector('[data-scenario=\"{s}\"]').addEventListener('click', function() {{ {cfg['select_func']}('{s}'); }});"
    
    content = re.sub(old_pattern, new_block, content, flags=re.DOTALL)
    
    # 3. Add data-scenario attributes to scenario buttons
    for s in cfg['scenarios']:
        old_btn = f"<button class=\"scenario-btn\" onclick=\"{cfg['select_func']}('{s}')\">"
        new_btn = f"<button class=\"scenario-btn\" data-scenario=\"{s}\">"
        content = content.replace(old_btn, new_btn)
    
    with open(filepath, 'w') as f:
        f.write(content)
    
    print(f"Fixed: {filepath.split(chr(92))[-1]}")

print("\nAll 5 pages fixed!")
