import { Configuration, OpenAIApi } from 'openai';

export class ChatGPT {
  openai = null;
  API_KEY = '';

  constructor(API_KEY) {
    this.API_KEY = API_KEY;
    this.setConfiguration();
  }

  setConfiguration() {
    const configs = new Configuration({
      apiKey: this.API_KEY,
    });
    this.openai = new OpenAIApi(configs);
  }

  async createCompletion(searchValue) {
    try {
      const completion = await this.openai.createChatCompletion({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: `Please reply below question in markdown format.\n ${searchValue}`,
          },
        ],
        max_tokens: 4000,
      });

      return [null, completion.data['choices']];
    } catch (err) {
      if (err.response) {
        console.log(err.response.status);
        console.log(err.response.data);
      } else {
        console.log(err.message);
      }
      // throw err.response;
      return [err.response ?? err, null];
    }
  }

  async createCompletions(searchValue) {
    try {
      const completion = await this.openai.createChatCompletion({
        model: 'gpt-4o-search-preview',
      //   web_search_options: {
      //     search_context_size: "high",
      //     user_location: {
      //         type: "approximate",
      //         approximate: {
      //             country: "GB",
      //             city: "Hoboken",
      //             region: "Hoboken",
      //         },
      //     },
      // },
        messages: [{ role: 'user', content: searchValue }],
        // max_tokens: 4000,
        // stream: true,
      });
// console.log('response', response);
return [null, completion.data['choices']];
    } catch (err) {
      console.error('OpenAI API Error:', err.response?.data || err.message);
      // throw err.response;
      error: err.response?.data?.error?.message || err.message 
    }
  }

  async createCompletionss(url) {
    try {
      const response = await this.openai.createChatCompletion({
        model: "gpt-4o-search-preview",
        web_search_options: {
          user_location: {
              type: "approximate",
              approximate: {
                  country: "GB",  // Corrected from "United Kingdom" to "GB"
                  city: "Jersey City",  // Jersey City is in the US, so check if this is correct
                  region: "New Jersey", // Likely meant to be "New Jersey" if it's USA
              },
          },
      },
            messages: [
                {
                    role: "system",
                    content: "You are an assistant that extracts program details from websites."
                },
                {
                    role: "user",
                    content: `Search for all programs or curriculum details from ${url} and return them in structured JSON format like this:
                    {
                      "Programs": [
                        {
                          "programName": "",
                          "programEmail": "",
                          "programPhoneNumber": "",
                          "programDescription": "",
                          "programCost": "",
                          "programAge": "",
                          "programType": "",
                          "programDuration": "",
                          "programLocation": "",
                          "programFullAddress": "",
                          "programDate": "",
                          "programTiming": "",
                          "programLink": "",
                          "programImage": "",
                          "programSchedule": "",
                          "programInPersonOrVirtual": ""
                        }
                      ]
                    }`
                }
            ],
      });
      console.log('response', response);
      return response.data.choices[0].message.content;
    } catch (err) {
      console.error('OpenAI API Error:', err.response?.data || err.message);
      throw err.response?.data?.error?.message || err.message 
    }
  }
  
  async createCompletionsubjects(searchValue, OpenAIModel) {
    // console.log('searchValue', searchValue);
    // console.log('OpenAIModel', OpenAIModel);
    try {
      const completion = await this.openai.createChatCompletion({
        model: `${OpenAIModel}`,
        messages: [
          {
            role: 'user',
            content: `Please reply below question in markdown format.\n ${searchValue}`,
          },
        ],
        max_tokens: 4000,
      });

      return [null, completion.data['choices']];
    } catch (err) {
      if (err.response) {
        console.log(err.response.status);
        console.log(err.response.data);
      } else {
        console.log(err.message);
      }
      // throw err.response;
      return [err.response ?? err, null];
    }
  }
}
