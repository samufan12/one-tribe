export const ProductSkeleton = ({ listView = false }: { listView?: boolean }) => {
  return (
    <div className={`bg-card rounded-lg border overflow-hidden animate-pulse ${
      listView ? 'flex' : ''
    }`}>
      <div className={listView ? 'w-48 flex-shrink-0' : ''}>
        <div className={`bg-muted ${
          listView ? 'w-full h-48' : 'w-full h-64'
        }`} />
      </div>
      
      <div className="p-4 flex-1 space-y-3">
        <div className="flex items-start justify-between">
          <div className="h-6 bg-muted rounded w-3/4" />
          <div className="h-6 bg-muted rounded w-16" />
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-muted" />
          <div className="h-4 bg-muted rounded w-24" />
        </div>
        
        <div className="flex items-center gap-3">
          <div className="h-4 bg-muted rounded w-20" />
          <div className="h-4 bg-muted rounded w-16" />
          <div className="h-4 bg-muted rounded w-20" />
        </div>
        
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-2/3" />
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-4">
            <div className="h-4 bg-muted rounded w-12" />
            <div className="h-4 bg-muted rounded w-20" />
            <div className="h-4 bg-muted rounded w-16" />
          </div>
          <div className="w-8 h-8 bg-muted rounded-full" />
        </div>
      </div>
    </div>
  );
};

export const ProductSkeletonGrid = ({ count = 6, listView = false }: { count?: number; listView?: boolean }) => {
  return (
    <div className={listView 
      ? "space-y-4" 
      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    }>
      {Array.from({ length: count }, (_, i) => (
        <ProductSkeleton key={i} listView={listView} />
      ))}
    </div>
  );
};