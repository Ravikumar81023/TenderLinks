interface PageHeaderProps {
  title: string;
  subtitle?: string;
  accentText?: string;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  accentText,
  className = "",
}: PageHeaderProps) {
  return (
    <div
      className={`relative py-16 bg-gradient-to-b from-blue-50/80 to-white ${className}`}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="h-full w-full bg-white/50" />
        <div className="h-full w-full bg-grid-gray-100/[0.2] bg-grid-16" />
      </div>
      <div className="relative max-w-7xl mx-auto text-center px-4">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          {accentText ? (
            <>
              {title.split(accentText)[0]}
              <span className="text-blue-600">{accentText}</span>
              {title.split(accentText)[1]}
            </>
          ) : (
            title
          )}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
