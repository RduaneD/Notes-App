class NoteItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.handleKeydown = this.handleKeydown.bind(this);
    }

    connectedCallback() {
        this.render();

        // Event delegation untuk klik di shadowRoot
        this.shadowRoot.addEventListener('click', (e) => {
            const target = e.target;
            const noteId = this.getAttribute('data-id');

            if (target.classList.contains('view-popup')) {
                this.shadowRoot.querySelector('.view-popup-container').classList.add('active');
                this.addKeyListener();
            }
            else if (target.classList.contains('view-popup-close')) {
                this.shadowRoot.querySelector('.view-popup-container').classList.remove('active');
                this.removeKeyListener();
            }
            else if (target.classList.contains('open-popup')) {
                this.shadowRoot.querySelector('.popup').classList.add('active');
                this.addKeyListener();
            }
            else if (target.classList.contains('popup-close')) {
                this.shadowRoot.querySelector('.popup').classList.remove('active');
                this.removeKeyListener();
            }
            else if (target.classList.contains('archive')) {
                if (noteId && confirm("Pindahkan catatan ini ke arsip?")) {
                    this.dispatchEvent(new CustomEvent("archive-note", {
                        bubbles: true,
                        composed: true,
                        detail: { id: noteId }
                    }));
                }
            }
            else if (target.classList.contains('delete')) {
                if (noteId && confirm("Apakah Anda yakin ingin menghapus catatan ini?")) {
                    this.dispatchEvent(new CustomEvent("delete-note", {
                        bubbles: true,
                        composed: true,
                        detail: { id: noteId }
                    }));
                }
            }
            else if (target.classList.contains('save')) {
                const editableTitle = this.shadowRoot.querySelector(".popup-content h3");
                const editableBody = this.shadowRoot.querySelector(".popup-content p");
                const newTitle = editableTitle.textContent.trim();
                const newBody = editableBody.textContent.trim();

                if (!newTitle || !newBody) {
                    alert("Judul dan isi catatan tidak boleh kosong!");
                    return;
                }

                if (confirm("Simpan perubahan (lokal)?")) {
                    this.setAttribute("title", newTitle);
                    this.setAttribute("body", newBody);
                    this.shadowRoot.querySelector('.popup').classList.remove('active');
                    this.removeKeyListener();
                    this.render();

                    this.dispatchEvent(new CustomEvent("update-note", {
                        bubbles: true,
                        composed: true,
                        detail: { id: noteId, title: newTitle, body: newBody }
                    }));
                }
            }
        });
    }

    addKeyListener() {
        document.addEventListener('keydown', this.handleKeydown);
    }

    removeKeyListener() {
        document.removeEventListener('keydown', this.handleKeydown);
    }

    handleKeydown(e) {
        if (e.key === 'Escape') {
            const viewPopup = this.shadowRoot.querySelector('.view-popup-container');
            const editPopup = this.shadowRoot.querySelector('.popup');

            if (viewPopup.classList.contains('active')) {
                viewPopup.classList.remove('active');
                this.removeKeyListener();
            }
            if (editPopup.classList.contains('active')) {
                editPopup.classList.remove('active');
                this.removeKeyListener();
            }
        }
    }

    truncateText(text, maxLength = 200) {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    }

    render() {
        const title = this.getAttribute('title') || 'No Title';
        const body = this.getAttribute('body') || 'No Content';
        const truncatedBody = this.truncateText(body, 200);

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    border: 1px solid #ccc;
                    border-radius: 8px;
                    padding: 12px;
                    margin-bottom: 10px;
                    background-color: var(--note-bg, #fff);
                    color: var(--note-text-color, #333);
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                    font-family: Arial, sans-serif;
                }
                h3 {
                    margin: 0 0 8px 0;
                    font-size: 1.2em;
                    user-select: none;
                }
                p {
                    margin: 0 0 12px 0;
                    white-space: pre-wrap;
                    word-break: break-word;
                    user-select: none;
                }
                button {
                    cursor: pointer;
                    border: none;
                    background: transparent;
                    font-size: 1.2em;
                    margin-right: 8px;
                }
                .actions {
                    display: flex;
                    gap: 8px;
                }
                /* Popup View */
                .view-popup-container,
                .popup {
                    display: none;
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    padding: 16px;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                    z-index: 1000;
                    max-width: 90vw;
                    max-height: 80vh;
                    overflow-y: auto;
                    transition: opacity 0.3s ease;
                }
                .view-popup-container.active,
                .popup.active {
                    display: block;
                    opacity: 1;
                }
                .view-popup-close,
                .popup-close {
                    background: #eee;
                    border-radius: 50%;
                    width: 28px;
                    height: 28px;
                    line-height: 26px;
                    font-size: 24px;
                    text-align: center;
                    cursor: pointer;
                    border: none;
                    position: absolute;
                    top: 8px;
                    right: 8px;
                }
                .popup-content h3,
                .popup-content p {
                    outline: none;
                }
                .popup-content h3 {
                    margin-top: 0;
                    font-size: 1.4em;
                }
                .save {
                    margin-top: 12px;
                    background: #007BFF;
                    color: white;
                    padding: 8px 16px;
                    border-radius: 4px;
                    font-size: 1em;
                    border: none;
                    cursor: pointer;
                    transition: background 0.2s ease;
                }
                .save:hover {
                    background: #0056b3;
                }
            </style>

            <div class="note">
                <h3>${title}</h3>
                <p>${truncatedBody}</p>
                <button class="view-popup" title="Lihat">📖</button>
                <div class="actions">
                    <button class="open-popup" title="Edit">✏️</button>
                    <button class="archive" title="Arsip">📁</button>
                    <button class="delete" title="Hapus">🗑</button>
                </div>
            </div>

            <div class="view-popup-container" role="dialog" aria-modal="true" aria-labelledby="view-title">
                <button class="view-popup-close" aria-label="Tutup">&times;</button>
                <div class="view-popup-content">
                    <h3 id="view-title">${title}</h3>
                    <p>${body}</p>
                </div>
            </div>

            <div class="popup" role="dialog" aria-modal="true" aria-labelledby="edit-title">
                <button class="popup-close" aria-label="Tutup">&times;</button>
                <div class="popup-content">
                    <h3 id="edit-title" contenteditable="true" spellcheck="false">${title}</h3>
                    <p contenteditable="true" spellcheck="false">${body}</p>
                    <button class="save">Save</button>
                </div>
            </div>
        `;
    }
}

customElements.define('note-item', NoteItem);
