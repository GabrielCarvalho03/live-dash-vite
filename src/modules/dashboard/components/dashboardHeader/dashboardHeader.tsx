export const DashboardHeader = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <div>
        <h1 className="text-2xl font-semibold leading-tight tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Bem-vindo de volta! Aqui está o resumo das suas transmissões.
        </p>
      </div>
      <div className="text-sm text-green-700 bg-green-100 rounded-full px-3 py-1 font-medium">
        Sistema Online
      </div>
    </div>
  );
};
