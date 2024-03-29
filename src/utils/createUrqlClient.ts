//Import from urql 
import { dedupExchange, fetchExchange, Exchange, stringifyVariables } from "urql";

//Import from exchange-graphcache
import { cacheExchange, Resolver, Cache } from "@urql/exchange-graphcache";

//Import auto generated types
import { LoginMutation, MeQuery, MeDocument, RegisterMutation, LogoutMutation, VoteMutationVariables, DeletePostMutationVariables } from "../generated/graphql";

//Import others 
import { betterUpdateQuery } from "./betterUpdateQuery";

//Import from wonka
import { pipe, tap } from 'wonka';

import { gql } from '@urql/core';

//Import from next router
import Router from "next/router";

export const cursorPagination = (): Resolver => {
  
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;
    
    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isItInTheCache = cache.resolve(
      cache.resolve(entityKey, fieldKey) as string, 
      'posts'
    );
    info.partial = !isItInTheCache;
    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter(info => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    let results: string[] = [];
    let hasMore = true;
    fieldInfos.forEach((fi) => {
      const key = cache.resolve(entityKey, fi.fieldKey) as string;
      const data = cache.resolve(key, "posts") as string[];
      const _hasMore = cache.resolve(key, "hasMore");
      if(!_hasMore) {
        hasMore = _hasMore as boolean;
      }
      results.push(...data);
    })

    return {
      __typename: 'PaginatedPosts',
      hasMore: hasMore,
      posts: results
    };

    // const visited = new Set();
    // let result: NullArray<string> = [];
    // let prevOffset: number | null = null;

    // for (let i = 0; i < size; i++) {
    //   const { fieldKey, arguments: args } = fieldInfos[i];
    //   if (args === null || !compareArgs(fieldArgs, args)) {
    //     continue;
    //   }

    //   const links = cache.resolve(entityKey, fieldKey) as string[];
    //   const currentOffset = args[cursorArgument];

    //   if (
    //     links === null ||
    //     links.length === 0 ||
    //     typeof currentOffset !== 'number'
    //   ) {
    //     continue;
    //   }

    //   const tempResult: NullArray<string> = [];

    //   for (let j = 0; j < links.length; j++) {
    //     const link = links[j];
    //     if (visited.has(link)) continue;
    //     tempResult.push(link);
    //     visited.add(link);
    //   }

    //   if (
    //     (!prevOffset || currentOffset > prevOffset) ===
    //     (mergeMode === 'after')
    //   ) {
    //     result = [...result, ...tempResult];
    //   } else {
    //     result = [...tempResult, ...result];
    //   }

    //   prevOffset = currentOffset;
    // }

    // const hasCurrentPage = cache.resolve(entityKey, fieldName, fieldArgs);
    // if (hasCurrentPage) {
    //   return result;
    // } else if (!(info as any).store.schema) {
    //   return undefined;
    // } else {
    //   info.partial = true;
    //   return result;
    // }
  };
};

export const errorExchange: Exchange = ({ forward }) => ops$ => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      if (error?.message.includes('NOT AUTHENTICATED')) {
        Router.replace('/login?next=/create-post');
      }
    })
  );
};

export const invalidatePosts = (cache: Cache) => {
  const allFields = cache.inspectFields("Query");
  const fieldInfos = allFields.filter(info => info.fieldName === "posts");
  fieldInfos.forEach((fi) => {
    // whenever the mutation we are in is implemented, this will be excuted
    // cache.invalidate() tells the cache that this query needs to be updated
    cache.invalidate("Query", "posts", fi.arguments);
  })
}

const createUrqlClient = (ssrExchange: any, ctx: any) =>{ 
  let cookie = '';
  if(typeof window === 'undefined') {
    cookie = ctx?.req?.headers?.cookie;
  }

  return ({
    url : process.env.NEXT_PUBLIC_GRAPHQL_URL as string,
    fetchOptions: {
        credentials: 'include' as const, // If this property is sett to 'include' & the back-end does not provide cors credintials, it will throw a cors error  
        headers: 
          cookie ?
          {
            cookie
          }
          : undefined
    },
    exchanges: [dedupExchange, 
        cacheExchange({
            keys: {
              PaginatedPosts: () => null
            },
            resolvers: {
              Query: {
                posts: cursorPagination(), // key should match the mutation in the graphql file        
              }
            },
            updates: {
                Mutation: {
                    vote: (_result, args, cache) => {
                      const {postId, value} = args as VoteMutationVariables;

                      const data = cache.readFragment(
                        gql`
                          fragment _ on Post {
                            id
                            points
                            voteStatus
                          }
                        `,
                        { id: postId }
                      );

                      if(data) {
                        if(data.voteStatus === value) {
                          return;
                        }
                        const newPoints = data.points + (data.voteStatus ? 2 : 1) * value;
                        cache.writeFragment(
                          gql`
                            fragment __ on Post {
                              points
                              voteStatus
                            }
                          `,
                          { id: postId, points: newPoints, voteStatus: value }
                        );
                      }

                    },
                    createPost: (_result, _, cache) => {
                      invalidatePosts(cache);
                    },
                    deletePost: (_result, args, cache) => {
                      cache.invalidate({ 
                        __typename: 'Post', 
                        id: (args as DeletePostMutationVariables).id
                      });
                    },
                    login: (_result, _, cache) => {
                      invalidatePosts(cache);
                      betterUpdateQuery<LoginMutation, MeQuery> (
                          cache,
                          {query: MeDocument},
                          _result,
                          (result, query) => {
                            if(result.login.errors) {
                              return query
                            } 
                            return {
                              me: result.login.user,
                            }
                          }
                      )
                    },
                    register: (_result, _, cache) => {
                      betterUpdateQuery<RegisterMutation, MeQuery> (
                        cache,
                        {query: MeDocument},
                        _result,
                        (result, query) => {
                          if(result.register.errors) {
                            return query
                          } 
                          return {
                            me: result.register.user,
                          }
                        }
                      )
                    },
                    logout: (_result, _, cache) => {
                      betterUpdateQuery<LogoutMutation, MeQuery> (
                        cache,
                        {query: MeDocument},
                        _result,
                        (result, query) => {
                          if(!result.logout) {
                            return query;
                          } 
                          return {
                            me: null,
                          }
                        }
                      )
                    },
                },
            }
        }),
    errorExchange,
    ssrExchange,
    fetchExchange],
})
}
export default createUrqlClient;