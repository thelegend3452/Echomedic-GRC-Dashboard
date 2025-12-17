import React, { useState, useEffect } from 'react';

const SecurityPosture = () => {
    // State to store the calculated counts
    const [riskStats, setRiskStats] = useState({
        apen: 0,
        pagar: 0,
        mitigert: 0,
        akseptert: 0
    });

    const [onboardingStats, setOnboardingStats] = useState({
        completed: 0,
        incomplete: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [empResponse, riskResponse] = await Promise.all([
                    fetch('/api/employee'),
                    fetch('/api/risk')
                ]);

                if (!empResponse.ok || !riskResponse.ok) {
                    throw new Error("Failed to fetch data");
                }

                const employees = await empResponse.json();
                const risks = await riskResponse.json();

                const rStats = { apen: 0, pagar: 0, mitigert: 0, akseptert: 0 };

                risks.forEach(risk => {
                    const status = risk.status ? risk.status.toLowerCase() : "";

                    if (status.includes("åpen") || status.includes("open")) rStats.apen++;
                    else if (status.includes("pågår") || status.includes("progress")) rStats.pagar++;
                    else if (status.includes("mitigert") || status.includes("mitigated") || status.includes("lukket")) rStats.mitigert++;
                    else if (status.includes("akseptert") || status.includes("accepted")) rStats.akseptert++;
                });
                setRiskStats(rStats);

                let completedCount = 0;
                let incompleteCount = 0;

                employees.forEach(emp => {
                    if (emp.progress === 100) {
                        completedCount++;
                    } else {
                        incompleteCount++;
                    }
                });

                setOnboardingStats({
                    completed: completedCount,
                    incomplete: incompleteCount
                });

            } catch (error) {
                console.error("Error loading security posture data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="security-posture-section">
            <h2 className="security-posture-title">Oversikt over sikkerhetstilstand</h2>
            <div className="security-posture-container">

                {/* RISIKOREGISTER CARD */}
                <div className="posture-card device-monitoring">
                    <h3 className="card-title">RisikoRegister</h3>
                    <div className="status-list">

                        <div className="status-item">
                            <span className="status-text">Åpen</span>
                            <span className="status-count red-text">{riskStats.apen}</span>
                        </div>

                        <div className="status-item">
                            <span className="status-text">Pågår</span>
                            <span className="status-count">{riskStats.pagar}</span>
                        </div>

                        <div className="status-item">
                            <span className="status-text">Mitigert</span>
                            <span className="status-count green-text">{riskStats.mitigert}</span>
                        </div>

                        <div className="status-item">
                            <span className="status-text">Akseptert</span>
                            <span className="status-count gray-text">{riskStats.akseptert}</span>
                        </div>
                    </div>
                </div>

                <div className="posture-card security-policies">
                    <h3 className="card-title">Onboarding</h3>
                    <div className="status-list">

                        <div className="status-item">
                            <span className="status-text">Ferdig onboardet</span>
                            <span className="status-count green-text">{onboardingStats.completed}</span>
                        </div>

                        <div className="status-item">
                            <span className="status-text">Ikke fullført onboarding</span>
                            <span className="status-count red-text">{onboardingStats.incomplete}</span>
                        </div>



                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecurityPosture;