import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import './style/responsive.css'
import ControlCard from "./components/ControlCard.jsx";
import LatestIssues from "./components/LatestIssues.jsx";
import OpenIssuesTable from "./components/OpenIssuesTable.jsx";
import SecurityPosture from "./components/SecurityPosture.jsx";
import RegulationList from "./components/RegulationList.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Dropdown from "./components/Dropdown.jsx";
import Onboarding from "./page/onboarding/Onboarding.jsx";
import { Sjekkliste } from "./page/sjekkliste/Sjekkliste.js";
import RisikoRegister from "./page/risiko/RisikoRegister.jsx";
import Information from "./page/Information/Information.jsx";
import LatestIssues2 from "./components/LatestIssues.jsx";



const MainContent = () => {
    const [data, setdata] = useState([]);
    const [isoData, setIsoData] = useState([]);
    const [normanData, setNormanData] = useState([]);

    useEffect(() => {
        const fetchdata = async () => {
            try {
                const res = await fetch('/api/compliance');
                if (res.ok) {
                    const json = await res.json();
                    setdata(json);
                } else {
                    console.error("Failed to fetch compliance data");
                }
            } catch (error) {
                console.error("Error connecting to server:", error);
            }
        };

        fetchdata();
    }, []);
    useEffect(() => {
        const fetchisodata = async () => {
            try {
                const res = await fetch('/api/compliance/iso');
                if (res.ok) {
                    const json = await res.json();
                    setIsoData(json);
                } else {
                    console.error("Failed to fetch iso compliance data");
                }
            } catch (error) {
                console.error("Error connecting to server:", error);
            }
        };

        fetchisodata();
    }, []);
    useEffect(() => {
        const fetchnormandata = async () => {
            try {
                const res = await fetch('/api/compliance/norman');
                if (res.ok) {
                    const json = await res.json();
                    setNormanData(json);
                } else {
                    console.error("Failed to fetch norman compliance data");
                }
            } catch (error) {
                console.error("Error connecting to server:", error);
            }
        };

        fetchnormandata();
    }, []);

    const getProgressColor = (percentage) => {
        if (percentage >= 80) return '#9333ea';
        if (percentage >= 50) return '#38A169';
        return '#E53E3E';
    };

    const totalIso = isoData.length;
    const passingIso = isoData.filter(item => item.status === 'Compliant').length;
    const partialIso = isoData.filter(item => item.status === 'Partial').length;
    const totalNorman = normanData.length;
    const passingNorman = normanData.filter(item => item.status === 'Compliant').length;
    const partialNorman = normanData.filter(item => item.status === 'Partial').length;

    const completionPercentIso = totalIso > 0 ? Math.round((passingIso / totalIso) * 100) : 0;
    const completionPercentNorman = totalNorman > 0 ? Math.round((passingNorman / totalNorman) * 100) : 0;

    return (
        <div className="main-content">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Generell oversikt</h1>
                <div className="header-actions">
                    <Dropdown/>
                </div>
            </div>

            <div className="compliance-grid">
                <ControlCard
                    title="ISO 27001 controls"
                    controls={passingIso}
                    passing={totalIso}
                    total={totalIso}
                    completion={`${completionPercentIso}%`}
                    color={getProgressColor(completionPercentIso)}
                    partial={partialIso}
                />
            </div>


            {/*bytte fra iso data til norman når vi har lagt den in*/}
            <div className="compliance-grid">
                <ControlCard
                    title="Norman controls"
                    controls={passingNorman}
                    passing={totalNorman}
                    total={totalNorman}
                    completion={`${completionPercentNorman}%`}
                    color={getProgressColor(completionPercentNorman)}
                    partial={partialNorman}
                />
            </div>
            {/*,
            <div style={{ marginBottom: '30px' }}>
                <RegulationList data={data} />
            </div>
            */}

            {/*
                <div className="issue-detection-grid">
                <LatestIssues data={data} />
            </div>
            */}

            <SecurityPosture />
        </div>
    );
};

export default function App() {
    return (
        <BrowserRouter>
            <div className="app-layout">
                <Sidebar />
                <Routes>
                    <Route path="/dashboard" element={<MainContent />} />
                    <Route path="/onboarding" element={<Onboarding />} />
                    <Route path="/sjekkliste" element={<Sjekkliste/>} />
                    <Route path="/information" element={<Information/>}/>
                    <Route path="/risikoregister" element={<RisikoRegister/>} />
                    <Route path="/" element={<MainContent />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}