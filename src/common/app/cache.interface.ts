export abstract class ICache {
  abstract set: (key: string, value: any, ttlInSeconds?: number) => Promise<void>;
  abstract get: <T>(key: string) => Promise<T | null>;
  abstract delete: (key: string) => Promise<void>;
}
