import React, {useEffect, useState} from "react";
import './onboarding.css';
import Modal from "./modal.jsx";
import {CHECKLIST} from "../../data/ansatt.js";


const Onboarding = () => {

    const formatData = (rawList) => {
        if (!Array.isArray(rawList)) return [];
        return rawList.map(emp => ({
            ...emp,
            initials: emp.initials || emp.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
            avatarColor: emp.avatarColor || '#3B82F6',
            checklist: emp.checklist || CHECKLIST.map(item => ({ ...item }))
        }));
    };

    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch("/api/employee");

                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }

                const data = await response.json();

                setEmployees(formatData(data));
            } catch (error) {
                console.error("Error loading employees:", error);
            }
        };

        fetchEmployees();
    }, []);

    const filteredEmployees = employees.filter((emp) => {
        const query = searchQuery.toLowerCase();
        return (
            emp.name.toLowerCase().includes(query) ||
            emp.role.toLowerCase().includes(query) ||
            (emp.department && emp.department.toLowerCase().includes(query))
        );
    });

    const handleRowClick = (employee) => {
        setSelectedEmployee(employee);
    };

    const closeDrawer = () => {
        setSelectedEmployee(null);
    };

    const handleAddEmployee = (newEmployee) => {
        setEmployees(prev => [newEmployee, ...prev]);
        setIsModalOpen(false);
    };

    const handleDeleteEmployee = async (id) => {
        try {
            const response = await fetch(`/api/employee/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setEmployees(prev => prev.filter(emp => emp.id !== id));
                setSelectedEmployee(null);
            } else if (response.status === 404) {
                console.error("Employee not found on server.");
                alert("Employee not found and could not be deleted.");
            } else {
                console.error("Error deleting employee from database.");
                alert("Failed to delete employee.");
            }
        } catch (error) {
            console.error("Network error during deletion:", error);
            alert("Could not connect to the server to delete employee.");
        }
    };

    const toggleCheckItem = async (itemId) => {
        if (!selectedEmployee) return;

        const updatedChecklist = selectedEmployee.checklist.map(item =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
        );

        const completedCount = updatedChecklist.filter(i => i.completed).length;
        const newProgress = Math.round((completedCount / updatedChecklist.length) * 100);

        let newStatus = "In Progress";
        if (newProgress === 0) newStatus = "Pending";
        if (newProgress === 100) newStatus = "Completed";

        const updatedEmployee = {
            ...selectedEmployee,
            checklist: updatedChecklist,
            progress: newProgress,
            status: newStatus
        };

        setSelectedEmployee(updatedEmployee);
        setEmployees(prevEmployees =>
            prevEmployees.map(e => e.id === updatedEmployee.id ? updatedEmployee : e)
        );

      try {
            await fetch("/api/employee", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedEmployee),
            });
        } catch (error) {
            console.error("Error updating checklist:", error);
        }
    };

    return (
        <div className="dashboard-container">
            <div className="main-content">
                <div className="page-header">
                    <div>
                        <h1>Onboarding av ansatte</h1>
                        <p className="subtitle">Følg opp sikkerhetsopplæring og tilgangsstyring for nyansatte.</p>
                    </div>
                    <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                        + Ny ansatt
                    </button>
                </div>

                <div className="toolbar">
                    <div className="search-wrapper">
                        <input
                            type="text"
                            placeholder="Søk i ansatte..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="table-container">
                    <div className="table-header">
                        <div className="col-name">NAVN</div>
                        <div className="col-role">ROLLE</div>
                        <div className="col-date">STARTDATO</div>
                        <div className="col-progress">FREMDRIFT</div>
                        <div className="col-status">STATUS</div>
                    </div>

                    <div className="table-body">
                        {filteredEmployees.length > 0 ? (
                            filteredEmployees.map((emp) => (
                                <div key={emp.id} className="table-row" onClick={() => handleRowClick(emp)}>
                                    <div className="col-name">
                                        <div className="avatar" style={{ backgroundColor: emp.avatarColor }}>{emp.initials}</div>
                                        <div className="name-info">
                                            <span className="emp-name">{emp.name}</span>
                                            <span className="emp-dept">{emp.department}</span>
                                        </div>
                                    </div>
                                    <div className="col-role">{emp.role}</div>
                                    <div className="col-date">{emp.startDate}</div>

                                    <div className="col-progress">
                                        <div className="progress-track">
                                            <div className="progress-fill" style={{ width: `${emp.progress}%` }}></div>
                                        </div>
                                        <span className="progress-text">{emp.progress}%</span>
                                    </div>

                                    <div className="col-actions">
                                        <span className="action-dots">•••</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                                Ingen ansatte funnet.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {selectedEmployee && (
                <>
                    <div className="drawer-overlay" onClick={closeDrawer}></div>
                    <div className="drawer">
                        <div className="drawer-header">
                            <div className="drawer-user-profile">
                                <div className="avatar large" style={{ backgroundColor: selectedEmployee.avatarColor }}>
                                    {selectedEmployee.initials}
                                </div>
                                <div className="drawer-user-info">
                                    <h2>{selectedEmployee.name}</h2>
                                    <div className="drawer-meta">
                                        <span> {selectedEmployee.role}</span>
                                    </div>
                                    <div className="drawer-contact">
                                        <p> {selectedEmployee.email}</p>
                                        <p> {selectedEmployee.startDate}</p>
                                    </div>
                                </div>
                            </div>
                            <button className="close-btn" onClick={closeDrawer}>×</button>
                        </div>

                        <div className="drawer-body">
                            <div className="section-progress">
                                <div className="flex-between">
                                    <h3>FREMDRIFT</h3>
                                    <span className="blue-text">{selectedEmployee.progress}%</span>
                                </div>
                                <div className="progress-track" style={{ maxWidth: '100%', height: '8px', backgroundColor: '#EFF6FF' }}>
                                    <div className="progress-fill" style={{ width: `${selectedEmployee.progress}%` }}></div>
                                </div>
                            </div>

                            <div className="section-checklist">
                                <h3><span className="check-icon">✓</span> Sikkerhetssjekkliste</h3>
                                <div className="checklist-items">
                                    {selectedEmployee.checklist && selectedEmployee.checklist.map((item) => (
                                        <div
                                            key={item.id}
                                            className={`checklist-item ${item.completed ? 'completed' : ''}`}
                                            onClick={() => toggleCheckItem(item.id)}
                                        >
                                            <div className="circle-check">
                                                {item.completed && <span></span>}
                                            </div>
                                            <span>{item.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="drawer-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <span className="footer-id" style={{ display: 'block' }}>ID: {selectedEmployee.id}</span>
                                <span className="footer-update"> Updated just now</span>
                            </div>

                            <button
                                onClick={() => {
                                    if(window.confirm(`Er du sikker på at du vil slette ${selectedEmployee.name}?`)) {
                                        handleDeleteEmployee(selectedEmployee.id);
                                    }
                                }}
                                style={{
                                    backgroundColor: '#FEE2E2',
                                    color: '#DC2626',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '12px'
                                }}
                            >
                                Slett Ansatt
                            </button>
                        </div>
                    </div>
                </>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleAddEmployee}
            />
        </div>
    );
};

export default Onboarding;