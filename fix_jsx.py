with open('frontend/src/pages/Landing.tsx', 'r') as f:
    content = f.read()

# Fix raw > in text
content = content.replace('> EXECUTING STARTUP SEQUENCE', '&gt; EXECUTING STARTUP SEQUENCE')
content = content.replace('> MOUNTING DATA VOLUMES', '&gt; MOUNTING DATA VOLUMES')
content = content.replace('> SYSTEM READY', '&gt; SYSTEM READY')
content = content.replace('&gt; Analyzing dataset', '&gt; Analyzing dataset')

with open('frontend/src/pages/Landing.tsx', 'w') as f:
    f.write(content)
