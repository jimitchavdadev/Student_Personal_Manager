import React, { useState } from 'react';
import { Users, Plus, MessageSquare, CheckSquare, Video, MoreVertical, X, Calendar, Clock, User, Send } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  members: string[];
  lastActivity: string;
}

interface ProjectDetails {
  id: string;
  name: string;
  members: {
    id: string;
    name: string;
    role: string;
    avatar: string;
  }[];
  chat: {
    id: string;
    sender: string;
    message: string;
    timestamp: string;
  }[];
  tasks: {
    id: string;
    title: string;
    assignee: string;
    dueDate: string;
    status: 'todo' | 'inprogress' | 'done';
  }[];
  meetings: {
    id: string;
    title: string;
    date: string;
    time: string;
    link: string;
  }[];
}

const CollaboratePage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Physics Group Project',
      members: ['John Doe', 'Jane Smith', 'Alex Johnson'],
      lastActivity: '2025-05-05T14:30:00'
    },
    {
      id: '2',
      name: 'History Presentation',
      members: ['John Doe', 'Sarah Williams'],
      lastActivity: '2025-05-04T09:15:00'
    },
    {
      id: '3',
      name: 'Computer Science Team',
      members: ['John Doe', 'Mike Brown', 'Lisa Chen', 'David Kim'],
      lastActivity: '2025-05-06T16:45:00'
    }
  ]);

  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'tasks' | 'meetings'>('chat');
  const [newMessage, setNewMessage] = useState('');
  const [projectDetails, setProjectDetails] = useState<ProjectDetails>({
    id: '1',
    name: 'Physics Group Project',
    members: [
      {
        id: '1',
        name: 'John Doe',
        role: 'Project Lead',
        avatar: 'JD'
      },
      {
        id: '2',
        name: 'Jane Smith',
        role: 'Researcher',
        avatar: 'JS'
      },
      {
        id: '3',
        name: 'Alex Johnson',
        role: 'Data Analyst',
        avatar: 'AJ'
      }
    ],
    chat: [
      {
        id: '1',
        sender: 'Jane Smith',
        message: 'Has everyone started working on their assigned sections?',
        timestamp: '2025-05-05T14:30:00'
      },
      {
        id: '2',
        sender: 'Alex Johnson',
        message: 'I\'ve completed the data collection part. Will start analysis tomorrow.',
        timestamp: '2025-05-05T14:35:00'
      },
      {
        id: '3',
        sender: 'John Doe',
        message: 'I\'m still working on the introduction. Should be done by tomorrow.',
        timestamp: '2025-05-05T14:40:00'
      }
    ],
    tasks: [
      {
        id: '1',
        title: 'Research background information',
        assignee: 'Jane Smith',
        dueDate: '2025-05-10',
        status: 'done'
      },
      {
        id: '2',
        title: 'Collect experimental data',
        assignee: 'Alex Johnson',
        dueDate: '2025-05-12',
        status: 'done'
      },
      {
        id: '3',
        title: 'Analyze results',
        assignee: 'Alex Johnson',
        dueDate: '2025-05-15',
        status: 'inprogress'
      },
      {
        id: '4',
        title: 'Write introduction',
        assignee: 'John Doe',
        dueDate: '2025-05-14',
        status: 'inprogress'
      },
      {
        id: '5',
        title: 'Create presentation slides',
        assignee: 'Jane Smith',
        dueDate: '2025-05-18',
        status: 'todo'
      },
      {
        id: '6',
        title: 'Final review',
        assignee: 'John Doe',
        dueDate: '2025-05-20',
        status: 'todo'
      }
    ],
    meetings: [
      {
        id: '1',
        title: 'Project Kickoff',
        date: '2025-05-01',
        time: '10:00 AM',
        link: '#'
      },
      {
        id: '2',
        title: 'Progress Check',
        date: '2025-05-08',
        time: '2:30 PM',
        link: '#'
      },
      {
        id: '3',
        title: 'Final Review',
        date: '2025-05-19',
        time: '1:00 PM',
        link: '#'
      }
    ]
  });

  const selectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    // In a real app, this would fetch project details from an API
    const project = projects.find(p => p.id === projectId);
    if (project) {
      // For demo purposes, we're using the same details for all projects
      setProjectDetails({
        ...projectDetails,
        id: projectId,
        name: project.name
      });
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const newChatMessage = {
      id: Date.now().toString(),
      sender: 'John Doe', // Current user
      message: newMessage,
      timestamp: new Date().toISOString()
    };
    
    setProjectDetails({
      ...projectDetails,
      chat: [...projectDetails.chat, newChatMessage]
    });
    
    setNewMessage('');
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
    <div className="max-w-6xl mx-auto">
      {!selectedProjectId ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Collaborate</h1>
            <button
              onClick={() => setShowCreateProjectModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus size={18} className="mr-1" />
              Create Project
            </button>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="font-semibold">Your Projects</h2>
            </div>
            
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {projects.map(project => (
                <li 
                  key={project.id}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-colors duration-200"
                  onClick={() => selectProject(project.id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{project.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {project.members.length} members • Last activity: {formatDate(project.lastActivity)}
                      </p>
                    </div>
                    <div className="flex -space-x-2">
                      {project.members.slice(0, 3).map((member, index) => (
                        <div 
                          key={index}
                          className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs border-2 border-white dark:border-gray-800"
                        >
                          {getInitials(member)}
                        </div>
                      ))}
                      {project.members.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300 text-xs border-2 border-white dark:border-gray-800">
                          +{project.members.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <button
                onClick={() => setSelectedProjectId(null)}
                className="mr-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold">{projectDetails.name}</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                <MoreVertical size={20} />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Project Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="font-semibold">Team Members</h2>
                </div>
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {projectDetails.members.map(member => (
                    <li key={member.id} className="p-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm mr-3">
                          {member.avatar}
                        </div>
                        <div>
                          <h3 className="font-medium">{member.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <button className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <Plus size={16} className="mr-1" />
                    Add Member
                  </button>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="font-semibold">Upcoming Meetings</h2>
                </div>
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {projectDetails.meetings.map(meeting => (
                    <li key={meeting.id} className="p-4">
                      <div>
                        <h3 className="font-medium">{meeting.title}</h3>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                          <Calendar size={14} className="mr-1" />
                          <span>{formatDate(meeting.date)}</span>
                          <span className="mx-1">•</span>
                          <Clock size={14} className="mr-1" />
                          <span>{meeting.time}</span>
                        </div>
                        <a 
                          href={meeting.link}
                          className="mt-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                        >
                          <Video size={14} className="mr-1" />
                          Join Meeting
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <button className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <Plus size={16} className="mr-1" />
                    Schedule Meeting
                  </button>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="md:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                      activeTab === 'chat'
                        ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <MessageSquare size={16} className="mr-2" />
                      Chat
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('tasks')}
                    className={`px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                      activeTab === 'tasks'
                        ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <CheckSquare size={16} className="mr-2" />
                      Tasks
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('meetings')}
                    className={`px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                      activeTab === 'meetings'
                        ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <Video size={16} className="mr-2" />
                      Meetings
                    </div>
                  </button>
                </div>
              </div>
              
              {activeTab === 'chat' && (
                <div className="flex flex-col h-[calc(100vh-280px)]">
                  <div className="flex-1 overflow-y-auto p-4">
                    {projectDetails.chat.map(message => (
                      <div key={message.id} className="mb-4">
                        <div className="flex items-start">
                          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs mr-2">
                            {getInitials(message.sender)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-baseline">
                              <span className="font-medium">{message.sender}</span>
                              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                {formatTimestamp(message.timestamp)}
                              </span>
                            </div>
                            <p className="text-gray-800 dark:text-gray-200 mt-1">{message.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                        placeholder="Type a message..."
                      />
                      <button
                        onClick={sendMessage}
                        className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none transition-colors duration-200"
                      >
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'tasks' && (
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Project Tasks</h3>
                    <button className="flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200">
                      <Plus size={16} className="mr-1" />
                      Add Task
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-750 rounded-md p-4">
                      <h4 className="font-medium mb-3 flex items-center">
                        <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                        To Do
                      </h4>
                      <ul className="space-y-2">
                        {projectDetails.tasks.filter(task => task.status === 'todo').map(task => (
                          <li key={task.id} className="bg-white dark:bg-gray-700 p-3 rounded-md shadow-sm">
                            <h5 className="font-medium">{task.title}</h5>
                            <div className="flex justify-between items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                              <div className="flex items-center">
                                <User size={14} className="mr-1" />
                                <span>{task.assignee}</span>
                              </div>
                              <div className="flex items-center">
                                <Calendar size={14} className="mr-1" />
                                <span>{formatDate(task.dueDate)}</span>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-750 rounded-md p-4">
                      <h4 className="font-medium mb-3 flex items-center">
                        <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                        In Progress
                      </h4>
                      <ul className="space-y-2">
                        {projectDetails.tasks.filter(task => task.status === 'inprogress').map(task => (
                          <li key={task.id} className="bg-white dark:bg-gray-700 p-3 rounded-md shadow-sm">
                            <h5 className="font-medium">{task.title}</h5>
                            <div className="flex justify-between items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                              <div className="flex items-center">
                                <User size={14} className="mr-1" />
                                <span>{task.assignee}</span>
                              </div>
                              <div className="flex items-center">
                                <Calendar size={14} className="mr-1" />
                                <span>{formatDate(task.dueDate)}</span>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-750 rounded-md p-4">
                      <h4 className="font-medium mb-3 flex items-center">
                        <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                        Done
                      </h4>
                      <ul className="space-y-2">
                        {projectDetails.tasks.filter(task => task.status === 'done').map(task => (
                          <li key={task.id} className="bg-white dark:bg-gray-700 p-3 rounded-md shadow-sm">
                            <h5 className="font-medium">{task.title}</h5>
                            <div className="flex justify-between items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                              <div className="flex items-center">
                                <User size={14} className="mr-1" />
                                <span>{task.assignee}</span>
                              </div>
                              <div className="flex items-center">
                                <Calendar size={14} className="mr-1" />
                                <span>{formatDate(task.dueDate)}</span>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'meetings' && (
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Scheduled Meetings</h3>
                    <button className="flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200">
                      <Plus size={16} className="mr-1" />
                      Schedule Meeting
                    </button>
                  </div>
                  
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-750 text-left">
                      <tr>
                        <th className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Meeting</th>
                        <th className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time</th>
                        <th className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {projectDetails.meetings.map(meeting => (
                        <tr key={meeting.id}>
                          <td className="px-4 py-3">{meeting.title}</td>
                          <td className="px-4 py-3">{formatDate(meeting.date)}</td>
                          <td className="px-4 py-3">{meeting.time}</td>
                          <td className="px-4 py-3">
                            <a 
                              href={meeting.link}
                              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                            >
                              <Video size={14} className="mr-1" />
                              Join
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Create Project Modal */}
      {showCreateProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold">Create New Project</h3>
              <button 
                onClick={() => setShowCreateProjectModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                  placeholder="Enter project name"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Team Members
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                  placeholder="Enter email addresses (comma separated)"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Project Description
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                  placeholder="Describe the project"
                  rows={3}
                ></textarea>
              </div>
            </div>
            
            <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowCreateProjectModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md mr-2 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCreateProjectModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none transition-colors duration-200"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollaboratePage;