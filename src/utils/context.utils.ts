import cls from '@utils/cls.utils';

export const addToContext = <T>(key: string, value: T): void => cls.set({ key, value });

export const getFromContext = <T>(key: string): T | undefined => cls.get({ key });

export const getCorrelationId = (): string | undefined => cls.get({ key: 'correlationId' });

export const addUserToContext = (userInfo: any): void => addToContext('userInfo', userInfo);

export const getUserFromContext = (): any => getFromContext('userInfo');
