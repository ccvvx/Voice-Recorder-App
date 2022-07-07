import { useState } from 'react';
import { AiOutlinePause } from 'react-icons/ai'
import { BiReset } from 'react-icons/bi'
import { FaBolt } from 'react-icons/fa'
import { IoMdClose } from 'react-icons/io'
import { TbLayoutList } from 'react-icons/tb'
import SoundWavesImg from '../assets/sound-waves.png'
import GhostImg from '../assets/ghost.png'

import { startAudioRecording, stopAudioRecording, cancelAudioRecording, handleAudio } from "../utils/AudioRecorderApi";
import AudioFileUi from '../components/AudioFileUi';

const RecorderScreen = () => {
    const [recordingStarted, setRecordingStarted] = useState(false)
    const [recordedAudios, setRecordedAudios] = useState([])
    const [showRecordedAudios, setShowRecordedAudios] = useState(false)


  return (
    <div className="recorder-screen h-screen bg-[#17181A] text-gray-200 p-5 px-[12%] flex flex-col">
        <h1 className='text-4xl text-center font-light self-center flex gap-2 items-center text-[#82868d]'>
            <span>Rec</span>
            <span className="animate-bounce">
                <FaBolt className='text-emerald-500 glow-green' />
            </span>
        </h1>

        <div className="time-block text-6xl text-center font-extralight self-center py-10 mt-5">
            <h1 className='text-[#9fa3ab]'>00:00:00</h1>
        </div>

        <figure className='flex justify-center opacity-30'>
            <img src={SoundWavesImg} width={200} alt="" />
        </figure>

        <div className="controls self-center text-2xl flex items-center gap-6 mt-12">
            <button className="reset w-10 h-10 bg-[#28282c] rounded-full flex items-center justify-center">
                <BiReset />
            </button>

            {
                recordingStarted ?
                <button className="start w-16 h-16 rounded-full border-2 border-red-500 flex items-center justify-center" onClick={() => {
                  setRecordingStarted(false)
                  stopAudioRecording((audioBlob) => handleAudio(audioBlob, (dataUrl, blobType) => {
                    let audioName = prompt('Enter a name for your file')
                    setRecordedAudios([ ...recordedAudios, { filename: audioName, dataUrl, audioType: blobType, } ])
                    console.log(recordedAudios);
                }))
                }}>
                    <div className="inner w-9 h-9 bg-red-500 rounded-md"></div>
                </button> :
                <button className="start w-16 h-16 rounded-full border-2 border-red-500 flex items-center justify-center" onClick={() => {
                    setRecordingStarted(true)
                    startAudioRecording()
                }}>
                    <div className="inner w-12 h-12 bg-red-500 rounded-full"></div>
                </button>

            }
            <button className="pause w-10 h-10 bg-[#28282c] rounded-full flex items-center justify-center">
                <AiOutlinePause />
            </button>
        </div>

        <button className="fixed w-16 h-16 rounded-full bg-[#28282c] flex items-center justify-center right-[12%] bottom-10 transition-all hover:drop-shadow-[0_0_12px_mediumaquamarine]" onClick={() => setShowRecordedAudios(!showRecordedAudios)}>
            <TbLayoutList size={25} />
        </button>

        {showRecordedAudios &&
            <div className="recorded-audios fixed w-full h-full bg-[#28282ccc] top-0 left-0 flex items-center justify-center px-[5%]">
            <div className="bg-[#28282c] max-w-lg min-h-60 w-full p-8 px-[3%] rounded-md border border-[#37373d] flex flex-col relative">
                <h1 className='text-3xl font-light'>Your Records</h1>
                <p className="font-light text-xs">Your recorded audios will show below</p>
                <button className='bg-[#333336] text-[#6e6e75] w-7 h-7 rounded-full flex justify-center items-center absolute right-[3%]' onClick={() => setShowRecordedAudios(false)}>
                    <IoMdClose size={20} color="#fff" />
                </button>

                <div className="audio-list-wrapper flex flex-1">
                    {
                        recordedAudios.length ? (
                            <div className="audio-list flex-1 flex flex-col gap-3 py-5">
                                {
                                    recordedAudios.map((audioObj, index) => (
                                        <AudioFileUi audioObj={audioObj} key={index} />
                                    ))
                                }
                            </div>
                        ) : (
                            <div className="audio-not-found p-8 flex flex-col gap-3 items-center justify-center">
                                <img src={GhostImg} alt="" />
                                <p className='text-sm text-[#5c5c61]'>You have no recorded audios</p>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>}
    </div>
  )
}

export default RecorderScreen