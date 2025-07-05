import { frameData, motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { RiShieldUserLine } from "react-icons/ri";
import React, { useContext, useState } from "react";
import { Link } from "react-router";
import { signupUser } from "../../API/Api";
import UserContext from "../../context/UserContext";

export default function SignUp() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const { setuserId, setemail, setname } = useContext(UserContext);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = await signupUser(formData);
        if (data) {
            setuserId(data._id);
            setname(data.name);
            setemail(data.email);
            localStorage.setItem("token", data.token);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
            {/* Background animations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-md z-10"
            >
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl border border-gray-700 shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gray-800/50 py-6 px-8 border-b border-gray-700">
                        <div className="flex items-center justify-center space-x-2">
                            <RiShieldUserLine className="text-3xl text-blue-400" />
                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                                Create Account
                            </h2>
                        </div>
                        <p className="mt-2 text-center text-gray-400">
                            Join Authspark today and secure your applications
                        </p>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {/* Name */}
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaUser className="text-gray-500" />
                                    </div>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-500 transition-all duration-300"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                            </motion.div>

                            {/* Email */}
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaEnvelope className="text-gray-500" />
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-500 transition-all duration-300"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                            </motion.div>

                            {/* Password */}
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className="text-gray-500" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-10 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-500 transition-all duration-300"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <FaEyeSlash className="text-gray-400 hover:text-gray-300" />
                                        ) : (
                                            <FaEye className="text-gray-400 hover:text-gray-300" />
                                        )}
                                    </button>
                                </div>

                                {/* Password strength bar */}
                                <div className="mt-2 flex items-center">
                                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '20%' }}></div>
                                    </div>
                                    <span className="ml-2 text-xs text-gray-400">Medium strength</span>
                                </div>
                            </motion.div>

                            {/* Submit */}
                            <motion.button
                                type="submit"
                                className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Create Account
                            </motion.button>
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="px-8 py-4 bg-gray-800/50 border-t border-gray-700 text-center">
                        <p className="text-gray-400 text-sm">
                            Already have an account?{" "}
                            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Security badge */}
                <motion.div
                    className="mt-6 flex flex-wrap justify-center gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <div className="flex items-center text-xs bg-gray-800/50 px-3 py-1.5 rounded-full border border-gray-700 text-gray-400">
                        <FaLock className="mr-1.5 text-green-400" />
                        End-to-end encryption
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
