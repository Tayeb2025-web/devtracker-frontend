export function Card({ children, className = '', hover = false, glass = true }) {
  return (
    <div className={`rounded-xl p-5 ${glass ? 'glass' : 'bg-surface-light border border-border'} ${hover ? 'transition-all duration-200 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5' : ''} ${className}`}>
      {children}
    </div>
  );
}

export function StatCard({ title, value, subtitle, icon: Icon, color = 'primary', delay = 0 }) {
  const colorMap = {
    primary: 'text-primary bg-primary/10',
    accent: 'text-accent bg-accent/10',
    yellow: 'text-yellow-400 bg-yellow-400/10',
    purple: 'text-purple-400 bg-purple-400/10',
  };

  return (
    <Card hover className={`animate-fade-in opacity-0 stagger-${Math.min(delay, 5)}`} style={{ animationDelay: `${delay * 0.05}s`, animationFillMode: 'forwards' }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-text-muted text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-text-muted text-xs mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-lg ${colorMap[color]}`}>
            <Icon size={20} />
          </div>
        )}
      </div>
    </Card>
  );
}

export function ProgressBar({ value, max = 100, color = 'primary', showLabel = true, height = 'h-2' }) {
  const pct = Math.min((value / max) * 100, 100);
  const colorClass = color === 'accent' ? 'bg-accent' : 'bg-primary';

  return (
    <div>
      {showLabel && (
        <div className="flex justify-between text-xs text-text-muted mb-1.5">
          <span>{Math.round(pct)}%</span>
          <span>{value}/{max}</span>
        </div>
      )}
      <div className={`w-full ${height} bg-surface-lighter rounded-full overflow-hidden`}>
        <div
          className={`${height} ${colorClass} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function Button({ children, variant = 'primary', size = 'md', className = '', disabled, ...props }) {
  const variants = {
    primary: 'bg-primary hover:bg-primary-dark text-white',
    accent: 'bg-accent hover:bg-accent-dark text-white',
    outline: 'border border-border hover:border-primary/50 text-text hover:bg-surface-lighter',
    ghost: 'text-text-muted hover:text-text hover:bg-surface-lighter',
    danger: 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export function Input({ label, className = '', ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-sm text-text-muted font-medium">{label}</label>}
      <input
        className={`w-full px-3 py-2 rounded-lg bg-surface-lighter border border-border text-text placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors ${className}`}
        {...props}
      />
    </div>
  );
}

export function Select({ label, options, className = '', ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-sm text-text-muted font-medium">{label}</label>}
      <select
        className={`w-full px-3 py-2 rounded-lg bg-surface-lighter border border-border text-text focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors ${className}`}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

export function Textarea({ label, className = '', ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-sm text-text-muted font-medium">{label}</label>}
      <textarea
        className={`w-full px-3 py-2 rounded-lg bg-surface-lighter border border-border text-text placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors resize-none ${className}`}
        {...props}
      />
    </div>
  );
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null;

  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-5xl' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${sizes[size]} max-h-[calc(100vh-2rem)] overflow-y-auto glass rounded-xl p-6 animate-fade-in`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-text-muted hover:text-text p-1 rounded-lg hover:bg-surface-lighter transition-colors">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-text-muted mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="danger" onClick={() => { onConfirm(); onClose(); }}>Confirm</Button>
      </div>
    </Modal>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      {Icon && (
        <div className="p-4 rounded-full bg-surface-lighter mb-4">
          <Icon size={32} className="text-text-muted" />
        </div>
      )}
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-text-muted text-sm max-w-sm mb-4">{description}</p>
      {action}
    </div>
  );
}

export function LoadingSpinner({ size = 'md' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex items-center justify-center py-12">
      <div className={`${sizes[size]} border-2 border-primary/30 border-t-primary rounded-full animate-spin`} />
    </div>
  );
}

export function Badge({ children, color = 'primary' }) {
  const colors = {
    primary: 'bg-primary/20 text-primary',
    accent: 'bg-accent/20 text-accent',
    yellow: 'bg-yellow-400/20 text-yellow-400',
    gray: 'bg-surface-lighter text-text-muted',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}>
      {children}
    </span>
  );
}
