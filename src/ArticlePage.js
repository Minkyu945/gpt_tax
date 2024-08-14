import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress } from '@mui/material';
import './ArticlePage.css';

function TikitakaPage() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [url, setUrl] = useState("");
    const [companyInfo, setCompanyInfo] = useState("");
    const [isUploadDisabled, setIsUploadDisabled] = useState(false);
    const [isInputDisabled, setIsInputDisabled] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const [emailContent, setEmailContent] = useState("");
    const [emailSubject, setEmailSubject] = useState("");
    const [openEdit, setOpenEdit] = useState(false);
    const [openCustomerInfo, setOpenCustomerInfo] = useState(false);
    const [customerEmail, setCustomerEmail] = useState("");
    const [isCustomerEmailValid, setIsCustomerEmailValid] = useState(false);
    const [isCustomerInfoCompleted, setIsCustomerInfoCompleted] = useState(false);
    const [openReSummaryDialog, setOpenReSummaryDialog] = useState(false);
    const typingIntervalRef = useRef(null);
    const [reSummaryInput, setReSummaryInput] = useState(""); // 재분석 입력 내용을 저장하는 상태 추가
    const [isSendingEmail, setIsSendingEmail] = useState(false);

    const handleUrlChange = (event) => {
        setUrl(event.target.value);
    };

    const handleUpload = async () => {
        if (!url) return;

        const loadingMessage = { text: "", isUser: false, isTyping: true };
        setMessages((prevMessages) => [...prevMessages, loadingMessage]);

        try {
            const response = await axios.post("http://localhost:5000/api/summarize", { url });

            setCompanyInfo(response.data.summary);
            const emailTemplate = response.data.summary;
            const emailSubject = extractEmailSubject(emailTemplate);
            const emailBody = emailTemplate.replace(`제목: ${emailSubject}\n\n`, '');

            const aiMessage = { text: emailBody, isUser: false, isTyping: false };
            setMessages((prevMessages) => {
                const newMessages = [...prevMessages];
                newMessages[newMessages.length - 1] = aiMessage;
                return newMessages;
            });

            setEmailContent(emailBody);
            setEmailSubject(emailSubject);
            setIsUploadDisabled(true);
            setIsInputDisabled(false);
        } catch (error) {
            console.error("Error summarizing URL:", error);
            const errorMessage = { text: "URL 요약 중 오류가 발생했습니다.", isUser: false, isTyping: false };
            setMessages((prevMessages) => {
                const newMessages = [...prevMessages];
                newMessages[newMessages.length - 1] = errorMessage;
                return newMessages;
            });
        }
    };

    const handleReSummaryClick = () => {
        setOpenReSummaryDialog(true);
    };

    const handleReSummaryConfirm = async () => {
        setOpenReSummaryDialog(false);
        setMessages([]);
        setEmailSubject("");
        setEmailContent("");
        
        if (!url) return;

        const loadingMessage = { text: "", isUser: false, isTyping: true };
        setMessages((prevMessages) => [...prevMessages, loadingMessage]);

        try {
            const response = await axios.post("http://localhost:5000/api/summarize", { url, reSummaryInput });

            setCompanyInfo(response.data.summary);
            const emailTemplate = response.data.summary;
            const emailSubject = extractEmailSubject(emailTemplate);
            const emailBody = emailTemplate.replace(`제목: ${emailSubject}\n\n`, '');

            const aiMessage = { text: emailBody, isUser: false, isTyping: false };
            setMessages((prevMessages) => {
                const newMessages = [...prevMessages];
                newMessages[newMessages.length - 1] = aiMessage;
                return newMessages;
            });

            setEmailContent(emailBody);
            setEmailSubject(emailSubject);
            setIsUploadDisabled(true);
            setIsInputDisabled(false);
        } catch (error) {
            console.error("Error summarizing URL:", error);
            const errorMessage = { text: "URL 요약 중 오류가 발생했습니다.", isUser: false, isTyping: false };
            setMessages((prevMessages) => {
                const newMessages = [...prevMessages];
                newMessages[newMessages.length - 1] = errorMessage;
                return newMessages;
            });
        }
    };

    const handleReSummaryCancel = () => {
        setOpenReSummaryDialog(false);
    };

    const handleReSummaryInputChange = (e) => {
        setReSummaryInput(e.target.value);
    };

    const extractEmailSubject = (text) => {
        const match = text.match(/^제목:\s*(.*)$/m);
        return match ? match[1] : "제목 없음";
    };

    const handleInputChange = (event) => {
        setMessage(event.target.value);
    };

    const handleSendClick = async () => {
        if (message.trim() === "" || !companyInfo) return;

        const userMessage = { text: message, isUser: true };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setMessage("");

        try {
            const aiMessage = { text: "···", isUser: false, isTyping: true };
            setMessages((prevMessages) => [...prevMessages, aiMessage]);

            const response = await axios.post("http://localhost:5000/api/ask", {
                topic: message,
                prompt_type: "세법기사",
                content: companyInfo,
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

    const handleEditClick = () => {
        setIsEditMode(true);
        setOpenEdit(true);
    };

    const handleEditCancel = () => {
        setIsEditMode(false);
        setOpenEdit(false);
        setEmailContent(messages[messages.length - 1].text);
    };

    const handleEditComplete = () => {
        const updatedMessage = { text: emailContent, isUser: false, isTyping: false };
        setMessages((prevMessages) => {
            const newMessages = [...prevMessages];
            newMessages[newMessages.length - 1] = updatedMessage;
            return newMessages;
        });
        setIsEditMode(false);
        setOpenEdit(false);
    };

    const handleCustomerInfoClick = () => {
        setOpenCustomerInfo(true);
    };

    const handleCustomerEmailChange = (e) => {
        const email = e.target.value;
        setCustomerEmail(email);
        setIsCustomerEmailValid(validateEmail(email));
    };

    const handleCustomerInfoComplete = () => {
        setIsCustomerInfoCompleted(true);
        setOpenCustomerInfo(false);
        handleSendEmail();
    };

    const handleCloseCustomerInfo = () => {
        setOpenCustomerInfo(false);
    };

    const handleSendEmail = async () => {
        const emailData = {
            to: customerEmail,
            subject: emailSubject,
            text: emailContent
        };

        try {
            await axios.post("http://localhost:5000/api/send-email", emailData);
            alert("메일이 성공적으로 전송되었습니다.");
        } catch (error) {
            console.error("Error sending email:", error);
            alert("메일 전송 중 오류가 발생했습니다.");
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    return (
        <Box className="tikitaka-page-container">
            <Typography className="main-content-title">
                세법 기사 요약 AI와 일합니다. 다른 비서와 일하시려면 새 대화를 열어주세요
            </Typography>
            <Box className="file-upload-container2">
                <Box className="chat-input-wrapper2">
                    <TextField
                        variant="outlined"
                        placeholder="URL을 입력하세요..."
                        value={url}
                        onChange={handleUrlChange}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleUpload();
                            }
                        }}
                        className="chat-input"
                    />
                </Box>
                <Button 
                    variant="contained" 
                    onClick={handleUpload} 
                    className="upload-button" 
                    disabled={isUploadDisabled}
                >
                    요약
                </Button>
            </Box>
            <Box className="messages-container">
                <div className='subject-container'>
                {emailSubject && (
                    <Box className="email-subject-container">
                        <Typography variant="h6" className="email-subject-text">{emailSubject}</Typography>
                    </Box>
                )}
                </div>
                {messages.map((msg, index) => (
                    <Box key={index} className={` ${msg.isUser ? '' : ''}`}>
                        {msg.isTyping ? (
                            <span className="typing-loading">
                                <span className="dot">·</span>
                                <span className="dot">·</span>
                                <span className="dot">·</span>
                                <span className="typing-text">AI가 답을 쓰고 있어요. 오래 걸려도 아주 열심히 적고 있으니 조금만 기다려 주세요.</span>
                            </span>
                        ) : (
                            <Box className="email-body-container">
                                <span className="email-body-text" dangerouslySetInnerHTML={formatText(msg.text)} />
                            </Box>
                        )}
                        {index === messages.length - 1 && !msg.isTyping && (
                            <Box className="button-container2">
                                <Box className="left-buttons">
                                    <Button variant="contained" onClick={handleReSummaryClick}>
                                        재요약
                                    </Button>
                                </Box>
                                <Box className="right-buttons">
                                    <Button variant="contained" onClick={handleEditClick}>
                                        수정
                                    </Button>
                                    <Button variant="contained" onClick={handleCustomerInfoClick}>
                                        전송
                                    </Button>
                                </Box>
                            </Box>
                        )}
                    </Box>
                ))}
            </Box>
            
            <Dialog open={openEdit} onClose={handleEditCancel} maxWidth="md" fullWidth>
                <DialogTitle>이메일 내용 수정</DialogTitle>
                <DialogContent>
                    <Box mb={2} mt={2}>
                        <TextField
                            multiline
                            fullWidth
                            variant="outlined"
                            value={emailSubject}
                            onChange={(e) => setEmailSubject(e.target.value)}
                            label="이메일 제목"
                        />
                    </Box>
                    <TextField
                        multiline
                        fullWidth
                        variant="outlined"
                        value={emailContent}
                        onChange={(e) => setEmailContent(e.target.value)}
                        label="이메일 내용"
                        style={{ marginTop: '16px' }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditCancel} color="primary">
                        취소
                    </Button>
                    <Button onClick={handleEditComplete} color="primary">
                        완료
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openReSummaryDialog} onClose={handleReSummaryCancel} maxWidth="md" fullWidth>
                <DialogTitle className="dialog-title">재분석</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="중점적으로 재분석하고 싶은 부분을 입력해주세요"
                        name="reSummaryInput"
                        fullWidth
                        value={reSummaryInput}
                        onChange={handleReSummaryInputChange}
                    />
                </DialogContent>
                <DialogActions className="dialog-actions">
                    <Button onClick={handleReSummaryCancel} color="primary">
                        취소
                    </Button>
                    <Button onClick={handleReSummaryConfirm} color="primary">
                        확인
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openCustomerInfo} onClose={handleCloseCustomerInfo} maxWidth="md" fullWidth>
                <DialogTitle>고객 이메일 입력</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="이메일"
                        name="email"
                        fullWidth
                        value={customerEmail}
                        onChange={handleCustomerEmailChange}
                        type="email"
                        required
                        disabled={isSendingEmail}
                    />
                    {isSendingEmail && (
                        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                            <CircularProgress />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCustomerInfo} color="primary" disabled={isSendingEmail}>
                        취소
                    </Button>
                    <Button onClick={handleCustomerInfoComplete} color="primary" disabled={!isCustomerEmailValid || isSendingEmail}>
                        완료
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default TikitakaPage;
