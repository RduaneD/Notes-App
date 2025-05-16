const API_BASE_URL = 'https://notes-api.dicoding.dev/v2';
const loadingIndicator = document.getElementById('loading');

const showLoading = () => loadingIndicator && (loadingIndicator.style.display = 'block');
const hideLoading = () => loadingIndicator && (loadingIndicator.style.display = 'none');

const getNotes = async () => {
  showLoading();
  try {
    const response = await fetch(`${API_BASE_URL}/notes`);
    const result = await response.json();
    if (result.status === 'success') return result.data;
    throw new Error(result.message);
  } catch (err) {
    alert('Gagal mengambil catatan.');
    console.error(err);
    return [];
  } finally {
    hideLoading();
  }
};

const getArchivedNotes = async () => {
  showLoading();
  try {
    const response = await fetch(`${API_BASE_URL}/notes/archived`);
    const result = await response.json();
    if (result.status === 'success') return result.data;
    throw new Error(result.message);
  } catch (err) {
    alert('Gagal mengambil catatan arsip.');
    console.error(err);
    return [];
  } finally {
    hideLoading();
  }
};

const addNote = async (title, body) => {
  showLoading();
  try {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body })
    });
    const result = await response.json();
    if (result.status === 'success') {
      await loadNotes();
    } else {
      throw new Error(result.message);
    }
  } catch (err) {
    alert('Gagal menambah catatan.');
    console.error(err);
  } finally {
    hideLoading();
  }
};

const deleteNote = async (id) => {
  if (!confirm("Yakin ingin menghapus catatan ini?")) return;
  showLoading();
  try {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, { method: 'DELETE' });
    const result = await response.json();
    if (result.status === 'success') {
      await loadNotes();
    } else {
      throw new Error(result.message);
    }
  } catch (err) {
    alert('Gagal menghapus catatan.');
    console.error(err);
  } finally {
    hideLoading();
  }
};

const archiveNote = async (id) => {
  showLoading();
  try {
    const response = await fetch(`${API_BASE_URL}/notes/${id}/archive`, { method: 'POST' });
    const result = await response.json();
    if (result.status === 'success') {
      await loadNotes();
    } else {
      throw new Error(result.message);
    }
  } catch (err) {
    alert('Gagal mengarsipkan catatan.');
    console.error(err);
  } finally {
    hideLoading();
  }
};

const loadNotes = async () => {
  const notes = await getNotes();
  const archived = await getArchivedNotes();

  const noteList = document.querySelector('note-list');
  const noteArchive = document.querySelector('note-archive');

  if (noteList && typeof noteList.setNotes === 'function') {
    noteList.setNotes(notes);
  } else {
    console.warn('note-list tidak ditemukan atau tidak memiliki method setNotes');
  }

  if (noteArchive && typeof noteArchive.setNotes === 'function') {
    noteArchive.setNotes(archived);
  } else {
    console.warn('note-archive tidak ditemukan atau tidak memiliki method setNotes');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  loadNotes();

  const noteForm = document.querySelector('note-form');
  if (noteForm) {
    noteForm.addEventListener('add-note', (e) => {
      addNote(e.detail.title, e.detail.body);
    });
  }

  document.addEventListener('delete-note', (e) => {
    deleteNote(e.detail.id);
  });

  document.addEventListener('archive-note', (e) => {
    archiveNote(e.detail.id);
  });
});
