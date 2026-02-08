import axios from 'axios';

const N8N_WEBHOOK_URL = 'https://n8n.brahmaastra.ai/webhook/49256393-8c27-48b4-9b91-d769c5fedb72/chat';

export const sendMessage = async (message) => {
    try {
        const response = await axios.post(N8N_WEBHOOK_URL, {
            message: message,
            timestamp: new Date().toISOString()
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 60000
        });

        if (response.data) {
            if (typeof response.data === 'string') {
                return response.data;
            }
            if (response.data.response) {
                return response.data.response;
            }
            if (response.data.message) {
                return response.data.message;
            }
            if (response.data.output) {
                return response.data.output;
            }
            if (response.data.text) {
                return response.data.text;
            }
            return JSON.stringify(response.data);
        }

        throw new Error('No response from AI');
    } catch (error) {
        console.error('n8n webhook error:', error);

        if (error.code === 'ECONNABORTED') {
            throw new Error('Request timeout - AI is taking too long to respond');
        }
        if (error.response) {
            throw new Error(`Server error: ${error.response.status}`);
        }
        if (error.request) {
            throw new Error('Network error - please check your connection');
        }
        throw new Error('Failed to get AI response');
    }
};

export const loadChatHistory = () => {
    try {
        const history = localStorage.getItem('chat_history');
        return history ? JSON.parse(history) : [];
    } catch (error) {
        console.error('Failed to load chat history:', error);
        return [];
    }
};

export const saveChatHistory = (messages) => {
    try {
        localStorage.setItem('chat_history', JSON.stringify(messages));
    } catch (error) {
        console.error('Failed to save chat history:', error);
    }
};

export const clearChatHistory = () => {
    try {
        localStorage.removeItem('chat_history');
    } catch (error) {
        console.error('Failed to clear chat history:', error);
    }
};

export default {
    sendMessage,
    loadChatHistory,
    saveChatHistory,
    clearChatHistory
};
