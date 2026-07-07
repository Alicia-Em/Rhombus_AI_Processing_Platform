import React from "react";
import FileUpload from "./components/FileUpload";
import JobsList from "./components/JobsList";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          File Processing Application
        </h1>
        <FileUpload />
        <JobsList />
      </div>
    </div>
  )
}

export default App
