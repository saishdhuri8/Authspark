import React from 'react';
import { FaPlug, FaShieldAlt, FaUserPlus, FaBookOpen, FaCode, FaTools, FaSignOutAlt } from 'react-icons/fa';

const Docs = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-400">Authspark Documentation</h1>
          <p className="text-gray-300 text-lg mt-2">The simplest way to integrate plug-and-play authentication, user tracking, and metadata management in React.</p>
        </header>

        {/* Setup Guide */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold flex items-center gap-2 text-blue-300 mb-4">
            <FaPlug /> Project Setup
          </h2>
          <p className="text-gray-300 mb-3">Wrap your application inside <code className="text-blue-400">AuthsparkAuthProvider</code> in <code>main.jsx</code> or <code>index.jsx</code>.</p>
          <div className="bg-gray-800 p-4 rounded text-sm overflow-x-auto">
            <pre>{`import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthsparkAuthProvider } from './AuthSpark/AuthsparkAuthProvider.jsx';

const k = "your key";

createRoot(document.getElementById('root')).render(
  <AuthsparkAuthProvider apiKey={k}>
    <App />
  </AuthsparkAuthProvider>
);`}</pre>
          </div>
        </section>

        {/* Auth UI Component */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold flex items-center gap-2 text-blue-300 mb-4">
            <FaUserPlus /> Login / Signup Component
          </h2>
          <p className="text-gray-300 mb-3">Use the AuthsparkAuth component anywhere in your app to show the login/signup UI.</p>
          <div className="bg-gray-800 p-4 rounded text-sm overflow-x-auto">
            <pre>{`<AuthsparkAuth theme='dark' apiKey={"your api key"} />`}</pre>
          </div>
        </section>

        {/* useUser Hook */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold flex items-center gap-2 text-blue-300 mb-4">
            <FaCode /> useUser() Hook
          </h2>
          <p className="text-gray-300 mb-3">Access authenticated user, check if user exists, update metadata, or sign out.</p>
          <div className="bg-gray-800 p-4 rounded text-sm overflow-x-auto">
            <pre>{`const { user, userExits, signOut, setMetadata } = useUser();`}</pre>
          </div>
        </section>

        {/* Sign Out */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold flex items-center gap-2 text-blue-300 mb-4">
            <FaSignOutAlt /> Sign Out
          </h2>
          <p className="text-gray-300 mb-3">You can allow users to sign out like this:</p>
          <div className="bg-gray-800 p-4 rounded text-sm overflow-x-auto">
            <pre>{`<button onClick={() => { signOut({ refresh: true }) }}>Signout</button>`}</pre>
          </div>
        </section>

        {/* Advanced Features */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold flex items-center gap-2 text-blue-300 mb-4">
            <FaTools /> Additional Features
          </h2>
          <ul className="list-disc text-gray-300 pl-6 space-y-2">
            <li><strong>Metadata:</strong> Each user can have custom metadata. Use <code>setMetadata()</code> to update.</li>
            <li><strong>Auto Login:</strong> Already logged-in users are fetched automatically on page load.</li>
          </ul>
        </section>

        {/* API Reference */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold flex items-center gap-2 text-blue-300 mb-4">
            <FaBookOpen /> API Endpoints
          </h2>
          <ul className="list-disc text-gray-300 pl-6 space-y-1 text-sm">
            <li><code>POST /project-users/signup</code> – Create a new user with email and password.</li>
            <li><code>POST /project-users/login</code> – Log in with email and password.</li>
            <li><code>POST /project-users/get-user-info</code> – Get current logged-in user via token.</li>
            <li><code>POST /project-users/update-metadata</code> – Update metadata of the logged-in user.</li>
            <li><code>POST /project-users/toggle-active-user</code> – Toggle the user’s active status.</li>
          </ul>
        </section>

        <footer className="text-center mt-12 text-gray-500 text-sm">
          Built with 💙 by Saish Dhuri — Authspark © {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
};

export default Docs;
