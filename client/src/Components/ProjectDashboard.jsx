import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaUsers, FaChartLine, FaCog, FaTrash, FaChevronDown, FaChevronUp,
  FaCopy, FaArrowLeft, FaArrowRight, FaSync
} from 'react-icons/fa';
import { useParams } from "react-router";
import { deleteUserOfProject, getProjectInfo, getUsers, updateProject } from '../API/Api';
import Graph from './Graph';

const ProjectDashBoard = () => {
  const { projectId } = useParams();
  const [activeTab, setActiveTab] = useState('users');
  const [backendUsers, setBackendUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedUser, setExpandedUser] = useState(null);
  const [projectSettings, setProjectSettings] = useState({
    name: '',
    tokenValidTime: '1',
    urlForSignup: '',
    apiKey: ''
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      const data = await getProjectInfo(projectId);
      

      if (data) {
        setProjectSettings(prev => ({
          ...prev,
          name: data.name || '',
          apiKey: data.apiKey || '',
          tokenValidTime: data.tokenValidTime || '1',
          urlForSignup: data.urlForSignup || ''
        }));
        setTotalPages(data.pages);
        setTotalUsers(data.totalUsers);
      }
    };
    loadData();
  }, [projectId]);

  useEffect(() => {
    setLoading(true);
    const x = async () => {
      const data = await getUsers(projectId, currentPage);
      

      if (data) {
        setBackendUsers(data.users);
        setActiveUsers(data.activeUsers)
      }
    }
    x();
    setLoading(false);
  }, [currentPage]);

  const handleRefresh = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = await getUsers(projectId, currentPage);
    if (data) {
      setBackendUsers(data.users);
      setActiveUsers(data.activeUsers);
      setTotalUsers(data.totalUsers)
    }
    setLoading(false);
  };

  const toggleUserExpand = (email) => {
    setExpandedUser(expandedUser === email ? null : email);
  };

  const handleDeleteUser = async (email) => {
    const res = await deleteUserOfProject(projectId, email);
    if (res) {
      setBackendUsers(pre => pre.filter((e) => e.email !== email));
    }
  };

  const handleSettingChange = (e) => {
    const { name, value } = e.target;
    setProjectSettings(prev => ({ ...prev, [name]: value }));
  };

  const saveSettings = async () => {
    if (projectSettings.tokenValidTime > 0) {
      const res = await updateProject(projectId, projectSettings.tokenValidTime, projectSettings.urlForSignup);
      if (!res) {
        // ----
      }
    }

  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 md:p-6">
      <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">{projectSettings.name}</h1>
            <p className="text-gray-400">Project ID: {projectId}</p>
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{totalUsers}</div>
              <div className="text-sm text-gray-400">Total Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{activeUsers}</div>
              <div className="text-sm text-gray-400">Active Now</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{totalPages}</div>
              <div className="text-sm text-gray-400">Total Pages</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex border-b border-gray-700 mb-6">
        {['users', 'graphs', 'settings'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-medium flex items-center space-x-2 ${activeTab === tab ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`}
          >
            {tab === 'users' && <FaUsers />}
            {tab === 'graphs' && <FaChartLine />}
            {tab === 'settings' && <FaCog />}
            <span className="capitalize">{tab}</span>
          </button>
        ))}
      </div>

      <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4 md:p-6">
        {activeTab === 'users' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-bold">User Management</h2>
              <div className="flex items-center gap-4">
                <button
                  className="flex items-center gap-2 px-3 py-2 border border-gray-600 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition"
                  onClick={handleRefresh}
                >
                  <FaSync /> Refresh
                </button>
                <div className="text-gray-400">Page {currentPage + 1} of {totalPages}</div>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="bg-gray-700/50 rounded-lg p-4 animate-pulse h-20"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {backendUsers.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">No users found in this project</div>
                ) : (
                  backendUsers.map((user, index) => (
                    <div key={index} className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
                      <div className="p-4 flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          <div className={`w-3 h-3 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                          <div>
                            <h3 className="font-medium">{user.email}</h3>
                            <p className="text-sm text-gray-400">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button onClick={() => toggleUserExpand(user.email)} className="p-2 text-gray-400 hover:text-white">
                            {expandedUser === user.email ? <FaChevronUp /> : <FaChevronDown />}
                          </button>
                          <button onClick={() => handleDeleteUser(user.email)} className="p-2 text-red-400 hover:text-red-300">
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                      {expandedUser === user.email && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="px-4 pb-4">
                          <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                            <h4 className="font-medium mb-2">User Metadata</h4>
                            <div className="relative">
                              <pre className="text-sm text-gray-300 overflow-x-auto p-2 bg-gray-800 rounded">
                                {JSON.stringify(user.metadata, null, 2)}
                              </pre>
                              <button onClick={() => copyToClipboard(JSON.stringify(user.metadata, null, 2))} className="absolute top-2 right-2 p-1 text-gray-400 hover:text-white">
                                <FaCopy size={14} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-700">
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0} className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${currentPage === 0 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-white'}`}>
                <FaArrowLeft /> <span>Previous</span>
              </button>
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages - 1} className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${currentPage === totalPages - 1 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-white'}`}>
                <span>Next</span> <FaArrowRight />
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <div className="mb-6">
              <label className="block text-xs font-medium text-gray-400 mb-1">API Key</label>
              <div className="flex">
                <input
                  type="text"
                  value={projectSettings.apiKey}
                  readOnly
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-sm text-white"
                />
                <button
                  onClick={() => copyToClipboard(projectSettings.apiKey)}
                  className="px-3 bg-gray-700 hover:bg-gray-600 rounded-r-lg border-l border-gray-700"
                >
                  <FaCopy className="text-gray-400" />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-1">Token Valid Time (in seconds)</label>
              <input
                type="number"
                name="tokenValidTime"
                value={projectSettings.tokenValidTime}
                onChange={handleSettingChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-1">Signup URL</label>
              <input
                type="text"
                name="urlForSignup"
                value={projectSettings.urlForSignup}
                onChange={handleSettingChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
              />
            </div>

            <button onClick={saveSettings} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm text-white">
              Save Changes
            </button>
          </motion.div>
        )}

        {activeTab === 'graphs' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <div>
              <Graph projectId={projectId} />
            </div>
          </motion.div>
        )}
      </div>
    </div >
  );
};

export default ProjectDashBoard;
