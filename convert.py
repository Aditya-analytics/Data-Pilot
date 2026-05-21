import re
import os

def html_to_jsx(html):
    # Basic replacements
    html = html.replace('class=', 'className=')
    html = html.replace('for=', 'htmlFor=')
    html = html.replace('<!--', '{/*')
    html = html.replace('-->', '*/}')
    html = html.replace('onclick="window.location.href=\'app.html\'"', '')
    html = html.replace('onclick="event.stopPropagation(); window.location.href=\'app.html\'"', '')
    html = html.replace('onclick="window.location.href=\'landing4.html\'"', '')
    
    # Fix inline styles roughly
    def style_replacer(match):
        style_str = match.group(1)
        rules = [r.strip() for r in style_str.split(';') if r.strip()]
        react_styles = []
        for r in rules:
            if ':' in r:
                k, v = r.split(':', 1)
                k = k.strip()
                v = v.strip().replace("'", '"')
                # camelCase keys
                parts = k.split('-')
                if len(parts) > 1:
                    k = parts[0] + ''.join(p.capitalize() for p in parts[1:])
                react_styles.append(f"{k}: '{v}'")
        return 'style={{ ' + ', '.join(react_styles) + ' }}'
        
    html = re.sub(r'style="([^"]*)"', style_replacer, html)
    
    # Fix unclosed br tags
    html = html.replace('<br>', '<br/>')
    return html

with open('frontend/prototypes/landing4.html', 'r') as f:
    landing = f.read()

landing_css = re.search(r'<style>(.*?)</style>', landing, re.DOTALL).group(1)
landing_body = re.search(r'<body>(.*?)</body>', landing, re.DOTALL).group(1)

jsx_body = html_to_jsx(landing_body)
# Remove script tags from jsx_body
jsx_body = re.sub(r'<script.*?</script>', '', jsx_body, flags=re.DOTALL)

react_landing = f"""
import React from 'react';
import {{ Link, useNavigate }} from 'react-router-dom';

export default function Landing() {{
  const navigate = useNavigate();
  return (
    <div className="landing-page-root">
      {{/* The original body content */}}
      {jsx_body}
    </div>
  );
}}
"""

with open('frontend/src/pages/Landing.tsx', 'w') as f:
    f.write(react_landing)

with open('frontend/src/index.css', 'w') as f:
    f.write("@import \"tailwindcss\";\n\n" + landing_css)

