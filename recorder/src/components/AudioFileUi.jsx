import { useEffect, useRef, useState } from 'react'
import { BsFileEarmarkMusic, BsPlayFill, BsDownload, BsPause } from 'react-icons/bs'

const AudioFileUi = ({ audioObj }) => {
    const audioRef = useRef()
    const [isPlaying, setIsPlaying] = useState(false)
    const [trackDuration, setTrackDuration] = useState(0)

    const handleDownload = (url, filename) => {
        let a = document.createElement('a')
        a.href = url
        a.download = filename
        a.click()
    }

    useEffect(() => {
      setTrackDuration(audioRef.current.duration)
    }, [audioRef?.current?.duration])
    

    useEffect(() => {
        console.log(audioRef.current.duration)
      if (isPlaying) audioRef.current.play()
      else audioRef?.current.pause()
    }, [isPlaying]) 
    

  return (
    <div className="audio-file bg-[#39393d] h-16 rounded-md p-3 px-5 flex items-center gap-3">
        
                <div className="icon w-10 h-10 rounded-full flex justify-center items-center bg-[#55555b]">
                    <BsFileEarmarkMusic />
                </div>
                <div className="details">
                    <h3 className='text-sm'>{ audioObj.filename }</h3>
                    <p className="text-xs">{ Math.floor(trackDuration / 60) }:{ Math.floor(trackDuration % 60) }</p>
                </div>

                <button className='bg-[#55555b] w-8 h-8 rounded-full flex justify-center items-center ml-auto' onClick={() => {setIsPlaying(!isPlaying)}}>
                    {!isPlaying && <BsPlayFill size={20} />}
                    {isPlaying && <BsPause size={20} />}
                </button>
                <button className='bg-[#55555b] w-8 h-8 rounded-full flex justify-center items-center' onClick={() => handleDownload(audioObj.dataUrl, audioObj.filename)}>
                    <BsDownload size={14} />
                </button>
           
        

        <audio controls className='hidden'  preload="metadata" onEnded={() => setIsPlaying(false)} onLoadedData={e => console.log(e.target.duration)} onProgress={e => console.log(e)} ref={audioRef}>
            <source src={audioObj.dataUrl} />
        </audio>
    </div>
  )
}

export default AudioFileUi