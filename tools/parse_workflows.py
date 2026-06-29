import os
import json
import re

METADATA_MAP = {
    "accounting/po_to_pl.md": {
        "problem_subheader": "CPAs spend hours copy-pasting PO data",
        "problem_description": "Managing incoming PDFs of POs via email consumes hours of high-value CPA time. Accountants have to manually extract numbers, log into QuickBooks, update spreadsheets, and notify teammates of transaction updates.",
        "reddit_title": "r/Accounting - How do you automate incoming client invoices and POs?",
        "reddit_comments": "42 comments",
        "metrics": [
            {"label": "US CPA Firms", "value": "1.3M"},
            {"label": "Avg Entry Time", "value": "12 mins"},
            {"label": "Data Error Rate", "value": "4%"}
        ],
        "gtm": [
            {"channel": "LinkedIn Direct Outreach", "desc": "Target solo CPA firm owners and practice managers experiencing manual data entry bottlenecks."},
            {"channel": "QuickBooks Community", "desc": "Provide guides and walkthroughs on QuickBooks forums showing how to automate incoming orders."},
            {"channel": "r/Accounting", "desc": "Engage in discussions about scaling small firm operations without hiring extra administrative help."}
        ]
    },
    "womens_business/ai_consulting.md": {
        "problem_subheader": "Women-led small businesses face a technology adoption gap",
        "problem_description": "Small women-owned businesses want to implement AI to increase efficiency, but traditional IT consultants are prohibitively expensive. They need direct, customized, and automated AI assessments that can be generated in minutes.",
        "reddit_title": "r/WomenInBusiness - How can I run an AI audit on my boutique boutique?",
        "reddit_comments": "29 comments",
        "metrics": [
            {"label": "Women-Owned Firms", "value": "13M"},
            {"label": "Tech Adoption Gap", "value": "35%"},
            {"label": "Avg Revenue Lift", "value": "+22%"}
        ],
        "gtm": [
            {"channel": "Women's Business Councils", "desc": "Partner with organizations like WBENC to offer AI audits as a value-added member benefit."},
            {"channel": "Local Chambers", "desc": "Hold workshops on simple AI tools for small local business owners to generate local warm leads."},
            {"channel": "Female Founder Groups", "desc": "Engage on Slack and Facebook networks with free high-value AI consultation lead magnets."}
        ]
    },
    "theater/cost_cutting.md": {
        "problem_subheader": "Non-profit theaters leak box office revenue on manual tracking",
        "problem_description": "Local theater groups are run by volunteers who struggle to sync ticket sales spreadsheets with promotional email campaigns, leading to empty seats and missed fundraising opportunities.",
        "reddit_title": "r/theater - Free tools for scheduling auditions and volunteer coordinating?",
        "reddit_comments": "31 comments",
        "metrics": [
            {"label": "Community Theaters", "value": "10K"},
            {"label": "Volunteer Hours/Wk", "value": "20h"},
            {"label": "Ticket Revenue Leakage", "value": "8%"}
        ],
        "gtm": [
            {"channel": "Theater Associations", "desc": "Promote cost-cutting templates through regional theater networks and non-profit arts leagues."},
            {"channel": "Arts Council Newsletters", "desc": "Secure placements in local arts newsletters offering free ticket audit spreadsheets."},
            {"channel": "Direct Outreach", "desc": "Audit community theater websites and pitch the automated sync dashboard directly to directors."}
        ]
    },
    "theater/process_automation.md": {
        "problem_subheader": "Auditions and casting pipelines are administrative nightmares",
        "problem_description": "Managing audition registrations, talent headshots, contact information, and rehearsal reminders in disjointed spreadsheets consumes hundreds of volunteer hours per production.",
        "reddit_title": "r/acting - Why are community theater casting portals so outdated?",
        "reddit_comments": "56 comments",
        "metrics": [
            {"label": "Avg Auditions/Show", "value": "150+"},
            {"label": "Coordination Hours", "value": "45h"},
            {"label": "No-Show Rate", "value": "12%"}
        ],
        "gtm": [
            {"channel": "Theater Director Forums", "desc": "Share casting automation templates on Facebook Groups and community theater subreddits."},
            {"channel": "Local Art Schools", "desc": "Partner with acting schools to provide a modern, automated audition signup portal for their students."},
            {"channel": "Case Studies", "desc": "Showcase how one theater saved 40 hours of admin work on their latest musical using Airtable + n8n."}
        ]
    },
    "water_damage/upsell_automation.md": {
        "problem_subheader": "Restoration contractors miss out on highly profitable remodeling upsells",
        "problem_description": "Emergency water mitigation companies do the immediate cleanup work but fail to follow up with homeowners about post-mitigation rebuild and remodeling contracts, letting competitors steal the job.",
        "reddit_title": "Restoration Forum - How are you converting dry-out jobs into rebuild contracts?",
        "reddit_comments": "19 comments",
        "metrics": [
            {"label": "Mitigation Firms", "value": "21K"},
            {"label": "Avg Upsell Value", "value": "$15K"},
            {"label": "Lead Leakage Rate", "value": "45%"}
        ],
        "gtm": [
            {"channel": "Plumbing Contractor Networks", "desc": "Establish referral programs with local plumbers who refer emergency mitigation jobs."},
            {"channel": "Restoration Associations", "desc": "Publish articles in trade magazines demonstrating the ROI of automated follow-up sequences."},
            {"channel": "GHL Communities", "desc": "Promote GHL pipeline templates tailored specifically for water damage rebuild sales."}
        ]
    },
    "water_damage/damage_detection.md": {
        "problem_subheader": "Emergency dispatch speed determines restoration project wins",
        "problem_description": "When home flooding occurs, homeowners call multiple contractors. The contractor who can classify damage from photos and provide a fast initial assessment wins the lucrative restoration contract.",
        "reddit_title": "r/Plumbing - Fast quoting for emergency water mitigation calls?",
        "reddit_comments": "38 comments",
        "metrics": [
            {"label": "Damage Claims/Yr", "value": "1.2M"},
            {"label": "Avg Restoration Bill", "value": "$8.5K"},
            {"label": "Response Time Window", "value": "<15m"}
        ],
        "gtm": [
            {"channel": "Google Local Service Ads", "desc": "Run hyper-targeted local ads bidding on emergency restoration keywords with fast assessment CTAs."},
            {"channel": "Home Insurance Agents", "desc": "Form relationships with insurance adjusters who recommend fast-responding restoration firms."},
            {"channel": "SEO for Emergency Queries", "desc": "Create local landing pages optimized for 'flooded basement help' queries with photo upload widgets."}
        ]
    },
    "ecommerce/product_process.md": {
        "problem_subheader": "Low-stock events cause thousands in lost revenue and supplier friction",
        "problem_description": "E-commerce stores lose customers when popular items go out of stock unexpectedly. Manually monitoring stock levels, emailing suppliers for reorders, and keeping catalogs in sync is a slow, error-prone cycle.",
        "reddit_title": "r/shopify - How do you handle automatic supplier reordering?",
        "reddit_comments": "64 comments",
        "metrics": [
            {"label": "Shopify Stores", "value": "2.5M"},
            {"label": "Stockout Revenue Loss", "value": "15%"},
            {"label": "Manual Sync Time/Wk", "value": "8h"}
        ],
        "gtm": [
            {"channel": "Shopify App Communities", "desc": "Promote workflow integration guides in Shopify Community forums and Facebook circles."},
            {"channel": "E-commerce Podcasts", "desc": "Sponsor e-commerce operations podcasts demonstrating inventory automation tactics."},
            {"channel": "Direct Cold Outreach", "desc": "Target high-growth Shopify stores showing signs of stockouts and pitch them automated restocking."}
        ]
    },
    "ecommerce/marketing_automation.md": {
        "problem_subheader": "Publishing new product listings across multiple channels is exhausting",
        "problem_description": "When launching new SKUs, e-commerce managers spend hours writing SEO descriptions, generating social media captions, and posting manually across Facebook, Meta, and Instagram.",
        "reddit_title": "r/ecommerce - Best way to auto-post Shopify products to Meta/Insta?",
        "reddit_comments": "41 comments",
        "metrics": [
            {"label": "SKU Launches/Mo", "value": "50+"},
            {"label": "Time Per Listing", "value": "15 mins"},
            {"label": "Social Reach Increase", "value": "+40%"}
        ],
        "gtm": [
            {"channel": "Shopify Partner Agencies", "desc": "White-label the marketing sync workflow to Shopify web design agencies to upsell to clients."},
            {"channel": "Meta Ads Forums", "desc": "Share case studies of stores driving organic traffic using AI-generated cross-platform postings."},
            {"channel": "E-commerce Newsletters", "desc": "Sponsor newsletters targeting independent store founders with free caption-generation playbooks."}
        ]
    },
    "hotels/market_research.md": {
        "problem_subheader": "Independent hotels lose bookings to chains with dynamic pricing",
        "problem_description": "Boutique and independent hotels cannot compete with large hotel chains that use automated competitor pricing crawlers. Managers waste hours manually checking Booking.com and Expedia rates.",
        "reddit_title": "r/HotelManagers - How to automate competitor price monitoring?",
        "reddit_comments": "27 comments",
        "metrics": [
            {"label": "US Hotels", "value": "55K"},
            {"label": "Boutique/Indie Share", "value": "40%"},
            {"label": "Monthly Booking Loss", "value": "$3K"}
        ],
        "gtm": [
            {"channel": "Independent Lodging Associations", "desc": "Pitch price intelligence workflows at independent lodging conferences and webinars."},
            {"channel": "Hospitality Tech Directories", "desc": "List the automated market research tool on hospitality software databases and review sites."},
            {"channel": "Direct General Manager Pitch", "desc": "Send general managers a free localized competitor pricing report to show immediate value."}
        ]
    },
    "property_appraisal/lead_gen.md": {
        "problem_subheader": "Appraisers waste hours scraping Zillow and filtering listings",
        "problem_description": "Independent real estate appraisers spend half their week chasing leads on Zillow, cross-referencing MLS listings, and looking up property history on outdated tax databases.",
        "reddit_title": "Appraisers Forum - Automating lead lists from Zillow and MLS?",
        "reddit_comments": "34 comments",
        "metrics": [
            {"label": "US Appraisers", "value": "78K"},
            {"label": "Scraping Hours/Wk", "value": "12h"},
            {"label": "Lead Response Speed", "value": "+60%"}
        ],
        "gtm": [
            {"channel": "Appraisal Facebook Groups", "desc": "Share tutorials on how to build localized lead engines using Zillow APIs and n8n."},
            {"channel": "Local Real Estate Boards", "desc": "Provide appraisal valuation reports to local MLS boards as value-add resources for members."},
            {"channel": "LinkedIn Outreach", "desc": "Target solo appraisers and small appraisal groups struggling to maintain a full project pipeline."}
        ]
    },
    "property_appraisal/follow_up.md": {
        "problem_subheader": "Appraisers spend 10+ hours a week chasing Realtors for updates",
        "problem_description": "Closing appraisal deals requires constant coordination and follow-up. Appraisers waste valuable billing hours texting and emailing agents to confirm property statuses, access details, and invoice payments.",
        "reddit_title": "Appraisers Forum - System to automate Realtor follow ups?",
        "reddit_comments": "23 comments",
        "metrics": [
            {"label": "Follow-Up Calls/Wk", "value": "40+"},
            {"label": "Appraisal Cycle Time", "value": "5 days"},
            {"label": "Invoice Aging Time", "value": "14 days"}
        ],
        "gtm": [
            {"channel": "Real Estate Agent Networks", "desc": "Position the appraisal follow-up system as a friction-reducer for agents looking to close deals faster."},
            {"channel": "Appraisal Coaching Groups", "desc": "Partner with appraisal coaches and trainers to feature the workflow in their operational courses."},
            {"channel": "Direct CRM Integrations", "desc": "Provide GHL snapshots pre-configured for appraisers to download and deploy instantly."}
        ]
    },
    "healthcare/compliance_automation.md": {
        "problem_subheader": "Expiring medical licenses and compliance certificates trigger heavy fines",
        "problem_description": "Medical practices are plagued by complex regulatory tracking. Healthcare admins manually monitor certification dates for doctors, nurses, and equipment in paper files, risking severe audit penalties.",
        "reddit_title": "r/MedicalPractice - Automated tracking for staff certifications?",
        "reddit_comments": "47 comments",
        "metrics": [
            {"label": "US Clinics", "value": "230K"},
            {"label": "Compliance Audit Fines", "value": "$10K+"},
            {"label": "Admin Staff Hours", "value": "6h/wk"}
        ],
        "gtm": [
            {"channel": "Healthcare Admin Forums", "desc": "Share compliance-check templates in MGMA (Medical Group Management Association) circles."},
            {"channel": "Medical CRM Directories", "desc": "Advertise the integration on medical EHR marketplaces and practice management hubs."},
            {"channel": "Direct Clinic Outreach", "desc": "Target operations managers at mid-sized clinical practices with audit-readiness checklists."}
        ]
    },
    "healthcare/revenue_cycle.md": {
        "problem_subheader": "Practices lose 10% of gross revenue to simple claim coding errors",
        "problem_description": "Medical claim denials are a massive cash drain. Practices fail to map billing codes correctly, and appeals are ignored because admins lack the time to draft customized correction appeals.",
        "reddit_title": "r/MedicalBilling - Appeal letter automation for denied claims?",
        "reddit_comments": "51 comments",
        "metrics": [
            {"label": "Avg Claim Denial Rate", "value": "15%"},
            {"label": "Appeals Process Time", "value": "20 mins"},
            {"label": "Revenue Leakage", "value": "10%"}
        ],
        "gtm": [
            {"channel": "Billing Consultancy Partnering", "desc": "Offer code automation toolkits to medical billing services to double their appeals processing capacity."},
            {"channel": "Healthcare LinkedIn Outreach", "desc": "Target Practice Managers and Billing Directors at multi-practitioner clinics."},
            {"channel": "HIPAA Compliance Networks", "desc": "Pitch the secure RAG denial tracking engine in healthcare tech newsletters."}
        ]
    },
    "education/teacher_task_automation.md": {
        "problem_subheader": "Teachers spend 15+ hours a week on grading and administration",
        "problem_description": "Grading quizzes, formatting progress sheets, and writing personalized emails to parents consumes teachers' evenings and weekends, causing severe burnout.",
        "reddit_title": "r/teachers - Admin work is killing my love for teaching. Automation tips?",
        "reddit_comments": "89 comments",
        "metrics": [
            {"label": "US K-12 Teachers", "value": "3.8M"},
            {"label": "Teacher Burnout", "value": "44%"},
            {"label": "Avg Grading Hours/Wk", "value": "15h"}
        ],
        "gtm": [
            {"channel": "EdTech Teacher Networks", "desc": "Share free Google Forms grading workflow templates on Pinterest and Teacher Twitter/X."},
            {"channel": "School District IT Sales", "desc": "Pitch administration time-savers to school district technical directors and principals."},
            {"channel": "Teacher Pay Teachers", "desc": "List n8n/Sheets templates on lesson directories as premium operations buildkits."}
        ]
    },
    "education/student_learning.md": {
        "problem_subheader": "One teacher cannot offer personalized practice to 30 unique students",
        "problem_description": "Students struggle with different concepts. Detecting who is falling behind, pinpointing their exact weaknesses, and generating customized practice sheets takes more time than teachers have.",
        "reddit_title": "r/teachers - Generating differentiated practice problems easily?",
        "reddit_comments": "44 comments",
        "metrics": [
            {"label": "Avg Class Size", "value": "25-30"},
            {"label": "Weak Topic Groups", "value": "4-6"},
            {"label": "Student Improvement", "value": "+18%"}
        ],
        "gtm": [
            {"channel": "Tutoring Franchises", "desc": "Pitch the student chat interface and automated problem generator to local tutoring franchises."},
            {"channel": "Homeschool Groups", "desc": "Promote the tutor chatbot as an affordable alternative to premium personal tutors."},
            {"channel": "Teacher Blog Outreach", "desc": "Partner with educational influencers to write guides on classroom differentiation with AI."}
        ]
    },
    "hvac/lead_gen.md": {
        "problem_subheader": "HVAC contractors struggle to maintain a full project pipeline",
        "problem_description": "Scraping commercial directories and checking if local businesses need service contracts is a manual chore that most field technicians and busy owners ignore, letting leads grow cold.",
        "reddit_title": "HVAC Hacks - Best way to build a commercial lead list?",
        "reddit_comments": "21 comments",
        "metrics": [
            {"label": "HVAC Contractors", "value": "115K"},
            {"label": "Scrape Target Size", "value": "500/city"},
            {"label": "GTM Lead Lift", "value": "+35%"}
        ],
        "gtm": [
            {"channel": "Local Contractor Meetups", "desc": "Present lead generation strategies to local business networking groups and chambers."},
            {"channel": "HVAC Contractor Forums", "desc": "Post step-by-step guides showing how to scrape and enrich business data on sites like HVAC-Talk."},
            {"channel": "GLS Optimization Audits", "desc": "Offer free localized maps audit reports to HVAC firms to sell the enrichment services."}
        ]
    },
    "hvac/voice_bot_outreach.md": {
        "problem_subheader": "Field-busy HVAC owners miss phone calls and lose clients",
        "problem_description": "When homeowners need urgent repairs, they call the first HVAC firm on Google. If the owner is out on a roof repairing a compressor, the call goes to voicemail and the lead is lost to a competitor.",
        "reddit_title": "HVAC Hacks - Answer rate and dispatch solutions?",
        "reddit_comments": "67 comments",
        "metrics": [
            {"label": "Missed Call Loss", "value": "$400/ea"},
            {"label": "Outreach Call Speed", "value": "<2 mins"},
            {"label": "SMS Conversion Lift", "value": "+25%"}
        ],
        "gtm": [
            {"channel": "Bland.ai/Synthflow Showcase", "desc": "Build demo voice bots for specific contractors and email them a recording of their voice assistant."},
            {"channel": "Contractor Marketing Agencies", "desc": "Partner with agencies doing SEO/PPC for trade companies to offer voice automation integrations."},
            {"channel": "Local HVAC Associations", "desc": "Host virtual webinars showing how voice AI handles booking and dispatching after-hours."}
        ]
    },
    "online_coaching/dead_lead_reactivation.md": {
        "problem_subheader": "Coaches sit on databases of 1,000+ cold leads without time to follow up",
        "problem_description": "Acquiring fitness or business coaching leads is expensive. When leads go cold, manually emailing or texting hundreds of contacts to revive them is an exhausting and rarely completed chore.",
        "reddit_title": "r/coaching - Best campaign to reactivate dead email lists?",
        "reddit_comments": "39 comments",
        "metrics": [
            {"label": "Avg Cold Lead List", "value": "1,200+"},
            {"label": "Lead Cost (Meta)", "value": "$45/ea"},
            {"label": "Reactivation Conversions", "value": "8-12%"}
        ],
        "gtm": [
            {"channel": "High-Ticket Coaching Circles", "desc": "Promote reactivation results in elite mastermind groups and coaching consulting hubs."},
            {"channel": "GoHighLevel Ecosystem", "desc": "List the reactivation workflow snapshot on GHL resource sites and affiliate circles."},
            {"channel": "Case Studies on X/Twitter", "desc": "Write long-form threads showing how a coach generated $15K from cold leads in 4 days."}
        ]
    },
    "online_coaching/sales_stack.md": {
        "problem_subheader": "Coaching intake forms and booking flows are disjointed",
        "problem_description": "Coaches leak clients when there are dead zones between submitting an intake form, creating a CRM record, booking a consultation calendar slot, and sending pre-call reminder texts.",
        "reddit_title": "r/sales - Best automated coaching onboarding setup?",
        "reddit_comments": "42 comments",
        "metrics": [
            {"label": "Coaching Market Size", "value": "$15B"},
            {"label": "Lead-to-Call Dropoff", "value": "30%"},
            {"label": "Show-Up Rate Lift", "value": "+20%"}
        ],
        "gtm": [
            {"channel": "Cal.com Integration Directory", "desc": "List the full intake-CRM-calendar snapshot in calendar app appstores."},
            {"channel": "Coaching Masterminds", "desc": "Conduct operational audits for coaches and swap out their fragmented software with this workflow."},
            {"channel": "Instagram/FB DM Ads", "desc": "Target coaches with ads highlighting 'one-click automated client intake setups'."}
        ]
    },
    "pharmaceutical/ind_nda_prep.md": {
        "problem_subheader": "Regulatory teams spend months manually compiling clinical narrative summaries",
        "problem_description": "FDA submissions require compliance mapping. Clinical teams waste hundreds of hours extracting trial data from laboratory sheets and formatting it into strict IND/NDA module layouts.",
        "reddit_title": "r/regulatoryaffairs - AI tools for drafting clinical narratives?",
        "reddit_comments": "18 comments",
        "metrics": [
            {"label": "Biotech Startups", "value": "8K"},
            {"label": "FDA Approval Delay Cost", "value": "$1M/day"},
            {"label": "Dossier Prep Time", "value": "6 months"}
        ],
        "gtm": [
            {"channel": "Biotech Incubator Networks", "desc": "Introduce the NDA drafting wizard to startup founders at incubator hubs (e.g. YC, LabCentral)."},
            {"channel": "Regulatory Affairs Conferences", "desc": "Demonstrate the document mapper at RAPS (Regulatory Affairs Professionals Society) meetups."},
            {"channel": "LinkedIn Outreach", "desc": "Connect with Directors of Regulatory Operations at clinical-stage biotech firms."}
        ]
    },
    "hr/ai_adoption_consulting.md": {
        "problem_subheader": "Small consulting firms struggle to deliver comprehensive AI audit documents",
        "problem_description": "Consultants spend days interviewing staff, compiling recommendations, formatting tables, and styling PDF report files. They cannot scale their auditing services without automation.",
        "reddit_title": "r/consulting - Automating discovery reports and recommendations?",
        "reddit_comments": "31 comments",
        "metrics": [
            {"label": "Small Consultancies", "value": "45K"},
            {"label": "Audit Prep Time", "value": "16 hours"},
            {"label": "Client Close Rate", "value": "+35%"}
        ],
        "gtm": [
            {"channel": "Consulting Communities", "desc": "Write blog posts and forum guides on scaling boutique consultancies using AI report builders."},
            {"channel": "Upwork/Fiverr Audits", "desc": "Offer rapid AI audit services on freelancing sites as high-converting discovery offers."},
            {"channel": "LinkedIn Professional Network", "desc": "Target independent business consultants and operations strategists with automation templates."}
        ]
    },
    "hr/admin_workflow.md": {
        "problem_subheader": "HR onboarding in growing firms is a manual, chaotic process",
        "problem_description": "Without automated triggers, HR managers waste hours emailing new hires for payroll info, checking background statuses, adding users to Slack, and setting up training tasks.",
        "reddit_title": "r/humanresources - Standard onboarding workflow for a team of 40?",
        "reddit_comments": "72 comments",
        "metrics": [
            {"label": "US Mid-Size Orgs", "value": "180K"},
            {"label": "Employee Onboarding Time", "value": "8h"},
            {"label": "Employee Turnover Reduction", "value": "30%"}
        ],
        "gtm": [
            {"channel": "HR Tech Forums", "desc": "Share onboarding workflow recipes on sites like HR Open Source and SHRM communities."},
            {"channel": "Slack App Ecosystem", "desc": "Promote the Slack auto-invite and setup integration on Slack community channels."},
            {"channel": "LinkedIn Target", "desc": "Directly message newly promoted HR Managers offering automated employee onboarding snapshots."}
        ]
    },
    "chiropractic/practice_automation.md": {
        "problem_subheader": "40% of new chiropractic patients fail to book a follow-up appointment",
        "problem_description": "Patient retention is the core profit driver for chiropractic clinics. Without immediate post-visit feedback requests, automated reminders, and 60-day reactivation texts, patients drop out of care programs.",
        "reddit_title": "Chiropractic Success - Patient retention and automated SMS?",
        "reddit_comments": "49 comments",
        "metrics": [
            {"label": "US Chiro Clinics", "value": "70K"},
            {"label": "Patient Drop-Out Rate", "value": "40%"},
            {"label": "Review Generation Lift", "value": "+50%"}
        ],
        "gtm": [
            {"channel": "Chiropractic Coaching Circles", "desc": "Partner with chiro business coaches to distribute the intake-to-reactivation workflow."},
            {"channel": "Chiro Facebook Groups", "desc": "Post case studies demonstrating Google Review increases from automated post-visit reminders."},
            {"channel": "Local Clinic SEO Audit", "desc": "Offer local chiropractors a free clinic review audit to demonstrate the need for automated reviews."}
        ]
    }
}

