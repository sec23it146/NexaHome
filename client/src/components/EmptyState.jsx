const EmptyState = ({ title = "No data found", text = "Try changing filters or adding a new item." }) => (
  <div className="empty-state">
    <strong>{title}</strong>
    <span>{text}</span>
  </div>
);

export default EmptyState;
