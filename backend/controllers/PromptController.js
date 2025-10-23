const { GoogleGenAI, createUserContent, createPartFromUri } = require("@google/genai");
const { InferenceClient } =  require("@huggingface/inference");
// const OpenAI = require("openai");
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const ai = new GoogleGenAI({});
// const client = new InferenceClient(process.env.HF_TOKEN);
const Stores = require("../models/Stores");
const mongoose = require('mongoose')
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });



const PromptController = {



    copy : async (req, res) => {

        //need page name
        try{
            // Only allow user to view their own stores
            let { businessId, contentLength, textPrompt, contentPurpose, emotion, reference, targetAge,  tone } = req.body;

            let store = await Stores.findOne({ businessName: businessId });

            if(!store) {
                return res.status(404).json({msg: 'store not found'})
            }

            
            const MMPreview = "ဒီအတွက်စာပိုဒ်ကို social media အတွက် ကမ္ဘာကျော် copywriter ပုံစံနဲ့မြန်မာလိုရေးပေးပါ။"

            let task;
            if (textPrompt && textPrompt.trim() !== "") {
              task = `Draft me a social media post for facebook about this: ${textPrompt}\n`;
            }else{
              task = "Draft me a social media post for facebook."
            }

            const promptChain = "Create 5 different posts to choose from."
            const personality = "Engineer the post like a digital marketing expert specialized in education field, PhD level."
            const format = `Respond **only** in the following JSON format:
                            {
                              "post_1": { "title": "Title 1", "content": "Post content 1..." },
                              "post_2": { "title": "Title 2", "content": "Post content 2..." },
                              "post_3": { "title": "Title 3", "content": "Post content 3..." },
                              "post_4": { "title": "Title 4", "content": "Post content 4..." },
                              "post_5": { "title": "Title 5", "content": "Post content 5..." }
                            }
                            Do not include any text outside this JSON.`;


            // Build the prompt dynamically
            let prompt = `${MMPreview}\n${task}\n${promptChain}\n${personality}\n`;

          
            // Add the rest of the prompt (common for both cases)
            prompt += `Business name : ${store.businessName}\n`;
            prompt += `Business core offering : ${store.coreOffering}\n`;
            prompt += `My target customer : ${store.targetAudience}\n`;
            prompt += `My unique selling point : ${store.uniqueSellingProposition}\n`;
            prompt += `My business mission : ${store.businessMission}\n`;
            prompt += `Write a ${contentLength} length post\n `;
            prompt += `Goal of this post is to get more ${contentPurpose}\n`;
            prompt += `Write the post in ${tone} tone\n`;
            prompt += `The post must evoke ${emotion} emotion\n`;
            prompt += `Target Age: ${targetAge}\n`;
            prompt += format;

            // Add reference only if it exists
            if (reference && reference.trim() !== "") {
                prompt += `Take this post as reference: ${reference}\n`;
            }
          
            console.log(prompt)
          
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
            });
          
            let rawResponse = response.text;
            let cleaned = rawResponse.replace(/```json\s*|```/g, "").trim();
          
            let posts;
            try {
              posts = JSON.parse(cleaned);
            } catch (err) {
              console.error("Failed to parse JSON:", err);
              return res.status(500).json({ error: "Failed to parse AI response" });
            }
          
            const { post_1, post_2, post_3, post_4, post_5 } = posts;
          
            return res.json({ post_1, post_2, post_3, post_4, post_5 });
          
        }catch(e){
          return res.status(500).json({msg: 'server error'})
        }    
    },
    choose : async (req, res) => {
        try{
            let { content } = {"title":"Unlock IGCSE CS Success: Beyond Rote Learning","content":"Is your child just 'learning' IGCSE Computer Science concepts, or are they truly understanding them and *how to ace the exams*? 🤯 Many schools focus on content delivery, leaving a crucial gap in exam technique and deep coding comprehension.\n\nAt [Your Page Name], we bridge that gap. We don't just teach chapters; we cultivate a genuine understanding of coding principles AND a step-by-step methodology for tackling every exam question. From decoding complex problems to structuring perfect answers, we equip students with the strategic thinking schools often miss. 🧠💡\n\nReady for grades that reflect true mastery? Transform frustration into confidence.\n\n➡️ DM us 'IGCSE CS' or visit [Link to your website/booking page] to learn more!\n\n#IGCSECS #ComputerScience #CSTutoring #ExamPrep #CodingSkills #StudentSuccess #AcademicSupport #IGCSE"}
            const format = `ဒီအောက်မှာပြထားတဲ့ပုံစံ JSON format နဲ့သာရေးပေးပါ:
                          "post": { 
                                    "title": "Title 1", 
                                    "content": "Post content 1" 
                                    },
                        ဒီ JSON အပြင်မှာစာသားတွေမပါစေနဲ့။`;

            const translate = `
            ${content}

            ဒီအတွက်စာပိုဒ်ကို social media အတွက် ကမ္ဘာကျော် copywriter ပုံစံနဲ့မြန်မာလိုရေးပေးပါ။
            IGCSE CS Tutoring page မှာတင်ရန်ဖြစ်တယ်။
            brand တည်ဆောက်ရန်နဲ့ ဖတ်သူကို တန်ဖိုးပေး ပြီး brand ကိုမှတ်မိလွယ်စေရန် ရည်ရွယ်ပါတယ်။
            `;

            let burmesePrompt = `${translate}\n${format}\n`;
            

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: burmesePrompt,
            });

            let rawResponse = response.text;
            let cleaned = rawResponse.replace(/```json\s*|```/g, "").trim();


            return res.status(200).json({cleaned})
        }catch(e){
            return res.status(500).json({msg: 'server error'});
        }
    },
    audio: (req, res) => {
      // Use multer inside the controller
      upload.single("audioFile")(req, res, async function (err) {
        if (err) {
          console.error("Multer error:", err);
          return res.status(500).json({ error: "Audio upload failed" });
        }

        if (!req.file) {
          return res.status(400).json({ error: "No audio file uploaded" });
        }

        try {
          // Convert audio buffer to base64
          const base64Audio = req.file.buffer.toString("base64");

          // Send to Gemini for transcription
          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: createUserContent([
              createPartFromUri(req.body.uri, req.body.mimeType),
              "Describe this audio clip",
            ]),
          });

          const transcript = response.text();
          res.json({ transcript });

        } catch (error) {
          console.error("Error processing audio:", error);
          res.status(500).json({ error: "Audio processing failed" });
        }
      });
    },
    imageGenerate : async (req, res) => {
        try {
                let post = req.body;

                let translationPrompt = 'Describe the following store in english in a few words\n\n'
                translationPrompt += `${post.title}\n`
                translationPrompt += `${post.preview}`

                const response = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: translationPrompt,
                });

                let prompt = 'Design a infographic social media poster for this post\n\n'
                prompt += `${response.text}`

                

                console.log(prompt)
                
                
                const encodedPrompt = encodeURIComponent(prompt);

                const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}`
        
                return res.json({ imageUrl });

            } catch (e) {
              console.error("Error generating image:", e);
              res.status(500).json({ error: "Image generation failed" });
            }
    },
    imageInput : async (req, res) => {
      try {
        console.log('imageInput endpoint hit');
        console.log('req.file:', req.file);
        console.log('req.body:', req.body);
        // Check if file is uploaded
        if (!req.file) {
          return res.status(400).json({ error: 'No image file uploaded' });
        }

        // Access form fields
        let { businessId, contentLength, tone, targetAge, contentPurpose, emotion } = req.body;
        let store = await Stores.findOne({ businessName: businessId });

        if(!store) {
                return res.status(404).json({msg: 'store not found'})
          }

          // Upload image to GenAI API with correct buffer and original filename
          // Save the uploaded image to a temporary file and pass the file path to GenAI
          const fs = require('fs');
          const path = require('path');
          const tempDir = path.join(__dirname, '../../tmp');
          if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
          }
          const tempPath = path.join(tempDir, req.file.originalname);
          fs.writeFileSync(tempPath, req.file.buffer);

          const image = await ai.files.upload({
            file: tempPath
          });

          fs.unlinkSync(tempPath); // Clean up temp file

        let basePrompt = 'ဒီပုံအတွက်စာပိုဒ်ကို social media အတွက် ကမ္ဘာကျော် copywriter ပုံစံနဲ့မြန်မာလိုရေးပေးပါ။\n'
        const format = `Respond **only** in the following JSON format:
                {
                  "post": { "title": "Title 1", "content": "Post content ..." },
                }
                Do not include any text outside this JSON.`;

        basePrompt += 'facebook မှာတင်ရန်ဖြစ်တယ်။\n'
        basePrompt += 'တခြားစာအပိုဘာမှမပါစေနဲ့။ content ဘဲရေးပေးပါ။ hashtag တွေပါထည့်ပါ။\n\n'
        
        // Add the rest of the prompt
        basePrompt += `My target customer : ${store.targetAudience}\n`;
        basePrompt += `Write a ${contentLength} length post\n `;
        basePrompt += format;

        console.log('Generated basePrompt:', basePrompt);



        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [
            createUserContent([
              basePrompt,
              createPartFromUri(image.uri, image.mimeType),
            ]),
          ],
        });

        // Return the output text to the frontend
        let rawResponse = response.text;
        let cleaned = rawResponse.replace(/```json\s*|```/g, "").trim();
        console.log(cleaned)


        return res.status(200).json({cleaned})
      } catch (e) {
        console.error(e);
        return res.status(500).json({ msg: "server error" });
      }
    }
}

module.exports = PromptController;












