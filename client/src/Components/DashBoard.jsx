import { motion } from "framer-motion";
import { FaPlus, FaUserCircle, FaCopy, FaProjectDiagram, FaSignOutAlt } from "react-icons/fa";
import { RiShieldUserLine } from "react-icons/ri";
import React, { useEffect, useState, useContext } from "react";
import { createProject, getProjects } from "../API/Api";
import UserContext from "../context/UserContext";
import { Link } from "react-router";

export default function UserDashboard() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showApiKeys, setShowApiKeys] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    tokenValidTime: '1',
    urlForSignup: ''
  });
  const [apiKeys, setApiKeys] = useState({
    key: ''
  });
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [creatingProject, setCreatingProject] = useState(false);

  const { userId, name } = useContext(UserContext);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoadingProjects(true);
        const data = await getProjects();
        if (data) {
          setProjects(data);
        }
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchProjects();
  }, []);

  const createNewProject = async () => {
    try {
      setCreatingProject(true);
      const obj = { userId, ...newProject };
      const data = await createProject(obj);
      if (data) {
        setApiKeys({ key: data.apiKey });
        setShowApiKeys(true);
        setProjects(prev => [...prev, data]);
      }
    } finally {
      setCreatingProject(false);
    }
  };

  const copyToClipboard = (text) => navigator.clipboard.writeText(text);

  const handleSignOut = () => {
    localStorage.clear();
    window.location.reload()
  };

  const ProjectSkeleton = () => (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
      <div className="p-6 space-y-4">
        <div className="h-6 bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-700 rounded w-full"></div>
      </div>
      <div className="px-6 py-3 bg-gray-900/50 border-t border-gray-700">
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 md:pl-64 flex flex-col min-h-screen">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="fixed hidden md:flex flex-col w-64 h-screen left-0 top-0 bg-gray-800/50 border-r border-gray-700 backdrop-blur-sm z-20"
        >
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <RiShieldUserLine className="text-3xl text-blue-400" />
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Authspark</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-1">
              <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all bg-blue-900/30 text-blue-400 border border-blue-800">
                <FaProjectDiagram className="text-lg" />
                <span>Projects</span>
              </button>
            </nav>
          </div>
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-white transition-all"
            >
              <FaSignOutAlt className="text-lg" />
              <span>Sign Out</span>
            </button>
          </div>
        </motion.div>

        <header className="sticky top-0 z-10 bg-gray-800/50 border-b border-gray-700 p-4 flex items-center justify-between md:justify-end backdrop-blur-sm">
          <div className="flex items-center md:hidden">
            <RiShieldUserLine className="text-2xl text-blue-400 mr-2" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Authspark</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center">
                <FaUserCircle className="text-xl text-blue-400" />
              </div>
              <span className="hidden md:inline text-sm font-medium">{name}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-2xl md:text-3xl font-bold">Your Projects</h1>
                <p className="text-gray-400">Manage all your authentication projects</p>
              </motion.div>
              <motion.button
                onClick={() => setShowCreateModal(true)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="mt-4 md:mt-0 px-4 py-2 md:px-6 md:py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
              >
                <FaPlus className="mr-2" />
                <span>New Project</span>
              </motion.button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {loadingProjects ? (
                <>
                  <ProjectSkeleton />
                  <ProjectSkeleton />
                  <ProjectSkeleton />
                </>
              ) : (
                projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 hover:border-blue-500 shadow-lg overflow-hidden transition-all duration-300"
                  >
                    <div className="p-4 md:p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg md:text-xl font-bold truncate">{project.name}</h3>
                      </div>
                      <div className="flex items-center justify-between mt-4 md:mt-6 text-xs md:text-sm text-gray-400">
                        <span>{project.totalUsers} users</span>
                        <span>{new Date(project.createdAt).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                    <div className="px-4 py-2 md:px-6 md:py-3 bg-gray-800/50 border-t border-gray-700 flex justify-end">
                      <Link to={`/project/${project.id}`} className="text-xs md:text-sm text-blue-400 hover:text-blue-300">View Keys</Link>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 shadow-2xl w-full max-w-md"
          >
            <div className="p-6 border-b border-gray-700">
              <h3 className="text-xl font-bold flex items-center">
                <FaPlus className="text-blue-400 mr-2" />
                <span>{showApiKeys ? 'Your API Keys' : 'Create New Project'}</span>
              </h3>
            </div>

            <div className="p-6">
              {!showApiKeys ? (
                <>
                  <div className="mb-4">
                    <label htmlFor="projectName" className="block text-sm font-medium text-gray-400 mb-2">
                      Project Name*
                    </label>
                    <input
                      type="text"
                      id="projectName"
                      value={newProject.name}
                      onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-500 transition-all duration-300"
                      placeholder="My Awesome Project"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="tokenValidTime" className="block text-sm font-medium text-gray-400 mb-2">
                      Token Valid Time (hrs*)
                    </label>
                    <input
                      type="number"
                      id="tokenValidTime"
                      value={newProject.tokenValidTime}
                      onChange={(e) => setNewProject({ ...newProject, tokenValidTime: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-500 transition-all duration-300"
                      placeholder="3600"
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="urlForSignup" className="block text-sm font-medium text-gray-400 mb-2">
                      Signup URL (optional)
                    </label>
                    <input
                      type="url"
                      id="urlForSignup"
                      value={newProject.urlForSignup}
                      onChange={(e) => setNewProject({ ...newProject, urlForSignup: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-500 transition-all duration-300"
                      placeholder="https://yourapp.com/signup"
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        setShowCreateModal(false);
                        setNewProject({
                          name: '',
                          tokenValidTime: '1',
                          urlForSignup: ''
                        });
                      }}
                      className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={createNewProject}
                      disabled={!newProject.name.trim() || !newProject.tokenValidTime || creatingProject}
                      className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center min-w-24"
                    >
                      {creatingProject ? (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : null}
                      {creatingProject ? 'Creating...' : 'Create Project'}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {creatingProject ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <svg className="animate-spin h-8 w-8 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <p className="mt-4 text-gray-400">Generating your API keys...</p>
                    </div>
                  ) : (
                    <>
                      <div className="mb-6 bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                        <label className="block text-xs font-medium text-gray-400 mb-2">
                          API Key
                        </label>
                        <div className="flex">
                          <input
                            type="text"
                            value={apiKeys.key}
                            readOnly
                            className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-l-lg text-sm text-white"
                          />
                          <button
                            onClick={() => copyToClipboard(apiKeys.key)}
                            className="px-3 bg-gray-700 hover:bg-gray-600 rounded-r-lg border-l border-gray-700"
                          >
                            <FaCopy className="text-gray-400" />
                          </button>
                        </div>
                        <p className="mt-3 text-xs text-red-400">
                          Store this API key securely. Do not expose in frontend code.
                        </p>
                      </div>


                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            setShowCreateModal(false);
                            setShowApiKeys(false);
                            setNewProject({
                              name: '',
                              tokenValidTime: '3600',
                              urlForSignup: ''
                            });
                          }}
                          className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          Done
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
