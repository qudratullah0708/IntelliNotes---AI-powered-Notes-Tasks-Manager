from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from gtts import gTTS
import os
import io
import sqlite3
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, Note, Todo
from ai_utils import summarize_note

# Ensure database schema is up to date
Base.metadata.create_all(bind=engine)

# Add deadline column and rename category to priority
try:
    conn = sqlite3.connect('notes.db')
    cursor = conn.cursor()
    # Add deadline column if it doesn't exist
    cursor.execute("ALTER TABLE todos ADD COLUMN deadline TIMESTAMP")
    # Rename category to priority
    cursor.execute("ALTER TABLE todos ADD COLUMN priority TEXT")
    # Copy data from category to priority
    cursor.execute("UPDATE todos SET priority = category WHERE category IS NOT NULL")
    # Drop old category column (SQLite doesn't support ALTER COLUMN, so we handle it in queries)
    conn.commit()
    conn.close()
except sqlite3.OperationalError:
    pass  # Columns already exist

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

# ============== TODO ENDPOINTS ==============

@app.post("/todos/")
def create_todo(title: str, description: str = None, priority: str = None, deadline: str = None):
    from datetime import datetime
    db = SessionLocal()
    try:
        deadline_dt = None
        if deadline:
            deadline_dt = datetime.fromisoformat(deadline.replace('Z', '+00:00'))
        
        todo = Todo(title=title, description=description, priority=priority, deadline=deadline_dt)
        db.add(todo)
        db.commit()
        db.refresh(todo)
        return todo
    finally:
        db.close()

@app.get("/todos/")
def get_todos():
    db = SessionLocal()
    try:
        todos = db.query(Todo).all()
        return todos
    finally:
        db.close()

@app.get("/todos/{todo_id}")
def get_todo(todo_id: int):
    db = SessionLocal()
    try:
        todo = db.query(Todo).get(todo_id)
        if not todo:
            raise HTTPException(status_code=404, detail="Todo not found")
        return todo
    finally:
        db.close()

@app.put("/todos/{todo_id}")
def update_todo(todo_id: int, title: str = None, description: str = None, priority: str = None, deadline: str = None):
    from datetime import datetime
    db = SessionLocal()
    try:
        todo = db.query(Todo).get(todo_id)
        if not todo:
            raise HTTPException(status_code=404, detail="Todo not found")
        
        if title is not None:
            todo.title = title
        if description is not None:
            todo.description = description
        if priority is not None:
            todo.priority = priority
        if deadline is not None:
            todo.deadline = datetime.fromisoformat(deadline.replace('Z', '+00:00'))
            
        db.commit()
        db.refresh(todo)
        return todo
    finally:
        db.close()

@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int):
    db = SessionLocal()
    try:
        todo = db.query(Todo).get(todo_id)
        if not todo:
            raise HTTPException(status_code=404, detail="Todo not found")
        db.delete(todo)
        db.commit()
        return {"message": "Todo deleted successfully"}
    finally:
        db.close()

@app.patch("/todos/{todo_id}/toggle")
def toggle_todo_completion(todo_id: int):
    db = SessionLocal()
    try:
        todo = db.query(Todo).get(todo_id)
        if not todo:
            raise HTTPException(status_code=404, detail="Todo not found")
        
        todo.completed = not todo.completed
        db.commit()
        db.refresh(todo)
        return todo
    finally:
        db.close()


