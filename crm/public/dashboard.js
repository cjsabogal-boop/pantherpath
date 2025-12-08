const API_URL = 'api';
let currentFilter = 'all';
let allContacts = [];
let token = localStorage.getItem('token');

// Check if already logged in
window.addEventListener('DOMContentLoaded', () => {
    if (token) {
        checkAuth();
    }
});

// Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (data.success) {
            token = data.token;
            localStorage.setItem('token', token);
            showDashboard(data.username);
        } else {
            showError(data.error || 'Error al iniciar sesión');
        }
    } catch (error) {
        showError('Error de conexión');
    }
});

// Check authentication
async function checkAuth() {
    try {
        const response = await fetch(`${API_URL}/check-auth`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        if (data.authenticated) {
            showDashboard(data.username);
        } else {
            logout();
        }
    } catch (error) {
        logout();
    }
}

// Show dashboard
function showDashboard(username) {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('dashboard').classList.add('active');
    document.getElementById('currentUser').textContent = username;

    loadStats();
    loadContacts();
}

// Logout
function logout() {
    localStorage.removeItem('token');
    token = null;
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('dashboard').classList.remove('active');
}

// Show error
function showError(message) {
    const errorDiv = document.getElementById('loginError');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 3000);
}

// Load stats
async function loadStats() {
    try {
        const response = await fetch(`${API_URL}/stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const stats = await response.json();

        const statsHTML = `
            <div class="stat-card">
                <div class="stat-label">Total Contactos</div>
                <div class="stat-value">${stats.total}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Nuevos</div>
                <div class="stat-value">${stats.nuevo}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Contactados</div>
                <div class="stat-value">${stats.contactado}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">En Proceso</div>
                <div class="stat-value">${stats.enProceso}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Convertidos</div>
                <div class="stat-value">${stats.convertido}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">No Interesados</div>
                <div class="stat-value">${stats.noInteresado}</div>
            </div>
        `;

        document.getElementById('statsGrid').innerHTML = statsHTML;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Load contacts
async function loadContacts() {
    try {
        const response = await fetch(`${API_URL}/contacts`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        allContacts = await response.json();
        renderContacts();
    } catch (error) {
        console.error('Error loading contacts:', error);
    }
}

// Render contacts
function renderContacts() {
    const filtered = currentFilter === 'all'
        ? allContacts
        : allContacts.filter(c => c.status === currentFilter);

    const tbody = document.getElementById('contactsTableBody');

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #B8B8B8;">No hay contactos</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map(contact => `
        <tr>
            <td>${contact.nombre}</td>
            <td>${contact.email}</td>
            <td>${contact.pais}</td>
            <td>${contact.experiencia}</td>
            <td><span class="status-badge status-${contact.status}">${contact.status}</span></td>
            <td>${new Date(contact.createdAt).toLocaleDateString()}</td>
            <td>
                <button class="btn-action" onclick="viewContact('${contact.id}')">Ver</button>
                <button class="btn-action" onclick="updateStatus('${contact.id}')">Estado</button>
            </td>
        </tr>
    `).join('');
}

// Filter contacts
function filterContacts(status) {
    currentFilter = status;

    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    renderContacts();
}

// View contact details
async function viewContact(id) {
    try {
        const response = await fetch(`${API_URL}/contacts/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const contact = await response.json();

        const detailHTML = `
            <div class="contact-detail">
                <div class="contact-detail-label">Nombre</div>
                <div class="contact-detail-value">${contact.nombre}</div>
            </div>
            <div class="contact-detail">
                <div class="contact-detail-label">Email</div>
                <div class="contact-detail-value">${contact.email}</div>
            </div>
            <div class="contact-detail">
                <div class="contact-detail-label">País</div>
                <div class="contact-detail-value">${contact.pais}</div>
            </div>
            <div class="contact-detail">
                <div class="contact-detail-label">Teléfono</div>
                <div class="contact-detail-value">${contact.telefono || 'No proporcionado'}</div>
            </div>
            <div class="contact-detail">
                <div class="contact-detail-label">Experiencia</div>
                <div class="contact-detail-value">${contact.experiencia}</div>
            </div>
            <div class="contact-detail">
                <div class="contact-detail-label">Disciplina</div>
                <div class="contact-detail-value">${contact.disciplina}</div>
            </div>
            <div class="contact-detail">
                <div class="contact-detail-label">Retos</div>
                <div class="contact-detail-value">${Array.isArray(contact.retos) ? contact.retos.join(', ') : contact.retos || 'No especificado'}</div>
            </div>
            <div class="contact-detail">
                <div class="contact-detail-label">Objetivo</div>
                <div class="contact-detail-value">${contact.objetivo || 'No especificado'}</div>
            </div>
            <div class="contact-detail">
                <div class="contact-detail-label">Motivación</div>
                <div class="contact-detail-value">${contact.motivacion || 'No especificado'}</div>
            </div>
            <div class="contact-detail">
                <div class="contact-detail-label">Coaching Previo</div>
                <div class="contact-detail-value">${contact.coaching_previo || 'No especificado'}</div>
            </div>
            <div class="contact-detail">
                <div class="contact-detail-label">Proceso Ideal</div>
                <div class="contact-detail-value">${contact.proceso_ideal || 'No especificado'}</div>
            </div>
            <div class="contact-detail">
                <div class="contact-detail-label">Comentarios</div>
                <div class="contact-detail-value">${contact.comentarios || 'Ninguno'}</div>
            </div>
            <div class="contact-detail">
                <div class="contact-detail-label">Estado</div>
                <div class="contact-detail-value">
                    <select id="statusSelect" class="form-input" style="width: auto;">
                        <option value="nuevo" ${contact.status === 'nuevo' ? 'selected' : ''}>Nuevo</option>
                        <option value="contactado" ${contact.status === 'contactado' ? 'selected' : ''}>Contactado</option>
                        <option value="en-proceso" ${contact.status === 'en-proceso' ? 'selected' : ''}>En Proceso</option>
                        <option value="convertido" ${contact.status === 'convertido' ? 'selected' : ''}>Convertido</option>
                        <option value="no-interesado" ${contact.status === 'no-interesado' ? 'selected' : ''}>No Interesado</option>
                    </select>
                    <button class="btn-action" onclick="saveStatus('${contact.id}')" style="margin-left: 1rem;">Guardar Estado</button>
                </div>
            </div>
            
            <div class="notes-section">
                <h3 style="color: #D4AF37; margin-bottom: 1rem;">Notas de Seguimiento</h3>
                <div id="notesList">
                    ${contact.notes && contact.notes.length > 0 ? contact.notes.map(note => `
                        <div class="note-item">
                            <div class="note-meta">${new Date(note.createdAt).toLocaleString()} - ${note.createdBy}</div>
                            <div class="note-text">${note.text}</div>
                        </div>
                    `).join('') : '<p style="color: #B8B8B8;">No hay notas todavía</p>'}
                </div>
                <div class="add-note-form">
                    <textarea id="newNoteText" placeholder="Agregar nota de seguimiento..."></textarea>
                    <button class="btn" onclick="addNote('${contact.id}')" style="width: auto; padding: 0.75rem 1.5rem;">Agregar</button>
                </div>
            </div>
        `;

        document.getElementById('contactDetailContent').innerHTML = detailHTML;
        document.getElementById('contactModal').classList.add('active');
    } catch (error) {
        console.error('Error loading contact:', error);
    }
}

// Close modal
function closeModal() {
    document.getElementById('contactModal').classList.remove('active');
}

// Save status
async function saveStatus(id) {
    const newStatus = document.getElementById('statusSelect').value;

    try {
        await fetch(`${API_URL}/contacts/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: newStatus })
        });

        loadStats();
        loadContacts();
        alert('Estado actualizado correctamente');
    } catch (error) {
        console.error('Error updating status:', error);
        alert('Error al actualizar el estado');
    }
}

// Add note
async function addNote(id) {
    const noteText = document.getElementById('newNoteText').value.trim();

    if (!noteText) {
        alert('Por favor escribe una nota');
        return;
    }

    try {
        await fetch(`${API_URL}/contacts/${id}/notes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ text: noteText })
        });

        document.getElementById('newNoteText').value = '';
        viewContact(id); // Reload contact details
    } catch (error) {
        console.error('Error adding note:', error);
        alert('Error al agregar la nota');
    }
}

// Update status (quick action from table)
async function updateStatus(id) {
    const newStatus = prompt('Nuevo estado:\n1. nuevo\n2. contactado\n3. en-proceso\n4. convertido\n5. no-interesado');

    const statusMap = {
        '1': 'nuevo',
        '2': 'contactado',
        '3': 'en-proceso',
        '4': 'convertido',
        '5': 'no-interesado'
    };

    const status = statusMap[newStatus];

    if (!status) {
        alert('Estado inválido');
        return;
    }

    try {
        await fetch(`${API_URL}/contacts/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });

        loadStats();
        loadContacts();
    } catch (error) {
        console.error('Error updating status:', error);
        alert('Error al actualizar el estado');
    }
}
