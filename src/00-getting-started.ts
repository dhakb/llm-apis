import "dotenv/config";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


// making a request to the openai api, which allowes us to communicate with the model. gpt-4o-mini is the model we are using.
// this is the way their models are exposed to the public.
// we are using the responses api. which is a new api over the chat completion api.
// they used the chance to improve the api desing and update the name of the api. def better naming. 
// naming is important. 
// it should express the underlying work process, to help the user create the mental abstraction that is closer to lower implementation details.

const response = await openai.responses.create({
  model: "gpt-4o-mini",
  input: [
    {
        role: "system",
        content: "You are a helpful assistant that can answer questions and help with tasks. Your name is Cudo."
    },
    {
        role: "user",
        content: "Hey! I'm a Giga! What's your name?"
    }
  ]
});

console.log(response.output_text);