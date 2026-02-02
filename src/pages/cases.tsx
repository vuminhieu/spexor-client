import { useEffect, useState } from 'react';
import { useCaseStore, useUIStore } from '../stores';
import { CaseTable } from '../components/features/cases/case-table';
import { CaseModal } from '../components/features/cases/case-modal';

export function CasesPage() {
  const { cases, fetchCases, loading } = useCaseStore();
  const { openModal } = useUIStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const filteredCases = cases.filter(c =>
    c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="page cases-page">
      <div className="page-header">
        <div>
          <h1>Quản lý sự vụ</h1>
          <p className="page-subtitle">Danh sách các sự vụ điều tra ({cases.length})</p>
        </div>
        <div className="header-actions">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Tìm kiếm sự vụ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className="btn btn-primary"
            onClick={() => openModal('case-modal')}
          >
            + Thêm sự vụ
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <CaseTable cases={filteredCases} />
      )}

      <CaseModal />
    </div>
  );
}
