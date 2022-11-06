export interface Account {
    id: number;
    accountNo: string;
    createdAt: string;
    amount: string;
    userId: number;
    user: string;
}

export type CreateAccountDto = Omit<Account, 'id'>;

export type EditAccountDto = CreateAccountDto;