export const audioRecorderStartErrorHandler = error => { //on error
    //No Browser Support Error
    if (error.message.includes("mediaDevices API or getUserMedia method is not supported in this browser.")) {
        console.log("To record audio, use browsers like Chrome and Firefox.");
        // displayBrowserNotSupportedOverlay();
    }

    //Error handling structure
    switch (error.name) {
        case 'AbortError': //error from navigator.mediaDevices.getUserMedia
            console.log("An AbortError has occured.");
            break;
        case 'NotAllowedError': //error from navigator.mediaDevices.getUserMedia
            console.log("A NotAllowedError has occured. User might have denied permission.");
            break;
        case 'NotFoundError': //error from navigator.mediaDevices.getUserMedia
            console.log("A NotFoundError has occured.");
            break;
        case 'NotReadableError': //error from navigator.mediaDevices.getUserMedia
            console.log("A NotReadableError has occured.");
            break;
        case 'SecurityError': //error from navigator.mediaDevices.getUserMedia or from the MediaRecorder.start
            console.log("A SecurityError has occured.");
            break;
        case 'TypeError': //error from navigator.mediaDevices.getUserMedia
            console.log("A TypeError has occured.");
            break;
        case 'InvalidStateError': //error from the MediaRecorder.start
            console.log("An InvalidStateError has occured.");
            break;
        case 'UnknownError': //error from the MediaRecorder.start
            console.log("An UnknownError has occured.");
            break;
        default:
            console.log("An error occured with the error name " + error.name);
    };
}