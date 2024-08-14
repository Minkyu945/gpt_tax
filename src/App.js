import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Drawer, Box, Divider } from '@mui/material';
import Home from './Home';
import ChatBrainPage from './ChatBrainPage';
import TikitakaPage from './TikitakaPage';
import ExcelDocsPage from './ExcelDocsPage'; // 추가된 라인
import ArticlePage from './ArticlePage';
import './App.css';
import Logo from './logo192.png';

function App() {
    return (
        <Router>
            <AppBar position="fixed" className="white-app-bar">
                <Toolbar className="white-toolbar">
                    <img src={Logo} alt="logo" className="home-logo" />
                    <Typography variant="h6" className="home-menu-item">
                        GPTs
                    </Typography>
                    <div className="home-spacer" />
                    <Button className="custom-button">회원정보</Button>
                    <Button className="custom-button">로그아웃</Button>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" anchor="left" className="sidebar">
                <Box sx={{ flexGrow: 1, mt: 8 }}>
                    <Button className="new-chat-button" onClick={() => window.location.href = '/'}>
                        + 새 대화 시작
                    </Button>
                </Box>
                <Divider sx={{ backgroundColor: '#ffffff' }} />
                <Box>
                    <Button className="footer-button">이용가이드</Button>
                    <Button className="footer-button">이용자 피드백</Button>
                    <Button className="footer-button">로그아웃</Button>
                </Box>
            </Drawer>
            <Box sx={{ marginLeft: '250px', marginTop: '80px' }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/chat-brain" element={<ChatBrainPage />} />
                    <Route path="/tikitaka" element={<TikitakaPage />} />
                    <Route path="/excel-docs" element={<ExcelDocsPage />} /> {/* 추가된 라인 */}
                    <Route path="/article" element={<ArticlePage />} />
                </Routes>
            </Box>
        </Router>
    );
}

export default App;
