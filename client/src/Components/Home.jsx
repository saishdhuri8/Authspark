import { motion } from "framer-motion";
import { FaUserShield, FaGoogle, FaProjectDiagram, FaRocket, FaShieldAlt, } from "react-icons/fa";
import { MdSecurity, MdOutlineDashboard, MdOutlineAccountCircle } from "react-icons/md";
import { RiShieldUserLine } from "react-icons/ri";
import { AiOutlineImport } from "react-icons/ai";
import { Link } from 'react-router';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-2"
        >
          <RiShieldUserLine className="text-3xl text-blue-400" />
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Authspark
          </span>
        </motion.div>


        <nav className="hidden md:flex space-x-8 text-lg">
          {['Features', 'Docs'].map((item, index) => (
            <Link
              key={item}
              to={`${item.toLowerCase()}`}
              className="relative px-2 py-1 text-gray-300 hover:text-white transition-colors"
            >
              {item}
              <motion.span
                className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400"
              />
            </Link>
          ))}
        </nav>



        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to={"/signup"} className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300">
            Get Started
          </Link>
        </motion.div>
      </header>

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center pt-32 pb-40 px-4 md:px-16"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <motion.span
            className="inline-block px-4 py-1 mb-4 text-sm font-medium rounded-full bg-blue-900/50 text-blue-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
           Authentication
          </motion.span>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-blue-400">
            <motion.span
              className="inline-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Secure Your Apps
            </motion.span>{' '}
            <motion.span
              className="inline-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              With Confidence
            </motion.span>
          </h1>
          <motion.p
            className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Authspark provides authentication with simple integration.
            Email/Password, JWT, and more - all with project isolation
            and advanced security features.
          </motion.p>
          <motion.div
            className="mt-12 flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center space-x-2">
              <FaRocket className="text-lg" />
              <Link to={"/login"}>Start</Link >
            </button>

          </motion.div>
        </motion.div>
      </motion.section>

      <motion.section
        id="features"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="relative z-10 py-24 px-6 md:px-12 bg-gray-900/50 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <span className="text-sm uppercase tracking-wider text-blue-400 font-medium">Features</span>
            <h2 className="text-3xl md:text-5xl font-bold mt-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-300">
              Authentication Made Simple
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-gray-400">
              Everything you need to secure your applications without the complexity.
            </p>
          </motion.div>



          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl border border-gray-800 shadow-xl hover:shadow-blue-500/20 transition-all duration-300"
              >
                <div className="text-4xl mb-6 text-blue-400 bg-blue-900/30 p-3 rounded-lg inline-flex">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
                <div className="mt-6">

                </div>
              </motion.div>
            ))}
          </div>



        </div>
      </motion.section>

      {/* Additional section */}
      <section className="relative z-10 py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-12 border border-gray-800 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to <span className="text-blue-400">secure</span> your application?
              </h2>
              <p className="text-gray-400 mb-8">
                Join thousands of developers who trust Authspark for their authentication needs.
                Get started in minutes with our easy-to-integrate solution.
              </p>

            </div>
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="absolute -top-8 -left-8 w-32 h-32 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
                <div className="relative bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
                  <div className="flex items-center space-x-4 mb-6">
                    <MdOutlineDashboard className="text-2xl text-blue-400" />
                    <h3 className="text-xl font-semibold">Dashboard Preview</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <MdOutlineAccountCircle className="text-xl text-blue-400" />
                        <span>User Management</span>
                      </div>

                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FaShieldAlt className="text-xl text-purple-400" />
                        <span>Analytics</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FaProjectDiagram className="text-xl text-green-400" />
                        <span>Project Settings</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 text-center py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <RiShieldUserLine className="text-2xl text-blue-400" />
              <span className="text-xl font-bold">Authspark</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-left">
              {footerLinks.map((column, index) => (
                <div key={index}>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">{column.title}</h4>
                  <ul className="space-y-2">
                    {column.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <a href={link.href} className="text-gray-500 hover:text-white transition-colors">
                          {link.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Authspark Technologies. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: <FaUserShield />,
    title: "Email/Password Auth",
    description: "Secure email/password authentication with advanced hashing and brute force protection."
  },
  {
    icon: <FaProjectDiagram />,
    title: "Project Isolation",
    description: "Complete separation between projects with independent user databases."
  },
  {
    icon: <MdSecurity />,
    title: "JWT Security",
    description: "Industry-standard JWT tokens with customizable expiration and refresh options."
  },
  {
    icon: <FaShieldAlt />,
    title: "Active Sessions",
    description: "Real-time monitoring of active user sessions across devices and locations."
  },
  {
    icon: <MdOutlineAccountCircle />,
    title: "User Metadata",
    description: "Store custom user data without schema changes or database migrations."
  },
  {
    icon: <AiOutlineImport />,
    title: "Read Made Component",
    description: "Dirctly import the component if needed"
  }
];

const footerLinks = [
  {
    title: "Product",
    links: [
      { text: "Features", href: "#" },
      { text: "Pricing", href: "#" },
      { text: "Integrations", href: "#" },
      { text: "Roadmap", href: "#" }
    ]
  },
  {
    title: "Resources",
    links: [
      { text: "Documentation", href: "#" },
      { text: "API Reference", href: "#" },
      { text: "Guides", href: "#" },
      { text: "Blog", href: "#" }
    ]
  },
  {
    title: "Company",
    links: [
      { text: "About", href: "#" },
      { text: "Careers", href: "#" },
      { text: "Privacy", href: "#" },
      { text: "Terms", href: "#" }
    ]
  },
  {
    title: "Support",
    links: [
      { text: "Contact", href: "#" },
      { text: "Status", href: "#" },
      { text: "Help Center", href: "#" },
      { text: "Community", href: "#" }
    ]
  }
];
