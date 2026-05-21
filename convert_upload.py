import re

def html_to_jsx(html):
    html = html.replace('class=', 'className=')
    html = html.replace('for=', 'htmlFor=')
    html = html.replace('<!--', '{/*')
    html = html.replace('-->', '*/}')
    html = html.replace('onclick="window.location.href=\'app.html\'"', '')
    html = html.replace('onclick="event.stopPropagation(); window.location.href=\'app.html\'"', '')
    html = html.replace('onclick="window.location.href=\'landing4.html\'"', '')
    
    def style_replacer(match):
        style_str = match.group(1)
        rules = [r.strip() for r in style_str.split(';') if r.strip()]
        react_styles = []
        for r in rules:
            if ':' in r:
                k, v = r.split(':', 1)
                k = k.strip()
                v = v.strip().replace("'", '"')
                parts = k.split('-')
                if len(parts) > 1:
                    k = parts[0] + ''.join(p.capitalize() for p in parts[1:])
                react_styles.append(f"{k}: '{v}'")
        return 'style={{ ' + ', '.join(react_styles) + ' }}'
        
    html = re.sub(r'style="([^"]*)"', style_replacer, html)
    html = html.replace('<br>', '<br/>')
    return html

with open('app_screen1.txt', 'r') as f:
    screen1 = f.read()

# We only want the .upload-body part, because Nav and Step-bar belong to App layout
upload_body = re.search(r'<div className="upload-body">(.*?)</div>\s*</div>', html_to_jsx(screen1), re.DOTALL)
if upload_body:
    body_content = upload_body.group(1)
else:
    # fallback if regex failed
    body_content = html_to_jsx(screen1)
    
react_upload = f"""
import React, {{ useState, useRef }} from 'react';
import {{ uploadDataset }} from '../services/api';

export default function Upload() {{
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelection = (selectedFile: File) => {{
    if (!selectedFile.name.endsWith('.csv')) return;
    setFile(selectedFile);
  }};

  const handleUpload = async () => {{
    if (!file) return;
    setIsUploading(true);
    try {{
      const data = await uploadDataset(file);
      setResult(data);
    }} catch (err) {{
      console.error(err);
    }} finally {{
      setIsUploading(false);
    }}
  }};

  return (
    <div className="upload-body" style={{{{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1.4fr', minHeight: 0 }}}}>
      <div className="upload-left fade in">
        <div className="label" style={{{{ marginBottom: '1.5rem' }}}}>SYS_INITIALIZE</div>
        <h2>
          DRAG, DROP,<br/><em>TRANSFORM.</em>
        </h2>
        <p>
          The moment your file lands, the pipeline begins. Analysis in seconds. AI plan in under a minute. Clean dataset ready to execute.
        </p>
        <div className="format-tags">
          <div className="tag">.CSV</div>
          <div className="tag" style={{{{ opacity: '0.3', textDecoration: 'line-through' }}}}>.XLSX</div>
          <div className="tag" style={{{{ opacity: '0.3', textDecoration: 'line-through' }}}}>.JSON</div>
        </div>
      </div>

      <div className="upload-right">
        {{result ? (
          <div className="drop-zone fade in" style={{{{ background: 'var(--black)', color: 'var(--white)' }}}}>
            <h3>SUCCESS</h3>
            <p style={{{{ color: 'var(--grey)' }}}}>ID: {{result.dataset_id}}</p>
            <p style={{{{ color: 'var(--grey)' }}}}>Saved {{result.filename}}</p>
          </div>
        ) : (
          <div 
            className={{`drop-zone fade in ${{isDragging ? 'dropped' : ''}}`}} 
            style={{{{ transitionDelay: '0.1s', cursor: 'pointer' }}}}
            onDragOver={{(e) => {{ e.preventDefault(); setIsDragging(true); }}}}
            onDragLeave={{() => setIsDragging(false)}}
            onDrop={{(e) => {{ e.preventDefault(); setIsDragging(false); if(e.dataTransfer.files) handleFileSelection(e.dataTransfer.files[0]); }}}}
            onClick={{() => fileInputRef.current?.click()}}
          >
            <input type="file" ref={{fileInputRef}} className="hidden" style={{{{display:'none'}}}} accept=".csv" onChange={{(e) => e.target.files && handleFileSelection(e.target.files[0])}} />
            <div className="drop-icon">DRAG & DROP</div>
            <h3>{{file ? file.name : 'DROP DATASET HERE'}}</h3>
            <p>{{file ? 'Click below to initialize' : 'or click to browse your local files.'}}</p>
            {{file && (
              <button 
                onClick={{(e) => {{ e.stopPropagation(); handleUpload(); }}}} 
                disabled={{isUploading}}
                className="btn btn-primary" 
                style={{{{ marginTop: '1.5rem' }}}}
              >
                {{isUploading ? 'UPLOADING...' : 'INITIALIZE PIPELINE'}}
              </button>
            )}}
          </div>
        )}}
      </div>
    </div>
  );
}}
"""

with open('frontend/src/pages/Upload.tsx', 'w') as f:
    f.write(react_upload)

# We also need to add app.css tokens to index.css
with open('app_css.txt', 'r') as f:
    app_css = f.read()

with open('frontend/src/index.css', 'a') as f:
    f.write("\n\n/* --- APP CSS MERGED --- */\n\n" + app_css)

