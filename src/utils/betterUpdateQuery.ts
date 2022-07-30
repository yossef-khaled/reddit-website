import { QueryInput, Cache } from "@urql/exchange-graphcache";

// This function is a better way to declare cache.updateQuery args types
export function betterUpdateQuery<Result, Query>(
    cache: Cache,
    qi: QueryInput,
    result: any,
    fn: (r: Result, q: Query) => Query) {
    return cache.updateQuery(qi, (data) => fn(result, data as any) as any);
}
