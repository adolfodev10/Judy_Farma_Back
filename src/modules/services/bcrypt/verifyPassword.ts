import bcrypt from 'bcrypt';

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
    try {
        const result = await bcrypt.compare(password, hash);
        return result;
    } catch (error) {
        console.error('Erro ao verificar senha:', error);
        return false;
    }
};
