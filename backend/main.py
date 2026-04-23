from datetime import datetime
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Eco-Snap API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

tickets = []


class TicketUpdate(BaseModel):
    issue_type: str | None = None
    status: str | None = None


def detect_issue_type(filename: str, description: str):
    text = f"{filename} {description}".lower()

    if "leak" in text or "water" in text or "pipe" in text:
        return "Water"
    if "light" in text or "bulb" in text or "electric" in text:
        return "Electricity"
    if "trash" in text or "waste" in text or "bin" in text or "overflow" in text:
        return "Waste"
    return "General"


def detect_severity(filename: str, description: str):
    text = f"{filename} {description}".lower()

    if "broken" in text or "critical" in text or "burst" in text:
        return "Critical"
    if "leak" in text or "overflow" in text or "danger" in text:
        return "High"
    if "light" in text or "waste" in text:
        return "Medium"
    return "Low"


@app.get("/")
def root():
    return {"message": "Eco-Snap backend running"}


@app.post("/report")
async def report(
    image: UploadFile = File(...),
    location: str = Form(""),
    description: str = Form("")
):
    issue_type = detect_issue_type(image.filename, description)
    severity = detect_severity(image.filename, description)
    status = "Unseen"

    ticket = {
        "id": len(tickets) + 1,
        "image_url": "https://via.placeholder.com/150",
        "issue_type": issue_type,
        "severity": severity,
        "status": status,
        "description": description,
        "location": location,
        "created_at": datetime.now().isoformat(),
    }

    tickets.append(ticket)
    return ticket


@app.get("/tickets")
def get_tickets():
    return tickets


@app.patch("/ticket/{ticket_id}")
def patch_ticket(ticket_id: int, updates: TicketUpdate):
    for ticket in tickets:
        if ticket["id"] == ticket_id:
            if updates.issue_type is not None:
                ticket["issue_type"] = updates.issue_type
            if updates.status is not None:
                ticket["status"] = updates.status
            return ticket

    return {"error": "Ticket not found"}