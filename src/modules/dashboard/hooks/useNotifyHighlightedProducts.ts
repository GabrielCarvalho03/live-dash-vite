import { useEffect, useRef } from "react";

export function useNotifyHighlightedProducts(produtosVisiveis: any[]) {
  const lastIdsRef = useRef<string[]>([]);

  const getId = (produto: any) => {
    if (typeof produto._id === "string") return produto._id;
    if (produto._id && typeof produto._id.$oid === "string")
      return produto._id.$oid;
    return "";
  };

  useEffect(() => {
    const novos = produtosVisiveis.filter(
      (p) => !lastIdsRef.current.includes(getId(p))
    );
    if (novos.length > 0) {
      alert(`Produto "${novos[0].name}" está em destaque!`);
    }
    lastIdsRef.current = produtosVisiveis.map(getId);
  }, [produtosVisiveis]);
}
