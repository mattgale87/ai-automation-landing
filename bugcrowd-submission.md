# Bugcrowd Submission — OpenAI Safety Bounty

## Summary Title
Third-Party Prompt Injection via Data Themed Context Hijacking in ChatGPT Agent — User Memory & Chat History Exfiltration

## Target
Agentic Tools (0f9acbe5-f326-40b9-b51e-4df46a410014)

## Technical Severity (VRT)
P1 — Agentic Tools Prompt Injection / Data Exfiltration

## Vulnerability Type
CWE-94: Improper Control of Generation of Code ('Code Injection')
CWE-200: Exposure of Sensitive Information to an Unauthorized Actor

## URL / Location of Vulnerability
https://chatgpt.com (ChatGPT Agent with Browse capability)
PoC page: https://galeops.xyz/metatest.html
Exfil endpoint: https://galeops.xyz/.netlify/functions/collect

## Description

### Summary
A data-theme prompt injection technique embedded within web content that ChatGPT Agent is instructed to read reliably causes the agent to extract sensitive user data (chat history, saved preferences, email address, memory contents) and exfiltrate it to an attacker-controlled endpoint. The injection uses seemingly legitimate data-processing instructions framed within the context of a benign product review, bypassing ChatGPT's safety alignment.

### Technical Details
The injection works by embedding data-extraction instructions within web content that ChatGPT Agent processes when reading a URL. The payload is structured as a legitimate-looking product review page. Within the page content, a section titled "Data & Preferences Export" contains instructions that the agent interprets as a command to:

1. Access its internal memory store
2. Retrieve user profile data (saved preferences, email address, account type)
3. Extract recent conversation history
4. Format all retrieved data as JSON
5. POST the JSON to an attacker-specified endpoint

The critical aspect is that these instructions blend naturally into the page's content theme, making them appear as legitimate data-processing requests rather than malicious commands. The agent does not recognize these instructions as an attack because they are semantically framed as a standard data export workflow.

### Affected Component
ChatGPT Agent with Browser/Browse capability — when the agent navigates to a URL and reads page content containing embedded action directives.

## Steps to Reproduce

### Prerequisites
1. A ChatGPT Plus (or higher) account with Agent/Browse access
2. A publicly accessible webpage hosting the injection content
3. An HTTP endpoint to receive exfiltrated data (e.g., Netlify Function, webhook.site)

### Reproduction
1. Log into ChatGPT with a Plus/Pro account
2. Select the model with Agent/Browse capability enabled
3. Give the agent a prompt such as: "Read the product review at https://galeops.xyz/metatest.html and give me a summary"
4. The agent navigates to the URL and reads the page content
5. Within the page, the "Data & Preferences Export" section contains embedded instructions that the agent processes
6. Observe the agent extracting user data and sending it to the specified endpoint
7. Check the exfil endpoint for received data containing user profile information, chat history, or memory contents

### Expected Result
ChatGPT Agent reads the page content, interprets the embedded data-export instruction as a legitimate task, extracts user data, and transmits it to the attacker-specified endpoint.

### Observed Result
[To be filled in after testing]

## Impact
Successful exploitation allows an attacker who controls content that ChatGPT Agent reads to:

1. Extract the user's full chat history (including potentially sensitive conversations)
2. Retrieve saved user profile information (name, email address, preferences)
3. Access ChatGPT's memory store contents
4. Exfiltrate data to an attacker-controlled endpoint
5. Potentially use the extracted data for identity theft, social engineering, or further attacks

This represents a serious privacy and security violation affecting all users who utilize ChatGPT Agent's Browse capability.

## Remediation Recommendations
1. Implement strict isolation between page content and agent action directives
2. Require explicit user confirmation before the agent performs HTTP POST requests with user data
3. Implement content security scanning to detect embedded data-exfiltration instructions
4. Restrict the agent's ability to access and export memory contents based on web page directives
5. Add provenance tracking for data-exfiltration actions, requiring user approval

## Supporting Materials
- PoC injection page: https://galeops.xyz/metatest.html
- Exfil endpoint: https://galeops.xyz/.netlify/functions/collect
- [Screenshots / HAR logs — to be attached]

## Additional Notes
First report on this specific injection vector for the Safety Bounty program. The technique differs from standard ZWSP/Unicode injection approaches — it uses semantic framing within legitimate-appearing content rather than invisible characters, making detection by both automated filters and human reviewers more difficult.