"use client";
import React, { useState, useMemo, useEffect } from "react";
import PrivateRoute from "@/Route/privateroute";
import { useAppNavigation } from "@/hooks/useNavigation";
import { showSuccessToast, showErrorToast } from "@/components/ui/toastUtils";

// Material UI Icons
import SearchIcon from "@mui/icons-material/Search";
import HelpOutlineIcon from "@mui/icons-material/HelpOutlined";
import SecurityIcon from "@mui/icons-material/Security";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PeopleIcon from "@mui/icons-material/People";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import WorkIcon from "@mui/icons-material/Work";
import ArticleIcon from "@mui/icons-material/Article";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import { useProfile } from "@/hooks/useProfile";

function HelpPageContent() {
  const { profile } = useProfile();
  const userName = profile?.name || "jinay";
  const { goToSettings, goToPlan, goToJobs, goToNetwork, goToFeeds, goToArticleCreate } = useAppNavigation();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedFaqId, setExpandedFaqId] = useState(null);

  // Frontend-only contact support state (NO backend dependency)
  const [ticketCategory, setTicketCategory] = useState("account");
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedTicketId, setSubmittedTicketId] = useState(null);

  const categories = [
    { id: "all", label: "All Topics" },
    { id: "account", label: "Account & Profile", icon: <SettingsIcon className="w-4 h-4" /> },
    { id: "privacy", label: "Privacy & Security", icon: <SecurityIcon className="w-4 h-4" /> },
    { id: "jobs", label: "Jobs & Careers", icon: <WorkIcon className="w-4 h-4" /> },
    { id: "premium", label: "Premium & Plans", icon: <WorkspacePremiumIcon className="w-4 h-4" /> },
    { id: "network", label: "Network & Messages", icon: <PeopleIcon className="w-4 h-4" /> },
    { id: "content", label: "Content & Posts", icon: <ArticleIcon className="w-4 h-4" /> },
  ];

  const topicCards = [
    {
      id: "account",
      title: "Account Preferences",
      description: "Manage email address, password, profile picture, name, and contact details.",
      icon: <SettingsIcon className="w-6 h-6 text-blue-600" />,
      actionText: "Manage Account",
      action: () => goToSettings(),
    },
    {
      id: "privacy",
      title: "Privacy & Visibility",
      description: "Control who can see your profile, see recent viewers, or browse in private mode.",
      icon: <VisibilityIcon className="w-6 h-6 text-emerald-600" />,
      actionText: "Visibility Settings",
      action: () => goToSettings(),
    },
    {
      id: "premium",
      title: "Premium & Billing",
      description: "Explore Premium subscription plans, unlock unlimited views, or cancel anytime.",
      icon: <WorkspacePremiumIcon className="w-6 h-6 text-amber-600" />,
      actionText: "View Plans",
      action: () => goToPlan(),
    },
    {
      id: "jobs",
      title: "Jobs & Applications",
      description: "Search open positions, apply to top companies, and track your job applications.",
      icon: <WorkIcon className="w-6 h-6 text-indigo-600" />,
      actionText: "Search Jobs",
      action: () => goToJobs(),
    },
    {
      id: "network",
      title: "Connections & Chat",
      description: "Find alumni, connect with colleagues, and send real-time direct messages.",
      icon: <PeopleIcon className="w-6 h-6 text-cyan-600" />,
      actionText: "Grow Network",
      action: () => goToNetwork(),
    },
    {
      id: "content",
      title: "Publishing & Posts",
      description: "Share professional updates, publish long-form articles, and engage with posts.",
      icon: <ArticleIcon className="w-6 h-6 text-violet-600" />,
      actionText: "Create Article",
      action: () => goToArticleCreate(),
    },
  ];

  // Comprehensive Knowledge Base with rich searchable keywords
  const faqs = [
    {
      id: "faq-1",
      category: "account",
      question: "How do I update my name, email address, or password?",
      answer: "You can update your personal details in Settings & Privacy. Head over to the 'Account preferences' or 'Sign in & security' tab. Click 'Change' next to your Name, Email, or Password, fill in the updated values, and save your changes.",
      keywords: ["setting", "settings", "password", "email", "name", "location", "account", "profile", "change password", "update email"],
      linkText: "Go to Settings",
      linkAction: () => goToSettings(),
    },
    {
      id: "faq-2",
      category: "account",
      question: "How do I change my profile photo, headline, or summary?",
      answer: "Navigate to your Profile by clicking the 'Me' menu and selecting 'View Profile'. From your profile page, you can update your headline, bio, experience history, skills, and profile photo.",
      keywords: ["setting", "settings", "profile", "photo", "picture", "headline", "avatar", "summary", "bio", "edit"],
      linkText: "Edit Profile",
      linkAction: () => goToSettings(),
    },
    {
      id: "faq-3",
      category: "privacy",
      question: "Who can see when I view their profile?",
      answer: "By default, members can see when you visit their profile. You can review your profile viewing options in the 'Visibility' section of Settings. You can also view recent visitors to your profile and track overall visits in the past 7, 30, or 90 days.",
      keywords: ["setting", "settings", "privacy", "visibility", "view", "viewer", "viewers", "private mode", "profile views", "who viewed"],
      linkText: "Check Profile Views",
      linkAction: () => goToSettings(),
    },
    {
      id: "faq-4",
      category: "privacy",
      question: "What security measures protect my LinkedIn account?",
      answer: "All accounts are protected with industry-standard authentication tokens, secure salted password encryption, and optional Google OAuth authentication. You can review active sessions and update your password regularly in Settings.",
      keywords: ["setting", "settings", "security", "protect", "safe", "password", "authentication", "session", "sign in"],
      linkText: "Security Settings",
      linkAction: () => goToSettings(),
    },
    {
      id: "faq-5",
      category: "jobs",
      question: "How do I apply for jobs and track my applications?",
      answer: "Navigate to the Jobs tab from the top navigation bar. Browse job postings curated for your background, review requirements, and click 'Easy Apply'. To monitor the progress of applications you submitted, use the Job Tracker tool.",
      keywords: ["job", "jobs", "apply", "career", "tracker", "application", "easy apply", "resume", "hiring"],
      linkText: "Explore Jobs",
      linkAction: () => goToJobs(),
    },
    {
      id: "faq-6",
      category: "jobs",
      question: "How do I post a new job opening or recruit candidates?",
      answer: "If you have a recruiter or employer account, navigate to 'Job Posting Account' from the user menu. You can define job descriptions, required skills, company details, and receive applications directly.",
      keywords: ["job", "jobs", "post job", "recruit", "hiring", "job create", "employer", "candidate"],
      linkText: "Job Posting",
      linkAction: () => goToJobs(),
    },
    {
      id: "faq-7",
      category: "premium",
      question: "How do I subscribe or cancel my Premium membership?",
      answer: "Visit the 'Plan' page from the top navigation bar or the user menu. Choose a subscription tier that matches your career or business goals. You can cancel your active subscription anytime with immediate effect from your plan dashboard.",
      keywords: ["premium", "plan", "plans", "billing", "subscription", "cancel", "pricing", "free trial", "upgrade", "invoice", "setting", "settings"],
      linkText: "Manage Subscription",
      linkAction: () => goToPlan(),
    },
    {
      id: "faq-8",
      category: "premium",
      question: "What features are included in LinkedIn Premium?",
      answer: "LinkedIn Premium includes access to advanced insights, see who viewed your profile over the last 90 days, direct messaging credits, priority job applicant status, and an exclusive Premium profile badge.",
      keywords: ["premium", "features", "inmail", "profile views", "unlimited", "badge", "plan", "plans", "trial"],
      linkText: "View Premium Plans",
      linkAction: () => goToPlan(),
    },
    {
      id: "faq-9",
      category: "network",
      question: "How do I connect with other members and send messages?",
      answer: "Go to the 'My Network' tab to discover suggested professionals, friends, and pending connection requests. Once connected, you can open direct conversations and exchange real-time messages via the Messaging tab.",
      keywords: ["network", "connect", "connection", "connections", "friend", "request", "pending", "follow", "message", "chat", "inbox"],
      linkText: "Open My Network",
      linkAction: () => goToNetwork(),
    },
    {
      id: "faq-10",
      category: "content",
      question: "How do I write an article or publish a post?",
      answer: "On your Home Feed, click the post box to write an update, upload pictures or video, and share with your network. For in-depth stories, click 'Write article' to access the rich-text article editor and publish long-form pieces.",
      keywords: ["post", "article", "feed", "share", "write", "editor", "publish", "photo", "video", "media"],
      linkText: "Visit Feed",
      linkAction: () => goToFeeds(),
    },
  ];

  // Proper Search Logic: Searches title, answer, category, and keywords
  const filteredFaqs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return faqs.filter((faq) => {
      const matchesCategory =
        selectedCategory === "all" || faq.category === selectedCategory;

      if (!q) return matchesCategory;

      const inQuestion = faq.question.toLowerCase().includes(q);
      const inAnswer = faq.answer.toLowerCase().includes(q);
      const inCategory = faq.category.toLowerCase().includes(q);
      const inKeywords =
        faq.keywords &&
        faq.keywords.some((k) => k.toLowerCase().includes(q));

      const matchesSearch = inQuestion || inAnswer || inCategory || inKeywords;

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // When user types in the search bar, automatically switch to "All Topics" so search works universally
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length > 0 && selectedCategory !== "all") {
      setSelectedCategory("all");
    }
  };

  const toggleFaq = (id) => {
    setExpandedFaqId((prev) => (prev === id ? null : id));
  };

  // Pure frontend ticket submission (no backend needed)
  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!ticketSubject.trim()) {
      showErrorToast("Please enter a subject for your request.");
      return;
    }
    if (!ticketMessage.trim()) {
      showErrorToast("Please describe the issue in the message box.");
      return;
    }

    const generatedId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
    setSubmittedTicketId(generatedId);
    setIsSubmitted(true);
    setTicketSubject("");
    setTicketMessage("");
    showSuccessToast(`Ticket ${generatedId} submitted! Our support team will assist you.`);
  };

  return (
    <div className="w-full bg-[#f3f2ef] min-h-screen pb-16">
      {/* Hero Header Section */}
      <section className="bg-[#0a66c2] py-12 px-4 sm:px-6 lg:px-8 border-b border-blue-900">
        <div className="max-w-4xl mx-auto text-center">
          {/* User Heading: White Text */}
          <h1
            style={{ color: "#ffffff" }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-center"
          >
            Hi {userName}, how can we help?
          </h1>

          {/* Subtitle: Perfectly Centered, Balanced across Desktop */}
          <p
            style={{ color: "#e0edff" }}
            className="text-sm sm:text-base text-center w-full max-w-4xl mx-auto mb-7 pb-4"
          >
            Find answers to frequently asked questions, learn how to manage your account, or get in touch with our support team.
          </p>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto relative">
            <div className="flex items-center bg-white rounded-full border border-gray-300 focus-within:border-blue-600 px-4 py-3 shadow-md">
              <SearchIcon className="w-5 h-5 text-gray-500 shrink-0 mr-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search by keywords, settings, questions, or topics..."
                className="w-full bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none text-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                  title="Clear search"
                >
                  <CloseIcon className="w-4 h-4" />
                </button>
              )}
            </div>
            {/* {searchQuery && (
              <div className="text-xs text-blue-100 mt-2.5 text-center">
                Showing {filteredFaqs.length} {filteredFaqs.length === 1 ? "result" : "results"} for &quot;<strong className="text-white">{searchQuery}</strong>&quot;
              </div>
            )} */}
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Recommended Topics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {topicCards.map((topic) => (
            <div
              key={topic.id}
              onClick={topic.action}
              className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm hover:border-gray-300 hover:shadow flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="p-2.5 bg-gray-50 rounded-lg w-fit mb-3">
                  {topic.icon}
                </div>
                <h3 className="text-base font-semibold text-gray-900 hover:text-blue-600 mb-1">
                  {topic.title}
                </h3>
                <p className="text-xs text-gray-500">
                  {topic.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-blue-600 hover:text-blue-800">
                <span>{topic.actionText}</span>
                <ArrowForwardIcon className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

        {/* FAQs & Knowledge Base */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column: Filterable FAQ Accordions */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-7">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Frequently Asked Questions</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Quick solutions and answers to common inquiries
                  </p>
                </div>
                <span className="text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full self-start sm:self-auto">
                  {filteredFaqs.length} {filteredFaqs.length === 1 ? "article" : "articles"}
                </span>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-full border cursor-pointer ${
                      selectedCategory === cat.id
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {cat.icon}
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>

              {/* Accordion List */}
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-12 px-4 border border-dashed border-gray-200 rounded-lg">
                  <HelpOutlineIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-800 pb-2">No matching help articles found</p>
                  <p className="text-xs text-gray-600 mt-2 text-center">
                    Try searching for &quot;setting&quot;, &quot;password&quot;, &quot;jobs&quot;, &quot;profile&quot;, or browse by category.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                    }}
                    className="mt-4 text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                  >
                    Reset search and show all articles
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredFaqs.map((faq) => {
                    const isOpen = expandedFaqId === faq.id;
                    return (
                      <div
                        key={faq.id}
                        className={`border rounded-lg overflow-hidden ${
                          isOpen ? "border-blue-400 bg-blue-50/20" : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleFaq(faq.id)}
                          className="w-full text-left p-4 flex items-center justify-between gap-3 bg-white hover:bg-gray-50 cursor-pointer"
                        >
                          <span className="text-sm font-semibold text-gray-900">
                            {faq.question}
                          </span>
                          <span className={`shrink-0 ${isOpen ? "text-blue-600" : "text-gray-500"}`}>
                            <ExpandMoreIcon className={`w-5 h-5 ${isOpen ? "rotate-180" : ""}`} />
                          </span>
                        </button>

                        {isOpen && (
                          <div className="px-4 pb-4 text-xs sm:text-sm text-gray-600 border-t border-gray-100 pt-3 space-y-3 bg-white">
                            <p>{faq.answer}</p>
                            {faq.linkText && (
                              <button
                                type="button"
                                onClick={faq.linkAction}
                                className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                              >
                                <span>{faq.linkText}</span>
                                <ArrowForwardIcon className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Contact Support Ticket & Quick Resources (100% Frontend) */}
          <div className="space-y-6">
            {/* Contact Support Form Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                  <ContactSupportIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Need More Assistance?</h3>
                  <p className="text-xs text-gray-500">Contact our LinkedIn Support Team</p>
                </div>
              </div>

              {isSubmitted ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5 text-center">
                  <CheckCircleOutlineIcon className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-emerald-900 mb-1">Support Ticket Submitted!</h4>
                  <p className="text-xs text-emerald-700 mb-3">
                    Your reference number is <strong>{submittedTicketId}</strong>. A support agent will review your inquiry within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="text-xs font-semibold text-emerald-800 hover:underline cursor-pointer"
                  >
                    Submit another request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleTicketSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Issue Category
                    </label>
                    <select
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value)}
                      className="w-full text-xs bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:border-blue-600 focus:outline-none"
                    >
                      <option value="account">Account & Sign In</option>
                      <option value="billing">Premium & Billing</option>
                      <option value="jobs">Job Posting & Applications</option>
                      <option value="privacy">Privacy & Security</option>
                      <option value="bug">Report a Bug / Issue</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      placeholder="e.g. Can't update profile picture"
                      className="w-full text-xs bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      value={ticketMessage}
                      onChange={(e) => setTicketMessage(e.target.value)}
                      placeholder="Provide details about what happened..."
                      className="w-full text-xs bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:border-blue-600 focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 px-4 rounded-full cursor-pointer transition"
                  >
                    <SendIcon className="w-3.5 h-3.5" />
                    <span>Submit Support Ticket</span>
                  </button>
                </form>
              )}
            </div>

            {/* Direct Shortcuts Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <ShieldOutlinedIcon className="w-4 h-4 text-gray-600" />
                <span>Quick Actions</span>
              </h3>
              <div className="space-y-2 text-xs">
                <button
                  type="button"
                  onClick={() => goToSettings()}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg border border-gray-100 hover:bg-gray-50 text-gray-700 font-medium cursor-pointer"
                >
                  <span>Edit Account & Privacy</span>
                  <ArrowForwardIcon className="w-3.5 h-3.5 text-gray-400" />
                </button>
                <button
                  type="button"
                  onClick={() => goToPlan()}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg border border-gray-100 hover:bg-gray-50 text-gray-700 font-medium cursor-pointer"
                >
                  <span>Manage Premium Membership</span>
                  <ArrowForwardIcon className="w-3.5 h-3.5 text-gray-400" />
                </button>
                <button
                  type="button"
                  onClick={() => goToJobs()}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg border border-gray-100 hover:bg-gray-50 text-gray-700 font-medium cursor-pointer"
                >
                  <span>Track Job Applications</span>
                  <ArrowForwardIcon className="w-3.5 h-3.5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Helpful Resources Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 text-xs text-gray-500 space-y-2">
              <h4 className="font-semibold text-gray-900 mb-2">Legal & Policies</h4>
              <div>
                <a href="#" className="hover:text-blue-600 hover:underline">
                  LinkedIn Professional Community Policies
                </a>
              </div>
              <div>
                <a href="#" className="hover:text-blue-600 hover:underline">
                  User Agreement & Privacy Policy
                </a>
              </div>
              <div>
                <a href="#" className="hover:text-blue-600 hover:underline">
                  Copyright & Intellectual Property
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function HelpPage() {
  return (
    <PrivateRoute>
      <HelpPageContent />
    </PrivateRoute>
  );
}
