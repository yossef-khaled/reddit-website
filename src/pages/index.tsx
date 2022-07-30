import React from "react";

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

const Index = () => {

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

export default  withUrqlClient(createUrqlClient)(Index);