def clean_content(text):
    text = re.sub(r'#.*', '', text, count=1)  # Remove H1
    return text.strip()

def parse_md_file(filepath, relative_path):
    with open(filepath, 'r') as f:
        content = f.read()

    # Parse Title
    title_match = re.match(r'^#\s*(.*?)\s*$', content, re.MULTILINE)
    title = title_match.group(1) if title_match else "Untitled Workflow"
    
    # Split Title into Industry and Name
    if "—" in title:
        industry, name = title.split("—", 1)
    elif "-" in title:
        industry, name = title.split("-", 1)
    else:
        industry = "General"
        name = title
        
    industry = industry.strip()
    name = name.strip()

    sections = {}
    current_section = None
    section_content = []

    lines = content.split('\n')
    for line in lines:
        if line.startswith('## '):
            if current_section:
                sections[current_section] = '\n'.join(section_content).strip()
            current_section = line[3:].strip()
            section_content = []
        elif current_section:
            section_content.append(line)
            
    if current_section:
        sections[current_section] = '\n'.join(section_content).strip()

    # Get What It Does
    what_it_does = sections.get("What It Does", "No description provided.")

    # Parse Integrations Required
    integrations_text = sections.get("Integrations Required", "")
    integrations = []
    for line in integrations_text.split('\n'):
        line = line.strip()
        if (line.startswith('-') or line.startswith('*')) and '`' in line:
            parts = line.split('`', 2)
            if len(parts) >= 2:
                integrations.append(parts[1])

    # Parse n8n Workflow Nodes
    n8n_text = sections.get("n8n Workflow Nodes", "")
    n8n_nodes = []
    # Match numbered steps, e.g. "1. **Gmail Trigger** (`n8n-nodes-base.gmailTrigger`)" or "1. **Schedule Trigger**"
    step_pattern = re.compile(r'^\d+\.\s+\*\*(.*?)\*\*(?:\s+\(`(.*?)`\))?')
    for line in n8n_text.split('\n'):
        line = line.strip()
        match = step_pattern.match(line)
        if match:
            node_name = match.group(1)
            node_type = match.group(2) or "n8n-nodes-base.custom"
            n8n_nodes.append({
                "name": node_name,
                "type": node_type
            })

    # Parse Claude AI Tasks
    ai_tasks_text = sections.get("Claude AI Tasks", "None specified.")
    
    # Parse Python Tools Needed
    python_tools_text = sections.get("Python Tools Needed", "None specified.")
    
    # Parse Claude Code App
    code_app_text = sections.get("Claude Code App", "Not required.")
    
    # Parse Test Plan
    test_plan_text = sections.get("Test Plan", "No test plan specified.")

    # Merge rich metadata
    meta = METADATA_MAP.get(relative_path, {})
    
    workflow_data = {
        "industry": industry,
        "name": name,
        "description": what_it_does,
        "integrations": integrations,
        "nodes": n8n_nodes,
        "ai_tasks": ai_tasks_text,
        "python_tools": python_tools_text,
        "code_app": code_app_text,
        "test_plan": test_plan_text,
        "problem_subheader": meta.get("problem_subheader", f"Manual processes in {industry} drain team resources"),
        "problem_description": meta.get("problem_description", f"Operational workflows in the {industry} niche are bogged down by administrative, disconnected platforms. Teams waste hours coordinating sheets and APIs manually."),
        "reddit_title": meta.get("reddit_title", f"r/{industry.lower().replace(' ', '')} - Automated templates and workflows recommendations?"),
        "reddit_comments": meta.get("reddit_comments", "15 comments"),
        "metrics": meta.get("metrics", [
            {"label": "Potential savings", "value": "10-15h/wk"},
            {"label": "Implementation", "value": "1 hour"},
            {"label": "Error Reduction", "value": "95%"}
        ]),
        "gtm": meta.get("gtm", [
            {"channel": "Direct Pitch", "desc": f"Target companies in {industry} experiencing operational bottlenecks."},
            {"channel": "Niche Forums", "desc": f"Engage on local {industry} business networks with automation tutorials."},
            {"channel": "Meta/Google Ads", "desc": f"Bid on keywords around '{industry.lower()} templates' and CRM integrations."}
        ])
    }
    
    return workflow_data

