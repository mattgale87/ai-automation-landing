import re

files = {
    r'C:\Users\matt\galeops-site\demo-saas.html': {
        'run_func': 'runSaasAgent',
        'leads_func': 'runSaasLeads',
        'select_func': 'selectSaasScenario',
        'scenarios': ['support', 'churn', 'onboarding'],
    },
    r'C:\Users\matt\galeops-site\demo-ecommerce.html': {
        'run_func': 'runEcAgent',
        'leads_func': 'runEcLeads',
        'select_func': 'selectEcScenario',
        'scenarios': ['cart', 'inventory', 'review'],
    },
    r'C:\Users\matt\galeops-site\demo-agency.html': {
        'run_func': 'runAgencyAgent',
        'leads_func': 'runAgencyLeads',
        'select_func': 'selectAgencyScenario',
        'scenarios': ['reporting', 'campaign', 'onboarding'],
    },
    r'C:\Users\matt\galeops-site\demo-professional.html': {
        'run_func': 'runPSAgent',
        'leads_func': 'runPSLeads',
        'select_func': 'selectPSScenario',
        'scenarios': ['intake', 'compliance', 'proposal'],
    },
    r'C:\Users\matt\galeops-site\demo-healthcare.html': {
        'run_func': 'runHCAgent',
        'leads_func': 'runHCLeads',
        'select_func': 'selectHCScenario',
        'scenarios': ['intake', 'compliance', 'scheduling'],
    },
}

for filepath, cfg in files.items():
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Add onclick attributes back to the Run Agent and Generate Leads buttons
    # Find the button by its current text and add onclick
    content = content.replace(
        f'<button class="btn-agent" id="{cfg["run_func"]}">',
        f'<button class="btn-agent" id="{cfg["run_func"]}" onclick="{cfg["run_func"]}()">'
    )
    content = content.replace(
        f'<button class="btn-run" id="{cfg["leads_func"]}">',
        f'<button class="btn-run" id="{cfg["leads_func"]}" onclick="{cfg["leads_func"]}()">'
    )
    
    # Add onclick to scenario buttons
    for s in cfg['scenarios']:
        # Find the scenario button by its text content and add onclick
        # The buttons have emoji text like "📧 Support Triage"
        emoji_map = {
            'support': '📧', 'churn': '🚨', 'onboarding': '🚀',
            'cart': '🛒', 'inventory': '📦', 'review': '⭐',
            'reporting': '📊', 'campaign': '🎯',
            'intake': '📋', 'compliance': '⚖️', 'proposal': '📄',
            'scheduling': '📅',
        }
        emoji = emoji_map.get(s, '')
        # Find the button text that contains the scenario name
        old = f'<button class="scenario-btn" data-scenario="{s}">'
        new = f'<button class="scenario-btn" data-scenario="{s}" onclick="{cfg["select_func"]}(\'{s}\')">'
        content = content.replace(old, new)
    
    with open(filepath, 'w') as f:
        f.write(content)
    
    print(f"Fixed: {filepath.split(chr(92))[-1]}")

print("\nDone!")
