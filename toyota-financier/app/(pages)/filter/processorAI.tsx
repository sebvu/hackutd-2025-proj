/*
for handling the text from the user
will process it and log the keywords, also store the desired aspects mentioned
eg desired price horsepower
ranges? flip
will call reccomend class to start the process
then it will format the result to be the reply to the user
AI chat should be here to make it an actual conversation and
 to draft the explanation of the result
*/

export async function processUserMessage(message: string): Promise<string> {
  const text = message.trim();
  // For real behavior replace the computed return with a fetch to an API route or external service.
  return "words went through AI";
}

//the AI should help make sure we have Something to run through the algorithm
//also to handle more info, if we already made a recommendation