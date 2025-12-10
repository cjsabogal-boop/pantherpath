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
                <div class="stat-value">${stats.total || 0}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Nuevos</div>
                <div class="stat-value">${stats.nuevo || 0}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Contactados</div>
                <div class="stat-value">${stats.contactado || 0}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">En Proceso</div>
                <div class="stat-value">${stats.enProceso || 0}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Convertidos</div>
                <div class="stat-value">${stats.convertido || 0}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">No Interesados</div>
                <div class="stat-value">${stats.noInteresado || 0}</div>
            </div>
        `;

        document.getElementById('statsGrid').innerHTML = statsHTML;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Format date safely
function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return 'N/A';
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (e) {
        return 'N/A';
    }
}

// Format datetime safely
function formatDateTime(dateStr) {
    if (!dateStr) return 'N/A';
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return 'N/A';
        return date.toLocaleString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return 'N/A';
    }
}

// Format value - convert slugs to readable text
function formatValue(value) {
    if (!value) return '-';

    // Mapping for known values
    const mappings = {
        // Experiencia
        'menos-1-ano': 'Menos de 1 año',
        '1-3-anos': '1-3 años',
        '3-5-anos': '3-5 años',
        '5-10-anos': '5-10 años',
        'mas-10-anos': 'Más de 10 años',
        // Disciplinas
        'salto': 'Salto',
        'adiestramiento': 'Adiestramiento',
        'endurance': 'Endurance',
        'completo': 'Completo',
        'polo': 'Polo',
        'western': 'Western',
        'otra': 'Otra',
        // Coaching previo
        'si': 'Sí',
        'no': 'No',
        // Estados
        'nuevo': 'Nuevo',
        'contactado': 'Contactado',
        'en-proceso': 'En Proceso',
        'convertido': 'Convertido',
        'no-interesado': 'No Interesado'
    };

    // Check if we have a mapping
    const lowerValue = value.toLowerCase();
    if (mappings[lowerValue]) {
        return mappings[lowerValue];
    }

    // Otherwise, capitalize first letter and replace dashes with spaces
    return value
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
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
        tbody.innerHTML = '<tr class="no-contacts-row"><td colspan="7" style="text-align: center; color: #B8B8B8; padding: 2rem;">No hay contactos</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map(contact => `
        <tr>
            <td data-label="Nombre"><strong>${contact.nombre || 'Sin nombre'}</strong></td>
            <td data-label="Email">${contact.email || '-'}</td>
            <td data-label="País">${contact.pais || '-'}</td>
            <td data-label="Experiencia">${formatValue(contact.experiencia)}</td>
            <td data-label="Estado">
                <select class="status-select status-${contact.status}" onchange="quickUpdateStatus('${contact.id}', this.value, this)">
                    <option value="nuevo" ${contact.status === 'nuevo' ? 'selected' : ''}>🔵 Nuevo</option>
                    <option value="contactado" ${contact.status === 'contactado' ? 'selected' : ''}>🟡 Contactado</option>
                    <option value="en-proceso" ${contact.status === 'en-proceso' ? 'selected' : ''}>🟢 En Proceso</option>
                    <option value="convertido" ${contact.status === 'convertido' ? 'selected' : ''}>✅ Convertido</option>
                    <option value="no-interesado" ${contact.status === 'no-interesado' ? 'selected' : ''}>🔴 No Interesado</option>
                </select>
            </td>
            <td data-label="Fecha">${formatDate(contact.created_at)}</td>
            <td data-label="Acciones">
                <button class="btn-action" onclick="viewContact('${contact.id}')">👁️ Ver</button>
            </td>
        </tr>
    `).join('');
}

// Filter contacts
function filterContacts(status, btn) {
    currentFilter = status;

    // Update active button
    document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('active');
    });
    if (btn) btn.classList.add('active');

    renderContacts();
}

// Quick update status from table
async function quickUpdateStatus(id, newStatus, selectElement) {
    try {
        const response = await fetch(`${API_URL}/contacts/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: newStatus })
        });

        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }

        loadStats();
        // Show brief confirmation
        if (selectElement) {
            const row = selectElement.closest('tr');
            if (row) {
                row.style.background = 'rgba(212, 175, 55, 0.2)';
                setTimeout(() => {
                    row.style.background = '';
                }, 500);
            }
        }
        console.log('Estado actualizado:', newStatus);
    } catch (error) {
        console.error('Error updating status:', error);
        alert('Error al actualizar el estado');
    }
}

