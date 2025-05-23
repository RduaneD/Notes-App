class NoteHeader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.handleResize = this.updateTitle.bind(this);
        this.render();
    }

    connectedCallback() {
        window.addEventListener("resize", this.handleResize);
    }

    disconnectedCallback() {
        window.removeEventListener("resize", this.handleResize);
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                header {
                    background: var(--primary-color);
                    color: #DCE5E2;
                    padding: 16px 20px;
                    display: flex;
                    align-items: center;
                    width: 100%;
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 1000;
                    transition: background 0.3s ease;
                }
                h1 {
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    margin: 0;
                    font-size: 1.5em;
                    white-space: nowrap;
                    transition: font-size 0.3s ease;
                }
                .menu-toggle {
                    display: none;
                    font-size: 1.5em;
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                }
                /* Sidebar */
                .sidebar {
                    position: fixed;
                    top: 0;
                    left: -100%;
                    width: 60%;
                    height: 100vh;
                    background: var(--primary-color);
                    padding: 80px 20px 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
                    transition: left 0.3s ease-in-out;
                    z-index: 1001;
                }
                .sidebar.show {
                    left: 0;
                }
                .sidebar h1 {
                    font-size: 1.4em;
                    color: white;
                    text-align: left;
                    margin-bottom: 20px;
                    white-space: normal;
                    word-wrap: break-word;
                    max-width: 90%;
                    margin-top: 20px;
                }
                /* Tombol Kembali */
                .close-menu {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.5em;
                    cursor: pointer;
                    position: absolute;
                    top: 20px;
                    left: 20px;
                }
                .header-controls {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                input {
                    padding: 8px 12px;
                    border: none;
                    border-radius: 20px;
                    font-size: 1em;
                    width: 168px;
                    background: white;
                    color: black;
                }
                input:focus {
                    outline: none;
                    box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
                }
                button {
                    background: white;
                    color: var(--primary-color);
                    border: none;
                    padding: 8px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 1.2em;
                    transition: transform 0.2s ease;
                }
                button:hover {
                    background: var(--secondary-color);
                    transform: scale(1.1);
                }
                /* Overlay */
                .overlay {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 1000;
                }
                .overlay.show {
                    display: block;
                }
                /* Mode Gelap */
                :host-context(body.dark-mode) header {
                    background: #222;
                    color: white;
                }
                :host-context(body.dark-mode) input {
                    background: #333;
                    color: white;
                    border: 1px solid #555;
                }
                :host-context(body.dark-mode) button {
                    background: #444;
                    color: white;
                }
                /* RESPONSIVE */
                @media (max-width: 768px) {
                    header {
                        justify-content: space-between;
                        padding: 12px 16px;
                    }
                    h1 {
                        font-size: 1.2em;
                        position: static;
                        transform: none;
                    }
                    .menu-toggle {
                        display: block;
                    }
                    .sidebar {
                        width: 48%;
                    }
                    .mobile-title {
                        display: block;
                        font-size: 1.2em;
                        text-align: center;
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                    }
                    .header-controls {
                        display: none;
                    }
                    .sidebar.show .header-controls {
                        display: flex;
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 15px;
                    }
                }
                @media (min-width: 769px) {
                    .menu-toggle {
                        display: none;
                    }
                    .sidebar {
                        display: none;
                    }
                }
            </style>
            <header>
                <button class="menu-toggle">☰</button>
                <h1 class="main-title">EverThought: Notes App untuk Segala Ide</h1>
                <h1 class="mobile-title" style="display:none;">EverThought</h1>
                <div class="header-controls">
                    <button id="toggle-mode">🌙</button>
                    <input type="text" id="search" placeholder="Cari catatan...">
                </div>
            </header>
            <div class="overlay"></div>
            <div class="sidebar">
                <button class="close-menu">✖</button>
                <h1>EverThought: Notes App untuk Segala Ide</h1>
                <div class="header-controls">
                    <button id="toggle-mode-sidebar">🌙</button>
                    <input type="text" id="search-sidebar" placeholder="Cari catatan...">
                </div>
            </div>
        `;

        this.setupEvents();
        this.updateTitle();
    }

    setupEvents() {
        const toggleModeBtn = this.shadowRoot.querySelector("#toggle-mode");
        const toggleModeSidebarBtn = this.shadowRoot.querySelector("#toggle-mode-sidebar");
        const searchInput = this.shadowRoot.querySelector("#search");
        const searchSidebarInput = this.shadowRoot.querySelector("#search-sidebar");
        const menuToggleBtn = this.shadowRoot.querySelector(".menu-toggle");
        const sidebar = this.shadowRoot.querySelector(".sidebar");
        const overlay = this.shadowRoot.querySelector(".overlay");
        const closeMenuBtn = this.shadowRoot.querySelector(".close-menu");
        const mobileTitle = this.shadowRoot.querySelector(".mobile-title");

        // Toggle sidebar
        menuToggleBtn.addEventListener("click", () => {
            sidebar.classList.toggle("show");
            overlay.classList.toggle("show");
        });

        // Klik di luar sidebar / overlay untuk menutup
        document.addEventListener("click", (event) => {
            if (!this.contains(event.target) && !sidebar.contains(event.target) && !menuToggleBtn.contains(event.target)) {
                sidebar.classList.remove("show");
                overlay.classList.remove("show");
            }
        });

        // Klik tombol close menu
        closeMenuBtn.addEventListener("click", () => {
            sidebar.classList.remove("show");
            overlay.classList.remove("show");
        });

        // Toggle mode gelap
        const toggleDarkMode = () => {
            document.body.classList.toggle("dark-mode");
        };

        toggleModeBtn.addEventListener("click", toggleDarkMode);
        toggleModeSidebarBtn.addEventListener("click", toggleDarkMode);

        // Search input event (bisa emit event custom jika perlu)
        searchInput.addEventListener("input", (e) => {
            this.dispatchEvent(new CustomEvent("search-changed", {
                detail: e.target.value,
                bubbles: true,
                composed: true,
            }));
        });
        searchSidebarInput.addEventListener("input", (e) => {
            this.dispatchEvent(new CustomEvent("search-changed", {
                detail: e.target.value,
                bubbles: true,
                composed: true,
            }));
        });

        // Resize event untuk update title jika perlu
        window.addEventListener("resize", this.handleResize);

        this.mobileTitle = mobileTitle;
        this.mainTitle = this.shadowRoot.querySelector(".main-title");
    }

    updateTitle() {
        if (window.innerWidth <= 768) {
            this.mainTitle.style.display = "none";
            this.mobileTitle.style.display = "block";
        } else {
            this.mainTitle.style.display = "block";
            this.mobileTitle.style.display = "none";
        }
    }
}

customElements.define("note-header", NoteHeader);
