import { audioRecorderStartErrorHandler } from "./AudioRecorderErrorHandler";

const audioRecorder = {
    audioBlobs: [],
    mediaRecorder: null,
    startTime: null,
    streamBeingCaptured: null,
    start () {
        //Feature Detection
        if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
            //Feature is not supported in browser
            //return a custom error
            return Promise.reject(new Error('mediaDevices API or getUserMedia method is not supported in this browser.'));
        }

        else {
            //create an audio stream
            return navigator.mediaDevices.getUserMedia({ audio: true })
                //returns a promise that resolves to the audio stream
                .then(stream => {

                    //save the reference of the stream to be able to stop it when necessary
                    audioRecorder.streamBeingCaptured = stream;

                    //create a media recorder instance by passing that stream into the MediaRecorder constructor
                    audioRecorder.mediaRecorder = new MediaRecorder(stream);

                    audioRecorder.mediaRecorder.addEventListener("dataavailable", event => {
                        //store audio Blob object
                        audioRecorder.audioBlobs.push(event.data);
                    });
                    audioRecorder.mediaRecorder.start();
                });
        }
    },
    stop () {
        //return a promise that would return the blob or URL of the recording
        return new Promise(resolve => {
            //save audio type to pass to set the Blob type
            let mimeType = 'audio/mpeg;codecs=opus';
            //listen to the stop event in order to create & return a single Blob object
            audioRecorder.mediaRecorder.addEventListener("stop", () => {
                let audioBlob = new Blob(audioRecorder.audioBlobs, { type: mimeType });                
                resolve(audioBlob);
            });
            audioRecorder.cancel();
        });
    },
    /** Cancel audio recording*/
    cancel () {
        //stop the recording feature
        audioRecorder.mediaRecorder.stop();

        //stop all the tracks on the active stream in order to stop the stream
        audioRecorder.stopStream();

        //reset API properties for next recording
        audioRecorder.resetRecordingProperties();
    },
    stopStream () {
        audioRecorder.streamBeingCaptured.getTracks() //get all tracks from the stream
            .forEach(track => track.stop()); //stop each one
    },
    resetRecordingProperties () {
        audioRecorder.mediaRecorder = null;
        audioRecorder.streamBeingCaptured = null;
    }
}

/** Starts the audio recording*/
export function startAudioRecording() {
    console.log("Recording Audio...");

    //start recording using the audio recording API
    audioRecorder.start()
        .then(() => { //on success
            //store the recording start time to display the elapsed time according to it
            audioRecorder.startTime = new Date();
            console.log('Recording in progress')
        })
        .catch(audioRecorderStartErrorHandler);
}

export function stopAudioRecording(callback) {

    console.log("Stopping Audio Recording...");

    //stop the recording using the audio recording API
    audioRecorder.stop()
        .then(audioAsblob => {
            //Play recorder audio
            callback(audioAsblob);

            //hide recording control button & return record icon
            // handleHidingRecordingControlButtons();
        })
        .catch(error => {
            //Error handling structure
            switch (error.name) {
                case 'InvalidStateError': //error from the MediaRecorder.stop
                    console.log("An InvalidStateError has occured.");
                    break;
                default:
                    console.log("An error occured with the error name " + error.name);
            };
        });
}

 /** Cancel the currently started audio recording */
export function cancelAudioRecording() {
    console.log("Canceling audio...");

    //cancel the recording using the audio recording API
    audioRecorder.cancel();
    audioRecorder.startTime = null

    //hide recording control button & return record icon
    // handleHidingRecordingControlButtons();
}

// Handle Audio
export function handleAudio(recorderAudioAsBlob, callback) {
    console.log(recorderAudioAsBlob)
    let reader = new FileReader();

    //once content has been read
    reader.onload = (e) => {
        //store the base64 URL that represents the URL of the recording audio
        let base64URL = e.target.result;
        console.log(base64URL, 'Blob converted')
 
        //set the type of the audio element based on the recorded audio's Blob type
        let BlobType = recorderAudioAsBlob.type.includes(";") ?
        recorderAudioAsBlob.type.substr(0, recorderAudioAsBlob.type.indexOf(';')) : recorderAudioAsBlob.type;

        callback(base64URL, BlobType)
    };

    reader.readAsDataURL(recorderAudioAsBlob);
}

export default audioRecorder