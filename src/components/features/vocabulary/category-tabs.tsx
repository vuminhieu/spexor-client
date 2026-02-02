interface CategoryTabsProps {
  categories: string[];
  active: string;
  onChange: (category: string) => void;
  counts?: Record<string, number>;
}

export function CategoryTabs({ categories, active, onChange, counts }: CategoryTabsProps) {
  return (
    <div className="category-tabs">
      {categories.map(category => (
        <button
          key={category}
          className={`tab ${active === category ? 'active' : ''}`}
          onClick={() => onChange(category)}
        >
          {category}
          {counts && counts[category] !== undefined && (
            <span className="tab-count">{counts[category]}</span>
          )}
        </button>
      ))}
    </div>
  );
}
