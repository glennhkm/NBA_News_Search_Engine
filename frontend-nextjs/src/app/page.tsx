"use client"

import { FormSearch } from '@/components/formSearch/formSearch'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Typewriter } from 'react-simple-typewriter'
import { TextMarquee } from '@/components/marquee/textMarquee';


const Home = () => {
  const [searchValue, setSearchValue] = useState<string>('')
  const router = useRouter()

  const searchHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchValue === "") {
      return;          
    }
    router.push(`/search?q=${searchValue}`)
  }

  return (
    <div className='w-screen h-screen relative flex flex-col justify-center items-center gap-4'>
      <div className='flex flex-col gap-6 w-full text-center items-center'>
        <div className='text-[6.6rem] text-white/80 font-bold w-full'>
          <Typewriter
              words={['Team 7', 'Friends of the Game', 'Team Up for NBA', 'Always About Hoops']}
              loop={0}
              cursor
              cursorStyle='|'
              typeSpeed={100}
              deleteSpeed={100}
              delaySpeed={1000}
          />
        </div>
        <p className='text-neutral-400 w-1/2'>Welcome to our NBA News Search Engine! Created by Team 7 (Glenn, Alghi, and Cut Dahliana) for our Information Retrieval project, this platform provides comprehensive search capabilities for the NBA news. Explore in-depth articles, game insights, player updates, and team highlights – all at your fingertips. Dive into the world of professional basketball and discover the stories that matter!</p>
      </div>
      <div className='flex gap-4 items-center w-1/2 mb-12 mt-2'>
        <FormSearch inputClassName='py-3 text-black' formClassName='bg-white/50 w-full' setSearchValue={setSearchValue} searchValue={searchValue} searchHandler={searchHandler}/>
      </div>      
      <TextMarquee position="bottom"/>
    </div>
  )
}

export default Home