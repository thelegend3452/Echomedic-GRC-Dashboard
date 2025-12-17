import React, { useState, useEffect } from "react";
import './modal.css';
import { CHECKLIST } from "../../data/ansatt.js";

const Modal = ({ isOpen, onClose, onSave }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [department, setDepartment] = useState("");
    const [startDate, setStartDate] = useState("");

    const [isMounted, setIsMounted] = useState(false);
    const [shouldOpen, setShouldOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsMounted(true);
            setTimeout(() => setShouldOpen(true), 10);

            setName("");
            setEmail("");
            setRole("");
            setDepartment("");
            setStartDate(new Date().toISOString().split('T')[0]);
        } else {
            setShouldOpen(false);
            const timer = setTimeout(() => {
                setIsMounted(false);
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const initials = name
            ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
            : "NA";

        const colors = ["#FCD34D", "#3B82F6", "#D8B4FE", "#F87171", "#34D399"];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        const newEmployee = {
            id: `E-${Math.floor(Math.random() * 1000) + 100}`,
            name,
            email,
            role,
            department,
            startDate,
            progress: 0,
            status: "Pending",
            avatarColor: randomColor,
            initials: initials,
            checklist: CHECKLIST.map(item => ({ ...item }))
        };

        try {
            const response = await fetch("/api/employee", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newEmployee),
            });

            if (response.ok) {
                onSave(newEmployee);
                onClose();
            } else {
                console.error("Failed to save employee to database");
                alert("Something went wrong saving the employee.");
            }
        } catch (error) {
            console.error("Network error:", error);
            alert("Could not connect to the server.");
        }
    };

    if (!isMounted) return null;

    return (
        <>
            <div className="modal-overlay" onClick={onClose}></div>

            <div className={`slide-panel ${shouldOpen ? "open": "close"}`}>
                <div className="panel-header">
                    <div className="panel-header-top">
                        <button className="close-btn" onClick={onClose}>✕</button>
                    </div>
                    <h2>Ny ansatt</h2>
                    <p style={{color: '#666', fontSize: '14px', marginTop: '5px'}}>Legg til en ny ansatt i onboarding-prosessen.</p>
                </div>

                <div className="panel-content">
                    <form id="employeeForm" onSubmit={handleSubmit}>

                        <div className="form-group">
                            <label>Fullt navn</label>
                            <input
                                type="text"
                                placeholder="f.eks. Ola Peter"
                                value={name}
                                required
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>E-post</label>
                            <input
                                type="email"
                                placeholder="ansatt@echomedic.no"
                                value={email}
                                required
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group half">
                                <label>Rolle / Tittel</label>
                                <input
                                    type="text"
                                    placeholder="f.eks. Utvikler"
                                    value={role}
                                    required
                                    onChange={(e) => setRole(e.target.value)}
                                />
                            </div>
                            <div className="form-group half">
                                <label>Avdeling</label>
                                <select
                                    value={department}
                                    onChange={(e) => setDepartment(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Velg avdeling...</option>
                                    <option value="Engineering">Engineering</option>
                                    <option value="HR">HR</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Startdato</label>
                            <input
                                type="date"
                                value={startDate}
                                required
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>

                    </form>
                </div>

                <div className="panel-footer">
                    <button type="submit" form="employeeForm" className="btn-save">
                        Legg til ansatt
                    </button>
                    <button type="button" onClick={onClose} className="btn-cancel">
                        Avbryt
                    </button>
                </div>
            </div>
        </>
    );
};

export default Modal;