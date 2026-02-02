// SPEXOR - Main Application JavaScript
// Full CRUD Functionality

// ================================
// STATE MANAGEMENT
// ================================

const state = {
    currentPage: 'dashboard',
    editingItem: null,
    deleteCallback: null,
    currentCaseId: null,
    cases: [
        { id: 'VV-2026-015', title: 'Vụ án tài chính ABC Corp', description: '', assignees: [1, 2], files: 8, alerts: 5, date: '22/01/2026' },
        { id: 'VV-2026-014', title: 'Điều tra nội bộ XYZ', description: '', assignees: [2], files: 12, alerts: 3, date: '20/01/2026' },
        { id: 'VV-2026-013', title: 'Vụ việc phòng chống tham nhũng', description: '', assignees: [1, 2, 3], files: 3, alerts: 0, date: '19/01/2026' }
    ],
    users: [
        { id: 1, fullname: 'Nguyễn Văn Admin', username: 'admin', email: 'admin@spexor.local', role: 'admin', active: true },
        { id: 2, fullname: 'Trần Văn Điều Tra', username: 'tran.dieutra', email: 'tran.dieutra@spexor.local', role: 'investigator', active: true },
        { id: 3, fullname: 'Lê Thị Xem', username: 'le.xem', email: 'le.xem@spexor.local', role: 'viewer', active: true }
    ],
    speakers: [
        { id: 1, name: 'Đối tượng A', alias: 'Anh Hai', gender: 'male', cases: 5, duration: '2h 30m' },
        { id: 2, name: 'Đối tượng B', alias: 'Sếp', gender: 'male', cases: 3, duration: '1h 45m' }
    ],
    alertWords: [
        { id: 1, word: 'tiền mặt', category: 'financial', description: 'Từ khóa liên quan đến giao dịch tiền mặt' },
        { id: 2, word: 'chuyển khoản', category: 'financial', description: 'Từ khóa liên quan đến chuyển tiền ngân hàng' },
        { id: 3, word: 'gặp mặt', category: 'other', description: 'Từ khóa về cuộc hẹn gặp trực tiếp' }
    ],
    replacements: [
        { id: 1, original: 'hà nội', correct: 'Hà Nội', category: 'location' },
        { id: 2, original: 'tp hcm', correct: 'TP. Hồ Chí Minh', category: 'location' },
        { id: 3, original: 'bộ ca', correct: 'Bộ Công an', category: 'organization' }
    ],
    notifications: [
        { id: 1, type: 'alert', action: 'detect', message: 'Phát hiện từ khóa <strong>"tiền mặt"</strong> trong file audio_023.mp3', user: 'Hệ thống', target: 'audio_023.mp3', timestamp: new Date('2026-01-29T09:23:00'), read: false },
        { id: 2, type: 'success', action: 'complete', message: 'Transcription hoàn thành cho <strong>cuoc_goi_002.wav</strong>', user: 'Hệ thống', target: 'cuoc_goi_002.wav', timestamp: new Date('2026-01-29T08:58:00'), read: false },
        { id: 3, type: 'crud', action: 'create', message: 'Người dùng <strong>Admin</strong> đã tạo sự vụ <strong>VV-2026-016</strong>', user: 'Admin', target: 'VV-2026-016', timestamp: new Date('2026-01-29T08:30:00'), read: false },
        { id: 4, type: 'crud', action: 'update', message: 'Người dùng <strong>Trần Điều Tra</strong> đã cập nhật transcript cho <strong>audio_025.mp3</strong>', user: 'Trần Điều Tra', target: 'audio_025.mp3', timestamp: new Date('2026-01-29T08:15:00'), read: true },
        { id: 5, type: 'crud', action: 'delete', message: 'Người dùng <strong>Admin</strong> đã xóa file audio <strong>cuoc_goi_old.wav</strong>', user: 'Admin', target: 'cuoc_goi_old.wav', timestamp: new Date('2026-01-29T07:45:00'), read: true },
        { id: 6, type: 'crud', action: 'create', message: 'Người dùng <strong>Admin</strong> đã thêm người dùng mới <strong>Lê Văn Mới</strong>', user: 'Admin', target: 'Lê Văn Mới', timestamp: new Date('2026-01-28T16:30:00'), read: true },
        { id: 7, type: 'crud', action: 'update', message: 'Người dùng <strong>Trần Điều Tra</strong> đã cập nhật hồ sơ người nói <strong>Đối tượng C</strong>', user: 'Trần Điều Tra', target: 'Đối tượng C', timestamp: new Date('2026-01-28T15:00:00'), read: true },
        { id: 8, type: 'system', action: 'export', message: 'Người dùng <strong>Admin</strong> đã export báo cáo sự vụ <strong>VV-2026-015</strong>', user: 'Admin', target: 'VV-2026-015', timestamp: new Date('2026-01-28T14:00:00'), read: true },
        { id: 9, type: 'system', action: 'import', message: 'Người dùng <strong>Admin</strong> đã import <strong>50 từ khóa cảnh báo</strong> mới', user: 'Admin', target: 'Từ khóa cảnh báo', timestamp: new Date('2026-01-28T10:30:00'), read: true },
        { id: 10, type: 'system', action: 'login', message: 'Người dùng <strong>Trần Điều Tra</strong> đã đăng nhập hệ thống', user: 'Trần Điều Tra', target: '', timestamp: new Date('2026-01-28T08:00:00'), read: true },
        { id: 11, type: 'system', action: 'logout', message: 'Người dùng <strong>Lê Thị Xem</strong> đã đăng xuất', user: 'Lê Thị Xem', target: '', timestamp: new Date('2026-01-27T17:30:00'), read: true },
        { id: 12, type: 'alert', action: 'detect', message: 'Phát hiện từ khóa <strong>"chuyển khoản"</strong> trong file audio_020.mp3', user: 'Hệ thống', target: 'audio_020.mp3', timestamp: new Date('2026-01-27T14:00:00'), read: true }
    ],
    notificationFilter: { type: 'all', dateFrom: '', dateTo: '' }
};

// ================================
// NAVIGATION
// ================================

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function (e) {
        e.preventDefault();
        const page = this.dataset.page;
        if (page) {
            showPage(page);
        }
    });
});

function showPage(pageName) {
    state.currentPage = pageName;

    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    const targetPage = document.getElementById('page-' + pageName);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === pageName) {
            item.classList.add('active');
        }
    });
}

// ================================
// MODAL FUNCTIONS
// ================================

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        // Reset form if exists
        const form = modal.querySelector('form');
        if (form) form.reset();
        state.editingItem = null;
    }
}

// Close modal on outside click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function (e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });
});

// Close modal on Escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
    }
});

// ================================
// UTILITY FUNCTIONS
// ================================

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// ================================
// TOAST NOTIFICATIONS
// ================================

