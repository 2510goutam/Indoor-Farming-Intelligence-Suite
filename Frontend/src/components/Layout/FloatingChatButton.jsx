import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

const FloatingChatButton = () => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = React.useState(false);

    const handleClick = () => {
        navigate('/consultation');
    };

    return (
        <div className="fixed bottom-8 right-8 z-50">
            <button
                onClick={handleClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group relative w-16 h-16 grad-primary rounded-full shadow-2xl shadow-primary-500/50 hover:shadow-primary-500/70 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center"
                aria-label="Open AI Chat Assistant"
            >
                <MessageCircle className="w-7 h-7 text-white" />

                <span className="absolute inset-0 rounded-full bg-primary-500 animate-ping opacity-20" />

                {isHovered && (
                    <div className="absolute right-full mr-4 px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white text-sm font-medium rounded-xl whitespace-nowrap border border-slate-700 dark:border-slate-600 shadow-xl">
                        Chat with AI Assistant
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-0 h-0 border-8 border-transparent border-l-slate-900 dark:border-l-slate-800" />
                    </div>
                )}
            </button>
        </div>
    );
};

export default FloatingChatButton;
