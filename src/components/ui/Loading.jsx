const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-accent-500 rounded-full animate-spin" style={{ animationDuration: "1.5s", animationDirection: "reverse" }}></div>
      </div>
      <p className="text-neutral-600 text-sm font-medium">{message}</p>
    </div>
  );
};

export default Loading;