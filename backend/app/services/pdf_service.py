import io
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT

def generate_wage_theft_pdf_report(
    job_type: str,
    location: str,
    expected_wage: float,
    received_wage: float,
    difference: float,
    risk_score: float,
    risk_level: str,
    hours_worked: float,
    complaint_text: str,
    worker_name: str = "Worker",
    employer_name: str = "Employer / Contractor"
) -> bytes:
    """
    Generates a formal PDF Wage Theft Investigation & Complaint Report using ReportLab.
    Returns bytes of the PDF document.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#0F172A'),
        alignment=TA_LEFT
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#0284C7'),
        alignment=TA_LEFT
    )

    h2_style = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#1E293B'),
        spaceBefore=10,
        spaceAfter=6
    )

    body_style = ParagraphStyle(
        'BodyText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor('#334155')
    )

    complaint_body_style = ParagraphStyle(
        'ComplaintBodyText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#1E293B')
    )

    story = []

    # Header Header Banner
    story.append(Paragraph("AI WAGE THEFT DETECTOR", subtitle_style))
    story.append(Spacer(1, 4))
    story.append(Paragraph("OFFICIAL WAGE THEFT AUDIT & COMPLAINT REPORT", title_style))
    story.append(Paragraph("Every Hour Counted. Every Rupee Protected.", ParagraphStyle('Tag', fontName='Helvetica-Oblique', fontSize=9, textColor=colors.HexColor('#64748B'))))
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#0284C7'), spaceBefore=4, spaceAfter=12))

    # Summary Grid Data Table
    table_data = [
        [
            Paragraph("<b>Worker Name:</b>", body_style), Paragraph(worker_name, body_style),
            Paragraph("<b>Job Role:</b>", body_style), Paragraph(job_type, body_style)
        ],
        [
            Paragraph("<b>Location:</b>", body_style), Paragraph(location, body_style),
            Paragraph("<b>Hours Worked:</b>", body_style), Paragraph(f"{hours_worked} hrs / shift", body_style)
        ],
        [
            Paragraph("<b>Expected Minimum Wage:</b>", body_style), Paragraph(f"Rs. {expected_wage:.2f}", body_style),
            Paragraph("<b>Actual Wage Received:</b>", body_style), Paragraph(f"Rs. {received_wage:.2f}", body_style)
        ],
        [
            Paragraph("<b>Wage Theft Shortfall:</b>", body_style), Paragraph(f"<font color='#DC2626'><b>Rs. {difference:.2f}</b></font>", body_style),
            Paragraph("<b>Risk Score & Level:</b>", body_style), Paragraph(f"<b>{risk_score:.1f}% ({risk_level.upper()})</b>", body_style)
        ]
    ]

    summary_table = Table(table_data, colWidths=[130, 130, 130, 130])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F8FAFC')),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#E2E8F0')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E1')),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(summary_table)
    story.append(Spacer(1, 14))

    # Audit Findings Section
    story.append(Paragraph("WAGE AUDIT FINDINGS", h2_style))
    audit_text = (
        f"Based on benchmark labor regulations and statutory minimum wage rates for <b>{job_type}</b> "
        f"in <b>{location}</b>, the legally required daily wage is <b>Rs. {expected_wage:.2f}</b> for a standard shift. "
        f"The worker received <b>Rs. {received_wage:.2f}</b>, resulting in an uncollected balance of <b>Rs. {difference:.2f}</b>. "
        f"This constitutes a wage underpayment severity score of <b>{risk_score:.1f}%</b>, evaluated at <b>{risk_level} Risk Level</b> under the Minimum Wages Act."
    )
    story.append(Paragraph(audit_text, body_style))
    story.append(Spacer(1, 14))

    # Formal Complaint Letter Section
    story.append(Paragraph("FORMAL COMPLAINT LETTER (AI GENERATED)", h2_style))
    
    # Format complaint lines
    formatted_complaint = complaint_text.replace("\n", "<br/>")
    complaint_paragraph = Paragraph(formatted_complaint, complaint_body_style)
    
    complaint_table = Table([[complaint_paragraph]], colWidths=[520])
    complaint_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, 0), colors.HexColor('#FEFCE8')),
        ('BOX', (0, 0), (0, 0), 1, colors.HexColor('#FDE047')),
        ('TOPPADDING', (0, 0), (0, 0), 10),
        ('BOTTOMPADDING', (0, 0), (0, 0), 10),
        ('LEFTPADDING', (0, 0), (0, 0), 12),
        ('RIGHTPADDING', (0, 0), (0, 0), 12),
    ]))
    story.append(complaint_table)
    story.append(Spacer(1, 16))

    # Action Items / Footer Note
    footer_note = (
        "<b>Notice:</b> This document was generated automatically by the AI Wage Theft Detector platform. "
        "Workers are advised to submit this letter to their nearest Regional Labor Commissioner's Office, "
        "District Legal Services Authority (DLSA), or registered trade union."
    )
    story.append(Paragraph(footer_note, ParagraphStyle('Foot', parent=body_style, fontSize=8, textColor=colors.HexColor('#64748B'))))

    doc.build(story)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
