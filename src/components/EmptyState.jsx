import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionPath,
  onAction,
}) {
  const navigate = useNavigate();

  const handleAction = () => {
    if (onAction) onAction();
    else if (actionPath) navigate(actionPath);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center px-4"
    >
      <div className="w-20 h-20 bg-surface-2 rounded-3xl flex items-center justify-center mb-5 border border-border">
        {Icon && <Icon className="w-10 h-10 text-text-muted" />}
      </div>
      <h3 className="text-xl font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary text-sm max-w-sm leading-relaxed mb-6">{description}</p>
      {actionLabel && (
        <button onClick={handleAction} className="btn-primary">
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}
