import React from 'react'
import Card from "@/components/shared/card"
import { useProfile } from "@/hooks/useProfile"

export default function Advertisement(){
  const { profile } = useProfile();

  return (
    <div className="stiky top-18">
        <Card padding={0}>
            <div className="relative h-25" >
           <div className="relative w-full h-22 rounded-md">
                <img src="/images.jpg" alt="profile" className="rounded-t-md h-full w-full"/>
               </div> 
               <div className="absolute top-14 left-6 z-10">
                   <img src="https://media.licdn.com/media//AAYAAgSrAAgAAQAAAAAAAGM6w-NyPk-_SVikYiCJ6V3Z-Q.png" alt="image" className="rounded-full border-2 h-16 w-16 border-white cursor-pointer"/>
               </div>
            </div>
            <div className= "px-5 my-5 mx-auto">
                <div className="text-sm font-semibold text-center">{profile.name || "Loading..."}</div>
                <div className="text-sm my-3 text-center">Get the latest job and industry news</div>
                <div className="text-sm my-1 border text-center p-2 rounded-2xl font-bold border-blue-950 text-white bg-blue-800 cursor-pointer">Explore</div>
            </div>
        </Card>
    </div>
  )
}
