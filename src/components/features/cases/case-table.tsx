import { useCaseStore, useUIStore } from '../../../stores';
import type { Case } from '../../../types';

interface CaseTableProps {
  cases: Case[];
}

export function CaseTable({ cases }: CaseTableProps) {
  const { setCurrentCase, deleteCase } = useCaseStore();
  const { setPage, showToast } = useUIStore();

  const handleOpenWorkspace = (caseItem: Case) => {
    setCurrentCase(caseItem);
    setPage('workspace');
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Bạn có chắc muốn xóa sự vụ này? Tất cả file audio và transcript sẽ bị xóa.')) {
      try {
        await deleteCase(id);
        showToast('success', 'Đã xóa sự vụ');
      } catch (error) {
        showToast('error', 'Không thể xóa sự vụ');
      }
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (cases.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📁</div>
        <h3>Chưa có sự vụ nào</h3>
        <p>Nhấn "Thêm sự vụ" để tạo sự vụ mới</p>
      </div>
    );
  }

  return (
    <div className="cases-table card">
      <table className="table">
        <thead>
          <tr>
            <th>Mã sự vụ</th>
            <th>Tiêu đề</th>
            <th>Mô tả</th>
            <th>Ngày tạo</th>
            <th>Cập nhật</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((caseItem) => (
            <tr
              key={caseItem.id}
              onClick={() => handleOpenWorkspace(caseItem)}
              className="clickable"
            >
              <td>
                <span className="case-code-badge">{caseItem.code}</span>
              </td>
              <td className="font-medium">{caseItem.title}</td>
              <td className="text-muted">{caseItem.description || '-'}</td>
              <td>{formatDate(caseItem.createdAt)}</td>
              <td>{formatDate(caseItem.updatedAt)}</td>
              <td className="actions-cell">
                <button
                  className="btn-icon"
                  title="Mở workspace"
                  onClick={(e) => { e.stopPropagation(); handleOpenWorkspace(caseItem); }}
                >
                  👁️
                </button>
                <button
                  className="btn-icon"
                  title="Xóa"
                  onClick={(e) => handleDelete(caseItem.id, e)}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
