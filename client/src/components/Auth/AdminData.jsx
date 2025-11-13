import React, { useState, useEffect } from "react";
import { useGetCustomersQuery } from "../../Redux/userr.api";
import { useSignOutMutation } from "../../Redux/admin.api";
import { Toaster } from "react-hot-toast";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { toast } from "sonner";

const AdminData = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [documentsModalOpen, setDocumentsModalOpen] = useState(false);
  const [modalFile, setModalFile] = useState(null);
  const [currentUserFiles, setCurrentUserFiles] = useState([]);
  const [currentUserName, setCurrentUserName] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const itemsPerPage = 5;

  const { data, isLoading, isError, error } = useGetCustomersQuery();
  const [signOut] = useSignOutMutation();

  // Safe AdminAuthContext usage with try-catch
  let logout = () => { };
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { logout: adminLogout } = require("../../contexts/AdminAuthContext").useAdminAuth();
    logout = adminLogout;
  } catch (err) {
    console.log("AdminAuthContext not available, using fallback logout");
    // Fallback logout function
    logout = () => {
      localStorage.removeItem('admin');
      localStorage.removeItem('AdminToken');
    };
  }

  const users = data || [];

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (modalOpen || documentsModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [modalOpen, documentsModalOpen]);

  const filteredUsers = users.filter(
    (user) =>
      (user.Name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.mobile || "").toString().includes(searchTerm) ||
      (user.companyName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openModal = (file) => {
    setModalFile(file);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalFile(null);
    setModalOpen(false);
  };

  const openDocumentsModal = (user) => {
    setCurrentUserFiles(user.files || []);
    setCurrentUserName(user.Name || "User");
    setDocumentsModalOpen(true);
  };

  const closeDocumentsModal = () => {
    setCurrentUserFiles([]);
    setCurrentUserName("");
    setDocumentsModalOpen(false);
  };

  // Helper to get extension from URL
  const getFileExtensionFromUrl = (url) => {
    if (!url) return null;
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      return pathname.split('.').pop()?.toLowerCase();
    } catch {
      return url.split('.').pop()?.toLowerCase();
    }
  };

  // Enhanced image extension detection
  const getImageExtension = (url) => {
    const ext = getFileExtensionFromUrl(url);
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'ico'];
    return imageExtensions.includes(ext) ? ext : 'jpg';
  };

  // Improved Download file function for all file types
  const downloadFile = async (file) => {
    try {
      console.log('Downloading file:', file);

      const response = await fetch(file.url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Get file type and set appropriate extension
      const fileType = getFileType(file);
      let fileName = file.originalName || `document_${Date.now()}`;

      // Remove any existing extension and add correct one
      fileName = fileName.replace(/\.[^/.]+$/, "");

      // Add correct extension based on file type
      const extensions = {
        'pdf': 'pdf',
        'image': getImageExtension(file.url),
        'document': 'docx',
        'spreadsheet': 'xlsx',
        'unknown': getFileExtensionFromUrl(file.url) || 'file'
      };

      const extension = extensions[fileType];
      fileName = `${fileName}.${extension}`;

      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`✅ ${fileType.toUpperCase()} file downloaded as ${fileName}`);

    } catch (error) {
      console.error("Download error:", error);
      toast.error("❌ Failed to download file");
    }
  };

  // Safe logout function
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      // Try API logout
      try {
        await signOut().unwrap();
        toast.success("Logged out successfully!");
      } catch (apiError) {
        console.log("API logout failed, continuing with local logout");
        toast.success("Logged out successfully!");
      }

      // Always clear local storage
      logout();

      // Redirect to login page after a short delay
      setTimeout(() => {
        window.location.href = "/admin-login";
      }, 1000);

    } catch (error) {
      console.error("Logout error:", error);
      // Final fallback
      localStorage.removeItem('admin');
      localStorage.removeItem('AdminToken');
      toast.success("Logged out successfully!");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getFileType = (file) => {
    if (file.fileType) return file.fileType.toLowerCase();
    const ext = file.url?.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return "pdf";
    if (["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"].includes(ext)) return "image";
    if (["doc", "docx"].includes(ext)) return "document";
    if (["xls", "xlsx", "csv"].includes(ext)) return "spreadsheet";
    return "unknown";
  };

  const getFileIcon = (type) => {
    switch (type) {
      case "pdf": return "📄";
      case "image": return "🖼️";
      case "document": return "📝";
      case "spreadsheet": return "📊";
      default: return "📎";
    }
  };

  const getFileColor = (type) => {
    switch (type) {
      case "pdf": return "bg-[#F79050]/20 text-[#F79050] border-[#F79050]/30";
      case "image": return "bg-[#28B8B4]/20 text-[#28B8B4] border-[#28B8B4]/30";
      case "document": return "bg-[#2D50A1]/20 text-[#2D50A1] border-[#2D50A1]/30";
      case "spreadsheet": return "bg-[#09193C]/20 text-[#09193C] border-[#09193C]/30";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const renderFilesSection = (user) => {
    const files = user.files || [];

    if (files.length === 0) {
      return (
        <span className="text-gray-400 text-sm">No files</span>
      );
    }

    return (
      <div className="flex items-center justify-end gap-3">
        {/* File Count Badge */}
        <span className="bg-[#28B8B4]/20 text-[#09193C] text-sm px-3 py-1 rounded-full border border-[#28B8B4]/30 font-medium">
          {files.length} file{files.length !== 1 ? 's' : ''}
        </span>

        {/* Doc Button */}
        <button
          onClick={() => openDocumentsModal(user)}
          className="px-4 py-2 bg-gradient-to-r from-[#2D50A1] to-[#28B8B4] text-white rounded-lg hover:from-[#1a3a8a] hover:to-[#1f9e9a] transition-all duration-200 shadow-sm font-medium flex items-center gap-2"
        >
          <span>📁</span>
          Doc
        </button>
      </div>
    );
  };

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen bg-[#FFF8F5]">
      <div className="text-[#2D50A1] font-semibold text-lg">Loading...</div>
    </div>
  );

  if (isError) return (
    <div className="flex justify-center items-center min-h-screen bg-red-50">
      <div className="text-red-600 font-semibold text-lg">Error: {error?.data?.message || "Failed to load data"}</div>
    </div>
  );

  return (
    <div className="min-h-screen p-4 md:p-6 bg-[#FFF8F5]">
      <Toaster />

      {/* Header with Logout Button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#09193C] mb-2">Green Energy Admin Dashboard</h1>
          <p className="text-[#2D50A1] text-sm md:text-base">Manage customer data and documents</p>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="px-4 py-2 bg-[#F79050] hover:bg-[#e67e40] text-white rounded-lg transition-all duration-200 shadow-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoggingOut ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Logging out...
            </>
          ) : (
            <>
              <span>🚪</span>
              Logout
            </>
          )}
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name, email, mobile, or company..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full p-3 border-2 border-[#28B8B4]/30 rounded-lg focus:ring-2 focus:ring-[#28B8B4] focus:border-[#28B8B4] bg-white shadow-sm"
        />
      </div>

      {/* Results Count */}
      <div className="mb-4 flex justify-between items-center">
        <span className="text-[#2D50A1] font-medium text-sm md:text-base">
          Showing {currentUsers.length} of {filteredUsers.length} customers
        </span>
      </div>

      {/* Table Container with Horizontal Scroll */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#28B8B4]/20">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gradient-to-r from-[#2D50A1] to-[#28B8B4]">
              <tr>
                <th className="px-4 py-3 md:px-6 md:py-4 text-left text-white font-semibold text-sm md:text-base whitespace-nowrap">User</th>
                <th className="px-4 py-3 md:px-6 md:py-4 text-left text-white font-semibold text-sm md:text-base whitespace-nowrap">Contact</th>
                <th className="px-4 py-3 md:px-6 md:py-4 text-left text-white font-semibold text-sm md:text-base whitespace-nowrap">Company</th>
                <th className="px-4 py-3 md:px-6 md:py-4 text-left text-white font-semibold text-sm md:text-base whitespace-nowrap">District</th>
                <th className="px-4 py-3 md:px-6 md:py-4 text-left text-white font-semibold text-sm md:text-base whitespace-nowrap">Documents</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#28B8B4]/10">
              {currentUsers.map((user, index) => (
                <tr
                  key={user._id}
                  className={`hover:bg-[#28B8B4]/5 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-[#28B8B4]/5'
                    }`}
                >
                  <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                    <div className="font-medium text-[#09193C] text-sm md:text-base">{user.Name}</div>
                  </td>
                  <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                    <div className="text-[#2D50A1] text-sm md:text-base">{user.email}</div>
                    <div className="text-[#28B8B4] text-xs md:text-sm">{user.mobile}</div>
                  </td>
                  <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                    <div className="text-[#09193C] text-sm md:text-base truncate max-w-[150px]">{user.companyName}</div>
                  </td>
                  <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                    <div className="text-[#2D50A1] text-sm md:text-base">{user.district}</div>
                  </td>
                  <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                    {renderFilesSection(user)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6 flex-wrap gap-2">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-3 py-2 md:px-4 md:py-2 rounded-lg font-medium text-sm md:text-base ${currentPage === 1
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-[#2D50A1] text-white hover:bg-[#1a3a8a] transition-colors'
            }`}
        >
          Previous
        </button>

        <span className="text-[#2D50A1] font-medium text-sm md:text-base px-2">
          Page {currentPage} of {Math.ceil(filteredUsers.length / itemsPerPage)}
        </span>

        <button
          onClick={() => setCurrentPage(prev =>
            prev < Math.ceil(filteredUsers.length / itemsPerPage) ? prev + 1 : prev
          )}
          disabled={currentPage >= Math.ceil(filteredUsers.length / itemsPerPage)}
          className={`px-3 py-2 md:px-4 md:py-2 rounded-lg font-medium text-sm md:text-base ${currentPage >= Math.ceil(filteredUsers.length / itemsPerPage)
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-[#2D50A1] text-white hover:bg-[#1a3a8a] transition-colors'
            }`}
        >
          Next
        </button>
      </div>

      {/* Documents Modal - All Files */}
      {documentsModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-[#28B8B4]/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 md:p-6 bg-gradient-to-r from-[#2D50A1] to-[#28B8B4] text-white">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg md:text-xl truncate">All Documents - {currentUserName}</h3>
                <p className="text-blue-100 text-sm mt-1">
                  {currentUserFiles.length} file{currentUserFiles.length !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={closeDocumentsModal}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors font-bold text-sm ml-4 flex-shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Documents List */}
            <div className="p-4 md:p-6 max-h-[60vh] md:max-h-[70vh] overflow-y-auto">
              {currentUserFiles.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No documents found
                </div>
              ) : (
                <div className="grid gap-3">
                  {currentUserFiles.map((file, index) => {
                    const type = getFileType(file);
                    return (
                      <div
                        key={file.url || index}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 bg-[#28B8B4]/5 rounded-lg border border-[#28B8B4]/20 hover:border-[#28B8B4] transition-colors gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <span className="text-xl flex-shrink-0">{getFileIcon(type)}</span>
                          <div className="min-w-0 flex-1">
                            <div className="text-[#09193C] font-medium truncate text-sm md:text-base">
                              {file.originalName || `Document ${index + 1}`}
                            </div>
                            <div className="text-[#2D50A1] text-xs md:text-sm">
                              {type.toUpperCase()} File
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getFileColor(type)} whitespace-nowrap`}>
                            {type.toUpperCase()}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                closeDocumentsModal();
                                openModal(file);
                              }}
                              className="px-3 py-2 bg-gradient-to-r from-[#2D50A1] to-[#28B8B4] text-white rounded-lg hover:from-[#1a3a8a] hover:to-[#1f9e9a] transition-all duration-200 shadow-sm font-medium text-sm whitespace-nowrap"
                            >
                              View
                            </button>
                            <button
                              onClick={() => downloadFile(file)}
                              className="px-3 py-2 bg-gradient-to-r from-[#F79050] to-[#e67e40] text-white rounded-lg hover:from-[#e67e40] hover:to-[#d46c30] transition-all duration-200 shadow-sm font-medium text-sm whitespace-nowrap flex items-center gap-1"
                            >
                              <span>⬇️</span>
                              Download
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* File View Modal - WITH IMPROVED DOWNLOAD BUTTON */}
      {modalOpen && modalFile && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden border border-[#28B8B4]/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header with Download Button */}
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[#2D50A1] to-[#28B8B4] text-white">
              <div className="flex-1 min-w-0 flex items-center gap-3">
                <span className="text-xl">{getFileIcon(getFileType(modalFile))}</span>
                <div className="min-w-0">
                  <h3 className="font-semibold text-lg truncate">
                    {modalFile.originalName || "Document Viewer"}
                  </h3>
                  <p className="text-blue-100 text-sm opacity-80">
                    {getFileType(modalFile).toUpperCase()} File • Click download to save
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Download Button in Header */}
                <button
                  onClick={() => downloadFile(modalFile)}
                  className="px-4 py-2 bg-gradient-to-r from-[#F79050] to-[#e67e40] text-white rounded-lg hover:from-[#e67e40] hover:to-[#d46c30] transition-all duration-200 shadow-sm font-medium text-sm flex items-center gap-2"
                >
                  <span>⬇️</span>
                  Download {getFileType(modalFile).toUpperCase()}
                </button>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors font-bold text-sm ml-2 flex-shrink-0"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-2 md:p-4 bg-gray-50">
              {getFileType(modalFile) === "pdf" ? (
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                  <div style={{ height: "70vh" }} className="rounded-lg overflow-hidden border border-[#28B8B4]/20">
                    <Viewer fileUrl={modalFile.url} />
                  </div>
                </Worker>
              ) : getFileType(modalFile) === "image" ? (
                <div className="flex flex-col items-center bg-white rounded-lg border border-[#28B8B4]/20 p-2 md:p-4">
                  <img
                    src={modalFile.url}
                    alt="Document"
                    className="max-h-[65vh] max-w-full object-contain rounded-lg"
                  />
                  <div className="mt-4 text-center">
                    <p className="text-gray-600 text-sm mb-2">
                      This is an image file ({getImageExtension(modalFile.url).toUpperCase()})
                    </p>
                    <button
                      onClick={() => downloadFile(modalFile)}
                      className="px-6 py-2 bg-gradient-to-r from-[#F79050] to-[#e67e40] text-white rounded-lg hover:from-[#e67e40] hover:to-[#d46c30] transition-all duration-200 shadow-sm font-medium text-sm flex items-center gap-2 mx-auto"
                    >
                      <span>⬇️</span>
                      Download Image
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center bg-white rounded-lg border border-[#28B8B4]/20 p-8">
                  <div className="text-6xl mb-4">{getFileIcon(getFileType(modalFile))}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {getFileType(modalFile).toUpperCase()} File
                  </h3>
                  <p className="text-gray-600 text-center mb-6 max-w-md">
                    This is a {getFileType(modalFile)} file. You can download it to view the complete content.
                  </p>
                  <button
                    onClick={() => downloadFile(modalFile)}
                    className="px-6 py-3 bg-gradient-to-r from-[#F79050] to-[#e67e40] text-white rounded-lg hover:from-[#e67e40] hover:to-[#d46c30] transition-all duration-200 shadow-sm font-medium text-base flex items-center gap-2"
                  >
                    <span>⬇️</span>
                    Download {getFileType(modalFile).toUpperCase()} File
                  </button>
                </div>
              )}
            </div>

            {/* Download Button at Bottom for all file types */}
            <div className="p-4 bg-white border-t border-[#28B8B4]/20 flex justify-center">
              <button
                onClick={() => downloadFile(modalFile)}
                className="px-6 py-3 bg-gradient-to-r from-[#F79050] to-[#e67e40] text-white rounded-lg hover:from-[#e67e40] hover:to-[#d46c30] transition-all duration-200 shadow-sm font-medium text-base flex items-center gap-2"
              >
                <span>⬇️</span>
                Download {getFileType(modalFile).toUpperCase()} File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminData;