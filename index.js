// import dotenv from 'dotenv';
// dotenv.config();
// import { HfInference } from '@huggingface/inference';
// import { listModels} from "@huggingface/hub";
import {pipeline} from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.8.0'


// const hf = new HfInference(process.env.HF_TOKEN)

// const textToGenerate = "The definition of machine learning is "

// const response = await hf.textGeneration({
//     inputs: textToGenerate,
//     model: "HuggingFaceH4/zephyr-7b-beta"
// })

// console.log(response)

// const testToClassify = "I just bought a new camera. It is the best camera I have ever owned!"

// const repsonse = await hf.textClassification({
//     model: "distilbert-base-uncased-finetuned-sst-2-english",
//     inputs: testToClassify
// })

// console.log(repsonse)

// const textToTranslate = "It is an exciting time to be an AI engineer"

// const textTranslationResponse = await hf.translation({
//     model: 'facebook/mbart-large-50-many-to-many-mmt',
//     inputs: textToTranslate,
//     parameters: {
//         src_lang: "en_XX",
//         tgt_lang: "es_XX"
//     }

// })

// const translation = textTranslationResponse.translation_text
// console.log("\ntranslation:\n")
// console.log(translation)

// const model = "ghoskno/Color-Canny-Controlnet-model"

// const oldImageUrl = "/old-photo.jpeg"
// const oldImageResponse = await fetch(oldImageUrl)
// const oldImageBlob = await oldImageResponse.blob()

// const prompt = `An elderly couple walks together on a gravel path with green grass and trees on each side. Wearing neutral-colored clothes, they face away from the camera as they carry their bags.`

// const newImageBlob = await hf.imageToImage({
//     model: model,
//     inputs: oldImageBlob,
//     parameters: {
//         prompt: prompt,
//         negative_prompt: "black and white photo. text, bad anatomy, blurry, low quality",
//         strength: 0.85 
//     }
// })

// const newImageBase64 = await blobToBase64(newImageBlob)
// const newImage = document.getElementById("new-image")
// newImage.src = newImageBase64

// async function isModelInferenceEnabled(modelName) {
//     const response = await fetch(`https://api-inference.huggingface.co/status/${modelName}`, {
//         headers: {
//             'Authorization': `Bearer ${process.env.HF_TOKEN}`
//         }
//     })
//     const data = await response.json()
//     return data.state == "Loadable"
// }

// const models = []

// for await (const model of listModels({
//     credentials:{
//         accessToken: process.env.HF_TOKEN
//     },
//     search: {
//         task: "text-to-image"
//     }
// })) {
//     if (model.likes < 2000) {
//         continue
//     }
//     if (await isModelInferenceEnabled(model.name)) {
//         models.push(model)
//     }
// }

// models.sort((model1, model2) => model2.likes - model1.likes)
// for (const model of models) {
//     console.log(`${model.likes} Likes: http://huggingface.co/${model.name} `)
// }

const status = document.getElementById('status')
const image = document.getElementById('image')
const detectObjectsButton = document.getElementById('detect-objects')
const imageContainer = document.getElementById('image-container')

//loading the model and creating a new object detection pipeline
status.textContent = "Loading model..."
const detector = await pipeline('object-detection', 'Xenova/yolos-tiny')

//enabling object detection
detectObjectsButton.addEventListener('click', detectAndDrawObjects)
detectObjectsButton.disabled = false
status.textContent = 'Ready'

async function detectAndDrawObjects() {
    status.textContent = 'Detecting...'
    const detectedObjects = await detector(image.src, {
        threshold: 0.95,
        percentage: true
    })

    status.textContent = 'Drawing...'
    detectedObjects.forEach(obj => {
        drawObjectBox(obj)})
    
    status.textContent = 'Done!'
}

function drawObjectBox(detectedObject) {
    const {label, score, box} = detectedObject
    const {xmax, xmin, ymax, ymin} = box
    //generating a random color for the box
    const color = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, 0)

    //drawing the box
    const boxElement = document.createElement('div')
    boxElement.className = 'bounding-box'
    Object.assign(boxElement.style, {
        borderColor: color,
        left: 100 * xmin + '%',
        top: 100 * ymin + '%',
        width: 100 * (xmax - xmin) + '%',
        height: 100 * (ymax - ymin) + '%'
    })

    //drawing label 
    const labelElement = document.createElement('span')
    labelElement.textContent = `${label} (${Math.floor(100 * score)}%)`
    labelElement.className = 'bounding-box-label'
    labelElement.style.backgroundColor = color
    boxElement.appendChild(labelElement)
    imageContainer.appendChild(boxElement)
}

// status.textContent = 'Detecting Objects...'

// const detectedObjects = await detector(image.src, {
//     threshold: 0.5,
//     percentage: true
// })
// detectedObjects.forEach(object => {
//     console.log(object) 
// })

// status.textContent = 'Done!'