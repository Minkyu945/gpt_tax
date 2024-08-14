import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import './ChatBrainPage.css';

function ChatBrainPage() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [tone, setTone] = useState('상냥한'); // 기본 어조 설정
    const [isToneSelected, setIsToneSelected] = useState(false); // 어조 선택 상태
    const typingIntervalRef = useRef(null);
    const [conversationId, setConversationId] = useState(null); // 대화 ID 관리

    const handleInputChange = (event) => {
        setMessage(event.target.value);
    };

    const handleToneSelect = (selectedTone) => {
        setTone(selectedTone);
        setIsToneSelected(true);
    };

    const handleSendClick = async () => {
        if (message.trim() === "") return;

        const userMessage = { text: message, isUser: true };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setMessage("");

        try {
            const aiMessage = { text: "···", isUser: false, isTyping: true };
            setMessages((prevMessages) => [...prevMessages, aiMessage]);

            // 서버에 POST 요청
            const response = await axios.post("http://localhost:5000/api/test", {
                conversation_id: conversationId, // 서버에 전달할 대화 ID
                topic: message,
                prompt_type: "기본 모드",
                tone: tone,
            });

            // 새로운 대화 ID가 반환되면 업데이트
            if (!conversationId && response.data.conversation_id) {
                setConversationId(response.data.conversation_id);
            }

            startTypingEffect(response.data.answer);
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage = { text: "답변을 가져오는 중 오류가 발생했습니다.", isUser: false, isTyping: false };
            setMessages((prevMessages) => {
                const newMessages = [...prevMessages];
                newMessages[newMessages.length - 1] = errorMessage;
                return newMessages;
            });
        }
    };

    const startTypingEffect = (text) => {
        let index = 0;
        setMessages((prevMessages) => {
            const newMessages = [...prevMessages];
            const lastMessage = newMessages[newMessages.length - 1];
            lastMessage.isTyping = false;
            lastMessage.text = "";
            return newMessages;
        });

        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = setInterval(() => {
            setMessages((prevMessages) => {
                const newMessages = [...prevMessages];
                const lastMessage = newMessages[newMessages.length - 1];
                lastMessage.text = text.slice(0, index + 1);
                return newMessages;
            });
            index++;
            if (index === text.length) {
                clearInterval(typingIntervalRef.current);
            }
        }, 20);
    };

    useEffect(() => {
        return () => {
            clearInterval(typingIntervalRef.current);
        };
    }, []);

    const formatText = (text) => {
        return { __html: text.replace(/\n/g, '<br>') };
    };

    return (
        <Box className="chat-brain-page-container">
            {isToneSelected ? (
                <>
                    <Typography className="main-content-title">
                        {tone === '상냥한' && '상냥한 똑쟁이 비서와 일합니다. 다른 비서와 일하시려면 새 대화를 열어주세요'}
                        {tone === '전문적인' && '전문적인 똑쟁이 비서와 일합니다. 다른 비서와 일하시려면 새 대화를 열어주세요'}
                        {tone === '차가운' && '차가운 똑쟁이 비서와 일합니다. 다른 비서와 일하시려면 새 대화를 열어주세요'}
                    </Typography>
                    <Box className="messages-container">
                        {messages.map((msg, index) => (
                            <Box key={index} className={`message-bubble ${msg.isUser ? 'ai-message' : 'user-message'}`}>
                                {msg.isTyping ? (
                                    <span className="typing-loading">
                                        <span className="dot">·</span>
                                        <span className="dot">·</span>
                                        <span className="dot">·</span>
                                        <span className="typing-text">AI가 답을 쓰고 있어요. 오래 걸려도 아주 열심히 적고 있으니 조금만 기다려 주세요.</span>
                                    </span>
                                ) : (
                                    <span dangerouslySetInnerHTML={formatText(msg.text)} />
                                )}
                            </Box>
                        ))}
                    </Box>
                    <Box className="chat-input-wrapper">
                        <TextField
                            variant="outlined"
                            placeholder="고객의 질문을 입력하세요..."
                            value={message}
                            onChange={handleInputChange}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleSendClick();
                                }
                            }}
                            className="chat-input"
                        />
                        <IconButton onClick={handleSendClick} color="primary">
                            <SendIcon />
                        </IconButton>
                    </Box>
                </>
            ) : (
                <Box className="tone-selection">
                    <Typography className="tone-selection-title">어조 선택</Typography>
                    <Box className="tone-buttons-container">
                        <Box className="tone-button" onClick={() => handleToneSelect('상냥한')}>
                            <Typography className="tone-button-title">상냥한</Typography>
                            <Typography className="tone-button-subtitle">20대 여사원이 40-50대 대표들에게 상냥하게 응대하는 모드</Typography>
                        </Box>
                        <Box className="tone-button" onClick={() => handleToneSelect('전문적인')}>
                            <Typography className="tone-button-title">전문적인</Typography>
                            <Typography className="tone-button-subtitle">세무법인 직원으로 전문적인 어조로 응대하는 모드</Typography>
                        </Box>
                        <Box className="tone-button" onClick={() => handleToneSelect('차가운')}>
                            <Typography className="tone-button-title">차가운</Typography>
                            <Typography className="tone-button-subtitle">30대 남성이 40-50대 대표들에게 차가운 어조로 응대하는 모드</Typography>
                        </Box>
                    </Box>
                </Box>
            )}
        </Box>
    );
}

export default ChatBrainPage;
