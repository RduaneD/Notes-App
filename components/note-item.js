class NoteItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    truncateText(text, maxLines = 5) {
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

    addEventListeners() {
        const shadow = this.shadowRoot;

        shadow.querySelector(".view-popup").addEventListener("click", () => {
            shadow.querySelector(".view-popup-container").classList.add("active");
        });

        shadow.querySelector(".view-popup-close").addEventListener("click", () => {
            shadow.querySelector(".view-popup-container").classList.remove("active");
        });

        shadow.querySelector(".open-popup").addEventListener("click", () => {
            shadow.querySelector(".popup").classList.add("active");
        });

        shadow.querySelector(".popup-close").addEventListener("click", () => {
            shadow.querySelector(".popup").classList.remove("active");
        });

        shadow.querySelector(".save").addEventListener("click", () => {
            const newTitle = shadow.querySelector(".popup-content h3").textContent;
            const newBody = shadow.querySelector(".popup-content p").textContent;
            
            if (confirm("Simpan perubahan?")) {
                this.setAttribute("title", newTitle);
                this.setAttribute("body", newBody);
                this.render();
            }
        });

        // Event Arsip 📁 dengan konfirmasi
        shadow.querySelector(".archive").addEventListener("click", () => {
            if (confirm("Pindahkan catatan ini ke arsip?")) {
                this.dispatchEvent(new CustomEvent("archive-note", {
                    bubbles: true,
                    composed: true,
                    detail: { note: this }
                }));
            }
        });

        // Event Hapus 🗑 dengan konfirmasi
        shadow.querySelector(".delete").addEventListener("click", () => {
            if (confirm("Apakah Anda yakin ingin menghapus catatan ini?")) {
                this.dispatchEvent(new CustomEvent("delete-note", {
                    bubbles: true,
                    composed: true,
                    detail: { note: this }
                }));
            }
        });
    }

    render() {
        const title = this.getAttribute('title') || 'No Title';
        const body = this.getAttribute('body') || 'No Content';
        const truncatedBody = this.truncateText(body, 5);

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }

                .note {
                    background: var(--background-color, white);
                    color: var(--text-color, black);
                    padding: 16px;
                    border-radius: var(--border-radius, 8px);
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    height: 240px;
                    position: relative;
                    overflow: hidden;
                    border-top: 3px solid var(--secondary-color, #007BFF);
                    transition: background 0.3s ease, color 0.3s ease;
                }

                .note h3 {
                    margin: 12px 0 6px;
                    font-size: 1.2em;
                    text-align: center;
                    height: 1.4em;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .note p {
                    flex-grow: 1;
                    font-size: 0.9em;
                    height: 6.5em;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 5;
                    -webkit-box-orient: vertical;
                    padding: 0 10px;
                }

                .view-popup {
                    position: absolute;
                    top: 8px;
                    right: 10px;
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 1.3em;
                    color: var(--text-color);
                    transition: transform 0.2s;
                }

                .view-popup:hover {
                    transform: scale(1.1);
                }

                .actions {
                    display: flex;
                    justify-content: space-around;
                    padding: 8px 0;
                    opacity: 0.8;
                    transition: opacity 0.3s;
                    border-top: 1px solid rgba(0, 0, 0, 0.1);
                }

                .note:hover .actions {
                    opacity: 1;
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

                .popup, .view-popup-container {
                    display: none;
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: var(--background-color);
                    color: var(--text-color);
                    padding: 20px;
                    border-radius: var(--border-radius);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                    z-index: 1000;
                    width: 80%;
                    max-width: 400px;
                }

                .popup.active, .view-popup-container.active {
                    display: block;
                }

                .popup-close, .view-popup-close {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: none;
                    border: none;
                    font-size: 1.5em;
                    cursor: pointer;
                    color: var(--text-color);
                }

                .popup-content, .view-popup-content {
                    text-align: left;
                }

                .popup-content h3, .view-popup-content h3 {
                    text-align: center;
                    margin-bottom: 10px;
                }
            </style>

            <div class="note">
                <h3>${title}</h3>
                <p>${truncatedBody}</p>
                <button class="view-popup">📖</button>
                <div class="actions">
                    <button class="open-popup" title="Edit">✏️</button>
                    <button class="archive" title="Arsip">📁</button>
                    <button class="delete" title="Hapus">🗑</button>
                </div>
            </div>

            <div class="view-popup-container">
                <button class="view-popup-close">&times;</button>
                <div class="view-popup-content">
                    <h3>${title}</h3>
                    <p>${body}</p>
                </div>
            </div>

            <div class="popup">
                <button class="popup-close">&times;</button>
                <div class="popup-content">
                    <h3 contenteditable="true">${title}</h3>
                    <p contenteditable="true">${body}</p>
                    <button class="save">Save</button>
                </div>
            </div>
        `;

        this.addEventListeners();
    }
}

customElements.define('note-item', NoteItem);