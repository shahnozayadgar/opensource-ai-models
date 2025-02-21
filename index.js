import dotenv from 'dotenv';
dotenv.config();
import { HfInference } from '@huggingface/inference';
import { listModels} from "@huggingface/hub";

const hf = new HfInference(process.env.HF_TOKEN)

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

async function isModelInferenceEnabled(modelName) {
    const response = await fetch(`https://api-inference.huggingface.co/status/${modelName}`, {
        headers: {
            'Authorization': `Bearer ${process.env.HF_TOKEN}`
        }
    })
    const data = await response.json()
    return data.state == "Loadable"
}

const models = []

for await (const model of listModels({
    credentials:{
        accessToken: process.env.HF_TOKEN
    },
    search: {
        task: "text-to-image"
    }
})) {
    if (model.likes < 2000) {
        continue
    }
    if (await isModelInferenceEnabled(model.name)) {
        models.push(model)
    }
}

models.sort((model1, model2) => model2.likes - model1.likes)
for (const model of models) {
    console.log(`${model.likes} Likes: http://huggingface.co/${model.name} `)
}
