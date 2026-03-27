export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative">
        <div className="h-10 w-10 rounded-full border-4 border-surface-200"></div>
        <div className="absolute top-0 left-0 h-10 w-10 rounded-full border-4 border-transparent border-t-primary-600 animate-spin"></div>
      </div>
    </div>
  );
}
