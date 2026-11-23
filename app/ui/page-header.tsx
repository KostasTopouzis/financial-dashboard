// Shared heading block for dashboard pages: eyebrow, title, optional
// description and an actions slot aligned to the right on wide screens.
export default function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-col gap-4 border-b border-line pb-6 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        {eyebrow ? <p className="eyebrow mb-2">{eyebrow}</p> : null}
        <h1 className="text-balance font-display text-3xl font-semibold leading-tight text-ink md:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-prose text-muted">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 gap-3">{actions}</div> : null}
    </header>
  );
}
