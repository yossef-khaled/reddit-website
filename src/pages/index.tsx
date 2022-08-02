import React, { FC } from "react";

//Import other components
import NavBar from "../components/NavBar"

//Import my urql client
import createUrqlClient from "../utils/createUrqlClient";

//Import from next-urql
import { withUrqlClient } from 'next-urql'; 
import { usePostsQuery } from "../generated/graphql";
import { useEffect, useState } from "react";

interface IState {
  waitingDots: string,
}

const Index: FC<IState> = () => {

  const [{data}] = usePostsQuery();
  const [waitingDots, setWaitingDots] = useState('');

  const timerForLoadingDots = setTimeout(() => {
      waitingDots.length == 3 ? setWaitingDots('')
      :
      setWaitingDots(`${waitingDots}.`);
    }
  , 500) 

  useEffect(() => {
    timerForLoadingDots;
  }, []);

  if(data?.posts) {
    clearTimeout(timerForLoadingDots);
  }
  
  return (
    <>
      <NavBar/>
      <div>
        {!data?.posts ? 
          <div>Loading{waitingDots}</div>
        :
        data.posts.map((post) => {
          return (
            <p key={post.id}>
              {post.title}
            </p>
          )
        })}
      </div>
    </>
  )
}

// ssr: true only for pages that need to be rendered in the server, but I still need to wrap all the pages with ` withUrqlClient() `
export default  withUrqlClient(createUrqlClient, {ssr: true})(Index);
