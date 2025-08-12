import { updateUserSchemaData } from "./updateUserSchema";

export interface useProfilleProps {
  handleUpdateUser: (value: updateUserSchemaData) => Promise<void>;
}
