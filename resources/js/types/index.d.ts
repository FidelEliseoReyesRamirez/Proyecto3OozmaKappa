export interface User {
  id: number;
  name: string;
  apellido: string;
  email: string;
  telefono?: string;
  rol: 'admin' | 'arquitecto' | 'ingeniero' | 'cliente';
  estado: 'activo' | 'inactivo';
  intentos_fallidos: number;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
}


export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