// View contact details
async function viewContact(id) {
    try {
        const response = await fetch(`${API_URL}/contacts/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const contact = await response.json();

        const detailHTML = `
            <div class="contact-details-grid">
                <div class="detail-section">
                    <h4 class="section-subtitle">📋 Información Personal</h4>
                    <div class="detail-row">
                        <span class="detail-label">Nombre</span>
                        <span class="detail-value">${contact.nombre || 'No especificado'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Email</span>
                        <span class="detail-value"><a href="mailto:${contact.email}" style="color: #D4AF37;">${contact.email || '-'}</a></span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">País</span>
                        <span class="detail-value">${contact.pais || '-'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">WhatsApp</span>
                        <span class="detail-value">
                            ${contact.telefono ? `<a href="https://wa.me/${contact.telefono.replace(/[^0-9]/g, '')}" target="_blank" style="color: #25D366;">📱 ${contact.telefono}</a>` : 'No proporcionado'}
                        </span>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4 class="section-subtitle">🐴 Perfil Ecuestre</h4>
                    <div class="detail-row">
                        <span class="detail-label">Experiencia</span>
                        <span class="detail-value">${formatValue(contact.experiencia)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Disciplina</span>
                        <span class="detail-value">${formatValue(contact.disciplina)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Coaching Previo</span>
                        <span class="detail-value">${formatValue(contact.coaching_previo)}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section full-width">
                <h4 class="section-subtitle">🎯 Retos y Objetivos</h4>
                <div class="detail-box">
                    <strong>Principales Retos:</strong><br>
                    ${contact.retos || 'No especificado'}
                </div>
                <div class="detail-box">
                    <strong>Objetivo a 3-6 meses:</strong><br>
                    ${contact.objetivo || 'No especificado'}
                </div>
                <div class="detail-box">
                    <strong>Motivación:</strong><br>
                    ${contact.motivacion || 'No especificado'}
                </div>
                <div class="detail-box">
                    <strong>Proceso Ideal:</strong><br>
                    ${contact.proceso_ideal || 'No especificado'}
                </div>
                ${contact.comentarios ? `
                <div class="detail-box">
                    <strong>Comentarios Adicionales:</strong><br>
                    ${contact.comentarios}
                </div>
                ` : ''}
            </div>
            
            <div class="detail-section full-width">
                <h4 class="section-subtitle">📊 Estado del Contacto</h4>
                <div class="status-control">
                    <select id="statusSelect" class="status-select-large">
                        <option value="nuevo" ${contact.status === 'nuevo' ? 'selected' : ''}>🔵 Nuevo</option>
                        <option value="contactado" ${contact.status === 'contactado' ? 'selected' : ''}>🟡 Contactado</option>
                        <option value="en-proceso" ${contact.status === 'en-proceso' ? 'selected' : ''}>🟢 En Proceso</option>
                        <option value="convertido" ${contact.status === 'convertido' ? 'selected' : ''}>✅ Convertido</option>
                        <option value="no-interesado" ${contact.status === 'no-interesado' ? 'selected' : ''}>🔴 No Interesado</option>
                    </select>
                    <button class="btn-save-status" onclick="saveStatus('${contact.id}')">💾 Guardar Estado</button>
                </div>
                <p style="color: #888; font-size: 0.85rem; margin-top: 0.5rem;">
                    Registrado: ${formatDateTime(contact.created_at)}
                </p>
            </div>
            
            <div class="notes-section">
                <h4 class="section-subtitle">📝 Notas de Seguimiento</h4>
                <div id="notesList">
                    ${contact.notes && contact.notes.length > 0 ? contact.notes.map(note => `
                        <div class="note-item">
                            <div class="note-meta">${formatDateTime(note.created_at)} - ${note.created_by || 'admin'}</div>
                            <div class="note-text">${note.text}</div>
                        </div>
                    `).join('') : '<p style="color: #888;">No hay notas todavía</p>'}
                </div>
                <div class="add-note-form">
                    <textarea id="newNoteText" placeholder="Agregar nota de seguimiento..."></textarea>
                    <button class="btn-add-note" onclick="addNote('${contact.id}')">➕ Agregar Nota</button>
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
        alert('✅ Estado actualizado correctamente');
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

// Legacy update status (kept for compatibility)
async function updateStatus(id) {
    viewContact(id);
}
