'use client'
import {useAppSelector } from "@/hooks/config";
const Home = () => {
  const {user} = useAppSelector((state) => state?.user)
  console.log(user);
  const {access_token }= useAppSelector(state => state?.user);
  console.log(access_token)
  return (
    <div>
      <h1>Home</h1>
      <p>This is the home page</p>
    </div>    
  )
}
export default Home;
