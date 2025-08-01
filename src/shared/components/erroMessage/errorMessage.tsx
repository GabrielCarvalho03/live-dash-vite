type ErrorMessageProps = {
  error: string | undefined;
};

export const ErrorMessage = ({ error }: ErrorMessageProps) => {
  return <span className="text-red-500 mb-1">{error}</span>;
};
