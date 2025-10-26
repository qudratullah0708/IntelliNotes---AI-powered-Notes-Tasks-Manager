from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from gtts import gTTS
import os
import io
import sqlite3
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, Note
from ai_utils import summarize_note

# Ensure database schema is up to date
Base.metadata.create_all(bind=engine)

#
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/notes/")
def create_note(title: str, content: str, category: str = None):
    db = SessionLocal()
    try:
        note = Note(title=title, content=content, category=category)
        db.add(note)
        db.commit()
        db.refresh(note)
        return note
    finally:
        db.close()

@app.get("/notes/")
def get_notes():
    db = SessionLocal()
    try:
        notes = db.query(Note).all()
        return notes
    finally:
        db.close()

@app.put("/notes/{note_id}")
def update_note(note_id: int, title: str, content: str, category: str = None):
    db = SessionLocal()
    try:
        note = db.query(Note).get(note_id)
        if not note:
            raise HTTPException(status_code=404, detail="Note not found")
        note.title, note.content = title, content
        if category is not None:
            note.category = category
        db.commit()
        db.refresh(note)
        return note
    finally:
        db.close()

@app.delete("/notes/{note_id}")
def delete_note(note_id: int):
    db = SessionLocal()
    try:
        note = db.query(Note).get(note_id)
        if not note:
            raise HTTPException(status_code=404, detail="Note not found")
        db.delete(note)
        db.commit()
        return {"message": "Deleted successfully"}
    finally:
        db.close()

@app.post("/summarize/{note_id}")
def summarize(note_id: int):
    db = SessionLocal()
    try:
        note = db.query(Note).get(note_id)
        if not note:
            raise HTTPException(status_code=404, detail="Note not found")
        summary = summarize_note(note.content)
        note.summary = summary
        db.commit()
        return {"summary": summary}
    finally:
        db.close()

@app.post("/speak/{note_id}")
def speak_note(note_id: int):
    db = SessionLocal()
    try:
        note = db.query(Note).get(note_id)
        if not note:
            raise HTTPException(status_code=404, detail="Note not found")
        
        # Create TTS audio
        text_to_speak = f"{note.title}. {note.content}"
        tts = gTTS(text=text_to_speak, lang='en')
        
        # Save to temporary file
        audio_path = f"temp_audio_{note_id}.mp3"
        tts.save(audio_path)
        
        return FileResponse(
            audio_path, 
            media_type="audio/mpeg",
            headers={
                "Content-Disposition": "inline; filename=note_audio.mp3",
                "Cache-Control": "no-cache"
            }
        )
    finally:
        db.close()


