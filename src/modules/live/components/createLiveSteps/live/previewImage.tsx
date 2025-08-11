import { useRef, useState, useEffect } from "react";
import { Avatar, AvatarImage } from "@/shared/components/ui/avatar";

type Props = {
  name: string;
  value?: string;
  onChange: (value: string) => void;
};

export function ImageUploadField({ value, onChange, name }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(value);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPreview(base64);
      onChange(base64);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (value && value !== preview) setPreview(value);
  }, [value]);

  return (
    <div className="flex flex-col items-center gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        name={name}
        className="hidden "
        onChange={handleFileChange}
      />

      <Avatar className="w-24 h-24 border bg-cover">
        {preview && <AvatarImage src={preview} alt="Imagem da live" />}
      </Avatar>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="text-sm text-blue-500 underline"
      >
        Escolher imagem
      </button>
    </div>
  );
}
