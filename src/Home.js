import React from 'react';
import { Typography, Box, Button, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import './Home.css';
import ChatDataIcon from './img/ico_chat_brain.svg';
import ChatBrainIcon from './img/ico_chat_data.svg';
import ChatDocsIcon from './img/ico_chat_docs.svg';
import ChatSummaryIcon from './img/ico_chat_summary.svg';
import ChatTikitakaIcon from './img/ico_chat_tikitaka.svg';
import ChatTranslateIcon from './img/ico_chat_translateDoc.svg';

function Home() {
    return (
        <Box className="centered-text-container">
            <Box className="text-container">
                <Typography className="centered-text">
                    대화하거나 함께 일할 비서를 선택해 주세요.
                </Typography>
                <Typography className="sub-text">
                    세무사 공식 비서
                </Typography>
                <Box className="button-container">
                    <Button className="custom-card-button" onClick={() => window.location.href = '/chat-brain'}>
                        <Box className="button-content">
                            <Box className="inline-content">
                                <img src={ChatBrainIcon} alt="Chat Brain Icon" className="icon" />
                                <Typography className="main-text">고객 응대</Typography>
                            </Box>
                            <Typography className="button-sub-text">선택한 어조에 따른 고객 응대 방법 제시</Typography>
                        </Box>
                    </Button>
                    <Button className="custom-card-button" onClick={() => window.location.href = '/tikitaka'}>
                        <Box className="button-content">
                            <Box className="inline-content">
                                <img src={ChatTikitakaIcon} alt="Chat Tikitaka Icon" className="icon" />
                                <Typography className="main-text">정관 파일</Typography>
                            </Box>
                            <Typography className="button-sub-text">정관 파일 분석 후 정보 제공</Typography>
                        </Box>
                    </Button>
                    <Button className="custom-card-button" onClick={() => window.location.href = '/excel-docs'}>
                        <Box className="button-content">
                            <Box className="inline-content">
                                <img src={ChatDocsIcon} alt="Chat Docs Icon" className="icon" />
                                <Typography className="main-text">엑셀 파일</Typography>
                            </Box>
                            <Typography className="button-sub-text">엑셀 파일 분석 후 정보 제공</Typography>
                        </Box>
                    </Button>
                    <Button className="custom-card-button" onClick={() => window.location.href = '/article'}>
                        <Box className="button-content">
                            <Box className="inline-content">
                                <img src={ChatDocsIcon} alt="Chat Docs Icon" className="icon" />
                                <Typography className="main-text">세법 기사 요약</Typography>
                            </Box>
                            <Typography className="button-sub-text">세법 기사 요약 후 메일링 서비스</Typography>
                        </Box>
                    </Button>
                    <Button className="custom-card-button">
                        <Box className="button-content">
                            <Box className="inline-content">
                                <img src={ChatTikitakaIcon} alt="Chat Tikitaka Icon" className="icon" />
                                <Typography className="main-text">데이터 분석</Typography>
                            </Box>
                            <Typography className="button-sub-text">엑셀/CSV 올리고 분석, 편집, 요약</Typography>
                        </Box>
                    </Button>
                    <Button className="custom-card-button">
                        <Box className="button-content">
                            <Box className="inline-content">
                                <img src={ChatTranslateIcon} alt="Chat Translate Icon" className="icon" />
                                <Typography className="main-text">본문 번역</Typography>
                            </Box>
                            <Typography className="button-sub-text">본문 주고 원하는 언어와 톤으로 번역</Typography>
                        </Box>
                    </Button>
                    <Button className="custom-card-button">
                        <Box className="button-content">
                            <Box className="inline-content">
                                <img src={ChatBrainIcon} alt="Chat Brain Icon" className="icon" />
                                <Typography className="main-text">내용 요약</Typography>
                            </Box>
                            <Typography className="button-sub-text">2~3줄로 핵심만 간결하게 요약</Typography>
                        </Box>
                    </Button>
                    <Button className="custom-card-button">
                        <Box className="button-content">
                            <Box className="inline-content">
                                <img src={ChatDataIcon} alt="Chat Data Icon" className="icon" />
                                <Typography className="main-text">내용 확장</Typography>
                            </Box>
                            <Typography className="button-sub-text">원문 뜻 유지하며 2~3배 늘리기</Typography>
                        </Box>
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default Home;