function showToast(type, title, message) {
    const container = document.getElementById('toast-container');
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${icons[type]}</span>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;

    container.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// ================================
// CASE CRUD
// ================================

function showCaseModal(caseId = null) {
    state.editingItem = caseId;
    const title = document.getElementById('case-modal-title');

    if (caseId) {
        title.textContent = 'Chỉnh sửa sự vụ';
        const caseData = state.cases.find(c => c.id === caseId);
        if (caseData) {
            document.getElementById('case-id').value = caseData.id;
            document.getElementById('case-code').value = caseData.id;
            document.getElementById('case-title').value = caseData.title;
        }
    } else {
        title.textContent = 'Thêm sự vụ mới';
        // Generate new case code
        const nextNum = state.cases.length + 1;
        document.getElementById('case-code').value = `VV-2026-${String(nextNum).padStart(3, '0')}`;
    }

    // Clear audio files list
    caseAudioFiles = [];
    document.getElementById('case-uploaded-list').innerHTML = '';

    openModal('modal-case');
}

let caseAudioFiles = [];

function handleCaseAudioFiles(files) {
    const listEl = document.getElementById('case-uploaded-list');

    for (const file of files) {
        caseAudioFiles.push(file);
        const item = document.createElement('div');
        item.className = 'uploaded-file-item';
        item.innerHTML = `
            <span class="file-icon">🎵</span>
            <div class="file-info">
                <div class="file-name">${file.name}</div>
                <div class="file-size">${formatFileSize(file.size)}</div>
            </div>
            <button class="file-remove" onclick="removeCaseAudioFile('${file.name}')">✕</button>
        `;
        listEl.appendChild(item);
    }
}

function removeCaseAudioFile(fileName) {
    caseAudioFiles = caseAudioFiles.filter(f => f.name !== fileName);
    const listEl = document.getElementById('case-uploaded-list');
    listEl.innerHTML = '';
    caseAudioFiles.forEach(file => {
        const item = document.createElement('div');
        item.className = 'uploaded-file-item';
        item.innerHTML = `
            <span class="file-icon">🎵</span>
            <div class="file-info">
                <div class="file-name">${file.name}</div>
                <div class="file-size">${formatFileSize(file.size)}</div>
            </div>
            <button class="file-remove" onclick="removeCaseAudioFile('${file.name}')">✕</button>
        `;
        listEl.appendChild(item);
    });
}

function saveCase() {
    const code = document.getElementById('case-code').value;
    const title = document.getElementById('case-title').value;
    const description = document.getElementById('case-description').value;

    if (!code || !title) {
        showToast('error', 'Lỗi', 'Vui lòng điền đầy đủ thông tin bắt buộc');
        return;
    }

    if (state.editingItem) {
        // Update existing
        const index = state.cases.findIndex(c => c.id === state.editingItem);
        if (index !== -1) {
            state.cases[index] = { ...state.cases[index], id: code, title, description };
        }
        showToast('success', 'Thành công', 'Đã cập nhật sự vụ');
    } else {
        // Create new
        state.cases.unshift({
            id: code,
            title,
            description,
            assignees: [],
            files: caseAudioFiles.length,
            alerts: 0,
            date: new Date().toLocaleDateString('vi-VN')
        });

        if (caseAudioFiles.length > 0) {
            showToast('success', 'Thành công', `Đã tạo sự vụ mới với ${caseAudioFiles.length} file audio. Đang xử lý phân tích...`);
        } else {
            showToast('success', 'Thành công', 'Đã tạo sự vụ mới');
        }
    }

    closeModal('modal-case');
    caseAudioFiles = [];
    renderCasesTable();
}

function viewCase(caseId) {
    const caseData = state.cases.find(c => c.id === caseId);
    if (!caseData) return;

    document.getElementById('view-modal-title').textContent = 'Chi tiết Sự vụ';
    document.getElementById('view-content').innerHTML = `
        <div class="detail-section">
            <h4>📁 Thông tin sự vụ</h4>
            <div class="detail-grid">
                <span class="detail-label">Mã sự vụ:</span>
                <span class="detail-value"><strong>${caseData.id}</strong></span>
                <span class="detail-label">Tiêu đề:</span>
                <span class="detail-value">${caseData.title}</span>
                <span class="detail-label">Số file audio:</span>
                <span class="detail-value">${caseData.files}</span>
                <span class="detail-label">Cảnh báo:</span>
                <span class="detail-value">${caseData.alerts}</span>
                <span class="detail-label">Ngày tạo:</span>
                <span class="detail-value">${caseData.date}</span>
            </div>
        </div>
    `;

    state.editingItem = { type: 'case', id: caseId };
    openModal('modal-view');
}

function deleteCase(caseId) {
    document.getElementById('delete-message').textContent =
        `Bạn có chắc chắn muốn xóa sự vụ "${caseId}"?`;
    state.deleteCallback = () => {
        state.cases = state.cases.filter(c => c.id !== caseId);
        renderCasesTable();
        showToast('success', 'Đã xóa', 'Sự vụ đã được xóa thành công');
    };
    openModal('modal-delete');
}

function openCaseWorkspace(caseId) {
    state.currentCaseId = caseId;
    const caseData = state.cases.find(c => c.id === caseId);
    if (caseData) {
        // Update workspace header with case info
        document.getElementById('workspace-case-id').textContent = caseData.id;
        document.getElementById('workspace-case-title').value = caseData.title;
        document.getElementById('workspace-case-description').value = caseData.description || '';

        // Update breadcrumb
        const breadcrumb = document.querySelector('.workspace-breadcrumb');
        if (breadcrumb) {
            breadcrumb.innerHTML = `<a href="#" onclick="showPage('cases')">Sự vụ</a> / ${caseData.id} - ${caseData.title}`;
        }
    }
    showPage('workspace');
}

function saveCaseFromWorkspace() {
    if (!state.currentCaseId) return;

    const title = document.getElementById('workspace-case-title').value;
    const description = document.getElementById('workspace-case-description').value;

    const index = state.cases.findIndex(c => c.id === state.currentCaseId);
    if (index !== -1) {
        state.cases[index].title = title;
        state.cases[index].description = description;
        showToast('success', 'Đã lưu', 'Thông tin sự vụ đã được cập nhật');

        // Update breadcrumb
        const breadcrumb = document.querySelector('.workspace-breadcrumb');
        if (breadcrumb) {
            breadcrumb.innerHTML = `<a href="#" onclick="showPage('cases')">Sự vụ</a> / ${state.currentCaseId} - ${title}`;
        }
    }
}

function renderCasesTable() {
    const tbody = document.querySelector('#page-cases tbody');
    if (!tbody) return;

    tbody.innerHTML = state.cases.map(c => `
        <tr>
            <td><span class="case-id">${c.id}</span></td>
            <td>${c.title}</td>
            <td>${c.files}</td>
            <td><span class="alert-count">${c.alerts}</span></td>
            <td>${c.date}</td>
            <td class="actions" onclick="event.stopPropagation()">
                <button class="btn-icon" title="Sửa" onclick="openCaseWorkspace('${c.id}')">✏️</button>
                <button class="btn-icon" title="Xóa" onclick="deleteCase('${c.id}')">🗑️</button>
            </td>
        </tr>
    `).join('');
}

// ================================
// USER CRUD
// ================================

function showUserModal(userId = null) {
    state.editingItem = userId;
    const title = document.getElementById('user-modal-title');

    if (userId) {
        title.textContent = 'Chỉnh sửa người dùng';
        const user = state.users.find(u => u.id === userId);
        if (user) {
            document.getElementById('user-id').value = user.id;
            document.getElementById('user-fullname').value = user.fullname;
            document.getElementById('user-username').value = user.username;
            document.getElementById('user-email').value = user.email;
            document.getElementById('user-role').value = user.role;
            document.getElementById('user-active').checked = user.active;
        }
    } else {
        title.textContent = 'Thêm người dùng mới';
    }

    openModal('modal-user');
}

function saveUser() {
    const fullname = document.getElementById('user-fullname').value;
    const username = document.getElementById('user-username').value;
    const email = document.getElementById('user-email').value;
    const role = document.getElementById('user-role').value;
    const active = document.getElementById('user-active').checked;

    if (!fullname || !username || !email) {
        showToast('error', 'Lỗi', 'Vui lòng điền đầy đủ thông tin bắt buộc');
        return;
    }

    if (state.editingItem) {
        const index = state.users.findIndex(u => u.id === state.editingItem);
        if (index !== -1) {
            state.users[index] = { ...state.users[index], fullname, username, email, role, active };
        }
        showToast('success', 'Thành công', 'Đã cập nhật người dùng');
    } else {
        state.users.push({
            id: Date.now(),
            fullname, username, email, role, active
        });
        showToast('success', 'Thành công', 'Đã tạo người dùng mới');
    }

    closeModal('modal-user');
    renderUsersGrid();
}

function deleteUser(userId) {
    const user = state.users.find(u => u.id === userId);
    document.getElementById('delete-message').textContent =
        `Bạn có chắc chắn muốn xóa người dùng "${user?.fullname}"?`;
    state.deleteCallback = () => {
        state.users = state.users.filter(u => u.id !== userId);
        renderUsersGrid();
        showToast('success', 'Đã xóa', 'Người dùng đã được xóa');
    };
    openModal('modal-delete');
}

function renderUsersGrid() {
    const grid = document.querySelector('#page-users .users-grid');
    if (!grid) return;

    const roleColors = { admin: 'admin', supervisor: 'supervisor', investigator: 'investigator', viewer: 'viewer' };
    const roleNames = { admin: 'Admin', supervisor: 'Giám sát', investigator: 'Điều tra viên', viewer: 'Người xem' };

    grid.innerHTML = state.users.map(u => `
        <div class="user-card">
            <div class="user-avatar ${roleColors[u.role]}">${u.fullname.charAt(0)}</div>
            <div class="user-info">
                <h4>${u.fullname}</h4>
                <span class="role ${u.role}">${roleNames[u.role]}</span>
                <p>${u.email}</p>
            </div>
            <div class="user-actions">
                <button class="btn-icon" onclick="showUserModal(${u.id})" title="Sửa">✏️</button>
                <button class="btn-icon" onclick="deleteUser(${u.id})" title="Xóa">🗑️</button>
            </div>
        </div>
    `).join('');
}

// ================================
// SPEAKER CRUD
// ================================

function showSpeakerModal(speakerId = null) {
    state.editingItem = speakerId;
    const title = document.getElementById('speaker-modal-title');

    if (speakerId) {
        title.textContent = 'Chỉnh sửa người nói';
        const speaker = state.speakers.find(s => s.id === speakerId);
        if (speaker) {
            document.getElementById('speaker-id').value = speaker.id;
            document.getElementById('speaker-name').value = speaker.name;
            document.getElementById('speaker-alias').value = speaker.alias;
            document.getElementById('speaker-gender').value = speaker.gender;
        }
    } else {
        title.textContent = 'Thêm người nói mới';
    }

    // Clear voice samples from previous session
    clearVoiceSamples();

    openModal('modal-speaker');
}

// Voice Samples handling
let voiceSamples = [];
let currentPlayingIndex = -1;

function handleVoiceSamples(files) {
    for (const file of files) {
        // Create object URL for playback
        const url = URL.createObjectURL(file);
        voiceSamples.push({
            id: Date.now() + Math.random(),
            name: file.name,
            size: file.size,
            file: file,
            url: url,
            duration: null
        });

        // Get duration
        const audio = new Audio(url);
        audio.addEventListener('loadedmetadata', function () {
            const sample = voiceSamples.find(s => s.url === url);
            if (sample) {
                sample.duration = audio.duration;
                renderVoiceSamplesList();
            }
        });
    }
    renderVoiceSamplesList();
}

function renderVoiceSamplesList() {
    const listEl = document.getElementById('voice-samples-list');
    if (!listEl) return;

    if (voiceSamples.length === 0) {
        listEl.innerHTML = '';
        return;
    }

    listEl.innerHTML = voiceSamples.map((sample, index) => `
        <div class="voice-sample-item" data-index="${index}">
            <span class="sample-icon">🎵</span>
            <div class="sample-info">
                <div class="sample-name">${sample.name}</div>
                <div class="sample-meta">
                    <span>${formatFileSize(sample.size)}</span>
                    <span>${sample.duration ? formatDuration(sample.duration) : 'Đang tải...'}</span>
                </div>
                <div class="sample-progress">
                    <div class="progress-bar" id="progress-${index}"></div>
                </div>
            </div>
            <div class="sample-actions">
                <button class="btn-play ${currentPlayingIndex === index ? 'playing' : ''}" onclick="toggleVoiceSample(${index})" title="Phát/Dừng">
                    ${currentPlayingIndex === index ? '⏸️' : '▶️'}
                </button>
                <button class="btn-delete" onclick="removeVoiceSample(${index})" title="Xóa">🗑️</button>
            </div>
        </div>
    `).join('');
}

function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function toggleVoiceSample(index) {
    const player = document.getElementById('voice-sample-player');
    if (!player) return;

    if (currentPlayingIndex === index) {
        // Pause current
        player.pause();
        currentPlayingIndex = -1;
        renderVoiceSamplesList();
    } else {
        // Play new
        const sample = voiceSamples[index];
        if (sample) {
            player.src = sample.url;
            player.play();
            currentPlayingIndex = index;
            renderVoiceSamplesList();

            // Update progress
            player.ontimeupdate = () => {
                const progressBar = document.getElementById(`progress-${index}`);
                if (progressBar && sample.duration) {
                    const percent = (player.currentTime / sample.duration) * 100;
                    progressBar.style.width = percent + '%';
                }
            };

            player.onended = () => {
                currentPlayingIndex = -1;
                renderVoiceSamplesList();
            };
        }
    }
}

function removeVoiceSample(index) {
    const player = document.getElementById('voice-sample-player');

    // Stop if playing
    if (currentPlayingIndex === index) {
        player?.pause();
        currentPlayingIndex = -1;
    }

    // Revoke URL to free memory
    URL.revokeObjectURL(voiceSamples[index].url);

    // Remove from array
    voiceSamples.splice(index, 1);

    // Adjust current playing index if needed
    if (currentPlayingIndex > index) {
        currentPlayingIndex--;
    }

    renderVoiceSamplesList();
    showToast('info', 'Đã xóa', 'Đã xóa voice sample');
}

function clearVoiceSamples() {
    const player = document.getElementById('voice-sample-player');
    player?.pause();
    currentPlayingIndex = -1;

    voiceSamples.forEach(s => URL.revokeObjectURL(s.url));
    voiceSamples = [];
    renderVoiceSamplesList();
}

function saveSpeaker() {
    const name = document.getElementById('speaker-name').value;
    const alias = document.getElementById('speaker-alias').value;
    const gender = document.getElementById('speaker-gender').value;

    if (!name) {
        showToast('error', 'Lỗi', 'Vui lòng nhập tên người nói');
        return;
    }

    if (state.editingItem) {
        const index = state.speakers.findIndex(s => s.id === state.editingItem);
        if (index !== -1) {
            state.speakers[index] = { ...state.speakers[index], name, alias, gender };
        }
        showToast('success', 'Thành công', 'Đã cập nhật người nói');
    } else {
        state.speakers.push({
            id: Date.now(),
            name, alias, gender, cases: 0, duration: '0h 0m'
        });
        showToast('success', 'Thành công', 'Đã thêm người nói mới');
    }

    closeModal('modal-speaker');
    renderSpeakersGrid();
}

function renderSpeakersGrid() {
    const grid = document.querySelector('#page-speakers .speakers-grid');
    if (!grid) return;

    grid.innerHTML = state.speakers.map(s => `
        <div class="speaker-card">
            <div class="speaker-photo">👤</div>
            <div class="speaker-details">
                <h4>${s.name}</h4>
                <span class="speaker-alias">Biệt danh: "${s.alias}"</span>
                <div class="speaker-stats">
                    <span>📁 ${s.cases} sự vụ</span>
                    <span>🕐 ${s.duration}</span>
                </div>
            </div>
            <div class="speaker-actions">
                <button class="btn btn-sm">🎤 Voice Profile</button>
                <button class="btn-icon" onclick="showSpeakerModal(${s.id})">✏️</button>
            </div>
        </div>
    `).join('');
}

// ================================
// ALERT WORD CRUD
// ================================

function showAlertWordModal(wordId = null) {
    state.editingItem = wordId;
    const title = document.getElementById('alert-word-modal-title');

    if (wordId) {
        title.textContent = 'Chỉnh sửa từ khóa cảnh báo';
        const word = state.alertWords.find(w => w.id === wordId);
        if (word) {
            document.getElementById('alert-word-id').value = word.id;
            document.getElementById('alert-word-text').value = word.word;
            document.getElementById('alert-word-category').value = word.category;
            document.getElementById('alert-word-priority').value = word.priority;
            document.getElementById('alert-word-active').checked = word.active;
        }
    } else {
        title.textContent = 'Thêm từ khóa cảnh báo';
    }

    openModal('modal-alert-word');
}

function saveAlertWord() {
    const word = document.getElementById('alert-word-text').value;
    const category = document.getElementById('alert-word-category').value;
    const priority = document.getElementById('alert-word-priority').value;
    const active = document.getElementById('alert-word-active').checked;

    if (!word) {
        showToast('error', 'Lỗi', 'Vui lòng nhập từ khóa');
        return;
    }

    if (state.editingItem) {
        const index = state.alertWords.findIndex(w => w.id === state.editingItem);
        if (index !== -1) {
            state.alertWords[index] = { ...state.alertWords[index], word, category, priority, active };
        }
        showToast('success', 'Thành công', 'Đã cập nhật từ khóa');
    } else {
        state.alertWords.push({ id: Date.now(), word, category, priority, active });
        showToast('success', 'Thành công', 'Đã thêm từ khóa mới');
    }

    closeModal('modal-alert-word');
    renderAlertWordsTable();
}

function deleteAlertWord(wordId) {
    const word = state.alertWords.find(w => w.id === wordId);
    document.getElementById('delete-message').textContent =
        `Bạn có chắc chắn muốn xóa từ khóa "${word?.word}"?`;
    state.deleteCallback = () => {
        state.alertWords = state.alertWords.filter(w => w.id !== wordId);
        renderAlertWordsTable();
        showToast('success', 'Đã xóa', 'Từ khóa đã được xóa');
    };
    openModal('modal-delete');
}

function renderAlertWordsTable() {
    const tbody = document.querySelector('#page-alert-words tbody');
    if (!tbody) return;

    const categoryNames = {
        financial: 'Tài chính', violence: 'Bạo lực', drugs: 'Ma túy',
        corruption: 'Tham nhũng', terrorism: 'Khủng bố', inappropriate: 'Không phù hợp', other: 'Khác'
    };
    const priorityNames = { high: 'Cao', medium: 'Trung bình', low: 'Thấp' };

    tbody.innerHTML = state.alertWords.map(w => `
        <tr>
            <td><span class="keyword">${w.word}</span></td>
            <td>${categoryNames[w.category] || w.category}</td>
            <td><span class="priority ${w.priority}">${priorityNames[w.priority]}</span></td>
            <td><span class="toggle ${w.active ? 'active' : ''}" onclick="toggleAlertWord(${w.id})"></span></td>
            <td class="actions">
                <button class="btn-icon" onclick="showAlertWordModal(${w.id})">✏️</button>
                <button class="btn-icon" onclick="deleteAlertWord(${w.id})">🗑️</button>
            </td>
        </tr>
    `).join('');
}

function toggleAlertWord(wordId) {
    const word = state.alertWords.find(w => w.id === wordId);
    if (word) {
        word.active = !word.active;
        renderAlertWordsTable();
    }
}

// ================================
// REPLACEMENT WORD CRUD
// ================================

function showReplacementModal(repId = null) {
    state.editingItem = repId;
    const title = document.getElementById('replacement-modal-title');

    if (repId) {
        title.textContent = 'Chỉnh sửa từ thay thế';
        const rep = state.replacements.find(r => r.id === repId);
        if (rep) {
            document.getElementById('replacement-id').value = rep.id;
            document.getElementById('replacement-original').value = rep.original;
            document.getElementById('replacement-correct').value = rep.correct;
            document.getElementById('replacement-category').value = rep.category;
        }
    } else {
        title.textContent = 'Thêm từ ngữ thay thế';
    }

    openModal('modal-replacement');
}

function saveReplacement() {
    const original = document.getElementById('replacement-original').value;
    const correct = document.getElementById('replacement-correct').value;
    const category = document.getElementById('replacement-category').value;

    if (!original || !correct) {
        showToast('error', 'Lỗi', 'Vui lòng nhập đầy đủ từ gốc và từ đúng');
        return;
    }

    if (state.editingItem) {
        const index = state.replacements.findIndex(r => r.id === state.editingItem);
        if (index !== -1) {
            state.replacements[index] = { ...state.replacements[index], original, correct, category };
        }
        showToast('success', 'Thành công', 'Đã cập nhật từ thay thế');
    } else {
        state.replacements.push({ id: Date.now(), original, correct, category });
        showToast('success', 'Thành công', 'Đã thêm từ thay thế mới');
    }

    closeModal('modal-replacement');
    renderReplacementsTable();
}

function deleteReplacement(repId) {
    const rep = state.replacements.find(r => r.id === repId);
    document.getElementById('delete-message').textContent =
        `Bạn có chắc chắn muốn xóa từ thay thế "${rep?.original}" → "${rep?.correct}"?`;
    state.deleteCallback = () => {
        state.replacements = state.replacements.filter(r => r.id !== repId);
        renderReplacementsTable();
        showToast('success', 'Đã xóa', 'Từ thay thế đã được xóa');
    };
    openModal('modal-delete');
}

function renderReplacementsTable() {
    const tbody = document.querySelector('#page-replacements tbody');
    if (!tbody) return;

    const categoryNames = {
        location: 'Địa danh', organization: 'Tổ chức', person: 'Tên người',
        medical: 'Y khoa', legal: 'Pháp lý', technical: 'Kỹ thuật', abbreviation: 'Viết tắt', other: 'Khác'
    };

    tbody.innerHTML = state.replacements.map(r => `
        <tr>
            <td><span class="word-original">${r.original}</span></td>
            <td>→</td>
            <td><span class="word-correct">${r.correct}</span></td>
            <td>${categoryNames[r.category] || r.category}</td>
            <td class="actions">
                <button class="btn-icon" onclick="showReplacementModal(${r.id})">✏️</button>
                <button class="btn-icon" onclick="deleteReplacement(${r.id})">🗑️</button>
            </td>
        </tr>
    `).join('');
}

// ================================
// DELETE CONFIRMATION
// ================================

function confirmDelete() {
    if (state.deleteCallback) {
        state.deleteCallback();
        state.deleteCallback = null;
    }
    closeModal('modal-delete');
}

// ================================
// EDIT FROM VIEW
// ================================

function editFromView() {
    closeModal('modal-view');
    if (state.editingItem) {
        if (state.editingItem.type === 'case') {
            showCaseModal(state.editingItem.id);
        }
    }
}

// ================================
// UPLOAD FILES
// ================================

let uploadedFiles = [];

function showUploadModal() {
    uploadedFiles = [];
    document.getElementById('upload-list').innerHTML = '';
    openModal('modal-upload');
}

document.getElementById('audio-files')?.addEventListener('change', function (e) {
    handleFiles(e.target.files);
});

function handleFiles(files) {
    const listEl = document.getElementById('upload-list');

    for (const file of files) {
        uploadedFiles.push(file);
        const item = document.createElement('div');
        item.className = 'upload-item';
        item.innerHTML = `
            <span>🎵</span>
            <div class="upload-item-info">
                <div class="upload-item-name">${file.name}</div>
                <div class="upload-item-size">${formatFileSize(file.size)}</div>
            </div>
            <button class="upload-item-remove" onclick="removeUploadFile('${file.name}')">×</button>
        `;
        listEl.appendChild(item);
    }
}

function removeUploadFile(fileName) {
    uploadedFiles = uploadedFiles.filter(f => f.name !== fileName);
    const listEl = document.getElementById('upload-list');
    listEl.innerHTML = '';
    uploadedFiles.forEach(file => {
        const item = document.createElement('div');
        item.className = 'upload-item';
        item.innerHTML = `
            <span>🎵</span>
            <div class="upload-item-info">
                <div class="upload-item-name">${file.name}</div>
                <div class="upload-item-size">${formatFileSize(file.size)}</div>
            </div>
            <button class="upload-item-remove" onclick="removeUploadFile('${file.name}')">×</button>
        `;
        listEl.appendChild(item);
    });
}

function uploadFiles() {
    if (uploadedFiles.length === 0) {
        showToast('warning', 'Chưa chọn file', 'Vui lòng chọn ít nhất một file audio');
        return;
    }

    closeModal('modal-upload');
    showToast('success', 'Đang upload', `${uploadedFiles.length} file đang được upload và xử lý...`);

    // Simulate upload complete
    setTimeout(() => {
        showToast('success', 'Hoàn thành', `Đã upload thành công ${uploadedFiles.length} file`);
    }, 2000);
}

// ================================
// EXPORT
// ================================

function showExportModal() {
    openModal('modal-export');
}

function doExport() {
    const format = document.querySelector('input[name="export-format"]:checked')?.value;
    closeModal('modal-export');
    showToast('info', 'Đang xuất file', `Đang tạo file ${format?.toUpperCase()}...`);

    setTimeout(() => {
        showToast('success', 'Xuất thành công', `File đã được lưu vào thư mục Downloads`);
    }, 1500);
}

// ================================
// TIME ADJUSTMENT
// ================================

function adjustTime(inputId, delta) {
    const input = document.getElementById(inputId);
    if (!input) return;

    const parts = input.value.split(':').map(Number);
    let hours = parts[0] || 0;
    let minutes = parts[1] || 0;
    let seconds = parts[2] || 0;

    // Convert to total seconds and adjust
    let totalSeconds = hours * 3600 + minutes * 60 + seconds + delta;
    if (totalSeconds < 0) totalSeconds = 0;

    // Convert back
    hours = Math.floor(totalSeconds / 3600);
    minutes = Math.floor((totalSeconds % 3600) / 60);
    seconds = totalSeconds % 60;

    input.value = [hours, minutes, seconds]
        .map(v => String(v).padStart(2, '0'))
        .join(':');
}

// ================================
// AUDIO RE-ANALYZE
// ================================

function reanalyzeAudio(fileId, event) {
    if (event) event.stopPropagation();

    // Get file name from the audio item
    const audioItem = document.querySelector(`.audio-item[data-file-id="${fileId}"]`);
    const fileName = audioItem?.querySelector('.audio-name')?.textContent || `File ${fileId}`;

    // Confirm re-analysis
    if (!confirm(`Bạn có chắc muốn phân tích lại "${fileName}"?\nĐiều này sẽ tải lại toàn bộ transcript và các thay đổi hiện tại sẽ bị mất.`)) {
        return;
    }

    // Update status to processing
    const statusIcon = audioItem?.querySelector('.audio-status');
    if (statusIcon) {
        statusIcon.className = 'audio-status processing';
        statusIcon.textContent = '⏳';
    }

    showToast('info', 'Đang phân tích lại', `File "${fileName}" đang được xử lý...`);

    // Simulate re-analysis completion after 2 seconds
    setTimeout(() => {
        if (statusIcon) {
            statusIcon.className = 'audio-status completed';
            statusIcon.textContent = '✓';
        }
        showToast('success', 'Hoàn thành', `Đã phân tích lại "${fileName}". Transcript đã được tải lại.`);

        // Here you would reload the transcript data from backend
        // For demo, we just show the toast
    }, 2000);
}

// ================================
// AUDIO PLAYER
// ================================

let isPlaying = false;
const playBtn = document.querySelector('.play-btn');
if (playBtn) {
    playBtn.addEventListener('click', function () {
        isPlaying = !isPlaying;
        this.textContent = isPlaying ? '⏸️' : '▶️';
    });
}

// Transcript segment click
document.querySelectorAll('.transcript-segment').forEach(segment => {
    segment.addEventListener('click', function () {
        document.querySelectorAll('.transcript-segment').forEach(s => s.classList.remove('active'));
        this.classList.add('active');
    });
});

function jumpToTime(seconds) {
    const progress = (seconds / 332) * 100;
    const progressBar = document.querySelector('.waveform-progress');
    if (progressBar) {
        progressBar.style.width = progress + '%';
    }
}

// ================================
// AI SUMMARY FUNCTIONS
// ================================

function changeSummaryLevel(level) {
    // Update button states
    document.querySelectorAll('.level-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase().includes(getLevelText(level).toLowerCase())) {
            btn.classList.add('active');
        }
    });

    // Hide all summary cards
    document.getElementById('summary-content')?.classList.add('hidden');
    document.getElementById('summary-short')?.classList.add('hidden');
    document.getElementById('summary-detailed')?.classList.add('hidden');

    // Show the selected one
    if (level === 'short') {
        document.getElementById('summary-short')?.classList.remove('hidden');
    } else if (level === 'detailed') {
        document.getElementById('summary-detailed')?.classList.remove('hidden');
    } else {
        document.getElementById('summary-content')?.classList.remove('hidden');
    }

    showToast('info', 'Đã thay đổi', `Hiển thị tóm tắt mức: ${getLevelText(level)}`);
}

