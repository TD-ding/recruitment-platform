export default function Loading() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      <span className="ml-3 text-gray-400">加载中...</span>
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return <p className="text-center text-gray-400 py-16">{message}</p>;
}
