class NoteList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    transition: background 0.3s, color 0.3s;
                    max-width: 100%; /* Pastikan tidak melebihi container utama */
                    margin: auto;
                }

                .grid-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 16px;
                    background: white;
                    padding: 16px;
                    border-radius: var(--border-radius);
                    transition: background 0.3s;
                    max-width: 80vw; /* Batasi agar tidak melebihi layout utama */
                    margin: auto;
                    justify-content: center; /* Tengah jika kurang dari 3 */
                }

                ::slotted(note-item) {
                    display: block;
                }

                /* Mode Gelap */
                :host-context(body.dark-mode) .grid-container {
                    background: #2E2E2E;
                    border-radius: var(--border-radius); /* Tambahkan border radius */
                }

                /* Laptop/Desktop: 3 Note per baris */
                @media (min-width: 1024px) {
                    .grid-container {
                        grid-template-columns: repeat(3, minmax(250px, 1fr)); 
                    }
                }

                /* Tablet: 2 Note per baris */
                @media (min-width: 768px) and (max-width: 1023px) {
                    .grid-container {
                        grid-template-columns: repeat(2, minmax(250px, 1fr));
                    }
                }

                /* Mobile: 1 Note per baris */
                @media (max-width: 767px) {
                    .grid-container {
                        grid-template-columns: repeat(1, minmax(250px, 1fr));
                    }
                }
            </style>
            <div class="grid-container">
                <slot></slot>
            </div>
        `;
    }
}

customElements.define('note-list', NoteList);