import re

with open('frontend/prototypes/landing4.html', 'r') as f:
    landing = f.read()

landing_css = re.search(r'<style>(.*?)</style>', landing, re.DOTALL).group(1)
landing_body = re.search(r'<body>(.*?)</body>', landing, re.DOTALL).group(1)

with open('frontend/prototypes/app.html', 'r') as f:
    app = f.read()

app_css = re.search(r'<style>(.*?)</style>', app, re.DOTALL).group(1)
app_screen1 = re.search(r'(<div id="screen-upload".*?</div>\s*</div>\s*</div>)', app, re.DOTALL).group(1)

with open('landing_css.txt', 'w') as f: f.write(landing_css)
with open('app_css.txt', 'w') as f: f.write(app_css)
with open('landing_body.txt', 'w') as f: f.write(landing_body)
with open('app_screen1.txt', 'w') as f: f.write(app_screen1)
