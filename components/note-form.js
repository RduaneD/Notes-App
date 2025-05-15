class NoteForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.originalPosition = null;
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }

                form {
                    background: white;
                    color: black;
                    padding: 16px;
                    border-radius: var(--border-radius);
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    margin-top: 100px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    transition: background 0.3s, color 0.3s, margin-top 0.3s;
                }

                input, textarea {
                    width: calc(100% - 16px);
                    padding: 8px;
                    border: 1px solid #ccc;
                    border-radius: var(--border-radius);
                    background: white;
                    color: black;
                    transition: background 0.3s, color 0.3s, border 0.3s;
                }

                textarea {
                    min-height: 40px;
                    resize: none;
                }

                button {
                    background: var(--secondary-color);
                    color: white;
                    border: none;
                    padding: 10px;
                    border-radius: var(--border-radius);
                    cursor: pointer;
                    font-weight: bold;
                    transition: background 0.3s, transform 0.2s;
                }

                button:hover {
                    background: var(--primary-color);
                    transform: scale(1.05);
                }

                /* Dark Mode Styles */
                :host-context(body.dark-mode) form {
                    background: #2E2E2E;
                    color: #F5F5F5;
                    box-shadow: 0 2px 4px rgba(255, 255, 255, 0.1);
                }

                :host-context(body.dark-mode) input,
                :host-context(body.dark-mode) textarea {
                    background: #3A3A3A;
                    color: #F5F5F5;
                    border: 1px solid #555;
                }

                :host-context(body.dark-mode) input::placeholder,
                :host-context(body.dark-mode) textarea::placeholder {
                    color: #AAA;
                }

                :host-context(body.dark-mode) button {
                    background: #445069;
                }

                :host-context(body.dark-mode) button:hover {
                    background: #2E3A59;
                }

                /* Responsif: Form masuk ke sidebar di mode mobile */
                @media (max-width: 768px) {
                    form {
                        margin-top: 50%;
                        box-shadow: none;
                        padding: 12px;
                        border-radius: 0;
                        background: transparent;
                        position: relative;
                        transform: translateY(-50%);
                    }

                    input, textarea {
                        width: 100%;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                    }

                    textarea {
                        min-height: 40px;
                    }

                    button {
                        width: 100%;
                    }
                }
            </style>
            <form id="add-note-form">
                <input type="text" id="note-title" placeholder="Judul catatan" required>
                <textarea id="note-body" placeholder="Isi catatan" required></textarea>
                <button type="submit">Tambah</button>
            </form>
        `;

        this.moveToSidebarIfMobile();
        window.addEventListener("resize", () => this.moveToSidebarIfMobile());
    }

    moveToSidebarIfMobile() {
        const form = this.shadowRoot.querySelector("form");
        const sidebar = document.querySelector("note-header").shadowRoot.querySelector(".sidebar");

        if (window.innerWidth <= 768) {
            if (!this.originalPosition) {
                this.originalPosition = form.parentNode;
            }
            if (!sidebar.contains(form)) {
                sidebar.appendChild(form);
            }
            form.style.marginTop = "50%";
            form.style.transform = "translateY(-50%)";
        } else {
            if (this.originalPosition && !this.originalPosition.contains(form)) {
                this.originalPosition.appendChild(form);
            }
            form.style.marginTop = "100px";
            form.style.transform = "none";
        }
    }
}

customElements.define('note-form', NoteForm);
