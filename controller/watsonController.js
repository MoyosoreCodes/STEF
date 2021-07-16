const {IamAuthenticator} = require('ibm-watson/auth');
const AssistantV2 = require('ibm-watson/assistant/v2');

const assistant = new AssistantV2({
    version: "2020-09-24",
    authenticator: new IamAuthenticator({
        apikey: "cOEUIHRExltMBjjk5HqAU4v9m1uLpvp_-dD5mc0HFIZb"
    }),
    //serviceUrl: process.env.ASSISTANT_SERVICEURL,
    serviceUrl: "https://api.eu-gb.assistant.watson.cloud.ibm.com/instances/99f34a30-556a-4594-9182-51e6d34bfe2f/v2/assistants/6ec9ac77-dc5e-4e4c-8582-be4921c94560/sessions",
    disableSslVerification: true
});

module.exports = {
    assistant,
    createSession: async () => {
        try {
            const session = await assistant.createSession({
                assistantId: "6ec9ac77-dc5e-4e4c-8582-be4921c94560"
            });

            return {
                status: session.status,
                result: session.result
            }
        } catch (error) {
            console.log(error);
            return error
        }
    },

    sendMessage: async (sessionId, msg) => {
        try {
            const payload = {
                assistantId: "6ec9ac77-dc5e-4e4c-8582-be4921c94560",
                sessionId,
                input: {
                    message_type: 'text',
                    text: msg
                }
            }
            
            const message = await assistant.message(payload);

            return {
                status: message.status,
                result: message.result
            }
        } catch (error) {
            console.log(error);
            return error
        }
    }
}
