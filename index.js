import dotenv from 'dotenv';
dotenv.config();
import { HfInference } from '@huggingface/inference';

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

const textToTranslate = "It is an exciting time to be an AI engineer"

const textTranslationResponse = await hf.translation({
    model: 'facebook/mbart-large-50-many-to-many-mmt',
    inputs: textToTranslate,
    parameters: {
        src_lang: "en_XX",
        tgt_lang: "es_XX"
    }

})

const translation = textTranslationResponse.translation_text
console.log("\ntranslation:\n")
console.log(translation)
