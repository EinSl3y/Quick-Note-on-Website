// ==UserScript==
// @name         Note
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Teckinologia
// @author       Ein
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    const storageKey = "smart_notes_data_v1";
    let notes = [];
    let undoStack = [];
    let currentColorIndex = 0;
    let deleteMode = false;
    let notesVisible = true;
    const colorCycle = ["#FFFACD", "#ADD8E6", "#FFB6C1", "#90EE90"];
    function loadNotes() {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            notes = JSON.parse(saved);
            notes.forEach(createNoteFromData);
        }
    }
    function saveNotes() {
        localStorage.setItem(storageKey, JSON.stringify(notes));
    }
    function createNoteFromData(data) {
        const note = createNoteElement(data.text, data.x, data.y, data.color, data.id);
        document.body.appendChild(note);
    }
    function getNextColor() {
        const color = colorCycle[currentColorIndex];
        currentColorIndex = (currentColorIndex + 1) % colorCycle.length;
        return color;
    }
    function createNoteElement(text = "", x = 100, y = 100, color = null, id = null) {
        const note = document.createElement("textarea");
        note.value = text;
        note.style.position = "absolute";
        note.style.left = `${x}px`;
        note.style.top = `${y}px`;
        note.style.background = color || getNextColor();
        note.style.padding = "6px";
        note.style.border = "1px solid #aaa";
        note.style.borderRadius = "6px";
        note.style.resize = "both";
        note.style.zIndex = 9999;
        note.style.minWidth = "100px";
        note.style.minHeight = "100px";
        note.style.boxShadow = "0 2px 10px rgba(0,0,0,0.3)";
        note.style.fontSize = "14px";
        note.style.overflow = "auto";
        note.style.whiteSpace = "pre-wrap";
        note.dataset.id = id || crypto.randomUUID();
        note.addEventListener("input", () => {
            const index = notes.findIndex(n => n.id === note.dataset.id);
            if (index >= 0) {
                notes[index].text = note.value;
            }
            saveNotes();
        });
        let isDragging = false, offsetX = 0, offsetY = 0;
        note.addEventListener("mousedown", e => {
            if (e.button === 0 && !deleteMode) {
                isDragging = true;
                offsetX = e.offsetX;
                offsetY = e.offsetY;
                note.style.cursor = "grabbing";
            }
        });
        document.addEventListener("mousemove", e => {
            if (isDragging) {
                note.style.left = `${e.pageX - offsetX}px`;
                note.style.top = `${e.pageY - offsetY}px`;

                const index = notes.findIndex(n => n.id === note.dataset.id);
                if (index >= 0) {
                    notes[index].x = e.pageX - offsetX;
                    notes[index].y = e.pageY - offsetY;
                    saveNotes();
                }
            }
        });
        document.addEventListener("mouseup", () => {
            if (isDragging) {
                isDragging = false;
                note.style.cursor = "default";
            }
        });
        note.addEventListener("click", () => {
            if (deleteMode) {
                const index = notes.findIndex(n => n.id === note.dataset.id);
                if (index >= 0) {
                    const removed = notes.splice(index, 1)[0];
                    undoStack.push(removed);
                    note.remove();
                    saveNotes();
                }
                note.remove();
            }
        });
        if (!id) {
            notes.push({
                id: note.dataset.id,
                text,
                x,
                y,
                color: note.style.background
            });
            saveNotes();
        }

        return note;
    }
    function createNote() {
        let x = window.lastMouseX || 100;
        let y = window.lastMouseY || 100;
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
            const rect = selection.getRangeAt(0).getBoundingClientRect();
            x = rect.left + window.scrollX + 20;
            y = rect.top + window.scrollY + 20;
        }
        const note = createNoteElement("", x, y);
        document.body.appendChild(note);
        note.focus();
    }
    function toggleDeleteMode() {
        deleteMode = !deleteMode;
        document.body.style.cursor = deleteMode ? "crosshair" : "default";
        alert(deleteMode ? "🗑️ Chế độ XÓA đang BẬT – click ghi chú để xóa" : "❌ Chế độ xóa đã TẮT");
    }
    function toggleAllNotesVisibility() {
    notesVisible = !notesVisible;
    document.querySelectorAll("textarea[data-id]").forEach(n => {
        if (n.isConnected) { // Chỉ xử lý các note còn trong DOM
            n.style.display = notesVisible ? "block" : "none";
        }
    });
}


    function undoLastDelete() {
        const last = undoStack.pop();
        if (last) {
            notes.push(last);
            saveNotes();
            createNoteFromData(last);
        } else {
            alert("🔙 Không có ghi chú nào để hoàn tác.");
        }
    }
    document.addEventListener("mousemove", e => {
        window.lastMouseX = e.pageX;
        window.lastMouseY = e.pageY;
    });
    document.addEventListener("keydown", e => {
        if (e.ctrlKey && e.key.toLowerCase() === "y") {
            e.preventDefault();
            createNote();
        }
        if (e.altKey && e.key.toLowerCase() === "y") {
            e.preventDefault();
            toggleDeleteMode();
        }
        if (e.ctrlKey && e.altKey && !e.shiftKey) {
            e.preventDefault();
            toggleAllNotesVisibility();
        }
        if (e.altKey && e.key.toLowerCase() === "z") {
            e.preventDefault();
            undoLastDelete();
        }
    });
    window.addEventListener("load", loadNotes);
})();
