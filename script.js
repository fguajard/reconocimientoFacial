

video = document.querySelector("#video")

const startVideo = () =>{
    const promesaVideo = navigator.mediaDevices.getUserMedia({video:true})
    promesaVideo.then((mediaStream)=>{    
        video.srcObject = mediaStream
    }).catch((err)=>console.error(err))
}

Promise.all([//funcionan en paralelo
    faceapi.nets.tinyFaceDetector.loadFromUri(`/models`), // detector de cara mas pequño y rapido
    faceapi.nets.faceLandmark68Net.loadFromUri(`/models`), //registra las diferentes partes de la cara 
    faceapi.nets.faceRecognitionNet.loadFromUri(`/models`), //reconoce donde esta la cara 
    faceapi.nets.faceExpressionNet.loadFromUri(`/models`)//reconoce las emociones expresadas en la cara feliz,triste ,etc

]).then(startVideo)

video.addEventListener("play",()=>{ //cuando el video comience a reproducirse
    const canvas = faceapi.createCanvasFromMedia(video) //crea canvas en base a video
    document.body.append(canvas)
    const displaySize = {width : video.width, height : video.height} //objeto con las dimensiones del video
    faceapi.matchDimensions(canvas,displaySize) //iguala las dimensiones de canvas a las del video
    setInterval( async () => {
        const detections = await faceapi.detectAllFaces(video,
        new faceapi.TinyFaceDetectorOptions()) // va a detectar todas als caras dentro de "video" usando la libreria FaceDetector
        .withFaceLandmarks().withFaceExpressions() //vamos a detectar las caras con FaceLandMarks(puntos en la cara)  FaceExpressions determina la expresion en la cara 
        
        const reziseDertections = faceapi.resizeResults(detections,displaySize) //asegura que el cuadro de las detecciones se ajsute al tamaño del video
        canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height)
        faceapi.draw.drawDetections(canvas,reziseDertections) //dibujamos las detecciones en el canvas que ira sobre el video 
        faceapi.draw.drawFaceLandmarks(canvas,reziseDertections)
        faceapi.draw.drawFaceExpressions(canvas,reziseDertections)

    },100) //va a hacer esta funcion cada 100 milisegundos
})




// const startVideo = () =>{
// navigator.getUserMedia({
//     video : {}
// }, 
// stream => console.log(stream)
// )}




// startVideo();