def main():
    base_dir = "/Users/ayo_o/automation-hub/workflows"
    all_workflows = []
    
    for root, dirs, files in os.walk(base_dir):
        if "templates" in root:
            continue
        for file in files:
            if file.endswith(".md"):
                filepath = os.path.join(root, file)
                relative_path = os.path.relpath(filepath, base_dir)
                try:
                    data = parse_md_file(filepath, relative_path)
                    all_workflows.append(data)
                except Exception as e:
                    print(f"Error parsing {filepath}: {e}")

    # Parse .env file for active keys
    configured_keys = []
    env_path = "/Users/ayo_o/automation-hub/.env"
    if os.path.exists(env_path):
        with open(env_path, "r") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, val = line.split("=", 1)
                    key = key.strip()
                    val = val.strip().strip("'").strip('"')
                    if val:
                        configured_keys.append(key)

    # Write data to workflows_data.js in absolute path
    out_filepath = "/Users/ayo_o/automation-hub/workflows/workflows_data.js"
    js_content = f"const WORKFLOWS_DATA = {json.dumps(all_workflows, indent=2)};\nconst CONFIGURED_KEYS = {json.dumps(configured_keys, indent=2)};"
    with open(out_filepath, "w") as f:
        f.write(js_content)
    print(f"Successfully compiled {len(all_workflows)} workflows into {out_filepath}")

if __name__ == "__main__":
    main()