function getLevelText(level) {
    switch (level) {
        case 'short': return 'Ngắn';
        case 'detailed': return 'Chi tiết';
        default: return 'Trung bình';
    }
}

function copySummary() {
    // Get visible summary card
    const visibleCard = document.querySelector('.summary-content-card:not(.hidden)');
    if (visibleCard) {
        const text = visibleCard.innerText;
        navigator.clipboard.writeText(text).then(() => {
            showToast('success', 'Đã sao chép', 'Nội dung tóm tắt đã được sao chép');
        }).catch(() => {
            showToast('error', 'Lỗi', 'Không thể sao chép nội dung');
        });
    }
}

function scrollToSummary() {
    const summaryPanel = document.querySelector('.summary-panel');
    if (summaryPanel) {
        summaryPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ================================
// TRANSCRIPT SEGMENT DELETE/RESTORE
// ================================

let deletedSegments = [];

function deleteSegment(segmentId) {
    const segment = document.querySelector(`[data-segment-id="${segmentId}"]`);
    if (segment) {
        segment.classList.add('deleted');
        deletedSegments.push(segmentId);
        updateRestoreBar();
        showToast('info', 'Đã ẩn', 'Đoạn transcript đã được ẩn');
    }
}

function restoreAllSegments() {
    deletedSegments.forEach(id => {
        const segment = document.querySelector(`[data-segment-id="${id}"]`);
        if (segment) {
            segment.classList.remove('deleted');
        }
    });
    deletedSegments = [];
    updateRestoreBar();
    showToast('success', 'Đã khôi phục', 'Tất cả đoạn transcript đã được khôi phục');
}

function updateRestoreBar() {
    const restoreBar = document.getElementById('restore-bar');
    const deletedCount = document.getElementById('deleted-count');

    if (deletedSegments.length > 0) {
        restoreBar?.classList.remove('hidden');
        if (deletedCount) deletedCount.textContent = deletedSegments.length;
    } else {
        restoreBar?.classList.add('hidden');
    }
}

// ================================
// AUDIO FILE DELETE
// ================================

function deleteAudioFile(fileId, event) {
    event.stopPropagation();

    document.getElementById('delete-message').textContent =
        `Bạn có chắc chắn muốn xóa file audio này?`;

    state.deleteCallback = () => {
        const audioItem = document.querySelector(`[data-file-id="${fileId}"]`);
        if (audioItem) {
            audioItem.style.opacity = '0';
            audioItem.style.transform = 'translateX(-100%)';
            setTimeout(() => {
                audioItem.remove();
            }, 300);
        }
        showToast('success', 'Đã xóa', 'File audio đã được xóa');
    };

    openModal('modal-delete');
}

// ================================
// HELPER FUNCTIONS
// ================================

function getStatusText(status) {
    const texts = { new: 'Mới', processing: 'Đang xử lý', completed: 'Hoàn thành', archived: 'Lưu trữ' };
    return texts[status] || status;
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// ================================
// BUTTON EVENT BINDINGS
// ================================

// Dashboard add case button
document.querySelector('#page-dashboard .btn-primary')?.addEventListener('click', () => showCaseModal());

// Cases page add button
document.querySelector('#page-cases .btn-primary')?.addEventListener('click', () => showCaseModal());

// Users page add button
document.querySelector('#page-users .btn-primary')?.addEventListener('click', () => showUserModal());

// Speakers page add button
document.querySelector('#page-speakers .btn-primary')?.addEventListener('click', () => showSpeakerModal());

// Alert words page add button
document.querySelector('#page-alert-words .header-actions .btn-primary')?.addEventListener('click', () => showAlertWordModal());

// Replacements page add button
document.querySelector('#page-replacements .header-actions .btn-primary')?.addEventListener('click', () => showReplacementModal());

// Workspace upload button
document.querySelector('.audio-files-panel .btn-sm')?.addEventListener('click', () => showUploadModal());

// Export buttons
document.querySelectorAll('.btn-secondary').forEach(btn => {
    if (btn.textContent.includes('Export Word') || btn.textContent.includes('Export PDF')) {
        btn.addEventListener('click', () => showExportModal());
    }
});

// ================================
// TRANSCRIPT SPEAKER FUNCTIONS
// ================================

// Current transcript speakers (temporary assignment for this audio)
let transcriptSpeakers = [
    { tempId: 'temp-a', speakerId: null, label: 'A', duration: '2:45' },
    { tempId: 'temp-b', speakerId: null, label: 'B', duration: '2:47' }
];

let speakerCounter = 2; // Start from C

// Populate speaker dropdowns with existing speakers from database
function populateSpeakerDropdowns() {
    const selects = document.querySelectorAll('.speaker-select');
    selects.forEach(select => {
        const currentValue = select.value;

        // Keep first two options (placeholder and "add new")
        const firstTwoOptions = `
            <option value="">-- Chọn người nói --</option>
            <option value="new">➕ Thêm người nói mới...</option>
        `;

        // Add existing speakers from database
        const speakerOptions = state.speakers.map(s =>
            `<option value="${s.id}">${s.name}${s.alias ? ` (${s.alias})` : ''}</option>`
        ).join('');

        select.innerHTML = firstTwoOptions + speakerOptions;

        // Restore selection
        if (currentValue) {
            select.value = currentValue;
        }
    });
}

// When user selects a speaker from dropdown
function assignSpeaker(selectElement, tempId) {
    const selectedValue = selectElement.value;

    if (selectedValue === 'new') {
        // Open speaker creation modal, then assign after save
        state.pendingSpeakerAssignment = tempId;
        showSpeakerModal();
        selectElement.value = ''; // Reset selection
        return;
    }

    if (selectedValue) {
        const speaker = state.speakers.find(s => s.id == selectedValue);
        if (speaker) {
            // Update the UI to show assigned speaker name instead of dropdown
            updateSpeakerDisplay(tempId, speaker);
            showToast('success', 'Đã gán', `Gán "${speaker.name}" cho người nói này`);
        }
    }
}

// Update speaker item display after assignment
function updateSpeakerDisplay(tempId, speaker) {
    const speakerItem = document.querySelector(`[data-speaker-id="${tempId}"]`);
    if (!speakerItem) return;

    const infoDiv = speakerItem.querySelector('.speaker-info');
    const duration = speakerItem.querySelector('.speaker-duration')?.textContent || '';

    infoDiv.innerHTML = `
        <div class="speaker-assigned">
            <span class="speaker-assigned-name">${speaker.name}</span>
            ${speaker.alias ? `<span class="speaker-assigned-alias">(${speaker.alias})</span>` : ''}
            <button class="speaker-change-btn" onclick="changeSpeakerAssignment('${tempId}')">Đổi</button>
        </div>
        <span class="speaker-duration">${duration}</span>
    `;

    // Update transcript speakers state
    const ts = transcriptSpeakers.find(t => t.tempId === tempId);
    if (ts) {
        ts.speakerId = speaker.id;
    }
}

// Allow user to change speaker assignment
function changeSpeakerAssignment(tempId) {
    const speakerItem = document.querySelector(`[data-speaker-id="${tempId}"]`);
    if (!speakerItem) return;

    const infoDiv = speakerItem.querySelector('.speaker-info');
    const ts = transcriptSpeakers.find(t => t.tempId === tempId);
    const duration = ts?.duration || '';

    // Generate speaker options
    const speakerOptions = state.speakers.map(s =>
        `<option value="${s.id}" ${ts?.speakerId == s.id ? 'selected' : ''}>${s.name}${s.alias ? ` (${s.alias})` : ''}</option>`
    ).join('');

    infoDiv.innerHTML = `
        <div class="speaker-select-wrapper">
            <select class="speaker-select" onchange="assignSpeaker(this, '${tempId}')">
                <option value="">-- Chọn người nói --</option>
                <option value="new">➕ Thêm người nói mới...</option>
                ${speakerOptions}
            </select>
        </div>
        <span class="speaker-duration">${duration}</span>
    `;

    // Reset speakerId
    if (ts) {
        ts.speakerId = null;
    }
}

// Add new speaker slot to transcript
function showAddSpeakerToTranscript() {
    speakerCounter++;
    const label = String.fromCharCode(64 + speakerCounter); // A=65, B=66, etc
    const tempId = `temp-${label.toLowerCase()}`;

    transcriptSpeakers.push({
        tempId,
        speakerId: null,
        label,
        duration: '0:00'
    });

    const speakerList = document.getElementById('transcript-speakers');
    const speakerColors = ['speaker-a', 'speaker-b', 'speaker-c', 'speaker-d'];
    const colorClass = speakerColors[(speakerCounter - 1) % speakerColors.length];

    // Generate speaker options
    const speakerOptions = state.speakers.map(s =>
        `<option value="${s.id}">${s.name}${s.alias ? ` (${s.alias})` : ''}</option>`
    ).join('');

    const newItem = document.createElement('div');
    newItem.className = 'speaker-item';
    newItem.setAttribute('data-speaker-id', tempId);
    newItem.innerHTML = `
        <div class="speaker-avatar ${colorClass}">${label}</div>
        <div class="speaker-info">
            <div class="speaker-select-wrapper">
                <select class="speaker-select" onchange="assignSpeaker(this, '${tempId}')">
                    <option value="">-- Chọn người nói --</option>
                    <option value="new">➕ Thêm người nói mới...</option>
                    ${speakerOptions}
                </select>
            </div>
            <span class="speaker-duration">0:00</span>
        </div>
        <button class="btn-icon" title="Xóa" onclick="removeSpeakerFromTranscript('${tempId}')">🗑️</button>
    `;

    speakerList.appendChild(newItem);
    showToast('info', 'Đã thêm', `Thêm người nói ${label} vào transcript`);
}

// Remove speaker from transcript
function removeSpeakerFromTranscript(tempId) {
    transcriptSpeakers = transcriptSpeakers.filter(t => t.tempId !== tempId);
    const item = document.querySelector(`[data-speaker-id="${tempId}"]`);
    if (item) {
        item.remove();
    }
}

// Override saveSpeaker to handle pending assignment
const originalSaveSpeaker = saveSpeaker;
saveSpeaker = function () {
    const name = document.getElementById('speaker-name').value;
    const alias = document.getElementById('speaker-alias').value;
    const gender = document.getElementById('speaker-gender').value;

    if (!name) {
        showToast('error', 'Lỗi', 'Vui lòng nhập tên người nói');
        return;
    }

    let newSpeakerId = null;

    if (state.editingItem) {
        const index = state.speakers.findIndex(s => s.id === state.editingItem);
        if (index !== -1) {
            state.speakers[index] = { ...state.speakers[index], name, alias, gender };
        }
        showToast('success', 'Thành công', 'Đã cập nhật người nói');
    } else {
        newSpeakerId = Date.now();
        state.speakers.push({
            id: newSpeakerId,
            name, alias, gender, cases: 0, duration: '0h 0m'
        });
        showToast('success', 'Thành công', 'Đã thêm người nói mới');
    }

    closeModal('modal-speaker');
    renderSpeakersGrid();
    populateSpeakerDropdowns();

    // If there's a pending assignment from transcript
    if (state.pendingSpeakerAssignment && newSpeakerId) {
        const newSpeaker = state.speakers.find(s => s.id === newSpeakerId);
        if (newSpeaker) {
            updateSpeakerDisplay(state.pendingSpeakerAssignment, newSpeaker);
        }
        state.pendingSpeakerAssignment = null;
    }
};

// ================================
// NOTIFICATIONS
// ================================

function getTimeAgo(timestamp) {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    return `${days} ngày trước`;
}

function getNotificationIcon(type, action) {
    const icons = {
        alert: '⚠️',
        success: '✅',
        crud: action === 'create' ? '📁' : action === 'update' ? '✏️' : action === 'delete' ? '🗑️' : '📋',
        system: action === 'login' ? '🔐' : action === 'logout' ? '🚪' : action === 'export' ? '📤' : action === 'import' ? '📥' : '⚙️'
    };
    return icons[type] || 'ℹ️';
}

function filterNotifications() {
    const typeFilter = document.getElementById('notification-type-filter')?.value || 'all';
    const dateFrom = document.getElementById('notification-date-from')?.value;
    const dateTo = document.getElementById('notification-date-to')?.value;

    state.notificationFilter = { type: typeFilter, dateFrom, dateTo };
    renderNotifications();
}

function resetNotificationFilters() {
    document.getElementById('notification-type-filter').value = 'all';
    document.getElementById('notification-date-from').value = '';
    document.getElementById('notification-date-to').value = '';
    state.notificationFilter = { type: 'all', dateFrom: '', dateTo: '' };
    renderNotifications();
}

function renderNotifications() {
    const container = document.querySelector('#page-notifications .notifications-list');
    if (!container) return;

    let filtered = [...state.notifications];

    // Filter by type
    if (state.notificationFilter.type !== 'all') {
        filtered = filtered.filter(n => n.type === state.notificationFilter.type);
    }

    // Filter by date range
    if (state.notificationFilter.dateFrom) {
        const fromDate = new Date(state.notificationFilter.dateFrom);
        fromDate.setHours(0, 0, 0, 0);
        filtered = filtered.filter(n => n.timestamp >= fromDate);
    }
    if (state.notificationFilter.dateTo) {
        const toDate = new Date(state.notificationFilter.dateTo);
        toDate.setHours(23, 59, 59, 999);
        filtered = filtered.filter(n => n.timestamp <= toDate);
    }

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => b.timestamp - a.timestamp);

    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>Không có thông báo nào phù hợp với bộ lọc</p></div>';
        return;
    }

    container.innerHTML = filtered.map(n => {
        const isImportant = isImportantEvent(n);
        return `
        <div class="notification-item ${n.read ? '' : 'unread'} ${isImportant ? 'important' : ''}" data-id="${n.id}">
            <div class="notification-icon ${n.type}">${getNotificationIcon(n.type, n.action)}</div>
            <div class="notification-content">
                <p class="notification-text">${n.message}${isImportant ? '<span class="important-badge">⭐ Quan trọng</span>' : ''}</p>
                <span class="notification-time">${getTimeAgo(n.timestamp)}</span>
            </div>
            ${!n.read ? `<button class="btn-icon" onclick="markNotificationAsRead(${n.id})" title="Đánh dấu đã đọc">✓</button>` : ''}
        </div>
    `}).join('');
}

function markNotificationAsRead(id) {
    const notification = state.notifications.find(n => n.id === id);
    if (notification) {
        notification.read = true;
        renderNotifications();
        updateNotificationBadge();
    }
}

function markAllNotificationsAsRead() {
    state.notifications.forEach(n => n.read = true);
    renderNotifications();
    updateNotificationBadge();
    showToast('success', 'Hoàn tất', 'Đã đánh dấu tất cả thông báo là đã đọc');
}

function updateNotificationBadge() {
    const unreadCount = state.notifications.filter(n => !n.read).length;
    const badge = document.querySelector('.nav-item[data-page="notifications"] .notification-badge');
    if (badge) {
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'flex' : 'none';
    }
}

// ================================
// IMPORTANT EVENTS CONFIG
// ================================

const importantEventsConfig = {
    alert: true,
    success: false,
    create: true,
    update: false,
    delete: true,
    export: false,
    import: false,
    login: false
};

function openImportantEventsConfig() {
    const panel = document.getElementById('important-events-panel');
    if (panel) {
        panel.classList.remove('hidden');
        // Load current settings
        Object.keys(importantEventsConfig).forEach(key => {
            const checkbox = document.getElementById(`important-${key}`);
            if (checkbox) checkbox.checked = importantEventsConfig[key];
        });
    }
}

function closeImportantEventsConfig() {
    const panel = document.getElementById('important-events-panel');
    if (panel) panel.classList.add('hidden');
}

function saveImportantEvents() {
    Object.keys(importantEventsConfig).forEach(key => {
        const checkbox = document.getElementById(`important-${key}`);
        if (checkbox) importantEventsConfig[key] = checkbox.checked;
    });
    // Re-render notifications to show updated important markers
    renderNotifications();
    showToast('success', 'Đã lưu', 'Cấu hình sự kiện quan trọng đã được cập nhật');
}

function resetImportantEvents() {
    // Reset to defaults
    importantEventsConfig.alert = true;
    importantEventsConfig.success = false;
    importantEventsConfig.create = true;
    importantEventsConfig.update = false;
    importantEventsConfig.delete = true;
    importantEventsConfig.export = false;
    importantEventsConfig.import = false;
    importantEventsConfig.login = false;

    // Update checkboxes
    Object.keys(importantEventsConfig).forEach(key => {
        const checkbox = document.getElementById(`important-${key}`);
        if (checkbox) checkbox.checked = importantEventsConfig[key];
    });

    renderNotifications();
    showToast('info', 'Đặt lại', 'Đã khôi phục cấu hình mặc định');
}

function isImportantEvent(notification) {
    const { type, action } = notification;

    if (type === 'alert' && importantEventsConfig.alert) return true;
    if (type === 'success' && importantEventsConfig.success) return true;
    if (type === 'crud') {
        if (action === 'create' && importantEventsConfig.create) return true;
        if (action === 'update' && importantEventsConfig.update) return true;
        if (action === 'delete' && importantEventsConfig.delete) return true;
    }
    if (type === 'system') {
        if (action === 'export' && importantEventsConfig.export) return true;
        if (action === 'import' && importantEventsConfig.import) return true;
        if ((action === 'login' || action === 'logout') && importantEventsConfig.login) return true;
    }
    return false;
}

// ================================
// INITIALIZE
// ================================

document.addEventListener('DOMContentLoaded', function () {
    console.log('SPEXOR Application Loaded');

    // Initialize tables
    renderCasesTable();
    renderUsersGrid();
    renderSpeakersGrid();
    renderAlertWordsTable();
    renderReplacementsTable();
    renderNotifications();

    // Populate speaker dropdowns in transcript
    populateSpeakerDropdowns();

    // Update notification badge
    updateNotificationBadge();
});
