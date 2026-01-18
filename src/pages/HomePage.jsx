import { useNavigate } from "react-router-dom";
import { useAuth } from "../firebase/auth";

export default function AppPage() {
  const { user, logout } = useAuth();


  return (
      <main className="max-w-5xl mx-auto p-6">



        <p className="text-gray-700">
          This is a in progress frontend for MediaMiner. Media Miner is a personal media
          downloader that allows you to download audio or media content from websites like YouTube, Vimeo, and more to. 
          It is built with React, Node.js, and MongoDB.
        </p>
      </main>
  );
}
