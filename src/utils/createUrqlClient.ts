//Import from urql 
import { dedupExchange, fetchExchange, Exchange } from "urql";

//Import from exchange-graphcache
import { cacheExchange } from "@urql/exchange-graphcache";

//Improt auto generated types
import { LoginMutation, MeQuery, MeDocument, RegisterMutation, LogoutMutation } from "../generated/graphql";

//Import others 
import { betterUpdateQuery } from "./betterUpdateQuery";

//Import from wonka
import { filter, pipe, tap } from 'wonka';

//Import from next router
import Router from "next/router";

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

const createUrqlClient = (ssrExchange: any) => ({
    url : 'http://localhost:4000/graphql',
    fetchOptions: {
        credentials: 'include' as const, // If this property is sett to 'include' & the back-end does not provide cors credintials, it will throw a cors error  
    },
    exchanges: [dedupExchange, 
        cacheExchange({
            updates: {
                Mutation: {
                    login: (_result, args, cache, info) => {
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
                    register: (_result, args, cache, info) => {
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
                    logout: (_result, args, cache, info) => {
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

export default createUrqlClient;