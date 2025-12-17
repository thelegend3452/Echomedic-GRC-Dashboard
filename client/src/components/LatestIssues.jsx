import React from 'react';

const IssueRow = ({type, title, time, level }) => {
    const getLevelClass = (l) => {
        switch (l) {
            case 'H': return 'level-high';
            case 'M': return 'level-medium';
            case 'L': return 'level-low';
            case 'C': return 'level-critical';
            case 'I': return 'level-info';
            default: return '';
        }
    };

    return (
        <div className="issue-row">
            <span className="issue-icon-container">
                <span className="issue-icon">{}</span>
            </span>
            <div className="issue-type-title">
                <span className={`issue-level-badge ${getLevelClass(level)}`}>{level}</span>
                <span className="issue-type">{type}</span>
                <span className="issue-title">{title}</span>
            </div>
            <span className="issue-time">{time}</span>
        </div>
    );
};

const LatestIssues = ({ data, limit = 5 }) => {
    const headers = ['TYPE', 'ID', 'BESK', 'TID'];

    const sourceData = data || isoData;

    const getLevelFromStatus = (status) => {
        if (status === 'Non-Compliant') return 'H';
        if (status === 'Partial') return 'M';
        return 'L';
    };

    const activeIssues = sourceData
        .filter(item => item.status !== 'Compliant')
        .map(item => ({
            type: 'ISO-27001',
            title: `${item.code} - ${item.name}`,
            time: item.lastAudited || 'N/A',
            level: getLevelFromStatus(item.status),
            icon: '🛡️'
        }))
        .slice(0, limit);


    return (
        <div className="latest-issues-card card">
            <h2 className="card-title">Siste oppdagede problemer (ISO)</h2>
            <div className="open-issues-header-row">
                {headers.map((header, index) => (
                    <div key={index} className={`open-issues-cell header`}>
                        {header}
                    </div>
                ))}
            </div>
            <div className="issue-list">
                {activeIssues.length > 0 ? (
                    activeIssues.map((issue, index) => (
                        <IssueRow key={index} {...issue} />
                    ))
                ) : (
                    <div style={{padding: '20px', textAlign: 'center', color: '#888'}}>
                        Ingen problemer funnet. Alt ser bra ut!
                    </div>
                )}
            </div>
        </div>
    );
};

export default LatestIssues;