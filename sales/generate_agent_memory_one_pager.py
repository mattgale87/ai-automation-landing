from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from pathlib import Path

OUT = Path(__file__).with_name('galeops-agent-memory-one-pager.pdf')
PAGE = letter
BG = colors.HexColor('#08090a'); INK = colors.HexColor('#f7f8f8'); MUTED = colors.HexColor('#8f96a3'); LINE = colors.HexColor('#30333a'); INDIGO = colors.HexColor('#7376f2'); GOLD = colors.HexColor('#c89a45'); GREEN = colors.HexColor('#34d399'); SURFACE = colors.HexColor('#121417')

styles = {
 'eyebrow': ParagraphStyle('eyebrow', fontName='Helvetica-Bold', fontSize=7.5, leading=10, textColor=INDIGO, tracking=1.4, spaceAfter=7),
 'title': ParagraphStyle('title', fontName='Helvetica-Bold', fontSize=23, leading=24, textColor=INK, spaceAfter=5),
 'lede': ParagraphStyle('lede', fontName='Helvetica', fontSize=9, leading=12, textColor=MUTED, spaceAfter=7),
 'h2': ParagraphStyle('h2', fontName='Helvetica-Bold', fontSize=11, leading=13, textColor=INK, spaceBefore=2, spaceAfter=3),
 'h3': ParagraphStyle('h3', fontName='Helvetica-Bold', fontSize=8.3, leading=10, textColor=INK, spaceAfter=2),
 'body': ParagraphStyle('body', fontName='Helvetica', fontSize=7.3, leading=9.2, textColor=MUTED),
 'small': ParagraphStyle('small', fontName='Helvetica', fontSize=6.7, leading=8.2, textColor=MUTED),
 'card': ParagraphStyle('card', fontName='Helvetica', fontSize=7.1, leading=8.7, textColor=MUTED),
 'price': ParagraphStyle('price', fontName='Helvetica-Bold', fontSize=12, leading=14, textColor=GOLD),
 'footer': ParagraphStyle('footer', fontName='Helvetica', fontSize=7.5, leading=10, textColor=MUTED, alignment=TA_CENTER),
}

def P(text, style): return Paragraph(text, styles[style])
def bullet(text): return Paragraph(f'<font color="#34d399">✓</font> {text}', styles['small'])

def bg(canvas, doc):
    canvas.saveState(); canvas.setFillColor(BG); canvas.rect(0,0,PAGE[0],PAGE[1],fill=1,stroke=0)
    canvas.setFillColor(colors.HexColor('#171a2c')); canvas.circle(PAGE[0]-35, PAGE[1]-25, 120, fill=1, stroke=0)
    canvas.setFillColor(GOLD); canvas.setFont('Helvetica-Bold', 10); canvas.drawString(0.48*inch, 0.35*inch, 'Gale'); canvas.setFillColor(INDIGO); canvas.drawString(0.71*inch, 0.35*inch, 'Ops')
    canvas.setFillColor(MUTED); canvas.setFont('Helvetica', 7.5); canvas.drawRightString(PAGE[0]-0.48*inch, 0.35*inch, 'AI Security & Automation  ·  galeops.xyz/agent-memory')
    canvas.restoreState()

story = []
story += [P('GALEOPS / AGENT OPERATIONS', 'eyebrow'), P('Agent Memory Layer', 'title'), P('Persistent, private, searchable memory for production AI agents—without giving up control of your data.', 'lede')]
proof = Table([[P('<b>PRIVATE</b><br/><font size="7">scoped by default</font>', 'small'), P('<b>TRACEABLE</b><br/><font size="7">source-aware retrieval</font>', 'small'), P('<b>SAFE</b><br/><font size="7">production boundary</font>', 'small'), P('<b>REPEATABLE</b><br/><font size="7">idempotent refresh</font>', 'small')]], colWidths=[1.72*inch]*4)
proof.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),SURFACE),('BOX',(0,0),(-1,-1),.6,LINE),('INNERGRID',(0,0),(-1,-1),.4,LINE),('TEXTCOLOR',(0,0),(-1,-1),INK),('VALIGN',(0,0),(-1,-1),'MIDDLE'),('LEFTPADDING',(0,0),(-1,-1),9),('RIGHTPADDING',(0,0),(-1,-1),9),('TOPPADDING',(0,0),(-1,-1),8),('BOTTOMPADDING',(0,0),(-1,-1),8)]))
story += [proof, Spacer(1, 7), P('The problem', 'eyebrow'), P('Most agents forget, overreach, or retrieve without context.', 'h2'), P('Adding a vector database is not the same as building memory you can operate. The hard part is scope, promotion, provenance, refresh safety, and knowing what the agent actually used.', 'body'), Spacer(1, 5)]
cols = [[P('WHAT GALEOPS BUILDS','eyebrow'), P('WHY IT MATTERS','eyebrow')], [P('Scoped durable memory','h3'), P('Searchable operating context','h3')], [bullet('Private, shared, and run-scoped context'), bullet('Wiki and code knowledge indexing')], [bullet('Explicit promotion controls'), bullet('Source paths and locators')], [bullet('Local-model compatible'), bullet('Duplicate-resistant identity')], [P('Safe operating layer','h3'), P('Business outcome','h3')], [bullet('Deterministic refreshes'), bullet('Agents stop starting from zero')], [bullet('Before/after safety checks'), bullet('Teams can inspect the answer trail')], [bullet('Read-only boundary around production memory'), bullet('Engineering can run the system with confidence')]]
t = Table(cols, colWidths=[3.45*inch,3.45*inch], hAlign='LEFT')
t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),SURFACE),('BOX',(0,0),(-1,-1),.6,LINE),('INNERGRID',(0,0),(-1,-1),.4,LINE),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),12),('RIGHTPADDING',(0,0),(-1,-1),12),('TOPPADDING',(0,0),(-1,-1),5),('BOTTOMPADDING',(0,0),(-1,-1),5)]))
story += [t, Spacer(1, 7), P('STARTING POINTS', 'eyebrow')]
pricing = Table([[P('Memory Readiness Audit','h3'),P('Agent Memory Foundation','h3'),P('Managed MemoryOps','h3')],[P('$1,500 one-time','price'),P('$4,500+ implementation','price'),P('$1,500+ / month','price')],[P('Map the agent stack, data flows, privacy boundaries, retrieval quality, and implementation path.','card'),P('Deploy the PostgreSQL/pgvector memory layer, scoped access, Wiki/CodeGraph indexing, provenance, canaries, and handoff.','card'),P('Monitor refreshes, tune retrieval, add sources, clean duplicates, and provide a monthly health report.','card')]], colWidths=[2.3*inch]*3)
pricing.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),SURFACE),('BOX',(0,0),(-1,-1),.6,LINE),('INNERGRID',(0,0),(-1,-1),.4,LINE),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),11),('RIGHTPADDING',(0,0),(-1,-1),11),('TOPPADDING',(0,0),(-1,-1),5),('BOTTOMPADDING',(0,0),(-1,-1),5)]))
story += [pricing, Spacer(1, 7), P('HOW IT WORKS', 'eyebrow'), P('<b>Map</b> → <b>Build</b> → <b>Verify</b> → <b>Operate</b>', 'h2'), P('We start with the smallest safe deployment, prove isolation and refresh invariants in a canary, then leave your team with a system they can inspect and run.', 'body'), Spacer(1, 7)]
cta = Table([[P('<b>Make memory an operating capability.</b><br/><font color="#8f96a3">Bring your current agent workflow. We’ll map the smallest safe path from “it forgets” to “we can run it.”</font>', 'body'), P('<b>Book an architecture call</b><br/><font color="#a5b4fc">cal.com/mathew-gale-u2vn11/15min</font>', 'body')]], colWidths=[4.65*inch,2.25*inch])
cta.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),colors.HexColor('#171a2c')),('BOX',(0,0),(-1,-1),.8,INDIGO),('VALIGN',(0,0),(-1,-1),'MIDDLE'),('LEFTPADDING',(0,0),(-1,-1),13),('RIGHTPADDING',(0,0),(-1,-1),13),('TOPPADDING',(0,0),(-1,-1),11),('BOTTOMPADDING',(0,0),(-1,-1),11)]))
story += [cta]
doc = SimpleDocTemplate(str(OUT), pagesize=PAGE, rightMargin=.48*inch, leftMargin=.48*inch, topMargin=.45*inch, bottomMargin=.58*inch)
doc.build(story, onFirstPage=bg)
print(OUT)
