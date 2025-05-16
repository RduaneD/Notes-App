class NoteList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.notes = [];
    }

    connectedCallback() {
        this.render();

        // Event delegation untuk menangani event dari note-item
        this.shadowRoot.addEventListener('archive-note', (e) => {
            e.stopPropagation();
            this.dispatchEvent(new CustomEvent('archive-note', {
                bubbles: true,
                composed: true,
                detail: e.detail
            }));
        });

        this.shadowRoot.addEventListener('delete-note', (e) => {
            e.stopPropagation();
            this.dispatchEvent(new CustomEvent('delete-note', {
                bubbles: true,
                composed: true,
                detail: e.detail
            }));
        });
    }

    setNotes(notes) {
        this.notes = notes;
        this.renderNotes();
    }

    renderNotes() {
        const container = this.shadowRoot.querySelector('.grid-container');
        if (!container) {
            console.warn('Container belum tersedia saat renderNotes dipanggil.');
            return;
        }

        container.innerHTML = '';

        this.notes.forEach(note => {
            const item = document.createElement('note-item');
            item.setAttribute('title', note.title);
            item.setAttribute('body', note.body);
            item.setAttribute('data-id', note.id);

            // Alternatif: jika note-item membutuhkan properti, bukan hanya atribut
            item.noteId = note.id;

            container.appendChild(item);
        });
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    transition: background 0.3s, color 0.3s;
                    max-width: 100%;
                    margin: auto;
                }

                .grid-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 16px;
                    background: white;
                    padding: 16px;
                    border-radius: var(--border-radius, 8px);
                    transition: background 0.3s;
                    max-width: 80vw;
                    margin: auto;
                    justify-content: center;
                }

                :host-context(body.dark-mode) .grid-container {
                    background: #2E2E2E;
                    border-radius: var(--border-radius, 8px);
                }

                @media (min-width: 1024px) {
                    .grid-container {
                        grid-template-columns: repeat(3, minmax(250px, 1fr)); 
                    }
                }

                @media (min-width: 768px) and (max-width: 1023px) {
                    .grid-container {
                        grid-template-columns: repeat(2, minmax(250px, 1fr));
                    }
                }

                @media (max-width: 767px) {
                    .grid-container {
                        grid-template-columns: repeat(1, minmax(250px, 1fr));
                    }
                }
            </style>
            <div class="grid-container"></div>
        `;

        // Setelah render selesai, panggil renderNotes untuk update tampilan
        this.renderNotes();
    }
}

customElements.define('note-list', NoteList);