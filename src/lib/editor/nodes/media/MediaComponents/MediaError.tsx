export const MediaError = ({
  type,
  onRetry,
}: {
  type: string;
  onRetry?: () => void;
}) => (
  <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-md bg-gray-50">
    <div className="text-gray-500 mb-2">Failed to load {type}</div>
    {onRetry && (
      <button
        onClick={onRetry}
        className="text-sm text-blue-600 hover:text-blue-800 underline"
      >
        Try again
      </button>
    )}
  </div>
);
