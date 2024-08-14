import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, TextField, IconButton, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import './ExcelDocsPage.css';

function ExcelDocsPage() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [file, setFile] = useState(null);
    const [excelInfo, setExcelInfo] = useState("");
    const [isUploadDisabled, setIsUploadDisabled] = useState(false);
    const [isInputDisabled, setIsInputDisabled] = useState(true); // 입력란 비활성화 상태 추가
    const [isFileSelectDisabled, setIsFileSelectDisabled] = useState(false); // 파일 첨부 버튼 비활성화 상태 추가
    const typingIntervalRef = useRef(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post("http://localhost:5000/api/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setExcelInfo(response.data.company_info);
            alert('업로드 완료');
            setIsUploadDisabled(true);
            setIsInputDisabled(false); // 업로드 완료 후 입력란 활성화
            setIsFileSelectDisabled(true); // 업로드 완료 후 파일 첨부 버튼 비활성화
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    const handleInputChange = (event) => {
        setMessage(event.target.value);
    };

    const handleSendClick = async () => {
        if (message.trim() === "" || !excelInfo) return;

        const userMessage = { text: message, isUser: true };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setMessage("");

        try {
            const aiMessage = { text: "···", isUser: false, isTyping: true };
            setMessages((prevMessages) => [...prevMessages, aiMessage]);

            const response = await axios.post("http://localhost:5000/api/ask", {
                topic: message,
                prompt_type: "회사정보",
                product_info: excelInfo,
            });

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
        <Box className="excel-docs-page-container">
            <Typography className="main-content-title">
                문서 번역 비서와 일합니다. 다른 비서와 일하시려면 새 대화를 열어주세요
            </Typography>
            <Box className="file-upload-container">
                <label className={`file-select-box ${isFileSelectDisabled ? 'disabled' : ''}`}>
                    <input type="file" onChange={handleFileChange} disabled={isFileSelectDisabled} />
                    <span>{file ? file.name : "파일 선택"}</span>
                </label>
                <Button 
                    variant="contained" 
                    onClick={handleUpload} 
                    className="upload-button" 
                    disabled={isUploadDisabled}
                >
                    업로드
                </Button>
            </Box>
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
                    placeholder={isInputDisabled ? "파일을 첨부해주세요" : "메시지를 입력하세요..."}
                    value={message}
                    onChange={handleInputChange}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' && !isInputDisabled) {
                            handleSendClick();
                        }
                    }}
                    className="chat-input"
                    disabled={isInputDisabled} // 입력란 비활성화
                />
                <IconButton onClick={handleSendClick} color="primary" disabled={isInputDisabled}>
                    <SendIcon />
                </IconButton>
            </Box>
        </Box>
    );
}

export default ExcelDocsPage;
