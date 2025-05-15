class NoteArchive extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .archive-container {
                    background: white; /* Default light mode */
                    padding: 16px;
                    border-radius: var(--border-radius, 8px);
                    margin-top: 20px;
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 10px;
                    transition: background 0.3s ease, color 0.3s ease;
                }

                /* Dark Mode */
                :host-context(body.dark-mode) .archive-container {
                    background: #2E2E2E; /* Sesuai grid-container */
                }

                h2 {
                    margin: 0;
                    font-size: 1.2em;
                    color: var(--primary-color, #333);
                }
                .archive-note {
                    background: var(--background-color, white);
                    color: var(--text-color, black);
                    padding: 16px;
                    border-radius: var(--border-radius, 8px);
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    position: relative;
                    border-top: 3px solid var(--secondary-color, #007BFF);
                    transition: background 0.3s ease, color 0.3s ease;
                }

                .archive-note h3 {
                    margin: 8px 0;
                    font-size: 1.2em;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .archive-note p {
                    font-size: 0.9em;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                }

                .actions {
                    display: flex;
                    justify-content: flex-start;
                    padding: 8px 0;
                    border-top: 1px solid rgba(0, 0, 0, 0.1);
                    gap: 10px;
                }
                .actions button {
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    font-size: 1.3em;
                    color: var(--text-color);
                    transition: transform 0.2s;
                }
                .actions button:hover {
                    transform: scale(1.2);
                }
            </style>
            <div class="archive-container">
                <h2>Arsip</h2>
                <div id="archive-list"></div>
            </div>
        `;

        this.renderArchivedNotes();
    }

    renderArchivedNotes() {
        const archiveList = this.shadowRoot.querySelector("#archive-list");
        archiveList.innerHTML = "";

        let archivedNotes = JSON.parse(localStorage.getItem('notesData')) || [];
        archivedNotes = archivedNotes.filter(note => note.archived);

        archivedNotes.forEach((note, index) => {
            const noteElement = document.createElement("div");
            noteElement.classList.add("archive-note");
            noteElement.innerHTML = `
                <h3>${note.title}</h3>
                <p>${this.truncateText(note.body, 3)}</p>
                <div class="actions">
                    <button class="open-popup" title="Lihat">📖</button>
                    <button class="restore" title="Kembalikan">↩️</button>
                </div>
            `;

            noteElement.querySelector(".open-popup").addEventListener("click", () => {
                alert(`Melihat catatan: ${note.title}\n\n${note.body}`);
            });

            noteElement.querySelector(".restore").addEventListener("click", () => {
                if (confirm("Kembalikan catatan ini ke daftar aktif?")) {
                    archivedNotes[index].archived = false;
                    localStorage.setItem("notesData", JSON.stringify(archivedNotes));
                    this.renderArchivedNotes();
                    document.dispatchEvent(new Event("refresh-notes"));
                }
            });

            archiveList.appendChild(noteElement);
        });
    }

    truncateText(text, maxLines = 3) {
        const words = text.split(" ");
        let truncated = "";
        let lineCount = 0;
        let tempLine = "";

        for (const word of words) {
            tempLine += word + " ";
            if (tempLine.length > 40) {
                lineCount++;
                if (lineCount >= maxLines) {
                    return truncated.trim() + "...";
                }
                truncated += tempLine;
                tempLine = "";
            }
        }
        return (truncated + tempLine).trim();
    }
}

customElements.define("note-archive", NoteArchive);
