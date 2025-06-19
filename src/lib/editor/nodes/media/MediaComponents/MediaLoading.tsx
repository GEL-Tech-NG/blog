export const MediaLoading = ({ type }: { type: string }) => (
  <div className="flex items-center justify-center p-8 bg-gray-100 rounded-md animate-pulse">
    <div className="text-gray-500">Loading {type}...</div>
  </div>
);