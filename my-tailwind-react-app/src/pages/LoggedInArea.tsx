import React from "react";
import "./LoggedInArea.css";

const LoggedInArea: React.FC = () => {
    return (
        <div className="loggedin-min-h-screen">
            <div className="loggedin-container">
                <h1 className="loggedin-title">Welcome!</h1>
                <p className="loggedin-description">
                    You are now logged in. Explore your dashboard and manage your account.
                </p>
                <div className="loggedin-buttons">
                    <button className="loggedin-dashboard-btn">
                        Go to Dashboard
                    </button>
                    <button className="loggedin-logout-btn">
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoggedInArea;