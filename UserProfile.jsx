import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MoreHorizontal, 
  Grid, 
  Repeat, 
  UserSquare, 
  Camera, 
  ChevronDown, 
  UserPlus, 
  MessageCircle, 
  X, 
  ChevronRight,
  Home,
  Search,
  PlusSquare,
  Film,
  User as UserIcon
} from 'lucide-react';

export default function OtherUserProfile() {
  // State management for uploads & interactions
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(true);
  const [activeTab, setActiveTab] = useState('grid');

  // Simulated upload handler with built-in safety timeout to prevent hanging
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      // Simulate network request with a safety timeout mechanism
      await new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          resolve();
        }, 1500);

        // Optional: Handle actual upload promise here if hooked to an API
        // If it fails or takes too long, clear loading via catch/finally
      });

      // Append new post item successfully
      const newPostUrl = URL.createObjectURL(file);
      setPosts((prev) => [newPostUrl, ...prev]);
    } catch (err) {
      setUploadError('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset input value so same file can be re-selected if needed
      event.target.value = null;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen text-black flex flex-col justify-between font-sans pb-16">
      
      <div>
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <button className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <span className="font-semibold text-base">likithgowda_7</span>
          <button className="p-1">
            <MoreHorizontal className="w-6 h-6" />
          </button>
        </div>

        {/* Profile Header Section */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center justify-between">
            {/* Profile Avatar */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" 
                  alt="likithgowda_7 profile" 
                  className="w-full h-full object-cover rounded-full border-2 border-white"
                />
              </div>
            </div>

            {/* Profile Stats */}
            <div className="flex justify-around flex-1 ml-6 text-center">
              <div>
                <div className="font-bold text-lg">{posts.length}</div>
                <div className="text-xs text-gray-600">posts</div>
              </div>
              <div>
                <div className="font-bold text-lg">449</div>
                <div className="text-xs text-gray-600">followers</div>
              </div>
              <div>
                <div className="font-bold text-lg">442</div>
                <div className="text-xs text-gray-600">following</div>
              </div>
            </div>
          </div>

          {/* Bio Details */}
          <div className="mt-3 text-sm">
            <h1 className="font-bold">Likith Gowda MS</h1>
            <p className="text-gray-800">DSCE&apos;29</p>
            <p className="text-gray-800">LEGEND NEVER DIES.......</p>
            <div className="flex items-center text-gray-900 mt-1 font-medium text-xs">
              <span className="mr-1">@</span> likithgowda_7
            </div>
          </div>

          {/* Mutual Followers Preview */}
          <div className="flex items-center mt-3 text-xs text-gray-600">
            <div className="flex -space-x-2 overflow-hidden mr-2">
              <inline-block className="inline-block h-5 w-5 rounded-full ring-2 ring-white bg-gray-300 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80" alt="mutual 1" className="w-full h-full object-cover"/>
              </inline-block>
              <inline-block className="inline-block h-5 w-5 rounded-full ring-2 ring-white bg-gray-300 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80" alt="mutual 2" className="w-full h-full object-cover"/>
              </inline-block>
              <inline-block className="inline-block h-5 w-5 rounded-full ring-2 ring-white bg-gray-300 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="mutual 3" className="w-full h-full object-cover"/>
              </inline-block>
            </div>
            <span>Followed by <span className="font-semibold text-black">_m_r_chandan_01</span>, <span className="font-semibold text-black">__pruthvii____</span> and 4 more</span>
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center gap-2 mt-4">
            <button 
              onClick={() => setIsFollowing(!isFollowing)}
              className={`flex-1 py-1.5 px-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-1 transition-colors ${
                isFollowing 
                  ? 'bg-gray-100 text-black border border-gray-200' 
                  : 'bg-blue-500 text-white'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
              {isFollowing && <ChevronDown className="w-4 h-4" />}
            </button>

            <button className="flex-1 bg-gray-100 text-black border border-gray-200 py-1.5 px-3 rounded-lg font-semibold text-sm flex items-center justify-center">
              Message
            </button>

            <button className="bg-gray-100 text-black border border-gray-200 p-2 rounded-lg flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Upload Status / Trigger Feedback Bar */}
        <div className="px-4 py-2 bg-gray-50 border-t border-b border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {isUploading ? 'Uploading, please wait...' : 'Share media to profile feed'}
          </span>
          <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-md font-medium transition-all shadow-sm">
            Upload Media
            <input 
              type="file" 
              accept="image/*,video/*" 
              className="hidden" 
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </label>
        </div>

        {uploadError && (
          <div className="px-4 py-1 bg-red-50 text-red-600 text-xs">
            {uploadError}
          </div>
        )}

        {/* Profile Navigation Tabs */}
        <div className="flex border-t border-gray-200 mt-2">
          <button 
            onClick={() => setActiveTab('grid')}
            className={`flex-1 flex justify-center py-3 border-b-2 transition-all ${
              activeTab === 'grid' ? 'border-black text-black' : 'border-transparent text-gray-400'
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setActiveTab('reposts')}
            className={`flex-1 flex justify-center py-3 border-b-2 transition-all ${
              activeTab === 'reposts' ? 'border-black text-black' : 'border-transparent text-gray-400'
            }`}
          >
            <Repeat className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setActiveTab('tagged')}
            className={`flex-1 flex justify-center py-3 border-b-2 transition-all ${
              activeTab === 'tagged' ? 'border-black text-black' : 'border-transparent text-gray-400'
            }`}
          >
            <UserSquare className="w-5 h-5" />
          </button>
        </div>

        {/* Posts Content Area */}
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-16 h-16 rounded-full border-2 border-black flex items-center justify-center mb-3">
              <Camera className="w-8 h-8 text-black stroke-[1.5]" />
            </div>
            <h3 className="font-bold text-lg">No posts yet</h3>
            <p className="text-gray-500 text-sm mt-1 max-w-xs">
              When likithgowda_7 posts, you&apos;ll see their photos and videos here.
            </p>
          </div>
        ) : (
          <div className="grid grid-gap-[2px] grid-cols-3 mt-[1px]">
            {posts.map((url, idx) => (
              <div key={idx} className="aspect-square bg-gray-100 overflow-hidden">
                <img src={url} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}

        {/* Suggested For You Section */}
        <div className="mt-6 px-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-sm text-gray-900">Suggested for you</span>
            <button className="text-xs font-semibold text-blue-600">See all</button>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
            {/* Suggestion Card 1 */}
            <div className="min-w-[140px] border border-gray-200 rounded-lg p-3 flex flex-col items-center relative bg-white shadow-2xs">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-black">
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden mt-2 mb-2">
                <div className="w-full h-full bg-gray-400 flex items-center justify-center text-white">
                  <UserIcon className="w-8 h-8" />
                </div>
              </div>
              <span className="font-semibold text-xs text-center truncate w-full">the_lord_2905</span>
              <span className="text-[10px] text-gray-500 text-center truncate w-full mb-3">New to Instagram</span>
              <button className="w-full bg-blue-500 text-white rounded py-1 text-xs font-semibold">
                Follow
              </button>
            </div>

            {/* Suggestion Card 2 */}
            <div className="min-w-[140px] border border-gray-200 rounded-lg p-3 flex flex-col items-center relative bg-white shadow-2xs">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-black">
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden mt-2 mb-2">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" 
                  alt="user" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-semibold text-xs text-center truncate w-full">piyush_shah_05...</span>
              <span className="text-[10px] text-gray-500 text-center truncate w-full mb-3">Followed by _m_r...</span>
              <button className="w-full bg-blue-500 text-white rounded py-1 text-xs font-semibold">
                Follow
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 flex items-center justify-around py-2.5 z-50">
        <button className="p-1 text-black"><Home className="w-6 h-6" /></button>
        <button className="p-1 text-black"><Search className="w-6 h-6" /></button>
        <button className="p-1 text-black"><PlusSquare className="w-6 h-6" /></button>
        <button className="p-1 text-black"><Film className="w-6 h-6" /></button>
        <button className="p-1 text-black relative">
          <div className="w-6 h-6 rounded-full border-2 border-black overflow-hidden">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="me" className="w-full h-full object-cover" />
          </div>
        </button>
      </div>

    </div>
  );
              }
