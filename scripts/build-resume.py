"""Convert the approved CV locally, correcting chronology and removing private phone data."""
import argparse
import re
import subprocess
import xml.etree.ElementTree as ET
from pathlib import Path
from zipfile import ZipFile

parser = argparse.ArgumentParser()
parser.add_argument('source', type=Path)
args = parser.parse_args()
work = Path('.local/resume').resolve()
work.mkdir(parents=True, exist_ok=True)
target = work / 'Abdulaziz_Toba_AI_Engineer_CV.docx'
ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
phone = re.compile(r'\+?\d[\d\s()-]{8,}\d')
with ZipFile(args.source) as source, ZipFile(target, 'w') as output:
    for item in source.infolist():
        data = source.read(item.filename)
        if item.filename == 'word/document.xml':
            root = ET.fromstring(data)
            for paragraph in root.findall('.//w:p', ns):
                nodes = paragraph.findall('.//w:t', ns)
                original = ''.join(n.text or '' for n in nodes)
                clean = phone.sub('', original)
                clean = clean.replace('AI Engineer with 8+ years of software engineering experience', 'AI Engineer with software engineering experience since July 2019')
                clean = clean.replace('Architected .NET 8 web applications', 'Architected .NET web applications')
                clean = re.sub(r'^\s*[|•]\s*|\s*[|•]\s*$', '', clean)
                clean = re.sub(r'\|\s*\|', '|', clean)
                if clean != original and nodes:
                    nodes[0].text = clean
                    for node in nodes[1:]:
                        node.text = ''
            data = ET.tostring(root, encoding='utf-8', xml_declaration=True)
        if item.filename.endswith('.rels'):
            data = re.sub(rb'<Relationship\b[^>]*Target="tel:[^"]*"[^>]*/>', b'', data)
        output.writestr(item, data)
subprocess.run(['libreoffice', '-env:UserInstallation=file://' + str(work / 'lo-profile'), '--headless', '--convert-to', 'pdf', '--outdir', str(Path('public').resolve()), str(target)], check=True, stdout=subprocess.DEVNULL)
pdf = Path('public/Abdulaziz_Toba_AI_Engineer_CV.pdf')
text = subprocess.check_output(['pdftotext', str(pdf), '-'], text=True)
assert pdf.read_bytes().startswith(b'%PDF')
assert 'ABDULAZIZ' in text.upper() and '8+ years' not in text
assert not phone.search(text), 'Private phone-like data found in PDF'
assert 'Architected .NET 8' not in text
assert 'abdulaziztoba@outlook.com' in text
print('Résumé generated; PDF text checked for identity, contact, chronology and phone privacy.')
