function LoadingScreen({ message }: { message: string }) {
  return (
    <div className="h-screen w-screen flex flex-col gap-3 items-center justify-center">
      <div className="loader"></div>
      <h4 className="text-xl">{message}</h4>
    </div>
  );
}

export default LoadingScreen;
